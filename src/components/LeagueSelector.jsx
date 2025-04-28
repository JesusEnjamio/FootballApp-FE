import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LeagueSelector = ({onClose}) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');
  const [selectedSeason, setSelectedSeason] = useState(new Date().getFullYear());

  const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://v3.football.api-sports.io/leagues', {
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        });

        const countrySet = new Set();
        response.data.response.forEach((league) => {
          if (league.country.name !== 'World') {
            countrySet.add(league.country.name);
          }
        });

        setCountries(Array.from(countrySet).sort());
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchLeagues = async () => {
      if (!selectedCountry) return;

      try {
        const response = await axios.get(`https://v3.football.api-sports.io/leagues?country=${selectedCountry}`, {
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'v3.football.api-sports.io',
          },
        });

        setLeagues(response.data.response);
      } catch (error) {
        console.error('Error fetching leagues:', error);
      }
    };

    fetchLeagues();
  }, [selectedCountry]);

  return (
    <div className="bg-white rounded-lg p-4">
   
      <div className="mb-4">
        <label className="block text-sm font-bold mb-1 text-gray-700">País</label>
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedLeagueId('');
          }}
          className="select-custom w-full"
        >
          <option value="">-- Elige un país --</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1 text-gray-700">Liga</label>
          <select
            value={selectedLeagueId}
            onChange={(e) => setSelectedLeagueId(e.target.value)}
            className="select-custom w-full"
          >
            <option value="">-- Elige una liga --</option>
            {leagues.map((league) => (
              <option key={league.league.id} value={league.league.id}>
                {league.league.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedLeagueId && (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1 text-gray-700">Temporada</label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="select-custom w-full"
          >
            {[2025, 2024, 2023, 2022].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      {selectedLeagueId && (
  <Link
    to={`/liga/${selectedLeagueId}?season=${selectedSeason}`}
    className="button block text-center mt-4"
    onClick={onClose}  
  >
    Ver Liga
  </Link>
)}

    </div>
  );
};

export default LeagueSelector;
