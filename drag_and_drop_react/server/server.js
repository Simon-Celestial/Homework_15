const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 5000;

// Middleware to parse request body
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.post('/save', async (req, res) => {
    const {filename, content} = req.body;

    if (!filename || !content) {
        return res.status(400).send('Filename and content are required.');
    }

    const filePath = path.join(__dirname, filename);

    try {
        await fs.writeFile(filePath, content);
        res.send('File saved successfully');
    } catch (error) {
        console.error('Error writing to file', error);
        res.status(500).send('An error occurred while saving the file.');
    }
});
app.get('/getDB', async (req, res) => {
    const result = await fs.open(path.join(__dirname, 'db.json'));
    const bufferPromise = await result.readFile();
    const string = bufferPromise.toString('utf-8'); // Convert buffer to string using utf-8 encoding
    console.log(string);
    res.status(200).send(string);
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
