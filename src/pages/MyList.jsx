import { useState } from 'react';
import { useStore } from '../store/useStore';
import AnimeCard from '../components/AnimeCard';
import { Bookmark, Clock, CheckCircle2, List as ListIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'viendo', label: 'Viendo', icon: Clock },
  { id: 'pendiente', label: 'Pendientes', icon: Bookmark },
  { id: 'terminado', label: 'Terminados', icon: CheckCircle2 }
];

export default function MyList() {
  const { myList } = useStore();
  const [activeTab, setActiveTab] = useState('viendo');

  const filteredList = myList?.filter(anime => anime.status === activeTab) || [];

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <ListIcon className="text-purple-500" size={32} />
            Mi Lista
          </h1>
          <p className="text-gray-400">Gestiona los animes que sigues, planeas ver o ya terminaste.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const count = (myList || []).filter(a => a.status === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-all relative ${
                activeTab === tab.id 
                  ? 'text-purple-400' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-400'
              }`}>
                {count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              )}
            </button>
          )
        })}
      </div>

      {filteredList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredList.map((anime) => (
            <div key={anime.id} className="relative group">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800/50">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="text-gray-500" size={24} />
          </div>
          <h3 className="text-xl font-medium text-gray-300 mb-2">Lista vacía</h3>
          <p className="text-gray-500 mb-6">Aún no tienes animes en esta categoría.</p>
          <Link to="/catalog" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
            Explorar Catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
