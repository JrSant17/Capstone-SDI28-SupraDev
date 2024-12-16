import React from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const styles = {
  background: 'linear-gradient(45deg,rgb(119, 45, 169) 30%,rgb(105, 149, 215) 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(48, 50, 173, 0.3)',
  color: 'white',
  height: 'auto',
  padding: '0 30px',
};

const Notification = ({ project, username, submitter, submitterImg, acceptedImg, submittedUserId, acceptedUserId, }) => {

 const navigate = useNavigate();

 const navProjects = () => {
  navigate(`/projects/${project.id}`);
};

  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        {project.is_competed || project.is_accepted ? (
          <a href={`http://localhost:3000/user/${acceptedUserId}`}>
            <Avatar src={acceptedImg} alt="User Avatar" style={{ float: 'left', outlineWidth: '30px', outlineColor: 'red', width: '40px', height: '40px' }} />
          </a>
        ) : (
          <a href={`http://localhost:3000/user/${submittedUserId}`}>
            <Avatar src={submitterImg} alt="User Avatar" style={{ float: 'left', outlineWidth: '3px', outlineColor: 'red', width: '40px', height: '40px' }} />
          </a>
        )}
        <div>
          <Typography onClick={navProjects} style={styles}>
            {project.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {project.last_updated}
          </Typography>
        </div>
      </Stack>
    </Box>
  );
};

export default Notification;