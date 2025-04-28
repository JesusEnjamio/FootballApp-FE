import React, { useEffect, useState } from 'react';
import FavoriteService from '../services/FavoriteService';
import FavoriteMatchCard from './FavoriteMatchCard';
import axios from 'axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await FavoriteService.getFavorites();

      const favoritesWithLogos = await Promise.all(
        favs.map(async (fav) => {
          try {
            const response = await axios.get(`https://v3.football.api-sports.io/fixtures?id=${fav.fixtureId}`, {
              headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'v3.football.api-sports.io',
              },
            });
            const matchData = response.data.response[0];
            return {
              ...fav,
              homeTeamLogo: matchData.teams.home.logo,
              awayTeamLogo: matchData.teams.away.logo,
            };
          } catch (error) {
            console.error('Error obteniendo logos del fixture:', fav.fixtureId, error);
            return fav;
          }
        })
      );

      setFavorites(favoritesWithLogos);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFavorite = async (id) => {
    try {
      await FavoriteService.deleteFavorite(id);
      loadFavorites();
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  const handleUpdateComment = async (id, newComment) => {
    try {
      await FavoriteService.updateComment(id, newComment);
      loadFavorites();
    } catch (error) {
      console.error('Error al actualizar comentario:', error);
    }
  };

  if (loading) {
    return <p className="text-center">Cargando favoritos...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Mis Partidos Favoritos</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">No tienes partidos favoritos todavía.</p>
      ) : (
        favorites.map((fav) => (
          <FavoriteMatchCard
            key={fav.id}
            favorite={fav}
            onDelete={handleDeleteFavorite}
            onUpdateComment={handleUpdateComment}
          />
        ))
      )}
    </div>
  );
};

export default Favorites;
