import '../public/stylesheets/strategicLookup.css';
import { useEffect, useState } from 'react';
import { InputNumber, Tabs } from 'antd';
import Header from '../parts/header';
import { getAllTeams, getDivisionsList } from '../utils/tbaRequest';
import StrategicTabs from '../parts/strategicTabs';
import { Select } from '../parts/formItems';

function StrategicLookup(props: any) {
	const DEFAULT_MATCH_EVENT = EVENT_NAME || "";

	const [shouldRetryLoading, setShouldRetryLoading] = useState(false);
	const [fetchedData, setFetchedData] = useState<any>(null);
	const [teamNumber, setTeamNumber] = useState(0);
	const [tabNum, setTabNum] = useState("1");
	const [strategicData, setStrategicData] = useState(null);
	const [items, setItems] = useState([initialState()]);
	const [match_event, setMatchEvent] = useState(DEFAULT_MATCH_EVENT);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => { document.title = props.title }, [props.title]);
	useEffect(() => {
		(async function() {
			try {
				const data = await getAllTeams(match_event);

				if(!data) {
					throw new Error("Could not get data");
				}

				const teamNumbers = data.map(function (team: any) {
					return (<h2 key={team}>
						<a onClick={async () => {setTeamNumber(team)}}>{team}</a>
					</h2>);
				});

				setFetchedData(teamNumbers);
			}
			catch (err) {
				console.error("Error fetching team list: ", err);
			}
		})();
	}, [match_event]);
	useEffect(() => {
		const prev : any = [];

		for(let i = 1; i < items.length; i++) {
			prev.push(items);
		}

		const res = [initialState(), ...prev];

		setItems(res);
	}, [fetchedData]);
	useEffect(() => {
		(async () => {
			if(!teamNumber) {
				return;
			}
			let fetchLink = SERVER_ADDRESS;

			if(!fetchLink) {
				console.error("Could not get fetch link; Check .env");
				return;
			}
			fetchLink += "reqType=getTeamStrategic";

			const strategicData = {};
			const res = await fetch(fetchLink + `&team=${teamNumber}`);
			const daa = await res.json();

			await setStrategicData(data);

			await setTabs(teamNumber);
		})();
	}, [teamNumber]);

	function initialState() {
		return {
			key: '1',
			label: 'Team',
			children: Lookup(),
		};
	}
	function Lookup() {
		if(!fetchedData) {
			setTimeout(() => {setRefresh(!refresh);}, 100);
		}
		return (
			<div>
				<h2>Team Number</h2>
				<InputNumber min={0} max={99999} className="input" id='teamNumber' />
				<div className={"centered"}>
					<button className={"submitButton"} onMouseDown={async function(event) {
						const input : any = document.querySelector("#teamNumber");
						await setTabs(input.ariaValueNow);
					}}>Submit</button>
				</div>
				<h2>List of Teams</h2>
				{fetchedData}
			</div>
		);
	}

	async function setTabs(teamNumber: number) {
		try {
			if(!strategicData) {
				await setItems([initialState()]);
				return;
			}
			const tabs = await StrategicTabs({team: teamNumber, data: strategicData});

			if(tabs) {
				await setItems([initialState(), ...tabs]);
			} else {
				await setItems([initialState()]);
			}
		} catch (err) {
			console.log(err);
		}
		setRefresh(!refresh);
	}

	const matchEvents = [
		{ label: `Default (${DEFAULT_MATCH_EVENT})`, value: DEFAULT_MATCH_EVENT },
	];
	for(const [eventName, eventId] of Object.entries(getDivisionsList())) {
		matchEvents.push({
			label: eventName,
			value: eventId
		});
	}

	return (
		<>
			<Header name={"Strategic Lookup"} back={"#scoutingapp/lookup/"} />

			<div className="strategicLookup">
				<Select
					title={"Match Event"}
					name={"match_event"}
					options={matchEvents}
					required={false}
					onChange={async (e? : string) => {
						if(e) {
							await setMatchEvent(e);
						}
					}}
				/>
				<Tabs defaultActiveKey="1" activeKey={tabNum} items={items} centered className='tabs' onChange={async (key) => { setTabNum(key); }} />
			</div>
		</>
	);
}

export default StrategicLookup;
