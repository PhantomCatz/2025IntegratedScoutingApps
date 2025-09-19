import { getTeamInfo, getTeamsScouted, getTeamPitInfo, getTeamStrategicInfo, submitPitData, submitMatchData, submitStrategicData,} from "./database.js";
import express from "express";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json({
	limit: "16mb",
}));

app.use((req, res, next) => {
	//TODO: should this be removed?
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
			console.log("reqType not used when getting:", queries);
			result = await getTeamInfo(queries);
			break;
		}
	} catch (err) {
		result = null
	}

	await res.json(result);
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
		console.log("err=", err);
		result = null;
	}

	if(result) {
		await res.status(200);
		await res.json({});
		return res;
	}

	console.log("Could not submit data.", queries);
	await res.status(500);
	await res.json(result);
	return res;
});

