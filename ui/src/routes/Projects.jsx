import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, Card, Avatar } from "@mui/material";
import { useCookies } from 'react-cookie';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Projects = (props) => {
  const { profile, ...other } = props;
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const maxLength = 50;
  const [filterVar, setFilterVar] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const [sessionCookies, setSessionCookies, removeSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token', 'user_type']);
  const [allUsers, setAllUsers] = useState([]);
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
    if (!allUsers.length || !sessionCookies.user_id_token || sessionCookies.user_id_token === '') {
      console.log(`User not logged in or no users loaded`);
      return;
    }
  
    console.log(`Proceeding with findProjectUsers for ${filterVar.length} projects`);
    filterVar.forEach(project => {
      findProjectUsers(project.id);
    });
  }, [filterVar, sessionCookies.user_id_token]);

  // useEffect(() => {
  //   //TODO: Critical error, 
  //   const refetchUserProjects = () => {
  //     if (!allUsers.length) return;
      
  //     filterVar.forEach(project => {
  //       localStorage.removeItem(`project_users_${project.id}`);
  //       findProjectUsers(project.id);
  //     });
  //   };

  //   refetchUserProjects();
  //   window.addEventListener('focus', refetchUserProjects);
    
  //   return () => {
  //     window.removeEventListener('focus', refetchUserProjects);
  //   };
  // }, [allUsers.length]);

    const handleChange = async (event, newValue) => {
      setSelectedTab(newValue);
  
      switch (newValue) {
        case 0:
          setFilterVar(projects.filter((p) => p.is_approved));
          break;
        case 2: {
          // Get projects with users
          const projectsWithUsers = await Promise.all(
            projects.filter(p => p.is_approved).map(async (project) => {
              const response = await fetch(`http://localhost:8080/user_projects?project_id=${project.id}`);
              const userProjects = await response.json();
              return { ...project, hasUsers: userProjects.length > 0 };
            })
          );
          setFilterVar(projectsWithUsers.filter(p => p.hasUsers));
          break;
        }
        case 1: {
          // Get projects without users
          const projectsWithoutUsers = await Promise.all(
            projects.filter(p => p.is_approved).map(async (project) => {
              const response = await fetch(`http://localhost:8080/user_projects?project_id=${project.id}`);
              const userProjects = await response.json();
              return { ...project, hasUsers: userProjects.length > 0 };
            })
          );
          setFilterVar(projectsWithoutUsers.filter(p => !p.hasUsers));
          break;
        }
        case 3:
          setFilterVar(projects.filter((p) => p.is_completed === true));
          break;

        default:
          setFilterVar(projects.filter((p) => !p.is_approved));
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
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'space-between', 
  });

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  }
  
  const cardStyle = {
    position: 'relative',
    height: 300,
    width: '300px',
    margin: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'center',
    borderRadius: '15px',
    background: 'rgba(255,255,255, 0.85)',
  };

  return (
    <div>
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
    }}
  >
    <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
      Projects {users.username}
    </Typography>

    <Tabs
      value={selectedTab}
      onChange={handleChange}
      variant="fullWidth"
      indicatorColor="primary"
      textColor="primary"
      bgcolor="primary"
    >
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
    }}
  >
    {filterVar.map((project) => (
      <HoverCard
        style={{
          ...cardStyle,
          background: "rgba(255,255,255, 0.85)", // Keeping background consistent
        }}
        key={project.id}
        onClick={() => handleProjectClick(project.id)}
      >
        {project.url ? (
          <img
            className="project-image"
            src={project.url}
            alt="Project Image"
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          />
        ) : (
          <Typography
            variant="body2"
            style={{
              color: "#888",
              marginBottom: "12px",
            }}
          >
            No image available
          </Typography>
        )}

        <div style={{ textAlign: "center", marginBottom: "auto" }}>
          <h2>{truncateText(project.name, maxLength)}</h2>
          <h3
            style={{
              color: project.is_completed
                ? "green"
                : project.is_accepted
                ? "blue"
                : "blue",
            }}
          >
            {project.is_completed
              ? `Completed by ${
                  projectUsernamesMap[project.id] || "Loading..."
                }`
              : projectUsernamesMap[project.id] &&
                projectUsernamesMap[project.id] !== "No users"
              ? `Joined by ${projectUsernamesMap[project.id]}`
              : "No one has joined"}
          </h3>
          <p
            style={{
              marginLeft: "4px",
              marginTop: "auto",
              textAlign: "left",
            }}
          >
            {/* Project Details: {truncateText(project.problem_statement, maxLength)} */}
          </p>
        </div>
        <div style={{ display: "flex" }}>
          {findSubmitter(project.submitter_id)}
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