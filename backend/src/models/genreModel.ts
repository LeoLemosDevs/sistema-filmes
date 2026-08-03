import { db } from '../config/database';

export const getAllGenres = async () => {
    const result = await db.query('SELECT * FROM Genres ORDER BY name ASC');
    return result.rows;
};
