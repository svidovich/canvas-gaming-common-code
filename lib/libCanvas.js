// Draws a circle of radius r at (x, y).
export const drawCircle = (CanvasContext, x, y, r) => {
  CanvasContext.beginPath();
  CanvasContext.arc(x, y, r, 0, 2 * Math.PI);
  CanvasContext.stroke();
};

// Draws a disc of radius r at (x, y).
export const drawDisc = (CanvasContext, x, y, r) => {
  CanvasContext.beginPath();
  CanvasContext.arc(x, y, r, 0, 2 * Math.PI);
  CanvasContext.fill();
};

// Returns an object with x, y representing the top left corner of the
// canvas with respect to the page.
export const getCanvasPageCoordinates = (CanvasContext) => {
  let operatingCanvas = CanvasContext.canvas;
  let { left: x, top: y } = operatingCanvas.getBoundingClientRect();

  return { x: x, y: y };
};

export const getCurrentFontSize = (CanvasContext) => {
  return parseInt(CanvasContext.font.replace(/[^0-9]/g, ""));
};
