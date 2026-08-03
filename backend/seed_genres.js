const mysql = require('mysql2/promise');

async function seedGenres() {
    const conn = await mysql.createConnection({ user: 'root', database: 'filmes_stream' });
    
    const genres = ["Artes Marciais", "Policial", "Terror", "Ficção Científica", "Faroeste", "Clássicos", "Aventura"];
    
    for (let g of genres) {
        await conn.execute('INSERT IGNORE INTO Genres (name) VALUES (?)', [g]);
    }
    
    console.log('Novos gêneros inseridos com sucesso!');
    await conn.destroy();
}

seedGenres().catch(console.error);
