import { useQuery } from '@tanstack/react-query';
import { getLatestEpisodes, getLatestAnimeAdded } from '../api/animeflv';
import HeroBanner from '../components/HeroBanner';
import AnimeCard from '../components/AnimeCard';
import { PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { data: latestEpisodes, isLoading: loadingEpisodes } = useQuery({
    queryKey: ['latestEpisodes'],
    queryFn: getLatestEpisodes
  });

  const { data: latestAnime, isLoading: loadingAnime } = useQuery({
    queryKey: ['latestAnime'],
    queryFn: getLatestAnimeAdded
  });

  // Usamos el primer anime recién agregado como destacado, o un fallback
  const featured = latestAnime?.[0] || null;

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12">
      {/* Hero Section */}
      <section className="mb-16">
        <HeroBanner featuredAnime={featured} />
      </section>

      {/* Últimos Episodios */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <PlayCircle className="text-purple-500" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold">Últimos Episodios</h2>
        </div>
        
        {loadingEpisodes ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-xl w-full"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {latestEpisodes?.map((ep, idx) => (
              <Link to={`/watch/${ep.id}/${ep.chapter}`} key={idx} className="relative group cursor-pointer block">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                  <img src={ep.cover || 'https://via.placeholder.com/300x170?text=No+Image'} alt={ep.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="text-white" size={32} />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Ep {ep.chapter}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-200 line-clamp-1 group-hover:text-purple-400 transition-colors">
                  {ep.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Animes Populares / Recientes */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-purple-500 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold">Recién Agregados</h2>
        </div>

        {loadingAnime ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-xl w-full"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {latestAnime?.slice(1).map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
