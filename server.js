const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routing files
const index = require('./server/routes/app');
const messageRoutes = require('./server/routes/messages');
const contactRoutes = require('./server/routes/contacts');
const documentRoutes = require('./server/routes/documents');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));

// API routes
app.use('/', index);
app.use('/messages', messageRoutes);
app.use('/contacts', contactRoutes);
app.use('/documents', documentRoutes);

// Serve static files from Angular build
app.use(express.static(path.join(__dirname, 'dist/cms/browser')));

// Catch-all: serve index.html for Angular routes (Express 5 requires named wildcard)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cms/browser/index.html'));
});

// Establish connection to the mongo database
mongoose
  .connect('mongodb://localhost:27017/cms')
  .then(() => {
    console.log('Connected to database!');
    app.listen(PORT, () => {
      console.log('API running on localhost:' + PORT);
    });
  })
  .catch((err) => {
    console.log('Connection failed: ' + err);
  });
