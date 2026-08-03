import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos (nome, email, senha) são obrigatórios.' });
        }

        // Verifica se email já existe
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Este e-mail já está em uso.' });
        }

        // Hash da senha (custo 10)
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Cria usuário
        const newUser = await createUser(name, email, passwordHash);

        res.status(201).json({
            message: 'Usuário registrado com sucesso.',
            user: newUser
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao registrar.' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
        }

        // Busca o usuário
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // Evite revelar qual parte falhou
        }

        // Compara a senha informada com o Hash do banco
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Gera o token JWT com expiração de 1 dia
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login bem-sucedido.',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao realizar login.' });
    }
};
