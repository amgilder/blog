const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// No longer used or needed
app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  // generate a random 4 byte id in hex
  const id = randomBytes(4).toString('hex');

  // get title from body of post request
  const { title } = req.body;

  // store id and title into our in-memory data store
  posts[id] = {
    id, title
  };

  // Post the an event indicating this change
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id, title
    }
  });

  // return the status 201 to indicate resource created
  // and send back the object we just placed in the data store
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);

  res.send({});
})

app.listen(4000, () => {
  console.log('v55');
  console.log('Listening on 4000');
});
