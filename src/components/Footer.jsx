import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] py-8 border-t border-white/5 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 flex items-center justify-center gap-2">
          Hecho con <Heart size={16} className="text-purple-500 fill-purple-500" /> para los fans del anime
        </p>
        <p className="text-gray-500 text-sm mt-2">
          AnimeVerse no almacena ningún video en sus servidores. Todo el contenido es proveído por terceros.
        </p>
      </div>
    </footer>
  );
}
