import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import styles from "./NewTab.css";

export default function Options() {
  const [images, setImages] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);

  // Read from extenstion storage for list of images
  useEffect(() => {
    chrome.storage.local.get("images", (result) => {
      if (result.images != null) {
        setImages(JSON.parse(result.images));
      }
    });
  }, []);

  // Select 3 images every 7 seconds
  useEffect(() => {
    function reloadSelectedIndices() {
      const newSelectedIndices = [];
      const limit = Math.min(3, images.length);
      while (newSelectedIndices.length < limit) {
        const randomIndex = Math.floor(Math.random() * images.length);
        if (!newSelectedIndices.includes(randomIndex)) {
          newSelectedIndices.push(randomIndex);
        }
      }
      setSelectedIndices(newSelectedIndices);
    }

    reloadSelectedIndices();
    const intervalId = setInterval(reloadSelectedIndices, 7000);

    return () => clearInterval(intervalId);
  }, [images]);

  const selectedImages = selectedIndices.map((index) => images[index]);

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
