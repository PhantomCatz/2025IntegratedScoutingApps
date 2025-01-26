import '../public/stylesheets/style.css';
import { Button } from 'antd';
import { useEffect } from 'react';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';
import Header from "./header";

function HomePage(props: any) {
  useEffect(() => { document.title = props.title; return () => { } }, [props.title]);
  const [cookies] = useCookies(['login', 'theme']);
  useEffect(() => { VerifyLogin.VerifyLogin(cookies.login); return () => { } }, [cookies.login]);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => { } }, [cookies.theme]);

  return (
    <div>
      <Header name={"Strategy App"} rootPage={true} />
      <div style={{ height: '1250px' }}>
        <Button className='homebutton' href='/scoutingapp'>Scouting App</Button>
        <Button className='homebutton' href='/dtf'>DTF</Button>
        <Button className='homebutton' href='/watchlist'>Watchlist</Button>
      </div>
    </div>
  );
}

export default HomePage;
