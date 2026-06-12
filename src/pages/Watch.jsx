import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLinks, getAnimeInfo } from '../api/animeflv';
import { useState, useEffect } from 'react';
import { ArrowLeft, Server } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Watch() {
  const { id, episode } = useParams();
  const [currentServer, setCurrentServer] = useState(0);

  const { data: anime } = useQuery({
    queryKey: ['anime', id],
    queryFn: () => getAnimeInfo(id),
    enabled: !!id
  });

  const { data: servers, isLoading } = useQuery({
    queryKey: ['episode', id, episode],
    queryFn: () => getLinks(`${id}-${episode}`),
    enabled: !!id && !!episode
  });

  const activeServer = servers?.[currentServer];
  const addToHistory = useStore(state => state.addToHistory);

  useEffect(() => {
    if (anime && episode) {
      addToHistory(anime, episode, 0);
    }
  }, [anime, episode, addToHistory]);

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <Link to={`/anime/${id}`} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit">
        <ArrowLeft size={20} />
        <span>Volver a Detalles</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl relative ring-1 ring-white/10">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : activeServer ? (
              <iframe
                src={activeServer.code}
                className="w-full h-full border-none"
                allowFullScreen
                title="Reproductor de Video"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Servidor no disponible
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {anime?.title || 'Cargando...'}
              </h1>
              <p className="text-purple-400 font-medium">Episodio {episode}</p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Server size={18} className="text-gray-400 shrink-0" />
              {servers?.map((server, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentServer(idx)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    currentServer === idx 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {server.server}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <h3 className="font-bold text-xl mb-4">Más Episodios</h3>
          <div className="bg-gray-900/50 rounded-2xl p-4 max-h-[500px] overflow-y-auto space-y-2 border border-white/5">
            {anime?.episodes?.map(ep => (
              <Link
                key={ep.episode}
                to={`/watch/${id}/${ep.episode}`}
                className={`block p-3 rounded-xl transition-colors ${
                  ep.episode === parseInt(episode)
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                    : 'hover:bg-white/5 text-gray-300'
                }`}
              >
                Episodio {ep.episode}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
