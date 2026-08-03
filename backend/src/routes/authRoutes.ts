import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Rota pública para registro de usuário
router.post('/register', register);

// Rota pública para login
router.post('/login', login);

export default router;
