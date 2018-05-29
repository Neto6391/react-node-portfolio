const express = require('express');
const mongoose = require('mongoose');

//Import routes of api
const { users, profile, posts } = require('./routes/api/index');

const app = express();

//Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//DB Config
const db = require('./config/keys').mongoURI;

// Connect to DB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Conectado'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World'));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on Port ${port}`));