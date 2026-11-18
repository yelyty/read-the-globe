/**
 * Makes an image of the logo that a canvas can draw.
 * The function copies the SVG of the header logo and sets its size to 604 × 610 px.
 * @returns The image, or null if the image does not load.
 */
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
