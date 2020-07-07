chrome.storage.local.get("images", (result) => {
  const images = JSON.parse(result.images) || [];
  const limit = Math.min(3, images.length);
  function reloadImages() {
    const selectedIndices = [];
    while (selectedIndices.length < limit) {
      const randomIndex = Math.floor(Math.random() * images.length);
      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex);
      }
    }
    for (let i = 0; i < selectedIndices.length; i++) {
      const selectedImage = images[selectedIndices[i]];
      const selectedImageUrl = chrome.runtime.getURL(`images/${selectedImage}`);
      const existingImageElement = document.getElementById(`i${i}`);
      if (existingImageElement != null) {
        existingImageElement.src = selectedImageUrl;
      } else {
        const imageWrapperElement = document.getElementById(`w${i}`);
        const imageElement = document.createElement("img");
        imageElement.className = "image";
        imageElement.id = `i${i}`;
        imageElement.src = selectedImageUrl;
        imageWrapperElement.appendChild(imageElement);
      }
    }
  }
  reloadImages();
  setInterval(reloadImages, 7000);
});
