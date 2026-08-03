import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Verifica se existe um usuário injetado (pelo authMiddleware) e se a role dele é 'admin'
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Acesso negado (Forbidden). Requer privilégios de administrador.' });
    }
};
