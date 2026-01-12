import '../public/stylesheets/strategicLookup.css';
import { useEffect, useState } from 'react';
import { useLocalStorage, } from 'react-use';
import { NumberInput, } from '../parts/formItems';
import { Tabs } from '../parts/tabs';
import Header from '../parts/header';
import { getAllTeams, } from '../utils/tbaRequest.ts';
import StrategicTabs from '../parts/strategicTabs';
import Constants from '../utils/constants';

import type * as TbaApi from '../types/tbaApi';
import type * as Database from '../types/database';
import type { TabItem, TabItems } from '../parts/tabs';

type Props = {
	title: string,
};

function StrategicLookup(props: Props): React.ReactElement {
	const [isLoading, setIsLoading] = useState(false);
	const [teamNumberElements, setTeamNumberElements] = useState<React.ReactElement[] | null>(null);
	const [teamNumber, setTeamNumber] = useState(0);
	const [tabNumber, setTabNumber] = useState("1");
	const [tabItems, setTabItems] = useState<TabItems>([initialTab()]);
	const [_eventKey, _setEventKey] = useLocalStorage<TbaApi.EventKey>('eventKey', Constants.EVENT_KEY);
	const [refresh, setRefresh] = useState(false);

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
			fetchLink += "reqType=getTeamStrategic";

			const res = await fetch(fetchLink + `&team=${teamNumber}`);
			const data = await res.json() as Database.StrategicEntry[];

			createTabs(teamNumber, data);
		})();
	}, [teamNumber]);

	function createTabs(teamNumber: number, data: Database.StrategicEntry[] | null): void {
		try {
			if(!data) {
				setTabItems([initialTab()]);
				return;
			}

			const tabs = StrategicTabs({team: teamNumber, data: data});

			setTabItems([initialTab(), ...tabs]);
		} catch (err) {
			console.error(err);
		}
		setRefresh(!refresh);
	}

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
					title="Team Number"
					min={0}
					max={99999}
					name='teamNumber'
				/>
				<div className={"centered"}>
					<button className={"submitButton"} onClick={function(_) {
						const input = document.querySelector("#teamNumber") as HTMLInputElement;
						createTabs(Number(input.value), null);
					}}>Submit</button>
				</div>
				<h2>List of Teams</h2>
				{teamNumberElements}
			</>
		);
	}

	return (
		<>
			<Header name={"Strategic Lookup"} back={"#scoutingapp/lookup/"} />

			<strategic-lookup>
				<Tabs defaultActiveKey="1" activeKey={tabNumber} items={tabItems} onChange={setTabNumber} />
			</strategic-lookup>
		</>
	);
}

export default StrategicLookup;
