import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import styles from "./NewTab.css";

export default function Options() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    chrome.storage.local.get("images", (result) => {
      if (result.images != null) {
        setImages(JSON.parse(result.images));
      }
    });
  }, []);

  // Select 3 images
  const selectedIndices = [];
  const limit = Math.min(3, images.length);
  while (selectedIndices.length < limit) {
    const randomIndex = Math.floor(Math.random() * images.length);
    if (!selectedIndices.includes(randomIndex)) {
      selectedIndices.push(randomIndex);
    }
  }
  const selectedImages = images.filter((_, index) =>
    selectedIndices.includes(index),
  );

  return (
    <div className={styles.images}>
      {selectedImages.map((image) => {
        return (
          <div className={styles.imageContainer} key={image}>
            <div className={styles.imageWrapper}>
              <img
                className={styles.image}
                src={chrome.runtime.getURL(`images/${image}`)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
