/**
 * @author Nathan Kwok, add more...
 * @since 2023-10-29
 * @version 1.0.0
 * @description welcome to tabata
 */
import ReactDOM from 'react-dom/client';
import HomePage from './routes/home';
import LoginPage from './routes/login';
import ScoutingApp from './routes/scoutingapp';
import MatchScout from './routes/match';
import DTF from './routes/dtf';
import DTFTeams from './routes/dtfteams';
import StrategicScout from './routes/strategic';
// import DriverSkill from './routes/driverSkill';
import Lookup from './routes/lookup';
import StrategicLookup from './routes/strategicLookup';

import PitLookup from './routes/pitLookup';
import PitScout from './routes/pit';
import PitPictureLookup from './routes/pitImageLookup';

import Buh from './routes/buh';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DataLookup from './routes/matchLookup';
import TeamData from './routes/matchData';
import Picklist from './routes/picklists';
import Watchlist from './routes/watchlist';
import WatchlistGet from './routes/watchlistdata';
import WatchlistUpdate from './routes/watchlistupdate';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage title="2637 Strategy App" />} />
        <Route path="/home" element={<HomePage title="2637 Strategy App" />} />
        <Route path="/scoutingapp" element={<ScoutingApp title="2637 Scouting App" />} />
        <Route path="/scoutingapp/match" element={<MatchScout title="2637 Match Scout" />} />
        <Route path="/scoutingapp/strategic" element={<StrategicScout title="2637 Strategic Scout" />} />
        {/* <Route path="/scoutingapp/strategic/driverskill" element={<DriverSkill title="2637 Driver Skill" />} /> */}
        <Route path="/scoutingapp/lookup/" element={<Lookup title="2637 Lookup" />} />
        <Route path="/scoutingapp/lookup/strategic" element={<StrategicLookup title="2637 Strategic Lookup" />} />
        <Route path="/scoutingapp/lookup/match" element={<DataLookup title="2637 Match Lookup" />} />
        <Route path="/scoutingapp/lookup/pit" element={<PitLookup title="2637 Pit Lookup" />} />
        <Route path="/scoutingapp/lookup/pitpicture" element={<PitPictureLookup title="2637 Pit Picture Lookup" />} />
        <Route path="/scoutingapp/lookup/teamData/:team_number" element={<TeamData title="2637 Data Lookup" />} />
        <Route path="/scoutingapp/pit" element={<PitScout title="2637 Pit Scout" />} />
        <Route path="/scoutingapp/picklists" element={<Picklist title="2637 Picklists" />} />
        <Route path="/dtf" element={<DTF title="2637 Drive Team Feeder" />} />
        <Route path="/dtf/:team_number" element={<DTFTeams title="2637 Drive Team Feeder" />} />
        <Route path="/watchlist" element={<Watchlist title="2637 Watch List" />} />
        <Route path="/watchlist/:team_number" element={<WatchlistGet title="2637 Watch List" />} />
        <Route path="/watchlist/update/:question_info" element={<WatchlistUpdate title="2637 Watch List" />} />
        <Route path="/buh" element={<Buh title="monkey"/>} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
