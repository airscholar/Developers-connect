const express = require('express');
const connectDB = require('./config/db');

// routes import
const usersRouter = require('./routes/api/v1/user');
const profilesRouter = require('./routes/api/v1/profile');
const authRouter = require('./routes/api/v1/auth');
const postsRouter = require('./routes/api/v1/post');

const app = express();

connectDB();

//init middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 6000;

app.get('/', (req, res) => {
  res.send('Server up and running');
});

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/auth', authRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
