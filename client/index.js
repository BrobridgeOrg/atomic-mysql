const events = require('events');
const mysql = require('mysql2/promise');

module.exports = class Client extends events.EventEmitter {
	constructor(conn = null, opts = {}) {
		super();

		this.opts = Object.assign({
			server: '0.0.0.0',
			port: 3306,
			database: '',
			timezone: '+00:00',
			charset: 'utf8mb4',
			connectionRetryInterval: 3000,
		}, opts.connection, {
			auth: Object.assign({
				username: 'root',
				password: '',
			}, opts.connection.auth || {})
		});

		this.poolOpts = Object.assign({
			max: 10,
		}, opts.pool);

		this.status = 'disconnected';
		this.pool = null;
		this.timer = null;
	}

	async initPool() {
		try {
			this.pool = mysql.createPool({
				host: this.opts.server,
				port: this.opts.port,
				database: this.opts.database,
				timezone: this.opts.timezone,
				charset: this.opts.charset,
				user: this.opts.auth.username,
				password: this.opts.auth.password,
				waitForConnections: true,
				connectionLimit: this.poolOpts.max,
				queueLimit: 100,
				enableKeepAlive: true,
			});
			this.status = 'connected';
			this.emit('connected');
			return this.pool;
		} catch (err) {
			this.status = 'disconnected';
			this.emit('error', err);
			throw err;
		}
	}

	getPool() {
		return this.pool;
	}

	async getConn() {
		return await this.pool.getConnection();
	}

	connect() {
		this.pool.getConnection()
			.then((conn) => {
				conn.release();
				this.emit('connected');
			})
			.catch((e) => {
				this.timer = setTimeout(() => {
					this.emit('reconnect');
					this.connect();
				}, this.opts.connectionRetryInterval);
			});

		clearTimeout(this.timer);
	}

	async disconnect() {
		try {
			await this.pool.end();
		} catch (e) {
			throw e;
		}
		this.emit('disconnect');
	}
};
