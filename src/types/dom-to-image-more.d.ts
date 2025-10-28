declare module 'dom-to-image-more' {
  interface DomToImageOptions {
    width?: number;
    height?: number;
    style?: string;
    bgcolor?: string;
    filter?: (node: Node) => boolean;
    quality?: number;
    cacheBust?: boolean;
    imagePlaceholder?: string;
  }

  const domtoimage: {
    toPng(node: Node, options?: DomToImageOptions): Promise<string>;
    toJpeg(node: Node, options?: DomToImageOptions): Promise<string>;
    toBlob(node: Node, options?: DomToImageOptions): Promise<Blob>;
    toSvg(node: Node, options?: DomToImageOptions): Promise<string>;
    toCanvas(node: Node, options?: DomToImageOptions): Promise<HTMLCanvasElement>;
    toPixelData(node: Node, options?: DomToImageOptions): Promise<ImageData>;
  };

  export default domtoimage;
}
