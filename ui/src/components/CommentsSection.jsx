import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Box, Typography, List, ListItem, TextField, Button, Avatar } from '@mui/material';

const CommentsSection = ({ id}) => {
  //This is goofy, but the original code always fetchs all users and then finds the picture etc. 
  //TODO: refactor
  //This entire chat feature should really use websockets if it is serious! otherwise never real time updates.
  const [chatposts, setChatposts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [sessionCookies, setSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token', 'user_type']);
  const [userData, setUserData] = useState({});

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/projects/${id}/messages`);
      const commentData = await response.json();
      setChatposts(commentData);
      await fetchUserData(commentData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUserData = async (comments) => {
    try {

      const userIds = [...new Set(comments.map(comment => comment.user_id))];
      const usersResponse = await Promise.all(userIds.map(userId =>
        fetch(`http://localhost:8080/users/${userId}`) // Adjust this URL as needed
      ));

      const usersData = await Promise.all(usersResponse.map(res => res.json()));
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.id] = user;
      });

      setUserData(usersMap);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  const deleteComment = async (commentId) => {
    try{
      await fetch(`http://localhost:8080/projects/${id}/messages`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "project_id": id,
          "post_id": commentId,
        }),
      });
      fetchPosts();
    } catch(err) {
      console.error('Error delete comment:', err);
    }
  }

  const postComment = async () => {
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
    const currentUser = userData[userIdFromPost] || {}; // Get user data from state

    return (
      <>
        {currentUser.username || "username"} {/* Fallback if username is not set */}
        <Avatar src={currentUser.avatar_url} alt="User Avatar" style={{ float: 'left', outlineWidth: '1px', outlineColor: 'red', width: '40px', height: '40px' }} />
      </>
    );
  };


  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };


  useEffect(() => {
    fetchPosts();
  }, [id]);

  if (!userData || userData.length === 0) {
    return <div>Loading...</div>;
  } else{
    return (
      <Box marginTop="2rem">
        <Typography variant="h5">Comments</Typography>
        <List>
          {chatposts.map((comment, index) => (
            <ListItem key={index}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  {userImgRender(comment.user_id)}
                </div>
                <Typography style={{ marginLeft: '1rem' }}>{comment.post_text}</Typography>
                {comment.user_id === sessionCookies.user_id_token && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteComment(comment.id)}
                    style={{ marginLeft: '10px', width: 'auto'}}
                  >
                    Delete Comment
                    </Button>
                )}
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
          onClick={postComment}
          variant="contained"
          color="primary"
          style={{ marginTop: "1rem" }}
        >
          Add Comment
        </Button>
      </Box>
    );
  }

};

export default CommentsSection;