const express = require('express')
const pg = require('pg');

const { Client } = pg
const client = new Client({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'b32',
})

app.get('/', (req, res) => {
    res.send(' Acme Ice Cream Shop Flavors')
});

app.get('/api/icecream/flavors', async (req, res) => {
    const data = await client.query('SELECT * FROM icecream');
    res.json(data.rows);
    console.log(data.rows)
});

app.post('/api/icecream/flavors', async (req, res) => {
    const { flavor, is_favorite, created_at, updated_at } = req.body;
    const query = `INSERT INTO icecream (flavor, is_favorite, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())`;
    await client.query(query, [flavor, is_favorite, created_at, updated_at])
    res.json('success');
});


app.put('/api/icecream/flavors/:id', async (req, res) => {
    const { flavor, is_favorite, created_at, updated_at } = req.body;

    try {
        await client.query(
            'UPDATE icecream SET is_favorite = $1, created_at = $2, updated_at = $3 WHERE flavor = $4',
            [is_favorite, created_at, updated_at, flavor]
        );
        res.json('success');
    } catch (err) {
        console.log(err);
        res.status(500).json('error updating flavor');
    }
});

app.delete('/api/icecream/flavors/:id', async (req, res) => {
    const { flavor } = req.body;

    try {
        await client.query('DELETE FROM icecream WHERE flavor = $1', [flavor]);
        res.json('flavor deleted successfully');
    } catch (err) {
        console.log(err);
        res.status(500).json('error deleting flavor');
    }
});

app.listen(port, async () => {
    await client.connect()
    console.log(`Example app listening on port ${port}`)
})


const app = express()
const port = 3000
app.use(express.json());