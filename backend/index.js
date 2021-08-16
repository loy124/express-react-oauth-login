const express = require('express');
const morgan = require('morgan');
const PORT = 8000;
const app = express();
const routes = require('./routes');
const cookieParser  = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin:true,
    credentials:true
}));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(routes);


app.listen(PORT, () => console.log(`this server listening on ${PORT}`))

