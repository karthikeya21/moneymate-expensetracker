const express = require('express');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('./passport');
const dbConnect = require('./dbConnect');
const path = require('path');
const MongoStore = require('connect-mongo');

const app = express();
app.use(express.json());



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
const userRoute = require('./routes/usersRoute');
const transactionsRoute = require('./routes/transactionsRoute');
app.use('/api/users', userRoute);
app.use('/api/transactions', transactionsRoute);

// Production build serving unchanged

const port =process.env.PORT || 5000

if(process.env.NODE_ENV === 'production')
{
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}



app.listen(port, () => console.log(`Node JS Server started at port ${port}!`))