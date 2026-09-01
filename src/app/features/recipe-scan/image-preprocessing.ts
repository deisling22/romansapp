/**
 * Preprocesses a photographed recipe page before OCR to improve Tesseract's accuracy.
 * Phone photos of book pages typically have low effective resolution, uneven lighting
 * (shadows, glare) and low contrast compared to a flatbed scan — all of which hurt
 * character recognition (missed umlauts, ß vs. B confusion, etc.) far more than the
 * choice of language model does. This applies two well-known fixes:
 *  1. Upscale small photos (Tesseract assumes ~70dpi for images without DPI metadata,
 *     so undersized text is effectively read at very low "resolution").
 *  2. Local adaptive thresholding (Bradley's algorithm via an integral image) instead of
 *     a single global brightness cutoff, so it copes with shadows/gradients across a page.
 */

const MIN_LONG_EDGE = 1800;
const MAX_LONG_EDGE = 3200;
const THRESHOLD_WINDOW_RATIO = 1 / 8;
const THRESHOLD_MIN_WINDOW = 15;
const THRESHOLD_BIAS = 12;

export async function preprocessRecipeImage(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await loadBitmap(file);
  const scale = computeScale(bitmap.width, bitmap.height);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    return canvas;
  }
  context.drawImage(bitmap, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  const gray = toGrayscale(imageData);
  const integral = buildIntegralImage(gray, width, height);
  const binary = adaptiveThreshold(gray, integral, width, height);
  writeGrayscale(imageData, binary);
  context.putImageData(imageData, 0, 0);

  return canvas;
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall through to the <img> based loader below
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode().catch(() => undefined);
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function computeScale(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  if (longEdge < MIN_LONG_EDGE) {
    return MIN_LONG_EDGE / longEdge;
  }
  if (longEdge > MAX_LONG_EDGE) {
    return MAX_LONG_EDGE / longEdge;
  }
  return 1;
}

function toGrayscale(imageData: ImageData): Float32Array {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);
  for (let i = 0, pixel = 0; i < data.length; i += 4, pixel++) {
    gray[pixel] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return gray;
}

function buildIntegralImage(gray: Float32Array, width: number, height: number): Float64Array {
  const integral = new Float64Array(width * height);
  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      rowSum += gray[index];
      integral[index] = rowSum + (y > 0 ? integral[index - width] : 0);
    }
  }
  return integral;
}

function adaptiveThreshold(
  gray: Float32Array,
  integral: Float64Array,
  width: number,
  height: number,
): Uint8ClampedArray {
  const windowSize = Math.max(THRESHOLD_MIN_WINDOW, Math.floor(Math.min(width, height) * THRESHOLD_WINDOW_RATIO));
  const half = Math.floor(windowSize / 2);
  const out = new Uint8ClampedArray(width * height);

  for (let y = 0; y < height; y++) {
    const y1 = Math.max(0, y - half);
    const y2 = Math.min(height - 1, y + half);
    for (let x = 0; x < width; x++) {
      const x1 = Math.max(0, x - half);
      const x2 = Math.min(width - 1, x + half);
      const count = (x2 - x1 + 1) * (y2 - y1 + 1);

      const bottomRight = integral[y2 * width + x2];
      const bottomLeft = x1 > 0 ? integral[y2 * width + (x1 - 1)] : 0;
      const topRight = y1 > 0 ? integral[(y1 - 1) * width + x2] : 0;
      const topLeft = x1 > 0 && y1 > 0 ? integral[(y1 - 1) * width + (x1 - 1)] : 0;
      const localMean = (bottomRight - bottomLeft - topRight + topLeft) / count;

      const index = y * width + x;
      out[index] = gray[index] < localMean - THRESHOLD_BIAS ? 0 : 255;
    }
  }
  return out;
}

function writeGrayscale(imageData: ImageData, values: Uint8ClampedArray): void {
  const { data } = imageData;
  for (let pixel = 0, i = 0; i < data.length; i += 4, pixel++) {
    const value = values[pixel];
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }
}
