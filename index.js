const Helper = codecept_helper;
const pg = require('pg');

class PostgresqlDBHelper extends Helper {
  constructor(config) {
    super(config);
    this.host = config.host;
    this.port = config.port;
    this.user = config.user;
    this.password = config.password;
    this.database = config.database;
    this.client = null
  }

  /**
   * Connects to PG shell .Accept options from the Helper config by default
   * @returns {Promise<*>}
   * @param {connection} [connection] - taken from codeceptjs config
   */
  async pgConnect(connection) {
    if (connection) {
      const {
        host,
        port,
        user,
        password,
        database,
      } = connection;

      if (host) this.host = host;

      if (port) this.port = port;

      if (user) this.user = user;

      if (password) this.password = password;

      if (database) this.database = database;
    }

    this.client = new pg.Client({
      user: this.user,
      host: this.host,
      database: this.database,
      password: this.password,
      port: this.port,
    });

    return await this.client.connect()
        .catch((e) => {
          throw Error(`Failed to open connection.\n${e}`)
        });
  }

  /**
   * Disconnects from PG shell
   * @returns {Promise<void>}
   */
  async pgDisconnect() {
    await this.client.end(err => {
      console.log('client has disconnected');
      if (err) {
        console.error(`error during disconnection. \n ${err.stack}`);
      }
    })
  }

  /**
   * Queries all records from pg_catalog.pg_tables
   * @returns {Promise<void>}
   */
  async pgShowTables() {
    return await this.client.query('SELECT * FROM pg_catalog.pg_tables')
        .catch((e) => {
          throw Error(`Failed to select tables from "pg_catalog.pg_tables".\n${e}`);
        });
  }

  /**
   * Executes query against connected PostgreSQL and returns result
   * @returns {Promise<void>}
   * @param query SQL query to execute
   */
  async pgExecuteQuery(query) {
    return await this.client.query(query)
        .catch((e) => {
          throw Error(`Failed to execute query "${query}".\n${e}`);
        });
  }
}

module.exports = PostgresqlDBHelper;
