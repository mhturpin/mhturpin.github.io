window.addEventListener('load', () => {
  document.getElementById('host-image').addEventListener('change', () => previewImage('host-image'));
  document.getElementById('image-with-file').addEventListener('change', () => previewImage('image-with-file'));
  document.getElementById('encode-file').addEventListener('click', encodeFileInImage);
  document.getElementById('decode-file').addEventListener('click', decodeFileFromImage);

  const e = new Event('change');
  document.getElementById('host-image').dispatchEvent(e);
  document.getElementById('image-with-file').dispatchEvent(e);
});

function diff(data1, data2) {
  diffarr = []

  for (let i = 0; i < data1.length; i ++) {
    if (data1[i] !== data2[i]) {
      diffarr.push([data1[i], data2[i], i])
    }
  }

  return diffarr;
}

function encodeFileInImage() {
  processFileAsBase64(document.getElementById('hidden-file').files[0], (base64ToHide) => {
    processFileAsBase64(document.getElementById('host-image').files[0], (base64Host) => {
      let imageData = base64ToImageData(base64Host);
      let fileName = document.getElementById('hidden-file').files[0].name;
      let fileNameLength = String.fromCharCode(fileName.length);
      let fileLength = binaryToBase64(base64ToHide.length.toString(2).padStart(32, 0));

      // Format:
      // File name length (1 byte), file name, file length (4 bytes), file contents
      base64ToHide = fileNameLength + fileName + fileLength + base64ToHide;

      if (imageData.width*imageData.height*3/8 < base64ToHide.length) {
        alert('Image not large enough');
        return;
      }

      // Get a binary representation of the base64 encoded file as an array of 0s and 1s
      let binary = base64ToBinary(base64ToHide).split('').map(n => parseInt(n));

      // Write the binary into the least significant bits of the image data
      numPixels = imageData.width * imageData.height
      for (let i = 0; i < numPixels; i ++) {
        for (let j = 0; j < 3; j ++) {
          // Don't use the alpha channel
          // Using the alpha channel causes conversion back to image to change pixel values
          imageData.data[i*4 + j] = setLastBit(imageData.data[i*4 + j], binary[i*3 + j]);
        }
      }

      showDowloadButton('encoded-file-download', 'result.png', imageDataToBase64(imageData));
    });
  });
}

function processFileAsBase64(file, processor) {
  if (file) {
    let reader = new FileReader();
    reader.onload = e => processor(e.target.result);
    reader.readAsDataURL(file);
  }
}

function base64ToBinary(base64) {
  let binaryString = '';

  for (let c of base64) {
    binaryString += c.charCodeAt().toString(2).padStart(8, '0');
  }

  return binaryString;
}

function base64ToImageData(base64) {
  let img = document.createElement('img');
  img.src = base64;

  let canvas = document.createElement('canvas');
  canvas.height = img.height;
  canvas.width = img.width;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // imageData.data is a flattened array of all the pixel values
  // 4 values represents 1 pixel (r, g, b, a)
  return ctx.getImageData(0, 0, img.width, img.height);
}

function imageDataToBase64(imageData) {
  let canvas = document.createElement('canvas');
  canvas.height = imageData.height;
  canvas.width = imageData.width;
  let ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

function setLastBit(value, bit) {
  // Clear out the last bit with `and`, then use `or` to set the bit
  // 254 = 11111110
  return value & 254 | bit;
}

function getLastBit(value) {
  return value & 1;
}

function decodeFileFromImage() {
  processFileAsBase64(document.getElementById('image-with-file').files[0], (base64Host) => {
    let binaryString = '';
    let imageData = base64ToImageData(base64Host);

    imageData.data.forEach((n, i) => {
      if (i%4 !== 3) {
        binaryString += getLastBit(n);
      }
    });

    let contents = binaryToBase64(binaryString);
    let fileNameLength = contents.charCodeAt(0);
    let fileName = contents.slice(1, fileNameLength + 1);
    let fileLength = parseInt(base64ToBinary(contents.slice(fileNameLength + 1, fileNameLength + 5)), 2);
    let fileData = contents.slice(fileNameLength + 5);

    showDowloadButton('decoded-file-download', fileName, fileData);
  });
}

function binaryToBase64(binaryString) {
  let base64 = '';

  for (let i = 0; i < binaryString.length; i += 8) {
    const chunk = binaryString.slice(i, i + 8);
    if (chunk.length === 8) {
      base64 += String.fromCharCode(parseInt(chunk, 2));
    }
  }

  return base64;
}

function showDowloadButton(id, name, base64) {
  let button = document.getElementById(id);
  button.onclick = () => downloadFile(name, base64);
  button.classList.remove('hidden');
}

function downloadFile(name, base64) {
  let a = window.document.createElement('a');
  a.href = base64;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function previewImage(id) {
  processFileAsBase64(document.getElementById(id).files[0], (base64) => {
    document.getElementById(id + '-preview').src = base64;
  });
}
