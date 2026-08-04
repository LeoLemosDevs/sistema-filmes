import { db } from '../config/database';

export const getAllContent = async () => {
    const query = `
        SELECT 
            c.*, 
            GROUP_CONCAT(g.name SEPARATOR ', ') AS genre_names,
            GROUP_CONCAT(g.id SEPARATOR ',') AS genre_ids
        FROM Content c
        LEFT JOIN Content_Genres cg ON c.id = cg.content_id
        LEFT JOIN Genres g ON cg.genre_id = g.id
        GROUP BY c.id
        ORDER BY c.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

export const createContentWithGenres = async (contentData: any, genreIds: number[]) => {
    const client = await db.connect();
    try {
        await client.query('START TRANSACTION');

        const insertContentQuery = `
            INSERT INTO Content (title, description, thumbnail_url, video_url, content_type, release_year, is_featured, featured_image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const contentValues = [
            contentData.title,
            contentData.description,
            contentData.thumbnail_url,
            contentData.video_url,
            contentData.content_type,
            contentData.release_year,
            contentData.is_featured ? 1 : 0,
            contentData.featured_image_url || null
        ];
        
        const result = await client.execute(insertContentQuery, contentValues);
        // @ts-ignore
        const newContentId = result[0].insertId;

        if (genreIds && genreIds.length > 0) {
            for (const genreId of genreIds) {
                await client.query(
                    'INSERT INTO Content_Genres (content_id, genre_id) VALUES (?, ?)',
                    [newContentId, genreId]
                );
            }
        }

        await client.query('COMMIT');
        
        const contentResult = await db.query('SELECT * FROM Content WHERE id = ?', [newContentId]);
        return contentResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const updateContent = async (id: number, contentData: any) => {
    const query = `
        UPDATE Content 
        SET title = ?, description = ?, thumbnail_url = ?, video_url = ?, content_type = ?, release_year = ?, is_featured = ?, featured_image_url = ?
        WHERE id = ?
    `;
    const values = [
        contentData.title,
        contentData.description,
        contentData.thumbnail_url,
        contentData.video_url,
        contentData.content_type,
        contentData.release_year,
        contentData.is_featured ? 1 : 0,
        contentData.featured_image_url || null,
        id
    ];
    
    await db.execute(query, values);
    if (contentData.genre_ids && Array.isArray(contentData.genre_ids)) {
        await db.query('DELETE FROM Content_Genres WHERE content_id = ?', [id]);
        for (const genreId of contentData.genre_ids) {
            await db.query('INSERT INTO Content_Genres (content_id, genre_id) VALUES (?, ?)', [id, genreId]);
        }
    }
    const result = await db.query('SELECT * FROM Content WHERE id = ?', [id]);
    return result.rows[0];
};

export const deleteContent = async (id: number) => {
    await db.query('DELETE FROM Content WHERE id = ?', [id]);
};
