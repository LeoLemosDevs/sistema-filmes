import { Request, Response } from 'express';
import * as genreModel from '../models/genreModel';

export const getGenres = async (req: Request, res: Response) => {
    try {
        const genres = await genreModel.getAllGenres();
        res.status(200).json(genres);
    } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        res.status(500).json({ message: 'Erro interno ao listar gêneros.' });
    }
};
