const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

//connection data
const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'challenge',
  password: 'password',
  port: 5432,
});

//endpoint to get data about a given account
app.get('/api/data/:id', async (req, res) => {
    
  const id = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM accounts WHERE account_number = $1', [id]);
    client.release();
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//endpoint to alter the account balance of a given account id
//this funciton takes in the new balance and simply sets that account to the new 
//balance, so all the calculation is happening on the front end
app.post('/api/alterBalance', async (req, res) => {
    
    const { id, newBalance } = req.body;
    
    let result 
    try {
      const client = await pool.connect();
      
     result = await client.query('UPDATE accounts SET amount = $1 WHERE account_number = $2', [newBalance, id]);

      client.release();
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
