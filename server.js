const express = require('express');
const connectDB = require('./config/db');

const app = express();

app.get('/', (req, res) => res.send('API Running Test'));

//Calling DB connection
connectDB();

//Init Middle ware

app.use(express.json({ extended: false }));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server started on Port " + PORT));
