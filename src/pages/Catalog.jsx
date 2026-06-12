import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { search, getLatestAnimeAdded, filterAnime } from '../api/animeflv';
import AnimeCard from '../components/AnimeCard';
import { Search, Filter, Grid, List as ListIcon, X } from 'lucide-react';

const GENRES = [
  "Acción", "Aventuras", "Comedia", "Drama", "Ecchi", 
  "Fantasía", "Magia", "Mecha", "Misterio", "Psicológico", 
  "Romance", "Sci-Fi", "Seinen", "Shoujo", "Shounen", "Terror"
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Sync state with URL params
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() === '') {
      searchParams.delete('q');
    } else {
      searchParams.set('q', val);
    }
    setSearchParams(searchParams);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const hasFilters = selectedGenres.length > 0;

  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => search(searchQuery),
    enabled: searchQuery.length > 2 && !hasFilters
  });

  const { data: filterResults, isLoading: loadingFilter } = useQuery({
    queryKey: ['filter', selectedGenres],
    queryFn: () => filterAnime({ genres: selectedGenres }),
    enabled: hasFilters
  });

  const { data: latestAnime, isLoading: loadingLatest } = useQuery({
    queryKey: ['latestAnime'],
    queryFn: getLatestAnimeAdded,
    enabled: searchQuery.length <= 2 && !hasFilters
  });

  const isLoading = hasFilters ? loadingFilter : (searchQuery.length > 2 ? loadingSearch : loadingLatest);
  const displayData = hasFilters ? filterResults : (searchQuery.length > 2 ? searchResults?.data : latestAnime);

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Catálogo de Anime</h1>
          <p className="text-gray-400">Explora nuestro extenso catálogo de animes</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={hasFilters}
              className="w-full bg-gray-900 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${showFilters || hasFilters ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'glass hover:bg-white/10'}`}
          >
            <Filter size={18} />
            <span>Filtros {selectedGenres.length > 0 && `(${selectedGenres.length})`}</span>
          </button>
        </div>
      </div>

      {/* Panel de Filtros */}
      {showFilters && (
        <div className="bg-gray-900/80 border border-white/5 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Géneros</h3>
            {selectedGenres.length > 0 && (
              <button onClick={() => setSelectedGenres([])} className="text-sm text-red-400 hover:text-red-300">
                Limpiar filtros
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedGenres.includes(genre)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[3/4] skeleton rounded-xl w-full"></div>
          ))}
        </div>
      ) : displayData && displayData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {displayData.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          No se encontraron resultados{searchQuery && !hasFilters ? ` para "${searchQuery}"` : ''}
        </div>
      )}
    </div>
  );
}
