import { useEffect, useRef, useState } from "react";
import { useLoading } from "../context/LoadingProvider";
import { setProgress } from "./Loading";

const FRAME_COUNT = 144;
const FRAME_PATH = (i: number) => {
  const frameNum = i.toString().padStart(3, "0");
  return `/Sequence/webp-output/frame_${frameNum}_delay-0.055s.webp`;
};

const ScrollyCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const lastFrameRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);
  const scrollPendingRef = useRef<boolean>(false);
  const [ready, setReady] = useState(false);
  const { setLoading } = useLoading();

  // ─── 1. Load all WebP frames (async decode, in-order array) ────────────
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);
    let loadedCount = 0;
    const progress = setProgress((value) => setLoading(value));

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.decoding = "async"; // don't block the main thread on decode

      const onFinish = (idx: number) => {
        loadedImages[idx] = img;
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          imagesRef.current = loadedImages;
          setReady(true);
          progress.loaded();
        }
      };

      const idx = i;
      img.onload = () => onFinish(idx);
      img.onerror = () => {
        console.error("Failed to load frame:", img.src);
        onFinish(idx); // count it anyway so we never hang
      };
    }

    return () => progress.clear();
  }, [setLoading]);

  // ─── 2. Scroll-driven canvas rendering ─────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use { alpha: false } — browser skips alpha compositing pass → faster
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Persistent offscreen buffer: draw here first, blit once → no flicker
    const offscreen = document.createElement("canvas");
    offscreenRef.current = offscreen;

    /**
     * Resize both the visible canvas and the offscreen buffer to match the
     * viewport × DPR, but cap DPR at 2 so a 5K iMac (DPR 2) never tries
     * to paint 5120×2880 pixels (which would be 10× slower than 1080p).
     * Sets CSS width/height so the canvas doesn't appear double-sized.
     * Returns true when a resize actually happened.
     */
    const syncSize = (): boolean => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      if (canvas.width === w && canvas.height === h) return false;

      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      offscreen.width = w;
      offscreen.height = h;
      return true;
    };

    syncSize();

    /**
     * Paint one frame: object-fit:cover scaling centred in the canvas.
     * Skip if the frame index hasn't changed (no redundant GPU uploads).
     */
    const drawFrame = (frameIndex: number, force = false) => {
      if (frameIndex === lastFrameRef.current && !force) return;
      lastFrameRef.current = frameIndex;

      const img = imagesRef.current[frameIndex];
      if (!img || img.naturalWidth === 0) return;

      const offCtx = offscreen.getContext("2d", { alpha: false });
      if (!offCtx) return;

      const cw = offscreen.width;
      const ch = offscreen.height;
      // cover: scale so image fills the canvas on both axes
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const x = (cw - img.naturalWidth * scale) / 2;
      const y = (ch - img.naturalHeight * scale) / 2;

      offCtx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
      // Single blit from offscreen → visible canvas
      ctx.drawImage(offscreen, 0, 0);
    };

    /** Convert scroll position → frame index → paint */
    const renderAtScroll = (force = false) => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(progress * FRAME_COUNT))
      );
      drawFrame(frameIndex, force);
    };

    /**
     * rAF-throttled scroll handler:
     * At most one drawImage call per display refresh tick — no matter how
     * fast the user scrolls. On a 60 Hz display that's 60 fps max; on a
     * 120 Hz ProMotion display it's still gated by actual scroll events.
     */
    const onScroll = () => {
      if (scrollPendingRef.current) return;
      scrollPendingRef.current = true;
      rafRef.current = requestAnimationFrame(() => {
        renderAtScroll();
        scrollPendingRef.current = false;
      });
    };

    /** On resize: re-measure DPR/viewport and repaint the current frame */
    const onResize = () => {
      const resized = syncSize();
      if (resized) {
        lastFrameRef.current = -1; // force a full redraw after resize
        renderAtScroll(true);
      }
    };

    // Paint the correct first frame immediately on mount
    renderAtScroll(true);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        willChange: "contents",   // hint browser to keep this on its own GPU layer
        imageRendering: "auto",   // let the browser pick the best scaling filter
      }}
    />
  );
};

export default ScrollyCanvas;
