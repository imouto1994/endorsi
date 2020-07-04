import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

import styles from "./Options.css";

export default function Options() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    chrome.storage.local.get("images", (result) => {
      if (result.images != null) {
        setImages(JSON.parse(result.images));
      }
    });
  }, []);

  function onImagesAdded(e) {
    const files = e.target.files;
    const newImages = [...images];
    for (const file of files) {
      newImages.push(file.name);
    }
    chrome.storage.local.set({ images: JSON.stringify(newImages) });
    setImages(newImages);
  }

  return (
    <div>
      <input type="file" onChange={onImagesAdded} multiple />
      <h1>IMAGES</h1>
      <div className={styles.images}>
        {images.map((image) => {
          return (
            <img
              key={image}
              className={styles.image}
              src={chrome.runtime.getURL(`images/${image}`)}
            />
          );
        })}
      </div>
    </div>
  );
}
