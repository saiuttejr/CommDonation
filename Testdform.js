import React, { useState } from 'react';

const BasicFileInput = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  return (
    <div>
      <h2>Test File Input</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {fileName && <p>Selected File: {fileName}</p>}
    </div>
  );
};

export default BasicFileInput;

