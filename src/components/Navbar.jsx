import { Link } from 'react-router-dom';
import LeagueSelector from './LeagueSelector';
import { useState } from 'react';

const Navbar = () => {
  const [showLeagueSelector, setShowLeagueSelector] = useState(false);

  const toggleLeagueSelector = () => {
    setShowLeagueSelector(prev => !prev);
  };

  const closeLeagueSelector = () => {
    setShowLeagueSelector(false);
  };

  return (
    <nav className="bg-blue-900 text-white fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 shadow-md z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-bold hover:underline">Inicio</Link>
        <Link to="/favoritos" className="font-bold hover:underline flex items-center gap-1">
          Favoritos 
        </Link>
        <button
          onClick={toggleLeagueSelector}
          className="font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          Seguimiento de Ligas 
        </button>
      </div>

      {showLeagueSelector && (
        <div className="absolute top-full left-0 w-full bg-blue-800 p-4 mt-2 shadow-lg">
          <LeagueSelector onClose={closeLeagueSelector} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
