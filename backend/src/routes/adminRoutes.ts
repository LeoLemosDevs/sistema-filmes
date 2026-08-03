import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import * as contentController from '../controllers/contentController';
import * as genreController from '../controllers/genreController';

const router = Router();

// Todos os endpoints abaixo desta declaração exigirão Autenticação JWT e Role Admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Gêneros
router.get('/genres', genreController.getGenres);

// CRUD de Conteúdo (Filmes, Séries, etc.)
router.get('/content', contentController.getAllAdminContent);
router.post('/content', contentController.createContent);
router.put('/content/:id', contentController.updateContent);
router.delete('/content/:id', contentController.deleteContent);

import * as adminToolsController from '../controllers/adminToolsController';
import * as adminEpisodeController from '../controllers/adminEpisodeController';

// Ferramentas do Sistema (Backup, Importação)
router.get('/backup', adminToolsController.backupDatabase);
router.post('/scan-directory', adminToolsController.scanDirectory);

// Episódios
router.get('/series/:contentId/episodes', adminEpisodeController.getSeriesEpisodes);
router.post('/series/:seriesId/episodes', adminEpisodeController.createEpisode);
router.delete('/episodes/:id', adminEpisodeController.deleteEpisode);

export default router;
