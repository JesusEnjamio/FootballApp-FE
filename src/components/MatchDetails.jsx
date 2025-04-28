import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import axios from 'axios';
import Lineups from './Lineups';

export async function loader({ params }) {
  const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
  const matchId = params.id;

  try {
    const fixtureResponse = await axios.get(
      `https://v3.football.api-sports.io/fixtures?id=${matchId}`,
      { headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' } }
    );

    const matchData = fixtureResponse.data.response[0];

    const statisticsResponse = await axios.get(
      `https://v3.football.api-sports.io/fixtures/statistics?fixture=${matchId}`,
      { headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' } }
    );

    matchData.statistics = statisticsResponse.data.response;

    const eventsResponse = await axios.get(
      `https://v3.football.api-sports.io/fixtures/events?fixture=${matchId}`,
      { headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' } }
    );

    matchData.events = eventsResponse.data.response;

    const lineupsResponse = await axios.get(
      `https://v3.football.api-sports.io/fixtures/lineups?fixture=${matchId}`,
      { headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' } }
    );

    matchData.lineups = lineupsResponse.data.response;

    return matchData;
  } catch (err) {
    console.error(err);
    return { error: true, message: 'Error al cargar los detalles del partido.' };
  }
}

const MatchDetails = () => {
  const data = useLoaderData();
  const [activeTab, setActiveTab] = useState('eventos');

  if (data.error) {
    return <p className="text-center text-red-500">{data.message}</p>;
  }

  const { teams, goals, statistics, events, lineups } = data;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{teams.home.name} vs {teams.away.name}</h1>

      <div className="flex items-center justify-between rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center w-1/4">
          <img src={teams.home.logo} alt="" className="w-10 h-10 mr-2" />
          {teams.home.name}
        </div>
        <div className="text-2xl font-bold">{goals.home} - {goals.away}</div>
        <div className="flex items-center w-1/4 justify-end">
          {teams.away.name}
          <img src={teams.away.logo} alt="" className="w-10 h-10 ml-2" />
        </div>
      </div>

      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('eventos')}
          className={`px-4 py-2 font-semibold ${activeTab === 'eventos' ? 'border-b-2 border-green-600' : 'text-gray-500'} cursor-pointer`}
        >
          Eventos / Estadísticas
        </button>
        <button
          onClick={() => setActiveTab('alineaciones')}
          className={`px-4 py-2 font-semibold ml-4 ${activeTab === 'alineaciones' ? 'border-b-2 border-green-600' : 'text-gray-500'} cursor-pointer`}
        >
          Alineaciones
        </button>
      </div>

      {activeTab === 'eventos' && (
        <div className="flex flex-col md:flex-row gap-6">
       
          <div className="w-full md:w-2/3 space-y-6">
            <div className=" rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Eventos del Partido</h2>
              {events && (
                <div className="space-y-8">
                  {['Goal', 'VAR', 'Card', 'subst'].map((eventType, idx) => (
                    <div key={idx}>
                      {events.some(e => (eventType === 'VAR' ? e.detail.includes('VAR') : e.type === eventType)) && (
                        <>
                          <h3 className="text-lg font-bold mb-4">
                            {eventType === 'Goal' && 'GOLES'}
                            {eventType === 'VAR' && 'VAR'}
                            {eventType === 'Card' && 'TARJETAS'}
                            {eventType === 'subst' && 'CAMBIOS'}
                          </h3>
                          {events.filter(e => (eventType === 'VAR' ? e.detail.includes('VAR') : e.type === eventType))
                            .sort((a, b) => a.time.elapsed - b.time.elapsed)
                            .map((event, idx2) => {
                              const isHome = event.team.id === teams.home.id;
                              const alignment = isHome ? 'justify-start' : 'justify-end';
                              const flexDirection = isHome ? 'flex-row' : 'flex-row-reverse';
                              const imageSrc = event.player?.photo || event.team.logo;

                              return (
                                <div key={idx2} className={`flex ${alignment} border-b py-2`}>
                                  <div className={`flex items-center space-x-2 ${flexDirection}`}>
                                    <img src={imageSrc} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    <div className="flex flex-col text-center">
                                      <span className="font-semibold">{event.player?.name}</span>
                                      {event.assist?.name && <span className="text-gray-500 text-xs">{event.assist.name}</span>}
                                      {event.comments && <span className="text-gray-500 text-xs">{event.comments}</span>}
                                    </div>
                                    <div className="flex flex-col items-center ml-2">
                                      <span className="text-green-600 font-bold">{event.time.elapsed}'</span>
                                      <span>
                                        {eventType === 'Goal' && '⚽'}
                                        {eventType === 'VAR' && '🎥'}
                                        {eventType === 'Card' && (event.detail.includes('Yellow') ? '🟨' : '🟥')}
                                        {eventType === 'subst' && '🔄'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <div className=" rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Estadísticas del Partido</h2>
              {statistics && statistics[0]?.statistics && statistics[1]?.statistics && (
                <div className="space-y-10">
                  {['ESTADÍSTICAS GENERALES', 'ATAQUE', 'DEFENSA', 'DISTRIBUCIÓN', 'DISCIPLINA'].map((sectionTitle, idxSection) => (
                    <div key={idxSection}>
                      <h3 className="text-xl font-bold mb-4 border-b pb-2">{sectionTitle}</h3>
                      <div className="space-y-6">
                        {statistics[0].statistics.map((stat, idx) => {
                          const homeStat = stat.value ? (typeof stat.value === 'string' ? parseFloat(stat.value) : stat.value) : 0;
                          const awayStat = statistics[1].statistics[idx]?.value ? (typeof statistics[1].statistics[idx].value === 'string' ? parseFloat(statistics[1].statistics[idx].value) : statistics[1].statistics[idx].value) : 0;

                          if (homeStat === 0 && awayStat === 0) return null;

                          const translatedNames = {
                            "Shots On Goal": "Tiros a puerta",
                            "Shots Off Goal": "Tiros fuera",
                            "Total Shots": "Tiros totales",
                            "Blocked Shots": "Disparos bloqueados",
                            "Shots Insidebox": "Tiros dentro del área",
                            "Shots Outsidebox": "Tiros fuera del área",
                            "Goalkeeper Saves": "Paradas del portero",
                            "Tackles": "Entradas",
                            "Passes": "Pases",
                            "Accurate Passes": "Pases completados",
                            "Passes %": "Precisión de pases",
                            "Fouls": "Faltas",
                            "Offsides": "Fueras de juego",
                            "Corners": "Saques de esquina",
                            "Yellow Cards": "Tarjetas amarillas",
                            "Red Cards": "Tarjetas rojas",
                            "Penalties": "Penaltis",
                            "Ball Possession": "Posesión",
                            "Expected Goals": "Goles esperados (xG)",
                          };

                          function cleanStatName(name) {
                            return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                          }

                          const statNameClean = cleanStatName(stat.type);
                          const displayName = translatedNames[statNameClean] || statNameClean;

                          let category = "OTROS";
                          if (["Posesión", "Fueras de juego", "Saques de esquina", "Goles esperados (xG)"].includes(displayName)) category = "ESTADÍSTICAS GENERALES";
                          if (["Tiros totales", "Tiros a puerta", "Tiros fuera", "Disparos bloqueados", "Tiros dentro del área", "Tiros fuera del área"].includes(displayName)) category = "ATAQUE";
                          if (["Paradas del portero", "Entradas"].includes(displayName)) category = "DEFENSA";
                          if (["Pases", "Pases completados", "Precisión de pases"].includes(displayName)) category = "DISTRIBUCIÓN";
                          if (["Faltas", "Tarjetas amarillas", "Tarjetas rojas"].includes(displayName)) category = "DISCIPLINA";

                          if (category !== sectionTitle) return null;

                          const total = (homeStat || 0) + (awayStat || 0);
                          const homePercent = total ? Math.round((homeStat / total) * 100) : 0;
                          const awayPercent = total ? Math.round((awayStat / total) * 100) : 0;

                          return (
                            <div key={idx}>
                              <div className="text-center font-semibold mb-1">{displayName}</div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>{homeStat}</span>
                                <span>{awayStat}</span>
                              </div>
                              <div className="flex h-4 overflow-hidden rounded bg-gray-200">
                                <div className="bg-green-500" style={{ width: `${homePercent}%` }}></div>
                                <div className="bg-blue-500" style={{ width: `${awayPercent}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      
      {activeTab === 'alineaciones' && (
  <div className=" rounded-lg shadow-md p-4">
    <Lineups teams={teams} lineups={lineups} />
  </div>
)}

      
    </div>
  );
};

export default MatchDetails;
