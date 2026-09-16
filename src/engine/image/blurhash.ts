// ─── Pure TypeScript Blurhash Decoder ─────────────────────────────────────────
//
// A dependency-free, high-performance implementation of the Blurhash decode algorithm.
// Converts a Blurhash string into a Uint8ClampedArray of RGBA pixels.
//
// ──────────────────────────────────────────────────────────────────────────────

const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%.&*+-;:=?@[]^_{|}~';

function decode83(str: string): number {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const digit = DIGITS.indexOf(c);
    value = value * 83 + digit;
  }
  return value;
}

function sRGBToLinear(value: number): number {
  const v = value / 255;
  if (v <= 0.04045) {
    return v / 12.92;
  }
  return Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSRGB(value: number): number {
  const v = Math.max(0, Math.min(1, value));
  if (v <= 0.0031308) {
    return Math.round(v * 12.92 * 255 + 0.5);
  }
  return Math.round((1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255 + 0.5);
}

function sign(num: number): number {
  return num < 0 ? -1 : 1;
}

export function decodeBlurhash(
  blurhash: string,
  width: number,
  height: number,
  punch: number = 1.0
): Uint8ClampedArray {
  if (!blurhash || blurhash.length < 6) {
    throw new Error('The blurhash image string is invalid.');
  }

  const sizeFlag = decode83(blurhash[0]);
  const numY = Math.floor(sizeFlag / 9) + 1;
  const numX = (sizeFlag % 9) + 1;

  const quantMaxValue = decode83(blurhash[1]);
  const maxValue = (quantMaxValue + 1) / 166;

  const colors: Array<[number, number, number]> = new Array(numX * numY);

  for (let i = 0; i < colors.length; i++) {
    if (i === 0) {
      const value = decode83(blurhash.substring(2, 6));
      colors[i] = [
        sRGBToLinear(value >> 16),
        sRGBToLinear((value >> 8) & 255),
        sRGBToLinear(value & 255),
      ];
    } else {
      const value = decode83(blurhash.substring(6 + (i - 1) * 2, 6 + i * 2));
      colors[i] = [
        sign(Math.floor(value / 19) - 9) * Math.pow(Math.abs(Math.floor(value / 19) - 9) / 9, 2) * maxValue * punch,
        sign((Math.floor(value / 9) % 9) - 9) * Math.pow(Math.abs((Math.floor(value / 9) % 9) - 9) / 9, 2) * maxValue * punch,
        sign((value % 9) - 9) * Math.pow(Math.abs((value % 9) - 9) / 9, 2) * maxValue * punch,
      ];
    }
  }

  const pixels = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let j = 0; j < numY; j++) {
        for (let i = 0; i < numX; i++) {
          const basis =
            Math.cos((Math.PI * x * i) / width) *
            Math.cos((Math.PI * y * j) / height);
          const color = colors[i + j * numX];
          r += color[0] * basis;
          g += color[1] * basis;
          b += color[2] * basis;
        }
      }

      const intR = linearToSRGB(r);
      const intG = linearToSRGB(g);
      const intB = linearToSRGB(b);

      const pixIndex = (y * width + x) * 4;
      pixels[pixIndex] = intR;
      pixels[pixIndex + 1] = intG;
      pixels[pixIndex + 2] = intB;
      pixels[pixIndex + 3] = 255;
    }
  }

  return pixels;
}
