import { getTeamInfo, getTeamsScouted, getTeamPitInfo, getTeamStrategicInfo } from "./database.cjs";
import express from "express";

const PORT = process.env.PORT || 3001;

const app = express();



app.get("/api", async (req, res) => {
	const queryString = req.url.split("?")[1];
	const queries = Object.fromEntries(new URLSearchParams(queryString));
	
	let result = undefined;

	console.log(queries);

	switch(queries.reqType) {
	//case "hasTeam":
	//	result = await hasTeam(queries);
	//	break;
	case "teamsScouted":
		result = await getTeamsScouted();
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
		console.log("reqType not used:", queries);
		result = await getTeamInfo(queries);
		break;
	}

	//console.log(result);

	await res.append("Access-Control-Allow-Origin", "*");
	await res.json(result);
	return res;
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
