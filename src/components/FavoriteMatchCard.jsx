import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FavoriteMatchCard = ({ favorite, onDelete, onUpdateComment }) => {
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(favorite.comment || '');

  const handleSaveComment = () => {
    if (comment.trim() !== '') {
      onUpdateComment(favorite.id, comment);
      setEditing(false);
    }
  };

  return (
    <div className="match-card mb-6">
      <div className="flex items-center justify-between">

        <div className="flex items-center w-1/4 justify-start gap-2">
          <img
            src={favorite.homeTeamLogo}
            alt={`${favorite.homeTeamName} logo`}
            className="w-8 h-8"
          />
          <span className="font-semibold text-gray-700">{favorite.homeTeamName}</span>
        </div>

        <div className="flex flex-col items-center w-1/2">
          <Link 
            to={`/partidos/${favorite.fixtureId}`} 
            className="text-2xl font-bold hover:underline"
          >
            {`${favorite.goalsHome ?? 0} - ${favorite.goalsAway ?? 0}`}
          </Link>
          
          {editing ? (
            <div className="flex flex-col items-center mt-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border p-1 rounded text-sm w-40"
              />
              <button
                onClick={handleSaveComment}
                className="button mt-2 text-sm w-24 cursor-pointer"
              >
                Guardar
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-600 mt-1">
              {favorite.comment || <span className="text-gray-400">Sin comentario</span>}
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-end w-1/4 justify-end gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{favorite.awayTeamName}</span>
            <img
              src={favorite.awayTeamLogo}
              alt={`${favorite.awayTeamName} logo`}
              className="w-8 h-8"
            />
          </div>

        </div>        
      </div>
      <div className="flex gap-2 mt-2">
            <button
              onClick={() => setEditing((prev) => !prev)}
              className="text-blue-600 hover:underline text-sm cursor-pointer"
            >
              {editing ? 'Cancelar' : 'Editar'}
            </button>
            <button
              onClick={() => onDelete(favorite.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Eliminar
            </button>
          </div>
    </div>
  );
};

export default FavoriteMatchCard;
