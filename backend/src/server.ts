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

// Rota de Healthcheck
app.get('/api/health', async (req: Request, res: Response) => {
    try {
        const dbRes = await db.query('SELECT NOW()');
        res.status(200).json({ 
            status: 'ok', 
            message: 'API Filmes Stream rodando perfeitamente!',
            db_time: dbRes.rows[0].now 
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro de conexão com o banco de dados.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
