import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [message, setMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMetadata(null);
    setDownloadLink('');
    setMessage('');
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage(response.data.message);
      setMetadata(response.data.metadata);
      setDownloadLink(`http://localhost:5000${response.data.downloadLink}`);
    } catch (error) {
      setMessage('Error uploading file.');
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>Word to PDF Converter</h1>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload & Convert</button>
      <p>{message}</p>
      {metadata && (
        <div>
          <h3>Metadata:</h3>
          <p>File Name: {metadata.originalName}</p>
          <p>File Size: {metadata.size} bytes</p>
          <p>Word Count: {metadata.wordCount}</p>
          <p>Upload Time: {metadata.uploadTime}</p>
        </div>
      )}
      {downloadLink && (
        <a href={downloadLink} download>
          Download Converted PDF
        </a>
      )}
    </div>
  );
}

export default App;
