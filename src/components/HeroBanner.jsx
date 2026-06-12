import { Play, Info, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeroBanner({ featuredAnime }) {
  if (!featuredAnime) return (
    <div className="w-full h-[60vh] skeleton rounded-2xl"></div>
  );

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] rounded-3xl overflow-hidden group">
      {/* Background Image */}
      <img
        src={featuredAnime.banner || featuredAnime.cover}
        alt={featuredAnime.title}
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
      />
      
      {/* Gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:w-2/3">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-2xl">
            {featuredAnime.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm font-medium mb-6">
            <span className="text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-1 rounded">
              {featuredAnime.rating || 'N/A'}
            </span>
            <span className="text-gray-300">{featuredAnime.type || 'Anime'}</span>
            <span className="text-gray-300">
              {featuredAnime.genres?.slice(0, 3).join(', ') || 'Various'}
            </span>
          </div>

          <p className="text-gray-300 mb-8 max-w-2xl line-clamp-3 md:line-clamp-4 text-base md:text-lg drop-shadow-md">
            {featuredAnime.synopsis || 'Disfruta de este increíble anime en AnimeVerse. Haz clic en "Ver Ahora" para comenzar la aventura.'}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to={`/anime/${featuredAnime.id}`} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Play fill="currentColor" size={20} />
              <span>Ver Ahora</span>
            </Link>
            <button className="flex items-center gap-2 glass hover:bg-white/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all transform hover:scale-105">
              <Plus size={20} />
              <span>Mi Lista</span>
            </button>
            <Link to={`/anime/${featuredAnime.id}`} className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-white px-4 py-3 rounded-full font-semibold transition-colors">
              <Info size={20} />
              <span>Más info</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
