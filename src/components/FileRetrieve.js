import React, { useState, useEffect } from 'react';

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:4005/retrieve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hashValues: ['bafybeihofqih6vmq3gstamuwnbasyhphve3skz57kpkrocg7hbih4al3my', 'bafybeifm2kfpjkfbbjd7vuwqt4s6yztc7zd5m54fyopkvr6lp3z2yuoozu'] })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      const data = await response.json();
      console.log(data.files);
      setImages(data.files);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <button onClick={fetchImages}>Retrieve Images</button>
      {error && <div>Error: {error}</div>}
      {images.map((image, index) => (
        <img key={index} src={`data:image/png;base64,${arrayBufferToBase64(image.fileBuffer.data)}`} alt={`Image ${index}`} />
      ))}
    </div>
  );
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default ImageGallery;
