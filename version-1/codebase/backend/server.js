const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const PORT = process.env.PORT || 8000;


app.use(express.json());
// allow cors
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

// calling routes
app.use('/api/auth', authRoutes);

app.listen(PORT,(err) => {
    if(err) throw err;
    else {
       console.log( `server started at port ${PORT}`);
    }
})