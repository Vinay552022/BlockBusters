import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import FileRetrieve from './components/FileRetrieve';

function App() {
  return (
    <>
      <FileUpload/>
      <FileRetrieve/>
    </>
  );
}
export default App;
