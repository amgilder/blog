import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default () => {
  // create state for posts, setting to empty object initially
  // empty object used because index.js in posts service returns an object listing posts
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get('https://posts.com:4002/posts');

    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // get an array of posts from the posts state variable
  // and map over each of those posts to return a card div for each
  const renderedPosts = Object.values(posts).map(post => {
    return (
      <div className="card"
           style={{ width: '30%', marginBottom: '20px' }}
           key={post.id}>
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList comments={post.comments} />
          <CommentCreate postId={post.id} />
        </div>
      </div>
    );
  });

  return <div className="d-flex flex-row flex-wrap justify-content-between">
    {renderedPosts}
  </div>;
}
