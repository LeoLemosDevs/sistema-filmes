import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import * as clientController from '../controllers/clientController';
import * as genreController from '../controllers/genreController';

const router = Router();

// Apenas usuários autenticados (não precisa ser admin)
router.use(authMiddleware);

// Gêneros
router.get('/genres', genreController.getGenres);

// Catálogo e Busca
router.get('/content', clientController.getAllContent);
router.get('/search', clientController.searchContent);
router.get('/content/:id', clientController.getContentById);

// Streaming Local (Para arquivos do HD)
router.get('/stream', clientController.streamLocalVideo);

router.get('/series/:id/episodes', clientController.getEpisodes);
router.get('/video-url/:id', clientController.getVideoUrl);
router.get('/episode/:id/context', clientController.getEpisodeContext);

// Favoritos (Minha Lista)
router.get('/favorites', clientController.getFavorites);
router.post('/favorites', clientController.addFavorite);
router.delete('/favorites/:id', clientController.removeFavorite);

export default router;
