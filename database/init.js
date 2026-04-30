const Database = require('better-sqlite3');
const path = require('path');

// Create or connect to th database file
const db = new Database(path.join(__dirname, '..', 'subscribers.db'));

//Create the subscribers table if it doesn't exist
 db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
     id INTEGER PRIMARY KEY,
     email TEXT NOT null,
     first_name TEXT NOT null,
     last_name TEXT NOT null,
     points_balance INTEGER DEFAULT 0,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

//insert the three demo subscribers
const insert= db.prepare(`
    INSERT OR IGNORE INTO subscribers(id,email,first_name,last_name,points_balance)
   VALUES (?, ?, ?, ?, ?)`
);

insert.run(1, 'candidate-test@example.com', 'Test','User','100');
insert.run(2, 'demo1@example.com','Demo','One','250');
insert.run(3, 'demo2@example.com','Grace','Sample','0');

console.log('Database initialised with demo subscibers');

module.exports = db;