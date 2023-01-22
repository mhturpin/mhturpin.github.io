function getFileContentsAsBase64(file, processor) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => processor(e.target.result);
    reader.readAsDataURL(file);
  }
}

function base64ToImageData(base64) {
  const img = document.createElement('img');
  img.src = base64;

  const canvas = document.createElement('canvas');
  canvas.height = img.height;
  canvas.width = img.width;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // imageData.data is a flattened array of all the pixel values
  // 4 values represents 1 pixel (r, g, b, a)
  return ctx.getImageData(0, 0, img.width, img.height);
}

function imageDataToBase64(imageData) {
  const canvas = document.createElement('canvas');
  canvas.height = imageData.height;
  canvas.width = imageData.width;
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

function binaryStringToBase64(binaryString) {
  let base64 = '';

  for (let i = 0; i < binaryString.length; i += 8) {
    const chunk = binaryString.slice(i, i + 8);
    if (chunk.length === 8) {
      base64 += String.fromCharCode(parseInt(chunk, 2));
    }
  }

  return base64;
}

function base64ToBinaryString(base64) {
  let binaryString = '';

  for (let i = 0; i < base64.length; i++) {
    binaryString += base64[i].charCodeAt().toString(2).padStart(8, '0');
  }

  return binaryString;
}

function setLastBit(value, bit) {
  // Clear out the last bit with `and`, then use `or` to set the bit
  // 254 = 11111110
  return (value & 254) | bit;
}

function getLastBit(value) {
  return value & 1;
}

function encodeFileInImage(fileToHide, hostImage) {
  // if (!fileToHide.base64 || !hostImage.base64) {
  //   return '';
  // }

  const imageData = base64ToImageData(hostImage.base64);
  const fileNameLength = String.fromCharCode(fileToHide.name.length);
  const fileLength = binaryStringToBase64(fileToHide.base64.length.toString(2).padStart(32, 0));
  const numPixels = imageData.width * imageData.height;

  // Format:
  // File name length (1 byte), file name, file length (4 bytes), file contents
  const base64ToHide = fileNameLength + fileToHide.name + fileLength + fileToHide.base64;

  // Each character is 8 bytes, and we can store 3 bytes per pixel (RGB) -> 3/8
  if ((numPixels * 3) / 8 < base64ToHide.length) {
    alert('Image not large enough');
    return '';
  }

  // Get a binary representation of the base64 encoded file as an array of 0s and 1s
  const binary = base64ToBinaryString(base64ToHide).split('').map((n) => parseInt(n, 10));

  // Write the binary into the least significant bits of the image data
  for (let i = 0; i < numPixels; i++) {
    for (let j = 0; j < 3; j++) {
      // Don't use the alpha channel
      // Using the alpha channel causes conversion back to image to change pixel values
      imageData.data[i * 4 + j] = setLastBit(imageData.data[i * 4 + j], binary[i * 3 + j]);
    }
  }

  return imageDataToBase64(imageData);
}

function decodeFileFromImage(imageWithFile) {
  const imageData = base64ToImageData(imageWithFile.base64);
  let binaryString = '';

  imageData.data.forEach((n, i) => {
    // Skip alpha channel because data doesn't store properly
    if (i % 4 !== 3) {
      binaryString += getLastBit(n);
    }
  });

  const contents = binaryStringToBase64(binaryString);
  const fileNameLength = contents.charCodeAt(0);
  const fileName = contents.slice(1, fileNameLength + 1);
  const fileLength = parseInt(base64ToBinaryString(contents.slice(fileNameLength + 1, fileNameLength + 5)), 2);
  const fileData = contents.slice(fileNameLength + 5);

  return { name: fileName, base64: fileData };
}

export { getFileContentsAsBase64, encodeFileInImage, decodeFileFromImage };
