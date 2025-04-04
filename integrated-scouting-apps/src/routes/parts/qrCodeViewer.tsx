import '../../public/stylesheets/style.css';
import '../../public/stylesheets/qrcode.css';

import {QRCode as AntQr} from 'antd';
import {useState, useEffect} from 'react';

const sep = "\t";
const defualtValue = <></>;

function QrCode(props : any) {
	const [qrValue, setQrValue] = useState<string>("");
	const [timestamp, setTimestamp] = useState<Date>(new Date());

	useEffect(() => {
		setTimeout(() => {
			(window as any).scrollByPages(100);
		}, 100);
	}, [qrValue]);

	let shouldShow = !!qrValue;

	const newQrValue = props.value;

	if(qrValue !== newQrValue) {
		setQrValue(newQrValue);
		setTimestamp(new Date());
		return defualtValue;
	}

	if(!qrValue) {
		return defualtValue;
	}

	const keys = [];
	const vals = [];
	if(shouldShow) {
		for(const [k,v] of Object.entries(qrValue)) {
			keys.push(k);
			switch(v as any) {
			case true:
				vals.push(1);
				break;
			case false:
				vals.push(0);
				break;
			case undefined:
				console.log(`${k} is undefined`);
				vals.push(v);
				break;
			default:
				vals.push(v);
				break;
			}
		}
	}

	const shownValue = escapeUnicode(vals.join(sep).replaceAll("\n", "\\n"));
	//if (shouldShow) {
	//	console.log("Current key map: " + keys.join("$"));
	//	console.log("Current values: " + vals.join("$"));
	//}
	
	const valuesToDisplay : {key : any, display : string}[] = [
		{
			"key" : "round_number",
			"display" : "Round Number:",
		},
		{
			"key" : "scouter_initials",
			"display" : "Scouter Initials:",
		},
		{
			"key" : "match_event",
			"display" : "Match Event:",
		},
		{
			"key" : "match_number",
			"display" : "Match Number:",
		},
		{
			"key" : "team_number",
			"display" : "Team Number:",
		},
	];

	const qrInfo : any[] = [];
	for(const value of valuesToDisplay) {
		if(qrValue[value.key]) {
			qrInfo.push(<p style={{fontSize:"300%"}} key={value.key}>{value.display} {qrValue[value.key]}</p>);
		}
	}

	return (
		<div>
		{shouldShow && (
			<div>
				<h1 className={"qrTitle"}>{`Last submitted at ${timestamp}`}</h1>
				{qrInfo}
				<div className={"qrCodeHolder"}>
					<div>
						<AntQr value={
							/*Limit: 2324 chars*/
							shownValue
						} size={800} type={"svg"} />
					</div>
				</div>
				<h2>Please take a screenshot of this and show it to WebDev</h2>
			</div>
		)}
	</div>);
}

function escapeUnicode(str: string) {
	return [...(str as any)].map(c => /^[\x00-\x7F]$/.test(c) ? c : c.split("").map((a: any) => "\\u" + a.charCodeAt().toString(16).padStart(4, "0")).join("")).join("");
}

export default QrCode;
export {escapeUnicode, };
