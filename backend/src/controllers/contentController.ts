import { Request, Response } from 'express';
import * as contentModel from '../models/contentModel';

export const getAllAdminContent = async (req: Request, res: Response) => {
    try {
        const contents = await contentModel.getAllContent();
        res.status(200).json(contents);
    } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
        res.status(500).json({ message: 'Erro interno ao listar conteúdos.' });
    }
};

export const createContent = async (req: Request, res: Response) => {
    try {
        const { title, description, thumbnail_url, video_url, content_type, release_year, genre_ids, is_featured, featured_image_url } = req.body;

        if (!title || !content_type) {
            return res.status(400).json({ message: 'Título e tipo de conteúdo são campos obrigatórios.' });
        }

        // genre_ids deve ser um array de IDs, ex: [1, 2] para "Ação" e "Comédia"
        const newContent = await contentModel.createContentWithGenres({
            title, description, thumbnail_url, video_url, content_type, release_year, is_featured, featured_image_url
        }, genre_ids || []);

        res.status(201).json({
            message: 'Conteúdo criado com sucesso.',
            content: newContent
        });
    } catch (error) {
        console.error('Erro ao criar conteúdo:', error);
        res.status(500).json({ message: 'Erro interno ao cadastrar conteúdo.' });
    }
};

export const updateContent = async (req: Request, res: Response) => {
    try {
        const contentId = parseInt(req.params.id);
        const updateData = req.body;

        const updatedContent = await contentModel.updateContent(contentId, updateData);
        
        if (!updatedContent) {
            return res.status(404).json({ message: 'Conteúdo não encontrado para atualização.' });
        }

        res.status(200).json({
            message: 'Conteúdo atualizado com sucesso.',
            content: updatedContent
        });
    } catch (error) {
        console.error('Erro ao atualizar conteúdo:', error);
        res.status(500).json({ message: 'Erro interno ao atualizar conteúdo.' });
    }
};

export const deleteContent = async (req: Request, res: Response) => {
    try {
        const contentId = parseInt(req.params.id);
        await contentModel.deleteContent(contentId);
        
        res.status(200).json({ message: 'Conteúdo removido com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover conteúdo:', error);
        res.status(500).json({ message: 'Erro interno ao remover conteúdo.' });
    }
};
