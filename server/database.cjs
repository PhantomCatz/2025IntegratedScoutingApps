require("dotenv").config()

const defaultValue = {"err" : "Failed to resolve request."};
const connectionData = {
	"user" : process.env.DB_USERNAME,
	"password" : process.env.DB_PASSWORD,
	"host" : process.env.DB_HOST, 
	"port" : process.env.DB_PORT, 
	"database" : process.env.DB_DATABASE, 
};

if(!connectionData || !process.env.DB_USERNAME) {
	console.log("connectionData=", connectionData);
	console.log("Check .env");
}

async function requestDatabase(query, substitution, forEach) {
	let result = [];

	const sqlQuery = query;

	try {
		const mysql = getMysql();
		const conn = await mysql.createConnection(connectionData);

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

		await conn.end();

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
	for(let i = 1; i <= 3; i++) {
		if(queries[`team${i}`]) {
			teams.push(queries[`team${i}`]);
		}
	}
 
	let result = {};

	if(teams.length == 0) {
		console.log("Error: No teams queried");
		return result;
	}

	const sqlQuery = "SELECT * FROM match_data WHERE team_number=?";

	await requestDatabase(sqlQuery, teams, function(val, res) {
		//console.log(res);
		result[val] = res;
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

	console.log(sqlQuery, team);

	result = await requestDatabase(sqlQuery, team);

	return result;
}

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
				console.log("Error occurred: ", err);
				return errorConnection;
			}
		},
	};

	return res;
}
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
};
