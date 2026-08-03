import { db } from '../config/database';

export const addFavorite = async (userId: number, contentId: number) => {
    // MySQL IGNORE syntax in place of DO NOTHING
    await db.execute(
        'INSERT IGNORE INTO Favorites (user_id, content_id) VALUES ($1, $2)',
        [userId, contentId]
    );
    const result = await db.query('SELECT * FROM Favorites WHERE user_id = $1 AND content_id = $2', [userId, contentId]);
    return result.rows[0];
};

export const removeFavorite = async (userId: number, contentId: number) => {
    await db.query(
        'DELETE FROM Favorites WHERE user_id = $1 AND content_id = $2',
        [userId, contentId]
    );
};

export const getFavoritesByUser = async (userId: number) => {
    const result = await db.query(
        `SELECT c.* FROM Content c
         JOIN Favorites f ON c.id = f.content_id
         WHERE f.user_id = $1
         ORDER BY c.title ASC`,
        [userId]
    );
    return result.rows;
};
