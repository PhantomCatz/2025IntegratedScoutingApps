import React from "react";
import ReactDOM from 'react-dom/client';
import HomePage from './routes/home';
import ScoutingApp from './routes/scoutingapp';
import MatchScout from './routes/match';
import DTF from './routes/dtf';
import DTFTeams from './routes/dtfteams';
import StrategicScout from './routes/strategic';
import Lookup from './routes/lookup';
import StrategicLookup from './routes/strategicLookup';
import PitLookup from './routes/pitLookup';
import PitScout from './routes/pit';
import DataLookup from './routes/matchLookup';
import TeamData from './routes/matchData';
import Picklist from './routes/picklist';
import Watchlist from './routes/watchlist';
import WatchlistGet from './routes/watchlistData';
import WatchlistUpdate from './routes/watchlistUpdate';

import { HashRouter, Routes, Route } from 'react-router-dom';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// Debounce alerting because React runs it twice and for less annoyance
window.alert = (function() {
  const alert = globalThis.window.alert;
  let id : any;
  let lastMessage : any[] = [];

  return function(message) {
    clearTimeout(id);

    if(!lastMessage.includes(message)) {
      lastMessage.push(message);
    }

    id = setTimeout(function() {
      if(!lastMessage?.length) {
        return;
      }

      alert(lastMessage.join("\n"));
      lastMessage = [];
    }, 500);
  }
})();
//window.alert = () => {};
/*
globalThis.fetch = (() => {
  const originalFetch = globalThis.fetch;

  return async function(link : any, args : any) {
      const rest = args || {};
      const options = {
        mode: "no-cors",
        ...rest
      };

      return originalFetch(link, options);
    }
})();
//*/

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage title="2637 Strategy App" />} />
        <Route path="/home" element={<HomePage title="2637 Strategy App" />} />
        <Route path="/scoutingapp" element={<ScoutingApp title="2637 Scouting App" />} />
        <Route path="/scoutingapp/match" element={<MatchScout title="2637 Match Scout" />} />
        <Route path="/scoutingapp/strategic" element={<StrategicScout title="2637 Strategic Scout" />} />
        <Route path="/scoutingapp/lookup/" element={<Lookup title="2637 Lookup" />} />
        <Route path="/scoutingapp/lookup/strategic" element={<StrategicLookup title="2637 Strategic Lookup" />} />
        <Route path="/scoutingapp/lookup/match" element={<DataLookup title="2637 Match Lookup" />} />
        <Route path="/scoutingapp/lookup/pit" element={<PitLookup title="2637 Pit Lookup" />} />
        <Route path="/scoutingapp/lookup/teamdata/:teamNumber" element={<TeamData title="2637 Data Lookup" />} />
        <Route path="/scoutingapp/pit" element={<PitScout title="2637 Pit Scout" />} />
        <Route path="/scoutingapp/picklist" element={<Picklist title="2637 Picklist" />} />
        <Route path="/dtf" element={<DTF title="2637 Drive Team Feeder" />} />
        <Route path="/dtf/:teamParams" element={<DTFTeams title="2637 Drive Team Feeder" />} />
        <Route path="/watchlist" element={<Watchlist title="2637 Watch List" />} />
        <Route path="/watchlist/:team_number" element={<WatchlistGet title="2637 Watch List" />} />
        <Route path="/watchlist/update/:question_info" element={<WatchlistUpdate title="2637 Watch List" />} />
      </Routes>
    </HashRouter>
  );
  
}

root.render(<App />);
/*
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/

window.addEventListener("error", (event) => {
  window.alert(event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  console.log(`event=`, event);
  window.alert(event);
});
