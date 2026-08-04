import { Request, Response } from 'express';
import { db } from '../config/database';
import * as favoriteModel from '../models/favoriteModel';
import * as contentModel from '../models/contentModel';

export const getAllContent = async (req: Request, res: Response) => {
    try {
        const contents = await contentModel.getAllContent();
        res.status(200).json(contents);
    } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
        res.status(500).json({ message: 'Erro interno ao listar conteúdos.' });
    }
};

export const searchContent = async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string;
        if (!q) return res.status(200).json([]);
        
        const query = `
            SELECT 
                c.*, 
                GROUP_CONCAT(g.name SEPARATOR ', ') AS genre_names,
                GROUP_CONCAT(g.id SEPARATOR ',') AS genre_ids
            FROM Content c
            LEFT JOIN Content_Genres cg ON c.id = cg.content_id
            LEFT JOIN Genres g ON cg.genre_id = g.id
            WHERE c.title LIKE ? OR c.description LIKE ?
            GROUP BY c.id
            ORDER BY c.release_year DESC
        `;
        const result = await db.query(query, [`%${q}%`, `%${q}%`]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro na pesquisa:', error);
        res.status(500).json({ message: 'Erro interno na pesquisa.' });
    }
};

export const getContentById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('SELECT * FROM Content WHERE id = ?', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Conteúdo não encontrado.' });
        }
        
        const content = result.rows[0];
        
        // Buscar gêneros
        const genresResult = await db.query(
            `SELECT g.name FROM Genres g
             JOIN Content_Genres cg ON g.id = cg.genre_id
             WHERE cg.content_id = ?`,
            [id]
        );
        content.genres = genresResult.rows.map(r => r.name);
        
        // Se for série, buscar temporadas e episódios
        if (content.content_type === 'series') {
            const episodesResult = await db.query(
                `SELECT e.* FROM Episodes e
                 JOIN Series_Metadata sm ON e.series_id = sm.id
                 WHERE sm.content_id = ?
                 ORDER BY e.season_number ASC, e.episode_number ASC`,
                [id]
            );
            content.episodes = episodesResult.rows;
            
            const metaResult = await db.query('SELECT total_seasons FROM Series_Metadata WHERE content_id = ?', [id]);
            if (metaResult.rows.length > 0) content.total_seasons = metaResult.rows[0].total_seasons;
        }
        
        res.status(200).json(content);
    } catch (error) {
        console.error('Erro ao buscar conteúdo:', error);
        res.status(500).json({ message: 'Erro interno.' });
    }
};

export const getEpisodes = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const season = req.query.season ? parseInt(req.query.season as string) : 1;
        const result = await db.query(
            `SELECT e.* FROM Episodes e
             JOIN Series_Metadata sm ON e.series_id = sm.id
             WHERE sm.content_id = ? AND e.season_number = ?
             ORDER BY e.episode_number ASC`,
            [id, season]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar episódios' });
    }
};

// Favoritos
export const getFavorites = async (req: any, res: Response) => {
    try {
        const userId = req.user.id; // Vem do JWT
        const favorites = await favoriteModel.getFavoritesByUser(userId);
        res.status(200).json(favorites);
    } catch (error) {
        console.error('Erro ao listar favoritos:', error);
        res.status(500).json({ message: 'Erro ao carregar lista.' });
    }
};

export const addFavorite = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const { content_id } = req.body;
        await favoriteModel.addFavorite(userId, content_id);
        res.status(201).json({ message: 'Adicionado com sucesso.' });
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        res.status(500).json({ message: 'Erro ao favoritar.' });
    }
};

export const removeFavorite = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const contentId = parseInt(req.params.id);
        await favoriteModel.removeFavorite(userId, contentId);
        res.status(200).json({ message: 'Removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        res.status(500).json({ message: 'Erro ao desfavoritar.' });
    }
};

// Obter URL do vídeo
export const getVideoUrl = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const type = req.query.type as string; // 'movie' ou 'episode'
        
        let url = null;
        if (type === 'movie') {
            const result = await db.query('SELECT video_url FROM Content WHERE id = ?', [id]);
            if (result.rows.length > 0) url = result.rows[0].video_url;
        } else if (type === 'episode') {
            const result = await db.query('SELECT video_url FROM Episodes WHERE id = ?', [id]);
            if (result.rows.length > 0) url = result.rows[0].video_url;
        }
        
        if (!url) return res.status(404).json({ message: 'Vídeo não encontrado' });
        res.status(200).json({ url });
    } catch(err) {
        res.status(500).json({ message: 'Erro ao buscar vídeo' });
    }
};

export const getEpisodeContext = async (req: Request, res: Response) => {
    try {
        const episodeId = parseInt(req.params.id);
        const result = await db.query(
            `SELECT sm.content_id 
             FROM Episodes e 
             JOIN Series_Metadata sm ON e.series_id = sm.id 
             WHERE e.id = ?`,
            [episodeId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Episódio não encontrado.' });
        }
        res.status(200).json({ content_id: result.rows[0].content_id });
    } catch (error) {
        console.error('Erro ao buscar contexto do episódio', error);
        res.status(500).json({ message: 'Erro interno.' });
    }
};

import fs from 'fs';
export const streamLocalVideo = (req: Request, res: Response) => {
    try {
        const videoPath = req.query.path as string;
        if (!videoPath || !fs.existsSync(videoPath)) {
            return res.status(404).send('Vídeo não encontrado no disco local.');
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                return;
            }

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error('Erro no streaming local', error);
        res.status(500).send('Erro interno');
    }
};
