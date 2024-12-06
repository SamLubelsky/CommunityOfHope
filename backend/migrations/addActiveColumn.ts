import db from '../config/database';

db.run(`ALTER TABLE help_requests ADD COLUMN active INTEGER DEFAULT 1;`, (err) => {
    if (err) {
        console.error('Error adding active column:', err);
    } else {
        console.log('Successfully added active column');
    }
    process.exit();
});