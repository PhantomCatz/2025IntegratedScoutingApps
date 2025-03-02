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
import MatchLookup from './routes/matchLookup';
import TeamData from './routes/matchData';
import Picklist from './routes/picklist';
import Watchlist from './routes/watchlist';
import WatchlistGet from './routes/watchlistData';
import WatchlistUpdate from './routes/watchlistUpdate';

import Chart from './routes/chart';
import QrCode from './routes/qrCodeViewer';
import Egg from './routes/egg'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage title="2637 Strategy App" />} />
        <Route path="/home" element={<HomePage title="2637 Strategy App" />} />
        <Route path="/scoutingapp" element={<ScoutingApp title="2637 Scouting App" />} />
        <Route path="/scoutingapp/match" element={<MatchScout title="2637 Match Scout" />} />
        <Route path="/scoutingapp/strategic" element={<StrategicScout title="2637 Strategic Scout" />} />
        <Route path="/scoutingapp/lookup/" element={<Lookup title="2637 Lookup" />} />
        <Route path="/scoutingapp/lookup/strategic" element={<StrategicLookup title="2637 Strategic Lookup" />} />
        <Route path="/scoutingapp/lookup/match" element={<MatchLookup title="2637 Match Lookup" />} />
        <Route path="/scoutingapp/lookup/pit" element={<PitLookup title="2637 Pit Lookup" />} />
        <Route path="/scoutingapp/lookup/teamdata/:teamNumber" element={<TeamData title="2637 Data Lookup" />} />
        <Route path="/scoutingapp/pit" element={<PitScout title="2637 Pit Scout" />} />
        <Route path="/scoutingapp/picklist" element={<Picklist title="2637 Picklist" />} />
        <Route path="/dtf" element={<DTF title="2637 Drive Team Feeder" />} />
        <Route path="/dtf/:teamParams" element={<DTFTeams title="2637 Drive Team Feeder" />} />
        <Route path="/watchlist" element={<Watchlist title="2637 Watch List" />} />
        <Route path="/watchlist/:team_number" element={<WatchlistGet title="2637 Watch List" />} />
        <Route path="/watchlist/update/:question_info" element={<WatchlistUpdate title="2637 Watch List" />} />
        <Route path="/egg" element={<Egg title="2637 GOATs" />}/>
        
		<Route path="/scoutingapp/chart" element={<Chart />} />
        <Route path="/qrcode" element={<QrCode title="Qr Code" value={"aldshfglaierglkaheflkjghalfdgalwfghu"} />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
