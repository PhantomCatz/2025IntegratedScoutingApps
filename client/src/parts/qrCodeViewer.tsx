import '../public/stylesheets/qrcode.css';

import { QRCode as AntQr } from 'antd';
import { useState, useEffect } from 'react';
import { escapeUnicode, } from '../utils/utils';

const sep = "\t";
const defualtValue = <></>;

type Props = {
	value: unknown,
};

function QrCode(props: Props): React.ReactElement {
	const [qrValue, setQrValue] = useState<unknown>("");
	const [timestamp, setTimestamp] = useState<Date>(new Date());

	useEffect(() => {
		if(!qrValue) {
			return;
		}
		// Scroll to QR when value
		setTimeout(() => {
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			window.scroll(0, 1e8);
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		}, 50);
	}, [qrValue]);

	const shouldShow = Boolean(qrValue);

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
			switch(v) {
				case true:
					vals.push(1);
					break;
				case false:
					vals.push(0);
					break;
				case undefined:
					console.error(`${k} is undefined`);
					vals.push(v);
					break;
				default:
					vals.push(v);
					break;
			}
		}
	}

	const shownValue = escapeUnicode(vals.join(sep).replaceAll("\n", "\\n"));

	const valuesToDisplay: { key : string, display : string }[] = [
		{
			"key": "scouter_initials",
			"display": "Scouter Initials:",
		},
		{
			"key": "match_event",
			"display": "Match Event:",
		},
		{
			"key": "match_number",
			"display": "Match Number:",
		},
		{
			"key": "team_number",
			"display": "Team Number:",
		},
	];

	const qrInfo: React.ReactElement[] = [];
	for(const value of valuesToDisplay) {
		const item = qrValue[value.key];
		if(item) {
			qrInfo.push(<p className={"qrIdentifier"} key={value.key}>{value.display} {item}</p>);
		}
	}

	return (
		<div className="qrCode">
			{shouldShow && (
				<div>
					<h1 className={"qrTitle"}>{`Last submitted at ${timestamp}`}</h1>
					{qrInfo}
					<div className={"qrCodeHolder"}>
						<div>
							<AntQr value={
								/*Limit: 2324 chars*/
								shownValue
							} type={"svg"} />
						</div>
					</div>
					<h2>Please take a screenshot of this and show it to WebDev</h2>
				</div>
			)}
		</div>);
}

export default QrCode;
