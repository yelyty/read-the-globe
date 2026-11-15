// the logo as a picture the canvas can draw: the same SVG the header shows, given its own size
export const logoImage = (svg: SVGSVGElement) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const copy = svg.cloneNode(true) as SVGSVGElement;

    copy.setAttribute('width', '604');
    copy.setAttribute('height', '610');
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);

    img.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(new XMLSerializer().serializeToString(copy));
  });
