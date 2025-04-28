import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MatchCard from './MatchCard';

import { Link } from 'react-router-dom';

const LiveMatches = () => {
  const [leagues, setLeagues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
  const LEAGUE_IDS = [39, 140, 135, 61, 78, 2, 3, 253, 143];

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const MATCHES_URL = `https://v3.football.api-sports.io/fixtures?date=${formatDate(selectedDate)}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(MATCHES_URL, {
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        });

        if (!Array.isArray(response.data.response)) {
          throw new Error('La respuesta de la API no contiene datos válidos.');
        }

        const filteredMatches = response.data.response.filter((match) =>
          LEAGUE_IDS.includes(match.league.id)
        );

        const matchesByLeague = {};
        filteredMatches.forEach((match) => {
          const leagueId = match.league.id;
          const leagueName = match.league.name;
          const round = match.league.round;

          if (!matchesByLeague[leagueName]) {
            matchesByLeague[leagueName] = {
              id: leagueId,
              logo: match.league.logo,
              rounds: {},
            };
          }

          if (!matchesByLeague[leagueName].rounds[round]) {
            matchesByLeague[leagueName].rounds[round] = [];
          }

          matchesByLeague[leagueName].rounds[round].push(match);
        });

        setLeagues(matchesByLeague);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los partidos.');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div className="container mx-auto p-4">
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Selecciona una fecha:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date('2025-01-01')}
          maxDate={new Date('2025-12-31')}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      {loading ? (
        <p className="text-center">Cargando partidos...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : Object.keys(leagues).length > 0 ? (
        Object.entries(leagues).map(([leagueName, leagueData]) => (
          <section key={leagueName} className="mb-4">
 
            <div className="rounded-lg shadow-md p-4 mb-2 flex items-center justify-between">
              <Link to={`/liga/${leagueData.id}`} className="flex items-center hover:opacity-80 transition">
                <img
                  src={leagueData.logo}
                  alt={`${leagueName} logo`}
                  className="w-6 h-6 mr-2"
                />
                <h2 className="text-xl font-bold">{leagueName}</h2>
              </Link>

              <span className="text-lg font-semibold">
                Jornada {extractRoundNumber(Object.keys(leagueData.rounds)[0])}
              </span>
            </div>

            {Object.entries(leagueData.rounds).map(([round, matches]) => (
              <div key={round} className=" rounded-lg shadow-md p-4 mb-4">
                {matches.length > 0 ? (
                  matches.map((match) => (
                    <MatchCard key={match.fixture.id} match={match} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">No hay partidos disponibles para esta jornada.</p>
                )}
              </div>
            ))}
          </section>
        ))
      ) : (
        <p className="text-center">No hay partidos disponibles para esta fecha.</p>
      )}
    </div>
  );
};

function extractRoundNumber(round) {
  const match = round.match(/(\d+)/);
  return match ? match[0] : 'N/A';
}

export default LiveMatches;