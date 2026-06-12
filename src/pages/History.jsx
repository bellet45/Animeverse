import { useStore } from '../store/useStore';
import { History as HistoryIcon, Trash2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function History() {
  const history = useStore((state) => state.history);
  const clearHistory = useStore((state) => state.clearHistory);

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <HistoryIcon className="text-purple-500" size={28} />
          <h1 className="text-3xl font-bold">Historial</h1>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Limpiar Historial</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <HistoryIcon className="mx-auto text-gray-600 mb-4" size={64} />
          <h2 className="text-xl font-medium text-gray-400">No has visto ningún episodio recientemente</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, idx) => (
            <Link key={idx} to={`/watch/${item.id}/${item.lastEpisode}`} className="flex gap-4 glass hover:bg-white/5 p-4 rounded-xl transition-all group">
              <div className="w-24 h-32 shrink-0 rounded-lg overflow-hidden relative">
                <img src={item.cover || item.poster} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="text-white" fill="currentColor" size={24} />
                </div>
              </div>
              <div className="flex-1 py-2">
                <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2 mb-1">
                  {item.title}
                </h3>
                <p className="text-purple-400 text-sm font-medium mb-2">Episodio {item.lastEpisode}</p>
                <p className="text-xs text-gray-500">Visto el {new Date(item.date).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
