import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import MatchCard from "./MatchCard";

export async function loader({ params, request }) {
  const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
  const leagueId = params.id;

  const url = new URL(request.url);
  const season = url.searchParams.get("season") || getSeasonForLeague(leagueId);

  try {
    const [standingsResponse, topScorersResponse, topAssistsResponse, topYellowCardsResponse, topRedCardsResponse, fixturesResponse] = await Promise.all([
      axios.get(`https://v3.football.api-sports.io/standings?league=${leagueId}&season=${season}`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" } }),
      axios.get(`https://v3.football.api-sports.io/players/topscorers?league=${leagueId}&season=${season}`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" } }),
      axios.get(`https://v3.football.api-sports.io/players/topassists?league=${leagueId}&season=${season}`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" } }),
      axios.get(`https://v3.football.api-sports.io/players/topyellowcards?league=${leagueId}&season=${season}`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" } }),
      axios.get(`https://v3.football.api-sports.io/players/topredcards?league=${leagueId}&season=${season}`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" } }),
      axios.get(`https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}`, { headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io" } })
    ]);

    return {
      standings: standingsResponse.data.response[0]?.league?.standings,
      topScorers: topScorersResponse.data.response,
      topAssists: topAssistsResponse.data.response,
      topYellowCards: topYellowCardsResponse.data.response,
      topRedCards: topRedCardsResponse.data.response,
      fixtures: fixturesResponse.data.response,
      leagueInfo: standingsResponse.data.response[0]?.league
    };
  } catch (err) {
    console.error(err);
    return { error: true, message: "Error al cargar los datos de la liga." };
  }
}

function getSeasonForLeague(leagueId) {
  const leagueSeasons = {
    39: "2024",
    140: "2024",
    135: "2024",
    61: "2024",
    253: "2025",
    78: "2024",
  };
  return leagueSeasons[leagueId] || "2024";
}

function formatRoundName(round) {
  const match = round.match(/(\d+)/);
  return match ? `Jornada ${match[1]}` : round;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('es-ES', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

const LeagueDetails = () => {
  const { standings, topScorers, topAssists, topYellowCards, topRedCards, fixtures, leagueInfo } = useLoaderData();
  const [selectedRound, setSelectedRound] = useState("");
  const [tab, setTab] = useState("partidos");

  useEffect(() => {
    if (fixtures && fixtures.length > 0) {
      const today = new Date();
  
      const sortedFixtures = [...fixtures].sort((a, b) =>
        Math.abs(new Date(a.fixture.date) - today) - Math.abs(new Date(b.fixture.date) - today)
      );
  
      if (sortedFixtures.length > 0) {
        setSelectedRound(sortedFixtures[0].league.round);
      }
    }
  }, [fixtures]);
  

  if (!standings) return <p>No hay datos disponibles.</p>;

  const uniqueRounds = [...new Set(fixtures.map(match => match.league.round))];

  const matchesByDate = fixtures
    .filter(match => match.league.round === selectedRound)
    .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date))
    .reduce((acc, match) => {
      const dateKey = formatDate(match.fixture.date);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(match);
      return acc;
    }, {});

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <img src={leagueInfo.logo} alt={leagueInfo.name} className="w-12 h-12 mr-4" />
        <h1 className="text-2xl font-bold">{leagueInfo.name}</h1>
      </div>

      <div className="flex mb-6">
        <button onClick={() => setTab("partidos")} className={`px-4 py-2 border-b-2 ${tab === "partidos" ? "border-blue-500" : "border-transparent"} cursor-pointer`}>Partidos</button>
        <button onClick={() => setTab("clasificacion")} className={`px-4 py-2 border-b-2 ${tab === "clasificacion" ? "border-blue-500" : "border-transparent"} cursor-pointer`}>Clasificación</button>
        <button onClick={() => setTab("estadisticas")} className={`px-4 py-2 border-b-2 ${tab === "estadisticas" ? "border-blue-500" : "border-transparent"} cursor-pointer`}>Estadísticas</button>
      </div>

      {tab === "partidos" && (
        <>
          <div className="mb-4">
            <select value={selectedRound} onChange={(e) => setSelectedRound(e.target.value)} className="border p-2 rounded w-full max-w-xs">
              {uniqueRounds.map((round, idx) => (
                <option key={idx} value={round}>
                  {formatRoundName(round)}
                </option>
              ))}
            </select>
          </div>
          {Object.entries(matchesByDate).map(([date, matches]) => (
            <div key={date} className="mb-6">
              <h3 className="text-center text-gray-500 text-sm font-semibold mb-2">{date}</h3>
              <div className="rounded-lg shadow-md p-4">
                {matches.map(match => (
                  <MatchCard key={match.fixture.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "clasificacion" && (
        standings.map((group, index) => (
          <div key={index} className="rounded-lg shadow-md p-6 mb-4">
            <h3 className="text-lg font-bold mb-4">Grupo {index + 1}</h3>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Equipo</th>
                  <th className="p-2">PJ</th>
                  <th className="p-2">PG</th>
                  <th className="p-2">PE</th>
                  <th className="p-2">PP</th>
                  <th className="p-2">GF</th>
                  <th className="p-2">GC</th>
                  <th className="p-2">PTS</th>
                </tr>
              </thead>
              <tbody>
                {group.map((team, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{team.rank}</td>
                    <td className="p-2 flex items-center">
                      <img src={team.team.logo} alt={team.team.name} className="w-6 h-6 mr-2" />
                      {team.team.name}
                    </td>
                    <td className="p-2">{team.all.played}</td>
                    <td className="p-2">{team.all.win}</td>
                    <td className="p-2">{team.all.draw}</td>
                    <td className="p-2">{team.all.lose}</td>
                    <td className="p-2">{team.all.goals.for}</td>
                    <td className="p-2">{team.all.goals.against}</td>
                    <td className="p-2">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

{tab === "estadisticas" && (
  <>
    <div className="rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">Máximos Goleadores</h2>
      <ul>
        {topScorers.map((player, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <img src={player.player.photo} alt={player.player.name} className="w-8 h-8 rounded-full mr-2" />
              <span>{player.player.name}</span>
            </div>
            <div>
              <span className="font-bold">{player.statistics[0]?.goals?.total || 0} goles</span>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">Máximos Asistentes</h2>
      <ul>
        {topAssists.map((player, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <img src={player.player.photo} alt={player.player.name} className="w-8 h-8 rounded-full mr-2" />
              <span>{player.player.name}</span>
            </div>
            <div>
              <span className="font-bold">{player.statistics[0]?.goals?.assists || 0} asistencias</span>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="rounded-lg shadow-md p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">Jugadores con más Tarjetas Amarillas 🟨</h2>
      <ul>
        {topYellowCards.map((player, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <img src={player.player.photo} alt={player.player.name} className="w-8 h-8 rounded-full mr-2" />
              <span>{player.player.name}</span>
            </div>
            <div>
              <span className="font-bold">{player.statistics[0]?.cards?.yellow || 0} amarillas</span>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Jugadores con más Tarjetas Rojas 🟥</h2>
      <ul>
        {topRedCards.map((player, index) => (
          <li key={index} className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <img src={player.player.photo} alt={player.player.name} className="w-8 h-8 rounded-full mr-2" />
              <span>{player.player.name}</span>
            </div>
            <div>
              <span className="font-bold">{player.statistics[0]?.cards?.red || 0} rojas</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </>
)}

    </div>
  );
};

export default LeagueDetails;
