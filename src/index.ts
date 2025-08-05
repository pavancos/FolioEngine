import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cors from 'cors';
import User from './models/User.js';
import CraftBench from './models/CraftBench.js';
import Folio from './models/Folio.js';
dotenv.config();
const app = express();

const connectionURI = process.env.MONGODB_URI!;
mongoose.connect(connectionURI)
    .then(() => {
        console.log("Connected to MongoDB");
        
        console.log("User model:", User.modelName);
        console.log("CraftBench model:", CraftBench.modelName);
        console.log("Folio model:", Folio.modelName);
        console.log("Registered models:", mongoose.modelNames());
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });

app.use(
    cors({
        origin: [
            '*',
            'http://localhost:3000',
            'http://localhost:5000',
            'https://4cfw3zvk-8888.inc1.devtunnels.ms',
            'https://tvpdpx33-8888.inc1.devtunnels.ms',
            'https://tvpdpx33-5000.inc1.devtunnels.ms',
            'https://dth5w8dq-3000.inc1.devtunnels.ms',
            'https://mdd7t8bl-8888.inc1.devtunnels.ms',
            'https://dth5w8dq-8888.inc1.devtunnels.ms'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Origin',
            'X-Requested-With',
            'Accept',
            'x-client-key',
            'x-client-token',
            'x-client-secret',
            'Authorization',
            'token'
        ],
        credentials: true,
    })
);

app.get('/', (req, res) => {
    res.send('<h1>This is Folio Engine</h1>');
});
app.get('/hello', (req, res) => {
    res.send('<h1>This is Home</h1>');
});

import auth from './routes/auth.js';
app.use('/auth', auth);

import craftBench from './routes/craftBench.js';
app.use('/craftBench', craftBench);

import folio from './routes/folio.js';
app.use('/folio', folio);

import dbTest from './tests/dbTest.js'
app.use('/dbTest', dbTest);

app.listen(3000, () => {
    console.log("Server Started at http://localhost:3000");
})