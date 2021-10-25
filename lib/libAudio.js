const fs = require("fs");

const loadAudioFile = (audioContext, filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, null, (error, fileData) => {
      if (error) {
        reject(error);
      }
      audioContext.decodeAudioData(
        // decodeAudioData requires an ArrayBuffer. We can retrieve
        // one from the Buffer object we receive as fileData.
        fileData.buffer,
        (audioBuffer) => {
          resolve(audioBuffer);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

export const playAudioBuffer = (audioContext, audioBuffer) => {
  let bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = audioBuffer;
  // Connect to the speakers
  bufferSource.connect(audioContext.destination);
  // Start playing
  bufferSource.start(0);
};

export const playAudioFile = (audioContext, filePath) => {
  loadAudioFile(audioContext, filePath)
    .then((buffer) => {
      playAudioBuffer(audioContext, buffer);
    })
    .catch((error) => {
      throw error;
    });
};
