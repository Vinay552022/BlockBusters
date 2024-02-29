import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        setError('Please select a file.');
        return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:4005/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadResult(response.data);
    } catch (error) {
      setError('Error uploading file.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div>{error}</div>}
      {uploadResult && (
        <div>
          <h3>Upload Successful!</h3>
          <p>IPFS Hash: {uploadResult.ipfsHash}</p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;