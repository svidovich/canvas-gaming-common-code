// Thanks be to broofa for this algo:
// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const loadImageFromPath = (imagePath, width, height) => {
  if (!imagePath) {
    throw new Error("imagePath is a required argument!");
  }
  let image = new Image();
  if (height) {
    image.height = height;
  }
  if (width) {
    image.width = width;
  }
  image.src = imagePath;
  return image;
};
