import express from 'express';
import path from 'path';
import fs from 'fs';
import {MongoClient} from 'mongodb';
import {fileURLToPath} from 'url';
import multer from 'multer';

const app = express()
const port = 8000
const upload = multer({dest: 'posters/'})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../build')));

app.use(express.static(path.join(__dirname, '../posters')));

app.get(/^(?!\/api).+/, (req,res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
});

app.get('/api/movies', async (req,res) =>{

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('movie-data');

    const movieData = await db.collection('movies').find({}).toArray();
    console.log(movieData);
    res.json(movieData);

})

app.post('/api/removeMovie', async (req, res) => {

    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();
 
    const db = client.db('movie-data');
    const result = await db.collection('movies').deleteOne({title: req.body.title})

    res.send("Good!");

 })

app.post('/api/review', upload.single('movie_poster'), async (req,res) => {
    const client = new MongoClient('mongodb://127.0.0.1:27017');
    await client.connect();

    const db = client.db('movie-data');

    const insertOperation = await db.collection('movies').insertOne({
    "title":req.body.title, 
    "release": req.body.release, 
    "actors": req.body.actors, 
    "rating": req.body.rating, 
    "image": req.file.filename});

    console.log(insertOperation);
    res.redirect('/');
})

app.listen(port, () =>{
    console.log(`App is listening to ${port}`)
})