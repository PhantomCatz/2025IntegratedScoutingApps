import '../public/stylesheets/dtf.css';
import logo from '../public/images/logo.png';
import back from '../public/images/back.png';
import { useState, useEffect } from 'react';
import { Button, Tabs, TabsProps } from 'antd';
import { useParams } from 'react-router-dom';
import VerifyLogin from '../verifyToken';
import { useCookies } from 'react-cookie';

const owo='tOwOt'
const arrarr: any[] = [];
const pitQ: string[] = [];
const strQ: string[] = [];
const pitQIndex: number[] = [];
const strQIndex: number[] = [];


function WatchlistGet(props: any) {
  //useEffect(() => document.title = props.title, [props.title]);
  let custom0: any;
  let custom1: any;
  let custom2: any;
  let custom3: any;
  let custom4: any;
  let custom5: any;
  let custom6: any;
  let custom7: any;
  let custom8: any;
  let custom9: any;
  let custom10: any;
  let custom11: any;
  let custom12: any;
  let custom13: any;
  let custom14: any;
  let custom15: any;
  let custom16: any;
  let custom17: any;
  let custom18: any;
  let custom19: any;
  let custom20: any;

  const { team_number } = useParams();
  const [loading, setLoading] = useState(true);
  const [tabNum, setTabNum] = useState("1");
  const [cookies] = useCookies(['login', 'theme']);
  let customArr: any[] = new Array(21);
  useEffect(() => { VerifyLogin.ChangeTheme(cookies.theme); return () => {}}, [cookies.theme]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(process.env.REACT_APP_WATCHLIST_GET_URL + '?team_number=' + team_number); //process.env.REACT_APP_DTF_URL
        const data = await response.json();
        console.log(data.documents[0]);
        console.log(Object.keys(data.documents[0]).length)
        //let arrlen = Object.keys(data.documents[0]).length - 2
        // customArr = data.documents;
        for(let i = 0; i < Object.keys(data.documents[0]).length - 2; i++) 
        {
          console.log(data.documents[0].length)
          console.log('custom' + i as string)
          console.log(data.documents[0]['custom' + i as string])
          customArr[i] = data.documents[0]['custom' + i as string];
          console.log(customArr[i]);
          console.log(customArr[i].question)
        }
        // let teamsArr_temp = new Array();
        // teamsArr_temp = [...fetchedData]
        // teamsArr_temp.push(data)
        // setFetchedData(teamsArr_temp);
        // console.log(teamsArr_temp)
        console.log(customArr)
        custom0 = customArr[0] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[0];
        custom1 = customArr[1] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[1];
        custom2 = customArr[2] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[2];
        custom3 = customArr[3] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[3];
        custom4 = customArr[4] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[4];
        custom5 = customArr[5] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[5];
        custom6 = customArr[6] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[6];
        custom7 = customArr[7] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[7];
        custom8 = customArr[8] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[8];
        custom9 = customArr[9] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[9];
        custom10 = customArr[10] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[10];
        custom11 = customArr[11] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[11];
        custom12 = customArr[12] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[12];
        custom13 = customArr[13] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[13];
        custom14 = customArr[14] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[14];
        custom15 = customArr[15] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[15];
        custom16 = customArr[16] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[16];
        custom17 = customArr[17] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[17];
        custom18 = customArr[18] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[18];
        custom19 = customArr[19] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[19];
        custom20 = customArr[20] === undefined ? {question: 'tOwOt', question_type: 'tOwOt'} : customArr[20];
        arrarr.push(custom0, custom1, custom2, custom3, custom4, custom5, custom6, custom7, custom8, custom9, custom10, custom11, custom12, custom13, custom14, custom15, custom16, custom17, custom18, custom19, custom20)
        console.log(arrarr)

        for(let i = 0; i < arrarr.length; i++)
        {
          console.log(owo)
          let OwO = arrarr[i].isPit
          if(OwO === true) {
            console.log(owo, owo)
            pitQ.push(arrarr[i].question);
            pitQIndex.push(i)
          } else if(OwO === false) {
            console.log('OwOOwOOwOOwOOwOOwOOwOOwO')
            strQ.push(arrarr[i].question);
            strQIndex.push(i)
          } else {
            console.log(owo, owo, owo);
          }
        }
        console.log(pitQ, strQ)
        return [team_number, data];
      }
      catch (err) {
        console.log(err);
      }
      finally {
        setLoading(false);
      }
    };
    if (team_number) {
       fetchData();
    }
  }, [team_number]);

  function pit(){
    return (
      <div>
        <div>
        <Button className={pitQ[0] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[0]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[0] + '&Pit&' + pitQIndex[0]}>{pitQ[0] ? pitQ[0]: ' '}</Button><br/>
        <Button className={pitQ[1] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[1]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[1] + '&Pit&' + pitQIndex[1]}>{pitQ[1] ? pitQ[1]: ' '}</Button><br/>
        <Button className={pitQ[2] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[2]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[2] + '&Pit&' + pitQIndex[2]}>{pitQ[2] ? pitQ[2]: ' '}</Button><br/>
        <Button className={pitQ[3] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[3]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[3] + '&Pit&' + pitQIndex[3]}>{pitQ[3] ? pitQ[3]: ' '}</Button><br/>
        <Button className={pitQ[4] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[4]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[4] + '&Pit&' + pitQIndex[4]}>{pitQ[4] ? pitQ[4]: ' '}</Button><br/>
        <Button className={pitQ[5] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[5]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[5] + '&Pit&' + pitQIndex[5]}>{pitQ[5] ? pitQ[5]: ' '}</Button><br/>
        <Button className={pitQ[6] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[6]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[6] + '&Pit&' + pitQIndex[6]}>{pitQ[6] ? pitQ[6]: ' '}</Button><br/>
        <Button className={pitQ[7] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[7]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[7] + '&Pit&' + pitQIndex[7]}>{pitQ[7] ? pitQ[7]: ' '}</Button><br/>
        <Button className={pitQ[8] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[8]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[8] + '&Pit&' + pitQIndex[8]}>{pitQ[8] ? pitQ[8]: ' '}</Button><br/>
        <Button className={pitQ[9] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[9]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[9] + '&Pit&' + pitQIndex[9]}>{pitQ[9] ? pitQ[9]: ' '}</Button><br/>
        <Button className={pitQ[10] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[10]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[10] + '&Pit&' + pitQIndex[10]}>{pitQ[10] ? pitQ[10]: ' '}</Button><br/>
        <Button className={pitQ[11] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[11]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[11] + '&Pit&' + pitQIndex[11]}>{pitQ[11] ? pitQ[11]: ' '}</Button><br/>
        <Button className={pitQ[12] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[12]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[12] + '&Pit&' + pitQIndex[12]}>{pitQ[12] ? pitQ[12]: ' '}</Button><br/>
        <Button className={pitQ[13] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[13]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[13] + '&Pit&' + pitQIndex[13]}>{pitQ[13] ? pitQ[13]: ' '}</Button><br/>
        <Button className={pitQ[14] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[14]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[14] + '&Pit&' + pitQIndex[14]}>{pitQ[14] ? pitQ[14]: ' '}</Button><br/>
        <Button className={pitQ[15] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[15]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[15] + '&Pit&' + pitQIndex[15]}>{pitQ[15] ? pitQ[15]: ' '}</Button><br/>
        <Button className={pitQ[16] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[16]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[16] + '&Pit&' + pitQIndex[16]}>{pitQ[16] ? pitQ[16]: ' '}</Button><br/>
        <Button className={pitQ[17] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[17]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[17] + '&Pit&' + pitQIndex[17]}>{pitQ[17] ? pitQ[17]: ' '}</Button><br/>
        <Button className={pitQ[18] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[18]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[18] + '&Pit&' + pitQIndex[18]}>{pitQ[18] ? pitQ[18]: ' '}</Button><br/>
        <Button className={pitQ[19] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[19]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[19] + '&Pit&' + pitQIndex[19]}>{pitQ[19] ? pitQ[19]: ' '}</Button><br/>
        <Button className={pitQ[20] ? 'watchlistbutton' : 'undefinedbutton'} disabled={pitQ[20]===undefined} href={'/watchlist/update/' + team_number as string + '&' + pitQ[20] + '&Pit&' + pitQIndex[20]}>{pitQ[20] ? pitQ[20]: ' '}</Button><br/>
        </div>
      </div>
    );
  }
  function strategic(){
    return (
      <div>
        <div>
        <Button className={strQ[0] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[0]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[0] + '&Strategic&' + strQIndex[0]}>{strQ[0] ? strQ[0]: ' '}</Button><br/>
        <Button className={strQ[1] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[1]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[1] + '&Strategic&' + strQIndex[1]}>{strQ[1] ? strQ[1]: ' '}</Button><br/>
        <Button className={strQ[2] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[2]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[2] + '&Strategic&' + strQIndex[2]}>{strQ[2] ? strQ[2]: ' '}</Button><br/>
        <Button className={strQ[3] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[3]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[3] + '&Strategic&' + strQIndex[3]}>{strQ[3] ? strQ[3]: ' '}</Button><br/>
        <Button className={strQ[4] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[4]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[4] + '&Strategic&' + strQIndex[4]}>{strQ[4] ? strQ[4]: ' '}</Button><br/>
        <Button className={strQ[5] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[5]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[5] + '&Strategic&' + strQIndex[5]}>{strQ[5] ? strQ[5]: ' '}</Button><br/>
        <Button className={strQ[6] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[6]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[6] + '&Strategic&' + strQIndex[6]}>{strQ[6] ? strQ[6]: ' '}</Button><br/>
        <Button className={strQ[7] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[7]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[7] + '&Strategic&' + strQIndex[7]}>{strQ[7] ? strQ[7]: ' '}</Button><br/>
        <Button className={strQ[8] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[8]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[8] + '&Strategic&' + strQIndex[8]}>{strQ[8] ? strQ[8]: ' '}</Button><br/>
        <Button className={strQ[9] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[9]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[9] + '&Strategic&' + strQIndex[9]}>{strQ[9] ? strQ[9]: ' '}</Button><br/>
        <Button className={strQ[10] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[10]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[10] + '&Strategic&' + strQIndex[10]}>{strQ[10] ? strQ[10]: ' '}</Button><br/>
        <Button className={strQ[11] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[11]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[11] + '&Strategic&' + strQIndex[11]}>{strQ[11] ? strQ[11]: ' '}</Button><br/>
        <Button className={strQ[12] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[12]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[12] + '&Strategic&' + strQIndex[12]}>{strQ[12] ? strQ[12]: ' '}</Button><br/>
        <Button className={strQ[13] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[13]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[13] + '&Strategic&' + strQIndex[13]}>{strQ[13] ? strQ[13]: ' '}</Button><br/>
        <Button className={strQ[14] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[14]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[14] + '&Strategic&' + strQIndex[14]}>{strQ[14] ? strQ[14]: ' '}</Button><br/>
        <Button className={strQ[15] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[15]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[15] + '&Strategic&' + strQIndex[15]}>{strQ[15] ? strQ[15]: ' '}</Button><br/>
        <Button className={strQ[16] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[16]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[16] + '&Strategic&' + strQIndex[16]}>{strQ[16] ? strQ[16]: ' '}</Button><br/>
        <Button className={strQ[17] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[17]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[17] + '&Strategic&' + strQIndex[17]}>{strQ[17] ? strQ[17]: ' '}</Button><br/>
        <Button className={strQ[18] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[18]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[18] + '&Strategic&' + strQIndex[18]}>{strQ[18] ? strQ[18]: ' '}</Button><br/>
        <Button className={strQ[19] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[19]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[19] + '&Strategic&' + strQIndex[19]}>{strQ[19] ? strQ[19]: ' '}</Button><br/>
        <Button className={strQ[20] ? 'watchlistbutton' : 'undefinedbutton'} disabled={strQ[20]===undefined} href={'/watchlist/update/' + team_number as string + '&' + strQ[20] + '&Strategic&' + strQIndex[20]}>{strQ[20] ? strQ[20]: ' '}</Button><br/>
        </div>
      </div>
    );
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Pit',
      children: pit(),
    },
    {
      key: '2',
      label: 'Strategic',
      children: strategic(),
    }
];

  return (
    <body className='body'>
      <div className='banner'>
        <header>
          <a href='/watchlist'>
            <img src={back} style={{height: 64 + 'px', paddingTop: '5%'}} alt=''/>
          </a>
          <table>
            <td>
              <img src={logo} style={{ height: 256 + 'px' }} alt=''/>
            </td>
            <td>
            <h2 style={{ whiteSpace: 'pre-line' }}>{loading ? "Loading..." : 'Team ' + team_number}</h2>
            </td>
          </table>
        </header>
      </div>
      <div>
        <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} className='tabs' centered onChange={async (key) => {setTabNum(key)}}/>
      </div>
    </body>
  );
}

export default WatchlistGet;
