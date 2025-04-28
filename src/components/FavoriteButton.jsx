import React, { useEffect, useState } from 'react';
import FavoriteService from '../services/FavoriteService';

const FavoriteButton = ({ match }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const favorites = await FavoriteService.getFavorites();
      const exists = favorites.some((fav) => fav.fixtureId === match.fixture.id);
      setIsFavorite(exists);
      setFavoritesLoaded(true);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault(); 

    if (!favoritesLoaded) return;

    try {
      if (isFavorite) {
        const favorites = await FavoriteService.getFavorites();
        const favorite = favorites.find((fav) => fav.fixtureId === match.fixture.id);
        if (favorite) {
          await FavoriteService.deleteFavorite(favorite.id);
        }
      } else {
        await FavoriteService.addFavorite({
          fixtureId: match.fixture.id,
          leagueName: match.league.name,
          homeTeamName: match.teams.home.name,
          awayTeamName: match.teams.away.name,
          goalsHome: match.goals.home,
          goalsAway: match.goals.away,
          fixtureDate: match.fixture.date,
          comment: '',
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className="mr-2 cursor-pointer"
      title={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
    >
      {isFavorite ? '⭐' : '☆'}
    </button>
  );
};

export default FavoriteButton;
