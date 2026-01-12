import ReactDOM from 'react-dom/client';
import HomeRouter from './routes/homeRouter';
import ScoutingAppRouter from './routes/scoutingAppRouter';
import MatchScout from './routes/matchScout';
import DTFHome from './routes/dtfHome';
import DTFTeams from './routes/dtfTeams';
import StrategicScout from './routes/strategicScout';
import LookupRouter from './routes/lookupRouter';
import StrategicLookup from './routes/strategicLookup';
import PitLookup from './routes/pitLookup';
import PitScout from './routes/pitScout';
import MatchLookup from './routes/matchLookup';
import MatchData from './routes/matchData';
import SettingsPage from './routes/settingsPage';

import { HashRouter, Routes, Route } from 'react-router-dom';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// Debounce alerting for less annoyance
window.alert = (function() {
	const alert = window.alert;
	let id: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let lastMessage: any[] = [];
	const DEBOUNCE_WINDOW = 500;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function(message: any) {
		clearTimeout(id);

		if(!lastMessage.includes(message)) {
			lastMessage.push(message);
		}

		id = setTimeout(function() {
			if(!lastMessage.length) {
				return;
			}

			alert(lastMessage.join("\n"));
			lastMessage = [];
		}, DEBOUNCE_WINDOW);
	}
})();

/*
globalThis.fetch = (() => {
const originalFetch = globalThis.fetch;

return async function(link: any, args : any) {
const rest = args || {};
const options = {
mode: "no-cors",
...rest
};

return originalFetch(link, options);
}
})();
//*/

function App(): React.ReactElement {
	//TODO: refactor titles
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<HomeRouter title="2637 Strategy App" />} />
				<Route path="/scoutingapp" element={<ScoutingAppRouter title="2637 Scouting App" />} />
				<Route path="/scoutingapp/match" element={<MatchScout title="2637 Match Scout" />} />
				<Route path="/scoutingapp/strategic" element={<StrategicScout title="2637 Strategic Scout" />} />
				<Route path="/scoutingapp/lookup/" element={<LookupRouter title="2637 Lookup" />} />
				<Route path="/scoutingapp/lookup/strategic" element={<StrategicLookup title="2637 Strategic Lookup" />} />
				<Route path="/scoutingapp/lookup/match" element={<MatchLookup title="2637 Match Lookup" />} />
				<Route path="/scoutingapp/lookup/pit" element={<PitLookup title="2637 Pit Lookup" />} />
				<Route path="/scoutingapp/lookup/teamdata/:teamNumber" element={<MatchData title="2637 Data Lookup" />} />
				<Route path="/scoutingapp/pit" element={<PitScout title="2637 Pit Scout" />} />
				<Route path="/dtf" element={<DTFHome title="2637 Drive Team Feeder" />} />
				<Route path="/dtf/:teamParams" element={<DTFTeams title="2637 Drive Team Feeder" />} />

				<Route path="/settings" element={<SettingsPage title="Settings" />} />
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
	window.alert(event);
});
