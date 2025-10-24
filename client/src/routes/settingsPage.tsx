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
  scouterIntial: '',
  eventCode: EVENT_NAME ,
  tbaData: {},
  tbaTeams: {},
  updateTimes: {},
} as const;

function Settings(props: any) {
  const [backgroundColor, setBackgroundColor] = useLocalStorage<any>('backgroundColor', DEFAULT_SETTINGS.backgroundColor);
  const [fontColor, setFontColor] = useLocalStorage<any>('fontColor', DEFAULT_SETTINGS.fontColor);
  const [scouterIntial, setScouterIntial] = useLocalStorage<any>('scouterIntial', DEFAULT_SETTINGS.scouterIntial);
  const [eventCode, setEventCode] = useLocalStorage<any>('eventCode', DEFAULT_SETTINGS.eventCode);
  const [tbaData, setTbaData] = useLocalStorage<any>('tbaData', DEFAULT_SETTINGS.tbaData);
  const [tbaTeams, setTbaTeams] = useLocalStorage<any>('tbaTeams', DEFAULT_SETTINGS.tbaTeams);
  const [updateTimes, setUpdateTimes] = useLocalStorage<any>('updateTimes', DEFAULT_SETTINGS.updateTimes);

  const textColorInput = useRef(null)
  const backgroundColorInput = useRef(null)

  const rootElement = document.querySelector(":root") as any;

  useEffect(() => {
    rootElement.style.setProperty('--background-color', backgroundColor);
    rootElement.style.setProperty('--font-color', fontColor);
  }, [backgroundColor, fontColor]);

  async function updateTeams (matchEvent : string) {
    const response = await request('event/' + matchEvent + '/teams');
    const teams = await response.json();

    const numbers = teams.map((x : any) => x.team_number);

    numbers.sort((a : any, b : any) => a - b);

    tbaTeams[matchEvent] = numbers;
  }

  async function updateData(matchEvent: string) {
    const response = await request(`event/${matchEvent}/matches`);
    const data = await response.json();

    const newData = data.map((row) => {
      const fullTeams: string[] = [];
      for(const color of ["red", "blue"]) {
        row.alliances[color].team_keys.forEach((team : any) => fullTeams.push(team.substring(3)));
      }
      return fullTeams;
    });

    const newTbaData = { ...tbaData };

    newTbaData[matchEvent] = newData;

    setTbaData(newTbaData);
  }

  const events = [];
  let index = 0;
  for(const [eventCode, time] of Object.entries(updateTimes)) {
    events.push(
      <div className="updateTime" key={`updateTime${index++}`}>
        <h1 className="updateTime__title">{eventCode}:</h1>
        <p className="updateTime__timestamp">{time}</p>
      </div>
    );
  }


  return (
    <div className="settingsPage">
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
      <button
        onClick={async function(event) {
          try {
            await updateTeams(eventCode);
            await updateData(eventCode);
            const newUpdateTimes = { ...updateTimes };
            newUpdateTimes[eventCode] = Date();

            setUpdateTimes(newUpdateTimes);
          } catch(err) {
            window.alert(`An error occurred: `, err);
          }
        }}
        className='fetchDataButton'
        type="button"
      >Fetch Data</button>
      <button
        onClick={function(event) {
          setTbaTeams({});
          setTbaData({});
          setUpdateTimes({});
        }}
        className="clearDataButton"
        type="button"
      >Clear Data</button>

      {...events}

      <h1>Color Theme</h1>
      <div className="input__color">
        <input
          ref={textColorInput}
          onChange={(event) => setFontColor(event.target.value)}
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
          onChange={(event) => setBackgroundColor(event.target.value)}
          type="color"
          id="backgroundColor"
          name="backgroundColor"
          defaultValue={backgroundColor}
        />
        <label htmlFor="backgroundColor">Background color</label>
      </div>

    </div>
  );
}

export default Settings;
