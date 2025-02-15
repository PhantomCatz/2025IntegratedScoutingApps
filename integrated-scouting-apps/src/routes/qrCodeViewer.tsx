import '../public/stylesheets/style.css';
import '../public/stylesheets/qrcode.css';

import {QRCode as AntQr} from 'antd';
import {useState, useEffect} from 'react';

const sep = "\t";
const defualtValue = <></>;

function QrCode(props : any) {
	const [qrValue, setQrValue] = useState<string>("");
	const [timestamp, setTimestamp] = useState<Date>(new Date());

	let shouldShow = !!qrValue;

	const newQrValue = props.value;

	if(!Object.is(qrValue, newQrValue)) {
		console.log("setting", qrValue, "from", newQrValue);
		setQrValue(newQrValue);
		setTimestamp(new Date());
		return defualtValue;
	}


	const keys = [];
	const vals = [];
	if(shouldShow) {
		//console.log(qrValue);

		for(const [k,v] of Object.entries(qrValue)) {
			//console.log(k + "," + v);
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

	const shownValue = vals.join(sep);
	if (shouldShow) {
		console.log("Current key map: " + keys);
		console.log("Current values: " + vals);
	}

	//shouldShow = true;

	return (
		<div>
		{shouldShow && (
			<div>
				<h1 className={"qrTitle"}>{`Last submitted at ${timestamp}`}</h1>
				<div className={"qrCodeHolder"}>
					<div>
						<AntQr value={
							/*Limit: 2324 chars*/
							/*
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + 
							"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
							"aaaaaaaaaaaaaaaaaaaaaaaa"
							*/
							shownValue
						} size={500} type={"svg"} />
					</div>
				</div>
				<h2>Please take a screenshot of this and show it to WebDev</h2>
			</div>
		)}
	</div>);
}

export default QrCode;
