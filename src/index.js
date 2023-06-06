import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import KmlGenerator from './components/KmlGenerator';
import Steganography from './components/Steganography';
import Fonts from './components/Fonts';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<Steganography />} />
        <Route path='/kml_generator' element={<KmlGenerator />} />
        <Route path='/steganography' element={<Steganography />} />
        <Route path='/fonts' element={<Fonts />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
