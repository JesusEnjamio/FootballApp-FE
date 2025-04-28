import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import LiveMatches from './components/LiveMatches';
import MatchDetails, { loader as matchDetailsLoader } from './components/MatchDetails';
import LeagueDetails, { loader as leagueDetailsLoader } from './components/LeagueDetails';
import Favorites from './components/Favorites';

// Crea un data router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LiveMatches />,
      },
      {
        path: '/partidos/:id',
        element: <MatchDetails />,
        loader: matchDetailsLoader, // Usa el loader para cargar los datos
      },
      {
        path: '/liga/:id',
        element: <LeagueDetails />,
        loader: leagueDetailsLoader,
      },
      {
        path: '/favoritos', // <-- Nueva ruta
        element: <Favorites />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);