const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
].map(origin => origin.trim().replace(/\/$/, "")).filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (origin) {
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma');
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    
    next();
});


const router = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes')

app.use('/api/auth', router);
app.use('/api/interview', interviewRouter);

// Health check endpoint for Uptime Robot monitoring
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is healthy and active',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

module.exports = app;
