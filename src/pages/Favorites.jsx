import { useStore } from '../store/useStore';
import AnimeCard from '../components/AnimeCard';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const favorites = useStore((state) => state.favorites);

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-purple-500 fill-purple-500" size={28} />
        <h1 className="text-3xl font-bold">Mis Favoritos</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="mx-auto text-gray-600 mb-4" size={64} />
          <h2 className="text-xl font-medium text-gray-400">Aún no tienes animes favoritos</h2>
          <p className="text-gray-500 mt-2">Agrega animes a tus favoritos para verlos aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {favorites.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
