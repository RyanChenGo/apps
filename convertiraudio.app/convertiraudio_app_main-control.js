// converterbrain.js
// Minimal, browser-only audio converter logic
// Requires ffmpeg.wasm to be loaded in the page

import { createFFmpeg, fetchFile } from "https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/ffmpeg.min.js";

const ffmpeg = createFFmpeg({ log: false });

const fileInput = document.getElementById("audioFile");
const formatSelect = document.getElementById("format");
const convertBtn = document.getElementById("convert");
const downloadLink = document.getElementById("download");

async function initFFmpeg() {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
}

convertBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const targetFormat = formatSelect.value;
  const inputName = "input." + file.name.split(".").pop();
  const outputName = "output." + targetFormat;

  convertBtn.disabled = true;
  downloadLink.style.display = "none";

  await initFFmpeg();

  ffmpeg.FS("writeFile", inputName, await fetchFile(file));

  await ffmpeg.run("-i", inputName, outputName);

  const data = ffmpeg.FS("readFile", outputName);
  const blob = new Blob([data.buffer], { type: "audio/" + targetFormat });
  const url = URL.createObjectURL(blob);

  downloadLink.href = url;
  downloadLink.download = "converted." + targetFormat;
  downloadLink.style.display = "inline";

  convertBtn.disabled = false;
});
