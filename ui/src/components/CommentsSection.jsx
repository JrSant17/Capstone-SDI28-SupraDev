import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Typography, List, ListItem, TextField, Button, Avatar } from '@mui/material';

const CommentsSection = ({ id,  userinfo }) => {
  //This is goofy, but the original code always fetchs all users and then finds the picture etc. 
  //TODO: refactor
  const [userdata, setUserdata] = useState([]);
  const [chatposts, setChatposts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [sessionCookies, setSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token', 'user_type']);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/projects/${id}/messages`);
      const commentData = await response.json();
      setChatposts(commentData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const postCommentFetch = async () => {
    try {
      await fetch(`http://localhost:8080/projects/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "project_id": parseInt(id),
          "user_id": sessionCookies.user_id_token,
          "post_text": newComment,
        }),
      });
      setNewComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const userImgRender = (userIdFromPost) => {
    let imgToRender = "";
    let idOfMatch;
    for (let element in userdata) {
      if (userdata[element].id === userIdFromPost) {
        imgToRender = userdata[element].profile_pic;
        idOfMatch = userdata[element].id;
      }
    }
    return (
      <Avatar src={imgToRender} alt="User Avatar" style={{ float: 'left', outlineWidth: '1px', outlineColor: 'red', width: '40px', height: '40px' }} />
    );
  };


  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };


  useEffect(() => {
    setUserdata(userinfo);
    fetchPosts();
  }, [id]);

  return (
    <Box marginTop="2rem">
      <Typography variant="h5">Comments</Typography>
      <List>
        {chatposts.map((comment, index) => (
          <ListItem key={index}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>{userImgRender(comment.user_id)}</div>
              <Typography style={{ marginLeft: '1rem' }}>{comment.post_text}</Typography>
            </div>
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a comment"
        value={newComment}
        onChange={handleCommentChange}
      />
      <Button
        onClick={postCommentFetch}
        variant="contained"
        color="primary"
        style={{ marginTop: "1rem" }}
      >
        Add Comment
      </Button>
    </Box>
  );
};

export default CommentsSection;