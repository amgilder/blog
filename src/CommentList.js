import React from 'react';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// get postId from props
export default ({ comments }) => {
//export default ({ postId }) => {
    // create state for comments, setting to empty object initially
    // empty object used because index.js in comments service returns an object listing comments
    // const [comments, setComments] = useState({});

    // const fetchData = async () => {
    //   const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
    //
    //   setComments(res.data);
    // };
    //
    // useEffect(() => {
    //   fetchData();
    // }, []);

    // get an array of comments from the comments state variable
    // and map over each of those comments to return a list item for each
    // const renderedComments = Object.values(comments).map(comment => {
    const renderedComments = comments.map(comment => {
      let content;

      if (comment.status === 'approved') {
        content = comment.content
      } else if (comment.status === 'pending') {
        content = 'This comment is awaiting moderation';
      } else {
        content = 'This comment has been rejected';
      }
      return (
        <li key = {comment.id}>{content}</li>
      );
    });

    return <ul>
      {renderedComments}
    </ul>;
};
