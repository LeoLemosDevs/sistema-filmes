import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'filmes_stream',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const db = {
    query: async (text: string, params?: any[]) => {
        let mysqlQuery = text.replace(/\$\d+/g, '?');
        mysqlQuery = mysqlQuery.replace(/ILIKE/gi, 'LIKE');
        const [rows] = await pool.query(mysqlQuery, params);
        return { rows: rows as any[] };
    },
    execute: async (text: string, params?: any[]) => {
        let mysqlQuery = text.replace(/\$\d+/g, '?');
        return pool.execute(mysqlQuery, params);
    },
    connect: async () => {
        const connection = await pool.getConnection();
        return {
            query: async (text: string, params?: any[]) => {
                let mysqlQuery = text.replace(/\$\d+/g, '?');
                mysqlQuery = mysqlQuery.replace(/ILIKE/gi, 'LIKE');
                const [rows] = await connection.query(mysqlQuery, params);
                return { rows: rows as any[] };
            },
            execute: async (text: string, params?: any[]) => {
                let mysqlQuery = text.replace(/\$\d+/g, '?');
                return connection.execute(mysqlQuery, params);
            },
            release: () => connection.release()
        };
    }
};
