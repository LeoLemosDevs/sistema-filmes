import { db } from './src/config/database';

async function updateDB() {
    try {
        await db.execute('ALTER TABLE Content ADD COLUMN is_featured BOOLEAN DEFAULT false;');
        console.log("Colouna is_featured adicionada.");
    } catch (e: any) {
        console.log("is_featured ja existe ou erro:", e.message);
    }
    
    try {
        await db.execute('ALTER TABLE Content ADD COLUMN featured_image_url VARCHAR(255) NULL;');
        console.log("Colouna featured_image_url adicionada.");
    } catch (e: any) {
        console.log("featured_image_url ja existe ou erro:", e.message);
    }
    
    console.log("Processo finalizado");
    process.exit(0);
}

updateDB();
