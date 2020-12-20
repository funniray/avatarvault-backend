import Express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import models from './models.js';

//Route Imports
import search from './routes/search.js';
import tags from './routes/tags.js';
import categories from "./routes/categories.js";
import upload from "./routes/upload.js";

//Initialization
dotenv.config();
const app = new Express();
app.models = models;
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: process.env.TEMPDIR || './tmp',
    createParentPath: true
}))
app.use(cors())

//Use routes
app.use('/v1/search',search);
app.use('/v1/tags',tags);
app.use('/v1/categories',categories);
app.use('/v1/upload',upload)

//Listen
app.listen(process.env.PORT || 3000);