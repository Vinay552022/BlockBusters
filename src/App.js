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
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: 'd84df280f768e4b0f769',
            pinata_secret_api_key: 'e542066a59a3f89a8c77c4cea7832250c686b58466a6f71d02c8af15aa143347',
          },
        }
      );

      setUploadResult(response.data);
      setError(null);
    } catch (error) {
      setError('Error uploading file.');
      console.error('Error uploading file:', error);
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
          <p>IPFS Hash: {uploadResult.IpfsHash}</p>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
