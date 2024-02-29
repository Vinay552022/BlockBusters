import React, { useState } from 'react';
import axios from 'axios';

export default function FileRetrieve() {
  const [hashValues, setHashValues] = useState(['bafkreigrmekxpit3va252sodhfrxdtqspoe7ac6gqiivewrveq4k55agyy', 'bafkreicxcl34vy2qwaranijjcmzfug2xuc527l5uxff3ycosxdlmtxzcwm']); // Replace with your actual Pinata hash values
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const retrieveFiles = async () => {
    try {
      setLoading(true);

      // Send hash values to the backend
      const response = await axios.post('http://localhost:4005/retrieve', { hashValues });

      // Update state with received files
      setFiles(response.data.files);

    } catch (error) {
      setError('Error retrieving files.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={retrieveFiles} disabled={loading}>
        {loading ? 'Retrieving...' : 'Retrieve Files'}
      </button>
      {error && <div>{error}</div>}
      {files.length > 0 && (
        <div>
          <h3>Received Files:</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.type.startsWith('image/') ? (
                  <img src={file.data} alt={`Image ${index}`} style={{ maxWidth: '100px' }} />
                ) : (
                  <p>{`File ${index}: ${file.filename}`}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
