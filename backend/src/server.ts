import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/database';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import clientRoutes from './routes/clientRoutes';

// Carrega as variáveis do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);

// Rota de Debug (Temporária)
app.get('/api/debug-env', (req: Request, res: Response) => {
    res.status(200).json({
        db_host: process.env.DB_HOST || 'NÃO DEFINIDO',
        db_port: process.env.DB_PORT || 'NÃO DEFINIDO',
        db_user: process.env.DB_USER || 'NÃO DEFINIDO',
        db_name: process.env.DB_NAME || 'NÃO DEFINIDO',
        has_password: !!process.env.DB_PASSWORD,
        ssl_enabled: !!(process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1')
    });
});

// Rota de Healthcheck
app.get('/api/health', async (req: Request, res: Response) => {
    try {
        const dbRes = await db.query('SELECT NOW()');
        res.status(200).json({ 
            status: 'ok', 
            message: 'API Filmes Stream rodando perfeitamente!',
            db_time: dbRes.rows[0].now 
        });
    } catch (error: any) {
        console.error('Erro no healthcheck:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Erro de conexão com o banco de dados.',
            details: error?.message || String(error),
            code: error?.code
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
