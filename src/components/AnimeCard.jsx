import { Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AnimeCard({ anime }) {
  // animeflv-api gives cover as 'cover' and rating as 'rating' usually.
  const { id, title, cover, type, rating } = anime;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative group rounded-xl overflow-hidden bg-gray-900 cursor-pointer shadow-lg shadow-black/20"
    >
      <Link to={`/anime/${id}`} className="block h-full">
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <img
            src={cover || 'https://via.placeholder.com/300x400?text=No+Image'}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100">
            <div className="bg-purple-600/80 backdrop-blur-md p-4 rounded-full text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]">
              <Play fill="currentColor" size={24} />
            </div>
          </div>

          {/* Type Badge */}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white border border-white/10">
            {type || 'Anime'}
          </div>

          {/* Rating */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-yellow-400 border border-white/10">
            <Star size={12} fill="currentColor" />
            <span>{rating || 'N/A'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
