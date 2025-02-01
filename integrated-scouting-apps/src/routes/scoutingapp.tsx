import '../public/stylesheets/style.css';
import { Button } from 'antd';
import { useEffect } from 'react';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
import Header from "./header";

function ScoutingPage(props: any) {
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  const [cookies, setCookies] = useCookies(['login', 'theme']);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);

  return (
    <div>
      <meta name="viewport" content="maximum-scale=1.0" />
      <Header name={"Scouting App"} back={"/home"} />
      <div>
        <Button className='mainbutton' href='/scoutingapp/match'>Match</Button>
        <Button className='mainbutton' href='/scoutingapp/strategic'>Strategic</Button>
        <Button className='mainbutton' href='/scoutingapp/pit'>Pit</Button>
        <Button className='mainbutton' href='/scoutingapp/lookup'>Data Lookup</Button>
        <Button className='mainbutton' href='/scoutingapp/picklists'>Picklists</Button>
      </div>
      {/* <iframe height="500px" width="500px" src="https://vclock.com/embed/timer/#date=2024-02-28&title=finish+scouting+app+and+enjoy+life&theme=1"></iframe> */}
    </div>
  );
}

export default ScoutingPage;
