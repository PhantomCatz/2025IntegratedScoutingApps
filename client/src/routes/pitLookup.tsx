import '../public/stylesheets/pitLookup.css';
import { useEffect, useState } from 'react';
import { useLocalStorage, } from 'react-use';
import Header from '../parts/header';
import { getAllTeams, } from '../utils/tbaRequest.ts';
import PitTabs from '../parts/pitTabs';
import { NumberInput } from '../parts/formItems';
import { Tabs, } from '../parts/tabs';
import Constants from '../utils/constants';

import type * as TbaApi from '../types/tbaApi';
import type { TabItem, TabItems } from '../parts/tabs';
import type * as Database from '../types/database';

type Props = {
	title: string;
};

function PitLookup(props: Props): React.ReactElement {
	const [isLoading, setIsLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [teamNumberElements, setTeamNumberElements] = useState<React.ReactElement[] | null>(null);
	const [teamNumber, setTeamNumber] = useState(0);
	const [tabNumber, setTabNumber] = useState("1");
	const [tabItems, setTabItems] = useState([initialTab()]);
	const [_eventKey, _setEventKey] = useLocalStorage<TbaApi.EventKey>('eventKey', Constants.EVENT_KEY);

	if(!_eventKey) {
		throw new Error("Could not get event key");
	}

	const eventKey = _eventKey;

	useEffect(() => { document.title = props.title }, [props.title]);
	useEffect(() => {
		void (async function() {
			setIsLoading(true);
			try {
				const data = await getAllTeams(eventKey);

				if(!data) {
					throw new Error("Could not get data");
				}

				const teamNumbers = data.map(function (team) {
					return (<h2 key={team}>
						<a
							onClick={() => {setTeamNumber(team)}}
							style={{
								cursor: "pointer"
							}}
						>{team}</a>
					</h2>);
				});

				setTeamNumberElements(teamNumbers);
			} catch (err) {
				console.error("Error fetching team list: ", err);
			}
			setIsLoading(false);
		})();
	}, [eventKey]);
	useEffect(() => {
		const res: TabItems = [initialTab()].concat(tabItems.slice(1));

		setTabItems(res);
	}, [teamNumberElements]);
	useEffect(() => {
		void (async () => {
			if(!teamNumber) {
				return;
			}

			let fetchLink = Constants.SERVER_ADDRESS;

			if(!fetchLink) {
				console.error("Could not get fetch link; check .env");
				return;
			}
			fetchLink += "reqType=getTeamPit";

			const res = await fetch(fetchLink + `&team=${teamNumber}`);
			const data = await res.json() as Database.PitEntry[];

			createTabs(teamNumber, data);
		})();
	}, [teamNumber]);

	function initialTab(): TabItem {
		return {
			key: '1',
			label: 'Team',
			children: Lookup(),
		};
	}
	function Lookup(): React.ReactElement {
		if(!isLoading && !teamNumberElements) {
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			setTimeout(() => {setRefresh(!refresh);}, 1000);
		}
		return (
			<>
				<NumberInput
					name="teamNumber"
					title="Team Number"
					min={0}
					max={99999}
				/>
				<div className={"centered"}>
					<button className={"submitButton"} onMouseDown={function(_) {
						const input = document.querySelector("#teamNumber") as HTMLInputElement;
						createTabs(Number(input.value), null);
					}}>Submit</button>
				</div>
				<h2>List of Teams</h2>
				{teamNumberElements}
			</>
		);
	}

	function createTabs(teamNumber: number, data: Database.PitEntry[] | null): void {
		try {
			const tabs = PitTabs({teamNumber: teamNumber, data: data});

			setTabItems([initialTab(), ...tabs]);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<>
			<Header name={"Pit Lookup"} back={"#scoutingapp/lookup"} />

			<pit-lookup>
				<Tabs defaultActiveKey="1" activeKey={tabNumber} items={tabItems} onChange={setTabNumber} />
			</pit-lookup>
		</>
	);
};

export default PitLookup;
