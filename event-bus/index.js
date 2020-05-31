const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// data store for historical events
const events = [];

app.post('/events', (req, res) => {
  // whatever comes in the body of the req is the event we need to pass along
  const event = req.body;

  // place current event at end of data store
  events.push(event);

  axios.post('http://posts-clusterip-srv:4000/events', event); // send to post service
  axios.post('http://comments-srv:4001/events', event); // send to comment service
  axios.post('http://query-srv:4002/events', event); // send to query servive
  axios.post('http://moderation-srv:4003/events', event); // send to moderation servive

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Listening on 4005');
});
