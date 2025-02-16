import { requestDatabase, getTeamInfo } from "./database.cjs";
//const requestDatabase = require("database").requestDatabase
import express from "express";
//const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();



app.get("/api", async (req, res) => {
	const query = req.sqlQuery || "show databases";
	
	const queryString = req.url.split("?")[1];
	const queries = Object.fromEntries(new URLSearchParams(queryString));
	
	let result = undefined;

	console.log(queries);

	switch(queries.reqType) {
	case "hasTeam":
		result = await hasTeam(queries);
		break;
	case "getTeam":
	default:
		//console.log(req);
		result = await getTeamInfo(queries);
		break;
	}

	//const result = await requestDatabase(query);

	//console.log(result);

	await res.json(result);
	await res.append("Access-Control-Allow-Origin", "*");
	return res;
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
