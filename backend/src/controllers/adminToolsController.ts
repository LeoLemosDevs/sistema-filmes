import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { db } from '../config/database';

export const backupDatabase = (req: Request, res: Response) => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup_filmes_stream_${timestamp}.sql`;
        const filepath = path.join(__dirname, '../../', filename);
        
        // mysqldump deve estar no PATH (padrão no XAMPP se configurado)
        // Se não estiver no PATH, o usuário pode precisar rodar o sistema no mesmo shell que tem o mysql.
        // Assumindo que root não tem senha, como definido no .env padrão
        const cmd = `mysqldump -u root filmes_stream > "${filepath}"`;
        
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao fazer backup: ${error.message}`);
                return res.status(500).json({ message: 'Erro ao gerar arquivo de backup. Verifique se o mysqldump está instalado no seu sistema.' });
            }
            
            res.download(filepath, filename, (err) => {
                if (err) console.error("Erro ao enviar arquivo", err);
                
                // Apaga o arquivo local após enviar
                fs.unlink(filepath, (unlinkErr) => {
                    if (unlinkErr) console.error("Erro ao apagar arquivo temporário de backup", unlinkErr);
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao realizar backup.' });
    }
};

export const scanDirectory = async (req: Request, res: Response) => {
    try {
        const { folderPath } = req.body;
        if (!folderPath || !fs.existsSync(folderPath)) {
            return res.status(400).json({ message: 'Caminho do diretório inválido ou não existe.' });
        }

        const files = fs.readdirSync(folderPath);
        const videoFiles = files.filter(f => f.endsWith('.mp4') || f.endsWith('.mkv') || f.endsWith('.avi'));
        
        if (videoFiles.length === 0) {
            return res.status(200).json({ message: 'Nenhum vídeo encontrado na pasta.', added: 0 });
        }

        let added = 0;
        for (let file of videoFiles) {
            // Usa o nome do arquivo sem extensão como título
            const title = path.parse(file).name;
            const videoUrl = path.join(folderPath, file).replace(/\\/g, '/');
            
            // Verifica se já existe para evitar duplicados
            const [existing] = await db.execute('SELECT id FROM Content WHERE title = ? AND content_type = "movie"', [title]) as any;
            if (existing.length > 0) continue;
            
            await db.execute(
                'INSERT INTO Content (title, description, release_year, content_type, thumbnail_url, video_url) VALUES (?, ?, ?, ?, ?, ?)',
                [title, 'Importado automaticamente pelo Scanner de Diretório.', new Date().getFullYear(), 'movie', 'https://via.placeholder.com/800x450?text=' + encodeURIComponent(title), videoUrl]
            );
            added++;
        }

        res.status(200).json({ message: `Scan concluído. ${added} filmes foram importados!`, added });
    } catch (error) {
        console.error('Erro no scanner:', error);
        res.status(500).json({ message: 'Erro interno ao escanear diretório.' });
    }
};
