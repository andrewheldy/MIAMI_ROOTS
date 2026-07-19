/**
 * Public surface of the dependency-free QR utility: encode text to a module
 * matrix, then render it to SVG (screen) or onto a canvas (downloads).
 */

export { encodeQr } from "./encode";
export type { QrMatrix, ErrorCorrectionLevel } from "./encode";
export { qrToSvg, qrToPathData, qrViewBoxSize } from "./svg";
export type { QrSvgOptions } from "./svg";
export { drawQrOnCanvas } from "./canvas";
export type { QrCanvasContext, DrawQrOptions } from "./canvas";
