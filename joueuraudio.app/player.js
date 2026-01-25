const fileInput = document.getElementById("file");
const player = document.getElementById("player");

function openFile() {
  fileInput.click();
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  player.src = url;
  player.play();
});
