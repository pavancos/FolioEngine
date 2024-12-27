import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(
    cors({
        origin: [
            '*',
            'http://localhost:3000',
            'http://localhost:5000',
            'https://4cfw3zvk-8888.inc1.devtunnels.ms',
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


app.listen(5000, () => {
    console.log("Server Started at http://localhost:5000");
})