import { db } from '../config/database';

// Busca um usuário pelo email
export const findUserByEmail = async (email: string) => {
    const result = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    return result.rows[0];
};

// Cria um novo usuário com role padrão 'user'
export const createUser = async (name: string, email: string, passwordHash: string) => {
    const query = 'INSERT INTO Users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)';
    const result = await db.execute(query, [name, email, passwordHash, 'user']);
    
    // @ts-ignore - mysql2 returns insertId
    const insertId = result[0].insertId;
    const userQuery = await db.query('SELECT id, name, email, role, created_at FROM Users WHERE id = $1', [insertId]);
    return userQuery.rows[0];
};
