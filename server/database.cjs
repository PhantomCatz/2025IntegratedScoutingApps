require("dotenv").config()

const defaultValue = {"err" : "Failed to resolve request."};
const connectionData = {
	"user" : process.env.DB_USERNAME,
	"password" : process.env.DB_PASSWORD,
	"host" : process.env.DB_HOST, 
	"port" : process.env.DB_PORT, 
	"database" : process.env.DB_DATABASE, 
	"connectionLimit" : 15, 
};

const NUM_ALLIANCES = 2;
const TEAMS_PER_ALLIANCE = 3;

if(!connectionData || !process.env.DB_DATABASE) {
	console.log("connectionData=", connectionData);
	console.log("Check .env");
}

console.log("Using Database " + process.env.DB_DATABASE);

let connPool = {
	getConnection: async function() {
		const mysql = require('mysql2/promise');
		const pool = mysql.createPool(connectionData);

		const conn = pool.getConnection();

		connPool = pool;

		return conn;
	}
};

async function requestDatabase(query, substitution, forEach) {
	let result = [];

	const sqlQuery = query;

	try {
		const conn = await connPool.getConnection();

		if(Array.isArray(substitution)) {
			for(const val of substitution) {
				const [res, fields] = await conn.query(sqlQuery, [val]);

				if(forEach) {
					await forEach(val, res, fields);
				} else {
					result.push(res);
				}
			}
		} else {
			const [res, fields] = await conn.query(sqlQuery, [substitution]);

			//if(forEach) {
			//	res.map((x) => forEach(x, fields));
			//}

			result = res;
		}

		await conn.destroy();

		return result;
	} catch(err) {
		console.log("Failed to resolve request:");
		console.dir(err);
	}
	return result;
}
async function getTeamsScouted() {
	let result = {};
	const sqlQuery = "SELECT DISTINCT team_number FROM pit_data";

	const res = await requestDatabase(sqlQuery);

	const teams = res.map((x) => x.team_number);

	result = teams;

	return result;
}
async function getTeamInfo(queries) {
	const teams = [];
	const inverse = {};
	for(let i = 1; i <= NUM_ALLIANCES * TEAMS_PER_ALLIANCE; i++) {
		const num = queries[`team${i}`];
		if(!num) {
			continue;
		}
		teams.push(num);
		inverse[num] = i;
	}
 
	let result = {};

	if(teams.length == 0) {
		console.log("Error: No teams queried");
		return result;
	}

	const sqlQuery = "SELECT * FROM match_data WHERE team_number=?";

	// val=team number, res=match data
	await requestDatabase(sqlQuery, teams, function(val, res) {
		const index = inverse[val];
		result[index] = res;
	});

	return result;
}
async function getTeamPitInfo(queries) {
	const team = queries.team;

	if(!team) {
		console.log("Error: bad team input: ", team);
		return {};
	}

	const sqlQuery = "SELECT * FROM pit_data WHERE team_number=?";

	const result = await requestDatabase(sqlQuery, team);

	return result;
}
async function getTeamStrategicInfo(queries) {
	const team = queries.team;

	let result = {};

	if(!team) {
		console.log("Error: bad team input: ", team);
		return result;
	}

	const sqlQuery = "SELECT * FROM strategic_data WHERE team_number=?";

	result = await requestDatabase(sqlQuery, team);

	return result;
}

// Please do not do SQL injection attack
async function submitData(data, table) {
	const keys = Object.keys(data);
	const sqlQuery = `INSERT INTO ${table} (${keys.join(",")}) values`
		+ `(${keys.map((x) => "?").join(",")})`;
	const values = Object.values(data);

	let result = null;

	try {
		// const mysql = getMysql();
		// const conn = await mysql.createConnection(connectionData);
		const conn = await connPool.getConnection();

		const [res, fields] = await conn.query(sqlQuery, values);

		result = res;

		await conn.destroy();
	} catch(err) {
		console.log(`Failed to resolve request to ${table}:`);
		console.dir(err);
	}
	return result;
}
async function submitPitData(data) {
	return await submitData(data, "pit_data");
}
async function submitMatchData(data) {
	return await submitData(data, "match_data");
}
async function submitStrategicData(data) {
	return await submitData(data, "strategic_data");
}

/*
function getMysql() {
	const mysql = require("mysql2/promise");

	const errorConnection = {
		query : function(...args) { return [null, null]; },
		end: function(...args) { },
	};

	const res = {
		createConnection : async function(connectionData) {
			try {
				const conn = await mysql.createConnection(connectionData);
				return conn;
			} catch (err) {
				switch(err.code) {
				case "ENOTFOUND":
					console.log("Could not find database server. Check wifi connection.");
					break;
				default:
					console.log("Error in mysql occurred: ", err);
					break;
				}

				return errorConnection;
			}
		},
	};

	return res;
}
*/
function verifyConnection(connection) {
	if(connection.state === "disconnected") {
		throw new Error("Could not connect to server.");
	}
}



module.exports = {
	"requestDatabase" : requestDatabase,
	"getTeamInfo" : getTeamInfo,
	"getTeamsScouted" : getTeamsScouted,
	"getTeamPitInfo" : getTeamPitInfo,
	"getTeamStrategicInfo" : getTeamStrategicInfo,
	"submitPitData" : submitPitData,
	"submitMatchData" : submitMatchData,
	"submitStrategicData" : submitStrategicData,
};
