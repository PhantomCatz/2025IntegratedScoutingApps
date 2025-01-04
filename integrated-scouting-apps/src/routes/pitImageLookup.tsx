import '../public/stylesheets/style.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useEffect, useState } from 'react';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
import { InputNumber } from 'antd';

function Teamresponse(props: any) {
  const [cookies] = useCookies(['login', 'theme']);
  const [fetchedData, setFetchedData] = useState([]);
  useEffect(() => { document.title = props.title }, [props.title]);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);

  async function getPictures(team_number: number) {
    try {
      if (team_number !== 0) {
        const robot_images = await(await fetch(process.env.REACT_APP_PIT_PICTURES_LOOKUP_URL as string + "?team_number=" + team_number)).json();
        const pictures = [];
        for (const picture of robot_images['documents']) {
          pictures.push(<img src={picture.images[0]} alt='' style={{width: '100%', paddingBottom: '5%'}}></img>);
        };
        console.log(pictures);
        setFetchedData(pictures as never[]);
      }
    }
    catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <div className='banner'>
        <header>
          <a href='/scoutingapp/lookup/'>
            <img src={back} style={{ height: 64 + 'px', paddingTop: '5%' }} alt='' />
          </a>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={logo} style={{ height: 256 + 'px' }} alt='' />
                </td>
                <td>
                  <h1 style={{ display: 'inline-block', textAlign: 'center' }}>Pit Picture Lookup</h1>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
        <div>
          <h2>Team Number</h2>
          <InputNumber min={1} max={9999} className='input' onChange={async (event) => {await getPictures(event as number);}} />
        </div>
        {fetchedData}
      </div>
    </div>
  );
};
export default Teamresponse;