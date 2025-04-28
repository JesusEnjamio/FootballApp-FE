// src/services/FavoriteService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/favorite-matches'; // Ajusta el puerto si tu backend es otro

const FavoriteService = {
  // Obtener todos los partidos favoritos
  getFavorites: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Añadir un partido favorito
  addFavorite: async (match) => {
    const response = await axios.post(API_URL, match);
    return response.data;
  },

  // Eliminar un partido favorito
  deleteFavorite: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  // Actualizar el comentario de un favorito
  updateComment: async (id, comment) => {
    const response = await axios.patch(`${API_URL}/${id}/comment`, comment, {
      headers: {
        'Content-Type': 'text/plain', // Es importante que sea texto plano
      },
    });
    return response.data;
  },
};

export default FavoriteService;
