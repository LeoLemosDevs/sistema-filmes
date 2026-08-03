import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendendo a interface Request do Express para injetar os dados do usuário autenticado
export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido no cabeçalho Authorization.' });
    }

    // O token geralmente vem no formato "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
        // Verifica e decodifica o token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number, role: string };
        
        // Armazena as informações decodificadas do usuário no objeto Request
        req.user = decoded;
        
        // Passa para o próximo middleware ou controller
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token JWT inválido ou expirado.' });
    }
};
