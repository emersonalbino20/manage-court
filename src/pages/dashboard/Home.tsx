import React, { useState } from 'react';
import Header from '@/_components/Header.tsx';
import Footer from '@/_components/Footer.tsx';
import ContentHome from '@/_components/ContentHome';

const Home = () => {
const [termoPesquisa, setTermoPesquisa] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Page Content */}
        <ContentHome/>
      {/* Footer */}
        <Footer/>
    </div>
  );
};

export default Home;