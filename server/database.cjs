require("dotenv").config()

const defaultValue = {"err" : "Failed to resolve request."};
const connectionData = {
	"user" : process.env.DB_USERNAME,
	"password" : process.env.DB_PASSWORD,
	"host" : process.env.DB_HOST, 
	"port" : process.env.DB_PORT, 
	//"database" : process.env.DB_DATABASE, 
	//"ssl" : {
	//	"rejectUnauthorized" : false,
	//},
};

function test(n) {
	console.log(`Got to ${n}`);
}

async function requestDatabase(query) {
	let result = {};
	const sqlQuery = query;

	try {
		const mysql = getMysql();
		const conn = await mysql.createConnection(connectionData);
		// do await conn.query(QUERY) for each sql command, below line would give results of query
		await conn.query("show tables");
		const [res, fields] = await conn.query(sqlQuery);

		await conn.end();

		result = res
		return result;
	} catch(err) {
		console.log("Failed to resolve request:");
		console.dir(err);
	}
	return result;
}
// Not implemented
async function getTeamInfo(teams) {
	let result = {};
	const sqlQuery = "SELECT * FROM match_data;";

	try {
		const mysql = getMysql();
		const conn = await mysql.createConnection(connectionData);
		await conn.query("USE testdb;");
		const [res, fields] = await conn.query(sqlQuery);

		await conn.end();

		result = res
		return result;
	} catch(err) {
		console.log("Failed to resolve request:");
		console.dir(err);
	}
	return result;
}
async function hasTeam() {
	let result = {};
	const sqlQuery = "SELECT * FROM pit_data WHERE ";

	try {
		const mysql = getMysql();
		const conn = await mysql.createConnection(connectionData);
		await conn.query("USE testdb");
		const [r1, f1] = await conn.query("SHOW TABLES");
		console.log(r1);
		const [res, fields] = await conn.query(sqlQuery);

		await conn.end();

		result = res
		return result;
	} catch(err) {
		console.log("Failed to resolve request:");
		console.dir(err);
	}
	return result;
}

function getMysql() {
	const mysql = require("mysql2/promise");
	return mysql;
}
function verifyConnection(connection) {
	if(connection.state === "disconnected") {
		throw new Error("Could not connect to server.");
	}
}

module.exports.requestDatabase = requestDatabase;
module.exports.getTeamInfo = getTeamInfo;
//export {requestDatabase, getTeamInfo};
