import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Catalog from '../pages/Catalog';
import AnimeDetails from '../pages/AnimeDetails';
import Watch from '../pages/Watch';
import MyList from '../pages/MyList';
import History from '../pages/History';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route path="/watch/:id/:episode" element={<Watch />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

