declare module "gsap-trial/SplitText" {
  export class SplitText {
    chars: HTMLElement[];
    words: HTMLElement[];
    lines: HTMLElement[];
    constructor(target: string | string[] | Element | Element[], vars?: object);
    revert(): void;
    split(vars?: object): void;
  }
}
