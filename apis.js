module.exports = {
	init: init 
};

function init(RED) {
	var prefix = '/nodes/atomic-mysql/apis';

	RED.httpAdmin.post(prefix + '/execute', RED.auth.needsPermission('flows.write'), function(req, res) {
		let connection = RED.nodes.getNode(req.body.connection);
		if (!connection) {
			res.end();
			return;
		}

		(async () => {
			try {
				let rs = await request(connection, req.body.query);

				res.json({
					success: true,
					finished: rs.finished,
					results: rs.recordset || [],
					rowsAffected: rs.rowsAffected,
				});
			} catch(e) {
				console.log(e);

				res.json({
					success: false,
					error: {
						code: e.code,
						message: e.message,
						stack: e.stack
					}
				});
			}
		})();
	});
}

function request(connection, query) {
	return new Promise(async (resolve, reject) => {
		let conn;
		try {
			conn = await connection.getConn();
			const [rows] = await conn.query(query);
			conn.release();

			if (rows.length > 1000) {
				resolve({
					finished: false,
					recordset: rows.slice(0, 1000),
					rowsAffected: [1000]
				});
			} else {
				resolve({
					finished: true,
					recordset: rows,
					rowsAffected: [rows[0].length]
				});
			}
		} catch (err) {
			if (conn) conn.release();
			reject(err);
		}
	});
}
