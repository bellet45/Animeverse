import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, User, PlayCircle, History, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Limpiar búsqueda
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg shadow-black/50 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-1">
            <PlayCircle size={28} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">
            AnimeVerse
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">Inicio</Link>
          <Link to="/catalog" className="text-gray-300 hover:text-white transition-colors font-medium">Catálogo</Link>
        </div>

        {/* Search Bar & Actions */}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar anime..."
              className="bg-gray-800/50 border border-gray-700/50 rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-800 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <Link to="/favorites" className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/80 rounded-full transition-all">
            <Heart size={20} />
          </Link>
          <Link to="/history" className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/80 rounded-full transition-all">
            <History size={20} />
          </Link>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full transition-all font-medium text-sm shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            <User size={18} />
            <span>Acceder</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-300">
          <Menu size={24} />
        </button>

      </div>
    </nav>
  );
}
