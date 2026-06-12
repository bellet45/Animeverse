import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAnimeInfo } from '../api/animeflv';
import { Play, Star, Calendar, Heart, ListVideo, Share2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AnimeDetails() {
  const { id } = useParams();
  
  const favorites = useStore(state => state.favorites);
  const addFavorite = useStore(state => state.addFavorite);
  const removeFavorite = useStore(state => state.removeFavorite);

  const { data: anime, isLoading } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => getAnimeInfo(id),
    enabled: !!id
  });

  const isFavorite = anime ? favorites.some(f => f.id === anime.id) : false;

  const toggleFavorite = () => {
    if (!anime) return;
    if (isFavorite) {
      removeFavorite(anime.id);
    } else {
      addFavorite(anime);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 min-h-screen">
        <div className="w-full h-64 skeleton rounded-2xl mb-8"></div>
        <div className="flex gap-8">
          <div className="w-64 h-96 skeleton rounded-xl shrink-0"></div>
          <div className="flex-1 space-y-4">
            <div className="w-3/4 h-12 skeleton rounded"></div>
            <div className="w-full h-32 skeleton rounded"></div>
            <div className="w-1/2 h-8 skeleton rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!anime) return <div className="text-center pt-32 text-xl text-gray-400">Anime no encontrado</div>;

  return (
    <div className="min-h-screen pb-12">
      {/* Banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh]">
        <img 
          src={anime.banner || anime.cover} 
          alt={anime.title} 
          className="w-full h-full object-cover blur-sm opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Poster & Actions */}
          <div className="w-full md:w-64 lg:w-72 shrink-0 flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10 relative group">
              <img src={anime.cover} alt={anime.title} className="w-full object-cover" />
            </div>
            
            <Link 
              to={anime.episodes?.length > 0 ? `/watch/${id}/${anime.episodes[anime.episodes.length - 1].episode}` : '#'}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)]"
            >
              <Play fill="currentColor" size={20} />
              Ver Episodio 1
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={toggleFavorite}
                className={`flex items-center justify-center gap-2 glass py-2 rounded-xl transition-colors font-medium text-sm ${isFavorite ? 'text-red-400 hover:bg-red-500/10' : 'text-white hover:bg-white/10'}`}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} /> Favorito
              </button>
              <button className="flex items-center justify-center gap-2 glass hover:bg-white/10 text-white py-2 rounded-xl transition-colors font-medium text-sm">
                <Share2 size={18} /> Compartir
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-4 md:pt-32">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${anime.status === 'En emision' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                {anime.status || 'Finalizado'}
              </span>
              <span className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 font-medium">
                {anime.type || 'Anime'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">
              {anime.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400" size={18} fill="currentColor" />
                <span className="font-bold text-white">{anime.rating || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400" size={18} />
                <span>{anime.year || 'N/A'}</span>
              </div>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed text-lg max-w-4xl">
              {anime.synopsis}
            </p>

            <div className="mb-8">
              <h3 className="text-white font-bold mb-3">Géneros</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres?.map(g => (
                  <span key={g} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-1.5 rounded-full text-sm cursor-pointer transition-colors">
                    {g}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Episodios */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <ListVideo className="text-purple-500" size={28} />
            <h2 className="text-3xl font-bold">Episodios ({anime.episodes?.length || 0})</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {anime.episodes?.map(ep => (
              <Link key={ep.episode} to={`/watch/${id}/${ep.episode}`} className="glass hover:bg-white/5 p-4 rounded-xl flex items-center gap-4 group transition-all">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-purple-600/20 group-hover:text-purple-400 transition-colors">
                  <Play size={20} className="ml-1" />
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">Episodio {ep.episode}</h4>
                  <span className="text-xs text-gray-400">Ver ahora</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
