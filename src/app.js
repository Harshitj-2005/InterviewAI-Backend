const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true
// }))

// const allowedOrigins = [
//     "http://localhost:5173",
//     process.env.FRONTEND_URL
// ];

// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://harshit-jain-mern-ai.vercel.app"
//   ],
//   credentials: true
// }));
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

if (!process.env.FRONTEND_URL) {
    console.warn('FRONTEND_URL is not set. Only localhost will be allowed by CORS.');
}

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true
}));


const router = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes')

app.use('/api/auth', router);
app.use('/api/interview', interviewRouter);

module.exports = app;
