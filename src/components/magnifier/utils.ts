const matrixLength = 17;
const boxWidth = 10;

const whiteBorder = 4;
const coloredBorder = 8;

const offset = (matrixLength * boxWidth) / 2;
const matrixBasis = Array(matrixLength).fill("#ffffff");
const borderSizes = whiteBorder + coloredBorder;
const defaultColors = matrixBasis.map(() => matrixBasis);
const centralIndex = Math.floor(matrixLength / 2);

// Distance of Circle Center to NextColor

const needBorder = (x: number, y: number) =>
  x === centralIndex && y === centralIndex;
const rgbToHex = (r: number, g: number, b: number): string =>
  ((r << 16) | (g << 8) | b).toString(16);

const getColorByCoordinates = (
  context: HTMLCanvasElement,
  width: number,
  height: number,
  x: number,
  y: number,
  i = 0,
  j = 0,
) => {
  const ctx = context.getContext("2d");
  const widthRatio = Math.round(context.width / width) || 1;
  const heightRatio = Math.round(context.height / height) || 1;
  // @ts-ignore
  const [r, g, b] = ctx.getImageData(
    (x + j) * widthRatio,
    (y + i) * heightRatio,
    1,
    1,
  ).data;

  return `#${`000000${rgbToHex(r, g, b)}`.slice(-6)}`;
};

const convertInto2DMatrix = (array: Uint8ClampedArray, rowLength: number) => {
  const matrix: number[][] = [];
  let j = -1;
  array.forEach((pixel, index) => {
    if (index % rowLength === 0) {
      j++;
      matrix[j] = [];
    }
    matrix[j].push(pixel);
  });
  return matrix;
};

const getColorsMatrix = (
  imageData: number[][],
  x: number,
  y: number,
  widthRatio: number,
  heightRatio: number,
) => {
  const nextColors = [];
  for (let i = -matrixLength / 2; i <= matrixLength / 2; i++) {
    const colorsLine = [];
    for (let j = -matrixLength / 2; j <= matrixLength / 2; j++) {
      const rowPixels = imageData[Math.floor((y + i) * heightRatio)];
      const index = Math.floor((x + j) * widthRatio) * 4;
      const r = rowPixels?.[index] || 0;
      const g = rowPixels?.[index + 1] || 0;
      const b = rowPixels?.[index + 2] || 0;
      const hex = `#${`000000${rgbToHex(r, g, b)}`.slice(-6)}`;

      colorsLine.push(hex);
    }
    nextColors.push(colorsLine);
  }

  return nextColors;
};

export {
  offset,
  needBorder,
  borderSizes,
  matrixBasis,
  centralIndex,
  defaultColors,
  getColorsMatrix,
  convertInto2DMatrix,
  getColorByCoordinates,
};
