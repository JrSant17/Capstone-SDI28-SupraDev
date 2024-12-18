import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, Card, Avatar } from "@mui/material";
import { useCookies } from 'react-cookie';
import { styled, useTheme } from '@mui/system';
import { motion } from 'framer-motion';

const Projects = (props) => {
  const { profile, ...other } = props;
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const maxLength = 22;
  const [filterVar, setFilterVar] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const [sessionCookies, setSessionCookies, removeSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token']);
  const [allUsers, setAllUsers] = useState([]);
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectUsernames, setProjectUsernames] = useState({});
  const [projectUsernamesMap, setProjectUsernamesMap] = useState({});
  const [isLoading, setIsLoading] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/projects")
      .then((res) => res.json())
      .then((projectsData) => {
        const approvedProjects = projectsData.filter((p) => p.is_approved);
        setProjects(projectsData);
        setFilterVar(approvedProjects);
        fetchUsers();
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:8080/users')
      .then((res) => res.json())
      .then((projectsData) => setAllUsers(projectsData));
  };

  const findSubmitter = (assocSubId) => {
    let outputUsername;
    let outputUserImg;
  
    for (let element in allUsers) {
      if (allUsers[element].id === assocSubId) {
        outputUsername = allUsers[element].username;
        outputUserImg = allUsers[element].profile_pic;
  
        return (
          <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', bottom: '0' }}>
            <Avatar
              src={outputUserImg}
              alt="User Avatar"
              style={{ outlineWidth: '1px', outlineColor: 'red', width: '40px', height: '40px' }}/>
            <span style={{ marginLeft: '8px', marginTop: 'auto', textAlign: 'left' }}>
              {outputUsername}
            </span>
          </div>
        );
      }
    }
    return null;
  };
  

  const findAcceptor = (assocAccId) => {
    let outputUsername;
    for (let element in allUsers) {
      if (allUsers[element].id === assocAccId) {
        outputUsername = allUsers[element].username;
        return outputUsername;
      }
    }
  };

  const findProjectUsers = useCallback(async (projectId) => {
    if (isLoading[projectId]) {
      return;
    }
    const cachedData = localStorage.getItem(`project_users_${projectId}`);
    if (cachedData) {
      const cached = JSON.parse(cachedData);
      if (cached.timestamp > Date.now() - 5 * 60 * 1000) {
        setProjectUsernamesMap(prev => ({
          ...prev,
          [projectId]: cached.usernames
        }));
        return;
      }
    }

    if (projectUsernamesMap[projectId]) {
      return;
    }
    try {
      setIsLoading(prev => ({ ...prev, [projectId]: true }));
        const userProjectsRes = await fetch(`http://localhost:8080/user_projects?project_id=${projectId}`);
        const userProjects = await userProjectsRes.json();
        const userIds = userProjects.map(up => up.user_id);
        const matchedUsers = allUsers.filter(user => userIds.includes(user.id));
        const usernames = matchedUsers.map(user => user.username).join(", ");
      
      
      localStorage.setItem(`project_users_${projectId}`, JSON.stringify({
        usernames: usernames || "No users",
        timestamp: Date.now()
      }));

      setProjectUsernamesMap(prev => ({
        ...prev,
        [projectId]: usernames || "No users"
      }));
    } catch (err) {
      console.error("Error fetching project users:", err);
    } finally {
      setIsLoading(prev => ({ ...prev, [projectId]: false }));
    }
  }, [allUsers]);

  useEffect(() => {
    if (!allUsers.length) {
      return;
    }
    filterVar.forEach(project => {
      findProjectUsers(project.id);
    });
  }, [filterVar, allUsers]);

  useEffect(() => {
    const refetchUserProjects = () => {
      if (!allUsers.length) return;
      
      // Clear existing cache to force refetch
      filterVar.forEach(project => {
        localStorage.removeItem(`project_users_${project.id}`);
        findProjectUsers(project.id);
      });
    };

    // Call refetch immediately
    refetchUserProjects();

    // Set up listener for when user returns to page
    window.addEventListener('focus', refetchUserProjects);
    
    return () => {
      window.removeEventListener('focus', refetchUserProjects);
    };
  }, [allUsers.length]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);

    switch (newValue) {
      case 0:
        setFilterVar(projects.filter((p) => p.is_approved));
        break;
      case 1:
        setFilterVar(projects.filter((p) => !p.is_accepted && !p.is_completed && p.is_approved));
        break;
      case 2:
        setFilterVar(projects.filter((p) => p.is_accepted && p.is_approved));
        break;
      case 3:
        setFilterVar(projects.filter((p) => p.is_completed && p.is_approved));
        break;
      case 4:
        setFilterVar(projects.filter((p) => !p.is_approved));
        break;

      default:
        setFilterVar(projects.filter((p) => p.is_approved));
        break;
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const HoverCard = styled(motion(Card))({
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    },
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  });

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }

  const cardStyle = {
    position: 'relative',
    height: 200,
    width: '25%',
    margin: 8,
    padding: 8,
    textAlign: 'center',
    borderRadius: "15px",
    background: "rgba(255,255,255, 0.85)",
    cursor: "pointer"
  };

  return (
    <div>
      <p>  </p>
      <Box
        padding="20px"
        height="90%"
        style={{
          marginTop: "25px",
          marginLeft: "50px",
          marginRight: "50px",
          marginBottom: "50px",
          backgroundColor: "rgba(255,255,255, 0.85)",
          borderRadius: "25px",
        }}>
        <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
          {" "}
          Projects{" "}
          {users.username}
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          bgcolor="primary">
          <Tab label="All Projects" />
          <Tab label="Unjoined Projects" />
          <Tab label="Joined Projects" />
          <Tab label="Completed Projects" />
         <Tab label="Pending" />
        </Tabs>

      </Box>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "20px",
        }}>
        {filterVar.map((project) => (
          <HoverCard
            style={cardStyle}
            key={project.id}
            onClick={() => handleProjectClick(project.id)}>
            <div key={project.id} style={{ textAlign: "center", marginBottom: 'auto' }}>
              <h2>{truncateText(project.name, maxLength)}</h2>
              <h3
                style={{
                  color: project.is_completed
                    ? "green"
                    : project.is_accepted
                      ? "blue"
                      : "blue",
                }}>
                 {project.is_completed
                  ? `Completed by ${projectUsernamesMap[project.id] || 'Loading...'}`
                  : projectUsernamesMap[project.id] && projectUsernamesMap[project.id] !== "No users"
                    ? `Joined by ${projectUsernamesMap[project.id]}`
                    : "No one has joined"}
              </h3>
              <p style={{ marginLeft: "4px", marginTop: 'auto', textAlign: "left" }}>
                Project Details: {truncateText(project.problem_statement, maxLength)}
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              {findSubmitter(project.submitter_id)}
              {/* <strong style={{ position: 'absolute', bottom: '0', right: '0', display: 'flex', marginRight: '8px' }}>
                <p>Reward:</p><img src='https://github.com/jsanders36/Capstone-SDI18-SupraDev/blob/main/ui/public/supradoubloon.png?raw=true' style={{ marginTop: '18px', marginLeft: '5px', marginRight: '2px' }} alt='supradoubloons' height='20px' width='20px' /><p style={{ color: 'blue' }}>{project.bounty_payout}</p>
              </strong> */}
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

Projects.propTypes = {
  projects: PropTypes.array,
  outputUsername: PropTypes.array
};

export default Projects;