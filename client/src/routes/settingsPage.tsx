import '../public/stylesheets/settingsPage.css';
import { useEffect, useState, useRef } from 'react';
import Header from '../parts/header';
import { Input, } from '../parts/formItems';
import {useLocalStorage, } from 'react-use';
import { request, } from '../utils/tbaRequest.ts';
import Constants from '../utils/constants';

import type * as LocalStorage from '../types/localStorage';
import type * as RequestType from '../types/requestTypes';
import type * as TbaApi from '../types/tbaApi';

const DEFAULT_SETTINGS = {
	backgroundColor: '#ffffff',
	fontColor: '#000000',
	scouterIntial: '',
	eventKey: Constants.EVENT_KEY,
	tbaData: {},
	tbaTeams: {},
	tbaPlayoffAlliances: {},
	updateTimes: {},
} as const;

function SettingsPage(): React.ReactElement {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [backgroundColor, setBackgroundColor] = useLocalStorage<string>('backgroundColor', DEFAULT_SETTINGS.backgroundColor);
	const [fontColor, setFontColor] = useLocalStorage<string>('fontColor', DEFAULT_SETTINGS.fontColor);
	const [scouterInitial, setScouterInitial] = useLocalStorage<string>('scouterIntial', DEFAULT_SETTINGS.scouterIntial);
	const [eventKey, setEventCode] = useLocalStorage<TbaApi.EventKey>('eventKey', DEFAULT_SETTINGS.eventKey);
	const [tbaData, setTbaData] = useLocalStorage<LocalStorage.TbaData>('tbaData', DEFAULT_SETTINGS.tbaData);
	const [tbaTeams, setTbaTeams] = useLocalStorage<LocalStorage.TbaTeams>('tbaTeams', DEFAULT_SETTINGS.tbaTeams);
	const [tbaPlayoffAlliances, setTbaPlayoffAlliances] = useLocalStorage<LocalStorage.PlayoffAlliances>('tbaPlayoffAlliances', DEFAULT_SETTINGS.tbaPlayoffAlliances);
	const [updateTimes, setUpdateTimes] = useLocalStorage<LocalStorage.UpdateTimes>('updateTimes', DEFAULT_SETTINGS.updateTimes);

	const textColorInput = useRef(null)
	const backgroundColorInput = useRef(null)

	useEffect(() => {
		const rootElement = document.querySelector(":root") as HTMLHtmlElement;

		rootElement.style.setProperty('--background-color', backgroundColor ?? null);
		rootElement.style.setProperty('--font-color', fontColor ?? null);
	}, [backgroundColor, fontColor]);
	async function updateTeams(eventKey: TbaApi.EventKey): Promise<void> {
		const response = await request('event/' + eventKey + '/teams/simple');
		const teams: RequestType.Event_Teams_Simple = await response.json() as RequestType.Event_Teams_Simple;

		const numbers = teams.map((x) => x.team_number);

		numbers.sort((a, b) => a - b);

		const newTbaTeams = { ...tbaTeams, [eventKey]: numbers };

		setTbaTeams(newTbaTeams);
	}
	async function updatePlayoffAlliances(eventKey: TbaApi.EventKey): Promise<void> {
		const response = await request(`event/${eventKey}/alliances`);
		const alliances: RequestType.Event_Alliances = await response.json() as RequestType.Event_Alliances;

		const newTbaPlayoffAlliances = { ...tbaPlayoffAlliances, [eventKey]: alliances };

		setTbaPlayoffAlliances(newTbaPlayoffAlliances);
	}
	async function updateData(eventKey: TbaApi.EventKey): Promise<void> {
		const response = await request(`event/${eventKey}/matches`);
		const data: RequestType.Event_Matches = await response.json() as RequestType.Event_Matches;

		const mapping: { [matchKey: TbaApi.MatchKey]: TbaApi.Match } = {};

		for(const m of data) {
			const id = m.key;
			mapping[id] = m;
		}

		const newTbaData: LocalStorage.TbaData = { ...tbaData, [eventKey]: mapping };

		setTbaData(newTbaData);
	}

	const events: React.ReactElement[] = [];
	let index = 0;
	if(updateTimes) {
		for(const [eventKey, time] of Object.entries(updateTimes)) {
			events.push(
				<div className="updateTime" key={`updateTime${index++}`}>
					<h1 className="updateTime__title">{eventKey}:</h1>
					<p className="updateTime__timestamp">{time}</p>
				</div>
			);
		}
	}


	return (
		<>
			<Header name={"Settings"} back="#/" settingsPage />

			<settings-page>
				<Input
					title="Scouter Initials"
					name="scouter_initials"
					maxLength={2}
					onChange={setScouterInitial}
					pattern="^[A-Za-z]{2}$"
					onInput={(event) => {
						const keyValue = event.key;
						if (!/^[A-Za-z]{2}$/.test(keyValue)) {
							event.preventDefault();
						}
					}}
					defaultValue={scouterInitial}
				/>

				<Input
					title="Event Key"
					name="event_key"
					pattern="^\d{4}[a-z]+$"
					onChange={(value) => {
						setEventCode(value);
					}}
					defaultValue={eventKey}
				/>
				<button
					onClick={async function() {
						if(isLoading) {
							window.alert("Currently getting data! Please wait patiently.");
							return;
						}

						setIsLoading(true);

						if(!eventKey || !/^\d{4}[a-z]+$/.test(eventKey)) {
							window.alert("Please input a valid event code!");
							return;
						}
						try {
							await Promise.all([
								updateData(eventKey),
								updateTeams(eventKey),
								updatePlayoffAlliances(eventKey),
							]);
							const newUpdateTimes = { ...updateTimes };
							newUpdateTimes[eventKey] = Date();

							setUpdateTimes(newUpdateTimes);
						} catch(err) {
							window.alert(`An error occurred: ${err}`);
						}

						setIsLoading(false);
					}}
					className='fetchDataButton'
					type="button"
				>Fetch Data</button>
				<button
					onClick={function() {
						setTbaTeams({});
						setTbaData({});
						setUpdateTimes({});
						setTbaPlayoffAlliances({});
					}}
					className="clearDataButton"
					type="button"
				>Clear Data</button>

				{...events}

				<h1>Color Theme</h1>
				<div className="input__color">
					<input
						ref={textColorInput}
						onChange={(event) => { setFontColor(event.target.value); }}
						type="color"
						id="textColor"
						name="textColor"
						defaultValue={fontColor}
					/>
					<label htmlFor="textColor">Text color</label>
				</div>

				<div className="input__color">
					<input
						ref={backgroundColorInput}
						onChange={(event) => { setBackgroundColor(event.target.value); }}
						type="color"
						id="backgroundColor"
						name="backgroundColor"
						defaultValue={backgroundColor}
					/>
					<label htmlFor="backgroundColor">Background color</label>
				</div>

			</settings-page>
		</>
	);
}

export default SettingsPage;
