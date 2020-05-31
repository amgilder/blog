const express = require('express');
const bodyParser = require('body-parser');
const  { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {}; 

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  // generate a random 4 byte id in hex
  const commentId = randomBytes(4).toString('hex');

  // get content from body of post request
  const { content } = req.body;

  // get array of comments for the id in the request from the data store
  const comments = commentsByPostId[req.params.id] || [];

  // push the comment in the request onto that array
  comments.push({ id: commentId, content, status: 'pending' });

  // place that modified array of comments back into the data store
  commentsByPostId[req.params.id] = comments;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: 'pending'
    }
  })

  // return the status 201 to indicate resource created
  // and send back the array of comments we just placed in the data store
  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Event received', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    // get relevant values from event's data property
    const { postId, id, status, content } = data;

    // get comments related to specified post from data store
    const comments = commentsByPostId[postId];

    // find the comment being updated in those retrieved from data store
    const comment = comments.find(comment => {
      return comment.id === id;
    });

    // update the status of that comment to match the status in events
    comment.status = status;

    // emit a CommentUpdated event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content
      }
    });
  }

  res.send({});
})

app.listen(4001, () => {
  console.log('Listening on 4001');
});
