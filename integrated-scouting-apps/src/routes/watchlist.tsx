import '../public/stylesheets/style.css';
import '../public/stylesheets/watchlist.css';
import '../public/stylesheets/match.css';
import { Button, Flex, Form, Input, InputNumber, Select, Tabs, TabsProps } from 'antd';
import React, { useState, useEffect } from 'react';
import TextArea from 'antd/es/input/TextArea';
import Header from "./parts/header";

function Watchlist(props: any) {
  type FieldType = {
    team_number: number;
    question: string;
    answer?: string;
    isPit: boolean;
  };
  const [tabNum, setTabNum] = useState("1");
  useEffect(() => { document.title = props.title }, [props.title]);

  async function sendNewWatchlistData(event: FieldType) {
    try {
      const requestBody = {
        team_number: event.team_number,
        custom0: {
          question: event.question,
          answer: event.answer,
          isPit: event.isPit,
        },
      };
      console.log(requestBody)
      await fetch(process.env.REACT_APP_WATCHLIST_SEND_URL as string, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response).then(data => {
        console.log(data)
        console.log("Data has been sent");
      });
      
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  }
  function Watchlist() {
    type FieldType = {
      team_number: number, //name not specified
      question: string,
      answer?: string,
      isPit: boolean,
    };
    const appOptions = [
      { label: "Pit", value: true },
      { label: "Strategic", value: false },
    ];
    return (
      <div>
        <Form
        initialValues={{
          team_number: null,
          question: "", 
          isPit: null,
        }}
          onFinish={async event => {
            try {
              await sendNewWatchlistData(event);
              window.location.reload();
            }
            catch (err) {
              console.log(err);
              window.alert("error has occured; please tell nathan asap");
              window.alert(err);
            }
          }}>
          <h2>Team #</h2>
          <Form.Item<FieldType> name="team_number" rules={[{ required: true, message: 'Please input the team number!' }]}>
            <InputNumber controls min={0} className="input" />
          </Form.Item>
          <h2>Pit or Strategic</h2>
          <Form.Item<FieldType> name="isPit" rules={[{ required: true, message: 'Please input whether it is pit or strategic!' }]}>
            <Select options={appOptions} className="input" />
          </Form.Item>
          <h2>Custom Question</h2>
          <Form.Item<FieldType> name="question" rules={[{ required: true, message: 'Please input a question!' }]}>
            <TextArea className="textbox_input" />
          </Form.Item>
          <Flex justify='in-between' style={{ paddingBottom : '5%' }}>
            <Button onClick={() => { setTabNum("2"); }} className='tabbutton'>Next</Button>
            <Input type="submit" value="Submit" className='submitbutton' />
          </Flex>
        </Form>
      </div>
    );
  }

  function watchListDisplay() {
    type FieldType = {
      team_number: number,
    };
    return (
      <div>
        <h2>Team #</h2>
        <Form
          onFinish={async event => {
            window.location.href = "/watchlist/" + event.team_number;
          }}
        >
          <Form.Item<FieldType> name="team_number" rules={[{ required: true, message: 'Please input the team number!' }]}>
            <InputNumber controls min={0} className="input" />
          </Form.Item>
          <Flex justify='in-between' style={{ paddingBottom : '5%' }}>
            <Button onClick={() => { setTabNum("1"); }} className='tabbutton'>Back</Button>
            <Input type="submit" value="Submit" className='submitbutton' />
          </Flex>
        </Form>
      </div>
    );
  }
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Input',
      children: Watchlist(),
    },
    {
      key: '2',
      label: 'Get',
      children: watchListDisplay(),
    }
  ];
  return (
    <div>
      <Header name={"2637 Watchlist"} back={"#home"} />
      <Tabs defaultActiveKey="1" activeKey={tabNum} items={items} className='tabs' centered onChange={async (key) => { setTabNum(key); }} />
    </div>
  );
}
export default Watchlist;
