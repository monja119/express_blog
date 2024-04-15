const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'blog.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Insérer les comptes administrateurs
    db.run('INSERT INTO admin (login, pass) VALUES (?, ?)', ['admin1', 'password1']);
    db.run('INSERT INTO admin (login, pass) VALUES (?, ?)', ['admin2', 'password2']);

    console.log('Seeders exécutés avec succès');
});

db.close();
