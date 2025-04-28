import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

const MatchCard = ({ match }) => {
  const { teams, goals, fixture } = match;

  return (
    <div className="match-card mb-6">
      <div className="flex items-center justify-between">

        <div className="flex items-center w-1/4 justify-start gap-2">
          <FavoriteButton match={match} />
          <img
            src={teams.home.logo}
            alt={`${teams.home.name} logo`}
            className="w-8 h-8"
          />
          <span className="font-semibold text-gray-700">{teams.home.name}</span>
        </div>

        <div className="flex flex-col items-center w-1/2">
          <Link 
            to={`/partidos/${fixture.id}`} 
            className="text-2xl font-bold hover:underline"
          >
            {fixture.status.short === 'NS' ? (
              <span>{new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            ) : (
              <span>{`${goals.home ?? 0} - ${goals.away ?? 0}`}</span>
            )}
          </Link>
        </div>

        <div className="flex items-center w-1/4 justify-end gap-2">
          <span className="font-semibold text-gray-700">{teams.away.name}</span>
          <img
            src={teams.away.logo}
            alt={`${teams.away.name} logo`}
            className="w-8 h-8"
          />
        </div>

      </div>
    </div>
  );
};

export default MatchCard;
