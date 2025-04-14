module.exports = function(RED) {

	function genQueryCmd() {
		return Array.from(arguments);
	}

	function genQueryCmdParameters(tpl, msg) {
		const regex = /\$\{([^}]+)\}/g;
		let index = 1;
		let binds = {};

		tpl = tpl.replace(/--(.*)$/gm, (match, comment) => {
			return `--` + comment.replace(regex, (_, key) => `<!--${key}-->`);
		});

		tpl = tpl.replace(/\/\*([\s\S]*?)\*\//gm, (match, comment) => {
			return `/*` + comment.replace(regex, (_, key) => `<!--${key}-->`) + `*/`;
		});

		let sql = tpl.replace(regex, (_, key) => {
			const paramName = `param${index++}`;
			try {
				binds[paramName] = new Function("msg", `return ${key};`)(msg);
			} catch (error) {
				console.error(`Error processing variable: ${key}`, error);
				binds[paramName] = null;
			}
			return `?`; // MySQL 使用位置參數
		});

		sql = sql.replace(/<!--([\s\S]*?)-->/gm, (_, key) => `\${${key.trim()}}`);

		return { sql, binds: Object.values(binds) };
	}

	function sanitizedCmd(raw) {
		return raw.replaceAll('\`', '\\\`');
	}

	function ExecuteNode(config) {
		RED.nodes.createNode(this, config);

		var node = this;
		this.connection = RED.nodes.getNode(config.connection)
		this.config = config;
		this.config.outputPropType = config.outputPropType || 'msg';
		this.config.outputProp = config.outputProp || 'payload';
		this.tpl = sanitizedCmd(node.config.command) || '';
		this.onStop = false;
		this.conn = null;

		if (!this.connection) {
			node.status({
				fill: 'red',
				shape: 'ring',
				text: 'disconnected'
			});
			return;
		}

		node.on('input', async (msg, send, done) => {
			if (this.onStop) {
				node.error('atomic on stopping ...')
				return;
			}

			if (node.config.querySource === 'dynamic' && !msg.query)
				return;

			let tpl = node.tpl;
			if (msg.query) {
				// higher priority for msg.query
				tpl = sanitizedCmd(msg.query);
			}

			try {
				this.conn = await this.connection.getConn()
				this.conn.callTimeout = 500;
				node.status({
					fill: 'blue',
					shape: 'dot',
					text: 'requesting'
				});

				let { sql, binds } = genQueryCmdParameters(tpl, msg);
				let rs = await this.conn.execute(sql, binds);
				if (this.conn){
					await this.conn.release();
					this.conn = null
				};

				node.status({
					fill: 'green',
					shape: 'dot',
					text: 'done'
				});

				// Preparing result
				//console.log(rs);
				if (node.config.outputPropType == 'msg') {
					msg[node.config.outputProp] = {
						results: rs[0] || [],
						//rowsAffected: rs[0].length || null,
					}
				}

				node.send(msg);
				done();
			} catch(e) {
				node.status({
					fill: 'red',
					shape: 'ring',
					text: e.toString()
				});

				/*
				node.send({
					error: e.toString()
				})
				*/

				node.error(e, msg);
				if (this.conn) {
					try{
						await this.conn.release();
						this.conn = null
					} catch(e){
						//console.log(e);
						//console.warn("Connection might already be closed.");
					}
				}
			}
		});

		node.on('close', async () => {
			this.onStop=true;
				if (this.conn) {
					try{
						await this.conn.release();
					} catch(e){
						console.log(e);
						//console.warn("Connection might already be closed.");
					}
				}
		});
	}

	// Admin API
	const api = require('./apis');
	api.init(RED);

	RED.nodes.registerType('MySQL Execute', ExecuteNode, {
		credentials: {
		}
	});
}
