import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MessageChatSquareIcon from '../assets/svg/message-chat-square.js';
import DotsHorizontalIcon from '../assets/svg/dots-horizontal.js';
import UserPlus02Icon from '../assets/svg/user-plus-02.js';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { socialApi } from '../social/index.js';
import { useMounted } from '../hooks/use-mounted';
import { SocialConnections } from '../social/social-connections';
import { SocialTimeline } from '../social/social-timeline';
import Projects from './Projects.js'

const tabs = [
  { label: 'Timeline', value: 'timeline' },
  { label: 'Connections', value: 'connections' }
];

const usePosts = () => {
  const isMounted = useMounted();
  const [posts, setPosts] = useState([]);

  const handlePostsGet = useCallback(async () => {
    try {
      const response = await socialApi.getPosts();

      if (isMounted()) {
        setPosts(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      handlePostsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return posts;
};

const useUsers = (search = '') => {
  const [users, setUsers] = useState([]);
  const isMounted = useMounted();

  const handleUsersGet = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/users');

      if (isMounted()) {
        const userData = await response.json();
        setUsers(userData);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    handleUsersGet();
  }, [handleUsersGet]);

  return users.filter((connection) => {
        return connection.first_name?.toLowerCase().includes(search);
      });

};


const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const isMounted = useMounted();


  const handleProjectsGet = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/projects');

      if (isMounted()) {
        setProjects(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      handleProjectsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return projects;
};

const OtherUser = () => {
  const { id } = useParams(); // Get the user ID from the URL params
  const isMounted = useMounted();
  const [profile, setProfile] = useState(null);
  const [currentTab, setCurrentTab] = useState('timeline');
  const [status, setStatus] = useState('not_connected');
  const [userObj, setUserObj] = useState([])
  const posts = usePosts();
  const projects = useProjects();
  const [usersQuery, setUsersQuery] = useState('');
  const users = useUsers(usersQuery);

  const userRefetch = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}`);
      const fetchData = await response.json();
      setUserObj(fetchData[0]);
    } catch (err) {
      console.error(err);
    }
  }, [id]);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await socialApi.getProfile(id);
        if (isMounted()) {
          setProfile(response);
        }
      } catch (err) {
        console.error(err);
      }
    };
    userRefetch();
    fetchUserProfile();
  }, [id, isMounted, userRefetch]);
  

  const handleConnect = async () => {
    try {
      const response = await socialApi.connectWithUser(id);

      if (response.status === 200) {
        setStatus('pending');
      } else {
        setStatus('pending2')
        console.error('Failed to connect with the user');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const handleUsersQueryChange = useCallback((event) => {
    setUsersQuery(event.target.value);
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: 'white',
        flexGrow: 20,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
          sx={{ mt: 5 }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Avatar
              src={userObj.profile_pic}
              alt={profile.avatar}
              sx={{
                height: 100,
                width: 100,
              }}
            />
            <div>
              <Typography
                color="text.secondary"
                variant="overline"
              >
                {userObj.job_title}
              </Typography>
              <Typography variant="h4">
                {userObj.first_name} {userObj.last_name}
              </Typography>
            </div>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{
              display: {
                md: 'block',
                xs: 'none',
              },
            }}
          >
            {status === 'not_connected' && (
              <Button
                size="small"
                startIcon={
                  <SvgIcon>
                    <UserPlus02Icon />
                  </SvgIcon>
                }
                variant="contained"
                onClick={handleConnect}
              >
                Connect
              </Button>
            )}
            <Button
              size="small"
              startIcon={
                <SvgIcon>
                  <MessageChatSquareIcon />
                </SvgIcon>
              }
              variant="contained"
            >
              Chat
            </Button>
          </Stack>
          <Tooltip title="More options">
            <IconButton>
              <SvgIcon>
                <DotsHorizontalIcon />
              </SvgIcon>
            </IconButton>
          </Tooltip>
        </Stack>
        <Tabs
          indicatorColor="primary"
          onChange={handleTabsChange}
          scrollButtons="auto"
          sx={{ mt: 5 }}
          textColor="primary"
          value={currentTab}
          variant="scrollable"
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
            />
          ))}
        </Tabs>
        <Divider />
        <Box sx={{ mt: 2 }}>
          {currentTab === 'timeline' && (
            <SocialTimeline
              posts={posts}
              profile={profile}
            />
          )}
          {currentTab === 'projects' && (
            <Projects
              projects={projects}
            />
          )}
          {currentTab === 'connections' && (
            <SocialConnections
              connections={users}
              onQueryChange={handleUsersQueryChange}
              query={usersQuery}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};


export default OtherUser;
