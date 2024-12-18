import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, Card, Avatar } from "@mui/material";
import { useCookies } from 'react-cookie';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const MyProjects = (props) => {

  const { profile, ...other } = props;
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("")
  const maxLength = 22;
  const [filterVar, setFilterVar] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const [sessionCookies, setSessionCookies, removeSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token']);
  const [allUsers, setAllUsers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch("http://localhost:8080/projects")
      .then((res) => res.json())
      .then((projectsData) => {
        console.log('id from mybounties:', id)
        const approvedProjects = projectsData.filter((p) => p.accepted_by_id === parseInt(id));
        setProjects(projectsData);
        setFilterVar(approvedProjects);
      })
      .catch((err) => console.log(err));
      fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:8080/users')
      .then((res) => res.json())
      .then((projectsData) => setAllUsers(projectsData))
  }

  const findSubmitter = (assocSubId) => {
    let outputUsername;
    let outputUserImg;
    for (let element in allUsers) {
      if (allUsers[element].id === assocSubId) {
        outputUsername = allUsers[element].username;
        outputUserImg = allUsers[element].profile_pic;
        return (
          <div style={{ display: 'flex', position: 'absolute', bottom: '0' }}>
            <p style={{ marginBottom: 'auto', textAlign: 'left' }}><Avatar src={outputUserImg} alt="User Avatar" style={{ float: 'left', outlineWidth: '1px', outlineColor: 'red', width: '40px', height: '40px' }} /></p>
            <p style={{ marginLeft: '5px', marginTop: '22px' }}>{outputUsername}</p>
          </div>
        )
      }
    }
  }

  const findAcceptor = (assocAccId) => {
    let outputUsername;
    for (let element in allUsers) {
      if (allUsers[element].id === assocAccId) {
        outputUsername = allUsers[element].username;
        return (
          outputUsername
        )
      }
    }
  }

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);

    switch (newValue) {
      case 0:
        setFilterVar(projects.filter((p) => p.accepted_by_id === parseInt(id)));
        break;
      case 1:
        setFilterVar(projects.filter((p) => !p.is_completed && p.is_accepted && p.is_approved && p.accepted_by_id === parseInt(id)));
        break;
      case 2:
        setFilterVar(projects.filter((p) => p.is_completed && p.is_approved && p.accepted_by_id === parseInt(id)));
        break;
      default:
        setFilterVar(projects.filter((p) => p.accepted_by_id === parseInt(id)));
        break;
    }
  };

  const handleProjectClick = (projectId) => {
    // Navigate to the detailed summary page for the clicked project
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
          <Tab bgcolor="blue" label="All" />
          <Tab label="Accepted" />
          <Tab label="Complete" />
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
            <div key={project.id} style={{ textAlign: "center", marginBottom:'auto' }}>
              <h2>{truncateText(project.name, maxLength)}</h2>
              <h3
                style={{
                  color: project.is_completed
                    ? "green"
                    : project.is_accepted
                      ? "blue"
                      : "red",
                }}>
                {project.is_completed
                  ? `Completed by ${findAcceptor(project.accepted_by_id)}`
                  : project.is_accepted
                    ? `Accepted by ${findAcceptor(project.accepted_by_id)}`
                    : "Not Accepted"}
              </h3>


              <p style={{ marginLeft: "4px", marginTop: 'auto', textAlign: "left" }}>
                Project Details: {truncateText(project.problem_statement, maxLength)}
              </p>
            </div>
            <div style={{display: 'flex'}}>
              {findSubmitter(project.submitter_id)}
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

MyProjects.propTypes = {
  projects: PropTypes.array,
  outputUsername: PropTypes.array
};

export default MyProjects;
