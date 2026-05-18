import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import router from './routes';

import helmet from "helmet";


const app = express();

//morgan

app.use(helmet());



// ✅ Handle preflight for ALL routes
// app.options('*', cors({
//     origin: config.allowed_origin,
//     credentials: true,
// }));

//body parser

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);

//live response
app.get('/', (req: Request, res: Response) => {
    const date = new Date(Date.now());
    res.send(
        `<h1 style="text-align:center; color:#173616; font-family:Verdana;">Beep-beep! The QURAN MAJID server is alive and kicking.</h1>
    <p style="text-align:center; color:#173616; font-family:Verdana;">${date}</p>
    `
    );
});


//handle not found route;
app.use((req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Not found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API DOESN'T EXIST",
            },
        ],
    });
});

export default app;
