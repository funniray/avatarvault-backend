import Express from 'express';
import dotenv from 'dotenv';
import models from './models.js';

//Route Imports
import search from './routes/search.js';
import tags from './routes/tags.js';
import categories from "./routes/categories.js";

//Initialization
dotenv.config();
const app = new Express();
app.models = models;
app.use(Express.json());
app.use(Express.urlencoded({extended:true}));

//Use routes
app.use('/v1/search',search);
app.use('/v1/tags',tags);
app.use('/v1/categories',categories);

//Listen
app.listen(process.env.PORT || 3000);