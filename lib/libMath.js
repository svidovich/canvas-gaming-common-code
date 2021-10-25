export const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// For computing the distance between two points
// A and B, each with a component x and a component y
export const distance = (A, B) => {
  return Math.sqrt(Math.pow(B.y - A.y, 2) + Math.pow(B.x - A.x, 2));
};
