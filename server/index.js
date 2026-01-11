import { getTeamInfo, getTeamsScouted, getTeamPitInfo, getTeamStrategicInfo, submitPitData, submitMatchData, submitStrategicData, } from "./database.js";
import dotenv from 'dotenv';
import express from "express";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json({
	limit: "16mb",
}));

app.use((req, res, next) => {
	//TODO: remove?
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});


app.get("/api", async function(req, res) {
	const queryString = req.url.split("?")[1];
	const queries = Object.fromEntries(new URLSearchParams(queryString));

	let result = undefined;

	try {
		switch(queries.reqType) {
			case "teamsScouted":
				result = await getTeamsScouted("pit_data");
				break;
			case "getTeam":
				result = await getTeamInfo(queries);
				break;
			case "getTeamPit":
				result = await getTeamPitInfo(queries);
				break;
			case "getTeamStrategic":
				result = await getTeamStrategicInfo(queries);
				break;
			default:
				console.error("reqType not used when getting:", queries);
				result = await getTeamInfo(queries);
				break;
		}
	} catch (err) {
		console.error(`ERROR: `, err);
		result = null
	}
	if(!result) {
		console.error(`ERROR: could not resolve request`, err);
	}

	res.json(result);
	return res;
});

app.post("/api", async function(req, res) {
	const queryString = req.url.split("?")[1];
	const queries = Object.fromEntries(new URLSearchParams(queryString));

	console.log("Querying", queries);

	const data = req.body;

	let result = undefined;

	try {
		switch(queries.reqType) {
			case "submitPitData":
				console.log("submit pit");
				result = await submitPitData(data);
				break;
			case "submitMatchData":
				console.log("submit match");
				result = await submitMatchData(data);
				break;
			case "submitStrategicData":
				console.log("submit strategic");
				result = await submitStrategicData(data);
				break;
			default:
				console.log("reqType not used when submitting:", queries);
				break;
		}
	} catch (err) {
		console.error("err=", err);
		result = null;
	}

	if(result) {
		res.status(200);
		res.json({});
		return res;
	}

	console.error("Could not submit data.", queries);
	res.status(500);
	res.json(result);
	return res;
});

