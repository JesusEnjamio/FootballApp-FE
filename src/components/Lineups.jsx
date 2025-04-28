import React from 'react';

const Lineups = ({ teams, lineups }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6">
     
      <div className="w-full md:w-1/2 rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6 text-center">{teams.home.name}</h3>

        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-4">Titulares</h4>
          {['G', 'D', 'M', 'F'].map((posLetter) => (
            <div key={posLetter} className="mb-4">
              <h5 className="text-lg font-bold border-b pb-1 mb-3">
                {posLetter === 'G' && 'Portero'}
                {posLetter === 'D' && 'Defensas'}
                {posLetter === 'M' && 'Centrocampistas'}
                {posLetter === 'F' && 'Delanteros'}
              </h5>
              <div className="space-y-2">
                {lineups.find(t => t.team.id === teams.home.id)?.startXI
                  .filter(player => player.player.pos.startsWith(posLetter))
                  .map((player, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={player.player.photo || teams.home.logo} alt="jugador" className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex flex-col">
                        <span className="font-semibold">#{player.player.number} {player.player.name}</span>
                        <span className="text-xs text-gray-500">{player.player.pos}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4">Suplentes</h4>
          <div className="space-y-2">
            {lineups.find(t => t.team.id === teams.home.id)?.substitutes.map((player, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={player.player.photo || teams.home.logo} alt="jugador" className="w-8 h-8 rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="font-semibold">#{player.player.number} {player.player.name}</span>
                  <span className="text-xs text-gray-500">{player.player.pos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6 text-center">{teams.away.name}</h3>

        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-4">Titulares</h4>
          {['G', 'D', 'M', 'F'].map((posLetter) => (
            <div key={posLetter} className="mb-4">
              <h5 className="text-lg font-bold border-b pb-1 mb-3">
                {posLetter === 'G' && 'Portero'}
                {posLetter === 'D' && 'Defensas'}
                {posLetter === 'M' && 'Centrocampistas'}
                {posLetter === 'F' && 'Delanteros'}
              </h5>
              <div className="space-y-2">
                {lineups.find(t => t.team.id === teams.away.id)?.startXI
                  .filter(player => player.player.pos.startsWith(posLetter))
                  .map((player, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={player.player.photo || teams.away.logo} alt="jugador" className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex flex-col">
                        <span className="font-semibold">#{player.player.number} {player.player.name}</span>
                        <span className="text-xs text-gray-500">{player.player.pos}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4">Suplentes</h4>
          <div className="space-y-2">
            {lineups.find(t => t.team.id === teams.away.id)?.substitutes.map((player, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={player.player.photo || teams.away.logo} alt="jugador" className="w-8 h-8 rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="font-semibold">#{player.player.number} {player.player.name}</span>
                  <span className="text-xs text-gray-500">{player.player.pos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lineups;