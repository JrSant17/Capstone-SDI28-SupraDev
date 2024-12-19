import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, Card, Avatar } from "@mui/material";
import { useCookies } from "react-cookie";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

const UsersProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filterVar, setFilterVar] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const [sessionCookies] = useCookies([
    "username_token",
    "user_id_token",
    "userPriv_Token",
  ]);

  const maxLength = 22;

  useEffect(() => {
    fetch("http://localhost:8080/projects")
      .then((res) => res.json())
      .then((projectsData) => {
        const approvedProjects = projectsData.filter(
          (p) =>
            p.is_approved && p.submitter_id === sessionCookies.user_id_token
        );
        setProjects(projectsData);
        setFilterVar(approvedProjects);
        fetchUsers();
      })
      .catch((err) => console.log(err));
  }, [sessionCookies.user_id_token]);

  const fetchUsers = () => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((userData) => setAllUsers(userData))
      .catch((err) => console.log(err));
  };

  const findSubmitter = (assocSubId) => {
    const user = allUsers.find((u) => u.id === assocSubId);
    if (user) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={user.profile_pic}
            alt="User Avatar"
            style={{ width: 40, height: 40, marginRight: 8 }}
          />
          <span>{user.username}</span>
        </div>
      );
    }
    return null;
  };

  const findAcceptor = (assocAccId) => {
    const user = allUsers.find((u) => u.id === assocAccId);
    return user ? user.username : "Unknown";
  };

  const handleChange = async (event, newValue) => {
    setSelectedTab(newValue);

    if (newValue === 3) {
      try {
        const response = await fetch(`http://localhost:8080/user_projects?user_id=${sessionCookies.user_id_token}`);
        const userProjects = await response.json();
        const userProjectIds = userProjects.map(up => up.project_id);
        
        const filtered = projects.filter(p => 
          userProjectIds.includes(p.id) && 
          p.is_accepted && 
          p.is_approved
        );
        setFilterVar(filtered);
        return;
      } catch (err) {
        console.error("Error fetching user projects:", err);
      }
    }

    const filtered = projects.filter((p) => {
      switch (newValue) {
        case 1:
          return p.is_approved && p.submitter_id === sessionCookies.user_id_token;
        case 2:
          return (
            !p.is_completed &&
            !p.is_approved &&
            p.submitter_id === sessionCookies.user_id_token
          );
        case 3:
          return (
            p.is_accepted &&
            p.is_approved &&
            p.submitter_id === sessionCookies.user_id_token
          );
        case 4:
          return (
            p.is_completed &&
            p.is_approved &&
            p.submitter_id === sessionCookies.user_id_token
          );
        default:
          return p.is_approved && p.submitter_id === sessionCookies.user_id_token;
      }
    });

    setFilterVar(filtered);
  };
   
  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const HoverCard = styled(motion(Card))({
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
    },
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  });

  const truncateText = (text) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const cardStyle = {
    position: "relative",
    height: 200,
    width: "25%",
    margin: 8,
    padding: 8,
    textAlign: "center",
    borderRadius: "15px",
    background: "rgba(255,255,255, 0.85)",
    cursor: "pointer",
  };

  return (
    <div>
      <Box
        padding="20px"
        style={{
          margin: "25px 50px",
          backgroundColor: "rgba(255,255,255, 0.85)",
          borderRadius: "25px",
        }}
      >
        <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
          Projects
        </Typography>

        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All" />
          <Tab label="Approved" />
          <Tab label="Unapproved" />
          <Tab label="Joined" />
          <Tab label="Complete" />
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
            style={cardStyle}
            key={project.id}
            onClick={() => handleProjectClick(project.id)}
          >
            <div>
              <h2>{truncateText(project.name)}</h2>
              <h3
                style={{
                  color: project.is_completed
                    ? "green"
                    : project.is_accepted
                    ? "blue"
                    : "red",
                }}
              >
                {/* {project.is_completed
                  ? `Completed by ${findAcceptor(project.accepted_by_id)}`
                  : project.is_accepted
                  ? `Approved by ${findAcceptor(project.accepted_by_id)}`
                  : "Not Approved"} */}
              </h3>
              <p>Problem Statement: {truncateText(project.problem_statement)}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {findSubmitter(project.submitter_id)}
              <strong style={{ display: "flex", alignItems: "center" }}>
                {/* <span>Reward:</span> */}
                {/* <img
                  // src="https://github.com/jsanders36/Capstone-SDI18-SupraDev/blob/main/ui/public/supradoubloon.png?raw=true"
                  // alt="supradoubloons"
                  style={{ marginLeft: 5, height: 20, width: 20 }}
                /> */}
                {/* <span style={{ color: "blue", marginLeft: 5 }}>
                  {project.bounty_payout}
                </span> */}
              </strong>
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

UsersProjects.propTypes = {
  projects: PropTypes.array,
};

export default UsersProjects;


