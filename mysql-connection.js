module.exports = function (RED) {
    function MySQLConnectionNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        this.client = null;
        this.status = 'disconnected';

        this.connConfig = {
            server: n.server,
            port: Number(n.port),
            database: n.database,
            timezone: n.timezone,
            charset: n.charset,
            connectionRetryInterval: Number(n.connectionRetryInterval) || 3000,
            auth: {
                username: this.credentials.username || 'root',
                password: this.credentials.password || ''
            }
        };

        this.poolConfig = {
            max: Number(n.poolMax) || 10
        };

        let Client = require('./client');
        this.client = new Client(null, {
            connection: this.connConfig,
            pool: this.poolConfig
        });

        this.client.initPool().then(() => {
            this.client.on('disconnect', () => {
                this.status = 'disconnected';
                node.log('Disconnected from MySQL server: ' + node.connConfig.server + ':' + node.connConfig.port);
            });

            this.client.on('reconnect', () => {
                this.status = 'reconnecting';
                node.log('Reconnecting to MySQL server: ' + node.connConfig.server + ':' + node.connConfig.port);
            });

            this.client.on('connected', () => {
                node.log('Connected to MySQL server: ' + node.connConfig.server + ':' + node.connConfig.port);
                node.log("Connection pool initialized.");
                this.status = 'connected';
            });

            this.client.on('error', (err) => {
                node.error(err);
            });

            node.log('Connecting to MySQL server: ' + node.connConfig.server + ':' + node.connConfig.port);
            this.client.connect();

            this.getPool = function() {
                return node.client.getPool();
            };

            this.getConn = async function() {
                return await node.client.getConn();
            };

            node.on('close', async function() {
                try {
                    await node.client.disconnect();
                } catch(e) {
                    console.log(e);
                }
            });
        }).catch((err) => {
            console.error("Failed to initialize connection pool:", err);
        });
    }

    RED.nodes.registerType('MySQL Connection', MySQLConnectionNode, {
        credentials: {
            username: { type: 'text' },
            password: { type: 'password' }
        }
    });
};

