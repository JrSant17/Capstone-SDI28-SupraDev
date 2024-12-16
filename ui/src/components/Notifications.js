import React from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Notification = ({ project, username, submitterImg, acceptedImg, submittedUserId, acceptedUserId }) => {
  const navigate = useNavigate();

  const navProjects = () => {
    navigate(`/projects/${project.id}`);
  };

  const userBoxStyles = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '8px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      cursor: 'pointer',
    },
  };

  const avatarStyles = {
    width: '40px',
    height: '40px',
    border: '2px solid red',
    marginRight: '12px',
  };

  const projectNameStyles = {
    background: 'linear-gradient(45deg, rgb(119, 45, 169) 30%, rgb(105, 149, 215) 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(48, 50, 173, 0.3)',
    color: 'white',
    padding: '5px 15px',
    cursor: 'pointer',
  };

  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Stack alignItems="center" direction="row" spacing={2}>
        <Box sx={userBoxStyles}>
          <a href={`http://localhost:3000/user/${project.is_competed || project.is_accepted ? acceptedUserId : submittedUserId}`}>
            <Avatar
              src={project.is_competed || project.is_accepted ? acceptedImg : submitterImg}
              alt="User Avatar"
              sx={avatarStyles}
            />
          </a>
          <Typography>{username}</Typography>
        </Box>
        <Box>
          <Typography onClick={navProjects} sx={projectNameStyles}>
            {project.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {project.last_updated}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default Notification;