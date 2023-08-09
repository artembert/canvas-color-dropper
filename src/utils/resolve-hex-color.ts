export const resolveHexColor = (pixel: Uint8ClampedArray) => {
  return (
    "#" +
    (
      "000000" + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)
    ).slice(-6)
  );
};
