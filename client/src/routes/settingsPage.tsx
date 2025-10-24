import '../public/stylesheets/settings.css';
import { useEffect, useState, useRef} from 'react';
import Header from '../parts/header';
import {Input, Form} from 'antd';
import { NumberInput } from '../parts/formItems';
import {useLocalStorage, } from 'react-use';
import { request } from '../utils/tbaRequest';


const DEFAULT_SETTINGS = {
  backgroundColor: '#ffffff',
  fontColor: '#000000',
	scouterIntial:'',
	eventCode: EVENT_NAME ,
	tbaData:{},
	tbaTeams:{},
} as const;

function Settings(props: any) {
  const [background, setBackground] = useLocalStorage<any>('background', DEFAULT_SETTINGS.backgroundColor);
  const [fontColor, setFontColor] = useLocalStorage<any>('fontColor', DEFAULT_SETTINGS.fontColor);
	const [scouterIntial, setScouterIntial] = useLocalStorage<any>('scouterIntial', DEFAULT_SETTINGS.scouterIntial);
	const [eventCode, setEventCode] = useLocalStorage<any>('eventCode', DEFAULT_SETTINGS.eventCode);
	const [tbaData, setTbaData] = useLocalStorage<any>('tbaData', DEFAULT_SETTINGS.tbaData);
	const [tbaTeams, setTbaTeams] = useLocalStorage<any>('tbaTeams', DEFAULT_SETTINGS.tbaTeams);
	const textColorInput = useRef(null)
	const backgroundColorInput = useRef(null)
	//const [theme] = useLocalStorage<any>('theme');
	//onChange={function(event) {setFontColor(color["--background-color"]);}}
	const rootElement = document.querySelector(":root") as any;
			rootElement.style.setProperty('--background-color', background);
			rootElement.style.setProperty('--font-color', fontColor);

	async function updateTeams (matchEvent : string) {
		try {
			const response = await request('event/' + matchEvent + '/teams');
			const teams = await response.json();

			const numbers = teams.map((x : any) => x.team_number);

			numbers.sort((a : any, b : any) => a - b);

			tbaTeams[matchEvent] = numbers;
		} catch(err) {
			window.alert("An error occurred:\n" + err);
		}
	}

	async function updateData(matchEvent: string) {
		try {
			const response = await request(`event/${matchEvent}/matches`);
			const data = await response.json();
			const newData = [];
			data.forEach((row) => {
			const fullTeams: string[] = [];
				for(const color of ["red", "blue"]) {
					data.alliances[color].team_keys.forEach((team : any) => fullTeams.push(team.substring(3)));
				}
				newData.push(fullTeams);
		});

    setTbaData(newData);


			console.log(data);
			data.map((row) => {
				const fullTeams: string[] = [];
				for(const color of ["red", "blue"]) {
					row.alliances[color].team_keys.forEach((team : any) => fullTeams.push(team.substring(3)));
				}
				return fullTeams;
			});
			setTbaData(data);
		} catch(err) {
			window.alert("An error occurred:\n" + err);
		}
	}


  return (
    <>
      <Header name={"Settings"} back="#/" />

			<h1>Scouter Initials</h1>
          <Input
            maxLength={2}
            className="input"
						onChange={(event) => setScouterIntial(event.target.value)}
            onKeyPress={(event) => {
              const keyCode = event.keyCode || event.which;
              const keyValue = String.fromCharCode(keyCode);
              if (!/^[A-Za-z]*$/.test(keyValue)) {
                event.preventDefault();
              }
            }}
						value={scouterIntial}
          />

			<h1>Event Code</h1>
          <Input
            className="input"
						onChange={(event) => setEventCode(event.target.value)}
						value={eventCode}
          />
			<button onClick={function(event) {
				updateTeams(eventCode);
				updateData(eventCode); }}
				className='fetchDataButton'> Fetch Data </button>

			 <h1>Color Theme</h1>
			<div>
				<input ref ={textColorInput} onChange={(event) => setFontColor(event.target.value)} type="color" id="textcontrast" name="textcontrast" defaultValue={fontColor}/>
				<label htmlFor="textcontrast"> Text color </label>
			</div>

			<div>
			<input ref={backgroundColorInput} onChange={(event) => setBackground(event.target.value)} type="color" id="background" name="background" defaultValue={background}/>
			<label htmlFor="background"> Background color</label>
		</div>

    </>
  );
}

export default Settings;
