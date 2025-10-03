import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(cors());

const connection = await mysql.createConnection({
    host: 'database',
    user: 'root',
    password: 'root',
    database: 'meteo'
});

app.get('/', async (req, res) => {
    res.json({ "Bienvenue": "API Meteo" });
});

// Stations
app.post('/station', async (req, res) => {
    const measure = req.body;

    await connection.query(
        'INSERT INTO stations (name, longitude, lattitude) VALUES (?, ?, ?)',
        [req.body.name, req.body.longitude, req.body.lattitude]
    );

    res.json(
        measure
    );
})

app.get('/stations', async (req, res) => {
    const [results] = await connection.query('SELECT * FROM stations');

    res.json({
        stations: results,
        total: results.length
    });
});

app.get('/station/:id', async (req, res) => {
    const [result] = await connection.query(
        'SELECT * FROM stations WHERE id = ?',
        [req.params.id]
    );

    res.json(result[0]);
});

app.delete('/station/:stationId', async (req, res) => {
    const [result] = await connection.query(
        'DELETE FROM stations WHERE id = ?',
        [req.params.stationId]
    );

    res.json(result);
});

// Measures
app.post('/measure', async (req, res) => {
    const measure = req.body;

    await connection.query(
        'INSERT INTO measures (temperature, humidity, brightness, station_id) VALUES (?, ?, ?, ?)',
        [req.body.temperature, req.body.humidity, req.body.brightness, req.body.stationId]
    );

    res.json(measure);
});

app.get('/measures', async (req, res) => {
    const [results] = await connection.query('SELECT * FROM measures');

    res.json({
        measures: results,
        total: results.length
    });
});

app.get('/measures/station/:stationId', async (req, res) => {
    const [results] = await connection.query(
        'SELECT * FROM measures WHERE station_id = ?',
        [req.params.stationId]
    );

    res.json({
        measures: results,
        total: results.length
    });
});

app.listen(3000, () => {
    console.log('API ready !');
});
