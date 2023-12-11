const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const bucketName = process.env.BUCKET_NAME;

const storage = new Storage();
const bucket = storage.bucket(`${bucketName}`);

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const dbConnection = mysql.createConnection(dbConfig);

app.post('/api/send-rempah/:gambarFileName', async (req, res) => {
    try {
        const { namaFile, data, harga, noWa, deskripsi, lokasi } = req.body;
        const gambarBuffer = req.file.buffer;

        // Simpan gambar di Cloud Storage
        const gambarFilename = uuidv4();
        const file = bucket.file(gambarFilename);
        await file.save(gambarBuffer);

        // Simpan informasi rempah ke dalam database MySQL di Cloud SQL
        const sql = `
            INSERT INTO rempah (gambar, nama, data, harga, noWa, deskripsi, lokasi)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        dbConnection.query(sql, [gambarFilename, namaFile, data, harga, noWa, deskripsi, lokasi], (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Terjadi kesalahan' });
            } else {
                res.json({ status: 'Data rempah berhasil dikirim' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
});

app.get('/api/get-rempah-img/:namaFile', async (req, res) => {
    try {
        const { namaFile } = req.params;

        // Ambil data dari Cloud Storage atau sumber data lainnya
        const dataRempah = {
            gambar: `https://storage.googleapis.com/${bucketName}/${namaFile}`,
            nama: '-',
            harga: '-',
            noWa: '--',
            deskripsi: '-',
            lokasi: '-',
        };
        res.json(dataRempah);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan' });
    }
    
});

app.get('/api/get-rempah', (req, res) => {
    const sql = 'SELECT * FROM rempah';

    dbConnection.query(sql, (error, results) => {
        if (error) {
            console.error('Gagal mengambil data dari MySQL:', error);
            res.status(500).json({ error: 'Terjadi kesalahan' });
        } else {
            console.log('Data rempah berhasil diambil dari MySQL');
            res.json(results);
        }
    });
});

app.get('/getData', (req, res) => {
    const query = 'SELECT * FROM rempah';
  
    // Menjalankan query
    dbConnection.query(query, (err, results) => {
      if (err) {
        console.error('Kesalahan query MySQL:', err.stack);
        res.status(500).send('Kesalahan server');
        return;
      }
  
      // Mengirim hasil query sebagai respons
      res.json(results);
    });
  });

const text = process.env.TEXT;

app.get('/', (req, res) => {
    res.send(text);
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});


