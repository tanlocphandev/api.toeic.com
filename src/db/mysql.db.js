"use strict";

const mysql = require("mysql2/promise");
const DB_CONFIGS = require("../configs/db.config");
const { ServerError } = require("../core/error.response");

class Database {
    constructor({ host, port, user, password, database, connectionLimit }) {
        this.pool = mysql.createPool({
            host,
            port,
            user,
            password,
            database,
            connectionLimit,
        });
    }

    getPool() {
        return this.pool;
    }

    async query(sql, params) {
        const connection = await this.pool.getConnection();

        try {
            const [rows] = await connection.query(sql, params);
            return rows;
        } catch (error) {
            console.log(`Error Database - query:::`, error);
            throw new ServerError(error.message);
        } finally {
            connection.release();
        }
    }

    async execute(sql, params) {
        const connection = await this.pool.getConnection();

        try {
            const [result] = await connection.execute(sql, params);
            return result;
        } catch (error) {
            console.log(`Error Database - execute:::`, error);
            throw new ServerError(error.message);
        } finally {
            connection.release();
        }
    }

    async close() {
        await this.pool.end();
    }

    async beginTransaction() {
        const connection = await this.pool.getConnection();
        await connection.beginTransaction();
        return connection;
    }

    async commit(connection) {
        await connection.commit();
        connection.release();
    }

    async rollback(connection) {
        await connection.rollback();
        connection.release();
    }

    async release(connection) {
        connection.release();
    }

    async releaseAll() {
        await this.pool.end();
    }
}

const database = new Database({
    host: DB_CONFIGS.HOST,
    port: DB_CONFIGS.PORT,
    user: DB_CONFIGS.USER,
    password: DB_CONFIGS.PASSWORD,
    database: DB_CONFIGS.DATABASE,
    connectionLimit: DB_CONFIGS.CONNECTION_LIMIT,
});

/**
 * Initializes the database connection and logs a success message if the connection is successful,
 * otherwise logs an error message.
 *
 * @return {Promise<void>} A promise that resolves when the connection is established or rejects with an error.
 */
const initializeDB = () => {
    database
        .getPool()
        .getConnection()
        .then(() => {
            console.log(`DB connect successfully`);
        })
        .catch((error) => {
            console.log(`DB connect failed:::`, error);
        });
};

module.exports = { database, initializeDB };
