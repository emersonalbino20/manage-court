import React, { useState } from 'react';
import Header from './_components/Header.tsx';
import Footer from './_components/Footer.tsx';
import Format from './Format';

const LadingPage = () => {
const [termoPesquisa, setTermoPesquisa] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
        <Header onSearch={setTermoPesquisa} />
     
      {/* Page Content */}
        <Format/>

      {/* Footer */}
        <Footer/>
    </div>
  );
};

export default LadingPage;