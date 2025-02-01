import '../public/stylesheets/dtf.css';
import { useEffect } from 'react';
import { Input, Form, InputNumber } from 'antd';
import { useCookies } from 'react-cookie';
import Header from "./header";

function DTF(props: any) {
	const [form] = Form.useForm();
	useEffect(() => { document.title = props.title; return () => { } }, [props.title]);

	return (
		<div>
			<Header name={"Drive Team Feeder"} back={"/home"} />
			<Form
			  form={form}
			  onFinish={async event => {
				const teamNums = [event.team1Num, event.team2Num, event.team3Num].filter(num => num !== undefined);
				window.location.href = "/dtf/" + teamNums.join(",");
			  }}
			>
			  <div>
				<h2>Team 1 Number</h2>
				<Form.Item name="team1Num" rules={[{ required: true, message: "Please input the team number!" }]} >
				  <InputNumber min={0} className="input" />
				</Form.Item>
	  
				<h2>Team 2 Number</h2>
				<Form.Item name="team2Num">
				  <InputNumber min={0} className="input" />
				</Form.Item>
				
				<h2>Team 3 Number</h2>
				<Form.Item name="team3Num">
				  <InputNumber min={0} className="input" />
				</Form.Item>
	  
				<Form.Item>
				  <Input type="submit" value="Submit" className="submit" />
				</Form.Item>
			  </div>
			</Form>
		  </div>
		);
	  };
	  
	  export default DTF;
	  
