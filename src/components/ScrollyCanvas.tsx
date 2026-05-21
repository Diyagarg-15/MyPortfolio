import { useEffect, useRef, useState } from "react";
import { useLoading } from "../context/LoadingProvider";
import { setProgress } from "./Loading";
import { setAllTimeline } from "./utils/GsapScroll";

const ScrollyCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    const frameCount = 144; // 000 to 143 = 144 frames
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const progress = setProgress((value) => setLoading(value));

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, "0");
      img.src = `/Sequence/frame_${frameNum}_delay-0.055s.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages([...loadedImages]);
          progress.loaded();
        }
      };
      img.onerror = () => {
        console.error("Failed to load frame:", img.src);
        loadedCount++; // Increment anyway so we don't get permanently stuck
        if (loadedCount === frameCount) {
          setImages([...loadedImages]);
          progress.loaded();
        }
      };
      // Important to keep the array in order
      loadedImages.push(img);
    }

    return () => progress.clear();
  }, [setLoading]);

  useEffect(() => {
    if (images.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (img: HTMLImageElement) => {
      const targetWidth = Math.round(window.innerWidth);
      const targetHeight = Math.round(window.innerHeight);

      if (canvas.width !== targetWidth) canvas.width = targetWidth;
      if (canvas.height !== targetHeight) canvas.height = targetHeight;

      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const x = (canvas.width - img.naturalWidth * scale) / 2;
      const y = (canvas.height - img.naturalHeight * scale) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        x,
        y,
        img.naturalWidth * scale,
        img.naturalHeight * scale
      );
    };

    let animationFrameId: number;

    const updateFrame = () => {
      // Calculate native scroll progress
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      let progress = 0;
      if (maxScroll > 0) {
        progress = window.scrollY / maxScroll;
      }
      const frameIndex = Math.min(143, Math.max(0, Math.floor(progress * 144)));

      const img = images[frameIndex];
      if (img && img.naturalWidth > 0) {
        render(img);
      }

      animationFrameId = requestAnimationFrame(updateFrame);
    };

    updateFrame();
    setAllTimeline();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [images]);

  if (images.length === 0) return null;

  return (
    <>
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
        }}
      />
    </>
  );
};

export default ScrollyCanvas;
