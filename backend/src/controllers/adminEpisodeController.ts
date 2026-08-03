import { Request, Response } from 'express';
import { db } from '../config/database';

export const getSeriesEpisodes = async (req: Request, res: Response) => {
    try {
        const contentId = parseInt(req.params.contentId);

        // 1. Encontrar o series_id a partir do contentId
        const [seriesRows] = await db.execute('SELECT id FROM Series_Metadata WHERE content_id = ?', [contentId]) as any;
        
        if (seriesRows.length === 0) {
            // Criar se não existir
            const [insertRes] = await db.execute('INSERT INTO Series_Metadata (content_id, total_seasons) VALUES (?, 1)', [contentId]) as any;
            seriesRows.push({ id: insertRes.insertId });
        }

        const seriesId = seriesRows[0].id;

        // 2. Buscar episódios
        const [episodes] = await db.execute('SELECT * FROM Episodes WHERE series_id = ? ORDER BY season_number ASC, episode_number ASC', [seriesId]) as any;

        res.status(200).json({ seriesId, episodes });
    } catch (error) {
        console.error('Erro ao buscar episódios:', error);
        res.status(500).json({ message: 'Erro interno ao buscar episódios.' });
    }
};

export const createEpisode = async (req: Request, res: Response) => {
    try {
        const { seriesId } = req.params;
        const { season_number, episode_number, title, description, duration_minutes, video_url, thumbnail_url } = req.body;

        const [result] = await db.execute(
            'INSERT INTO Episodes (series_id, season_number, episode_number, title, description, duration_minutes, video_url, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [seriesId, season_number, episode_number, title, description, duration_minutes || 0, video_url || '', thumbnail_url || '']
        ) as any;

        res.status(201).json({ message: 'Episódio criado com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Erro ao criar episódio:', error);
        res.status(500).json({ message: 'Erro interno ao criar episódio.' });
    }
};

export const deleteEpisode = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM Episodes WHERE id = ?', [id]);
        res.status(200).json({ message: 'Episódio deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar episódio:', error);
        res.status(500).json({ message: 'Erro interno ao deletar episódio.' });
    }
};
