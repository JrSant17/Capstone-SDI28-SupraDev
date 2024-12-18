import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { useCookies } from 'react-cookie';
import CommentsSection from '../components/CommentsSection';
import ProjectDetailActions from '../components/ProjectDetailActions';
import ProjectDetailHeader from '../components/ProjectDetailHeader';
import './ProjectDetailsPage.css'

const ProjectDetailsPage = () => {
  const [project, setproject] = useState(null);
  const { id } = useParams();
  const [sessionCookies, setSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token', 'user_type']);
  const [userdata, setUserdata] = useState([]);
  const projectSubmitter = userdata.find((user) => user.id === project?.submitter_id);

  const InfoItem = ({ label, value }) => (
    <Typography variant="h6" style={{ fontWeight: "500", color: "#616161" }}>
      {label}: {value || "Not available"}
    </Typography>
  );

  const fetchUsers = async () => {
    await fetch(`http://localhost:8080/users`)
        .then((res) => res.json())
        .then((fetchedUserData) => setUserdata(fetchedUserData));
  };

  useEffect(() => {
    fetch(`http://localhost:8080/projects/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setproject(data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the project:", error);
      });

      fetchUsers();
  }, []);

  if (!project) {
    return <Typography align="center" style={{ marginTop: '2rem' }}>Loading...</Typography>;
  }

  const renderProjectDetails = () => (
    <div>
      <Typography variant="h6" style={{ fontWeight: "500", color: "#616161" }}>
        Project Details:
      </Typography>
      <div className="image-container">
        {project.url ? (
          <img className="project-image" src={project.url} alt="Project Image" />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <Typography
        paragraph
        style={{
          fontSize: "1rem",
          marginTop: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {project.problem_statement}
      </Typography>
      <InfoItem label="Project Submitter Name" value={`${projectSubmitter?.first_name || 'Unknown'} ${projectSubmitter?.last_name || ''}`} />
      <InfoItem label="Project Submitter Username" value={projectSubmitter?.username} />
      <InfoItem label="Contact Info" value={projectSubmitter?.email} />
      <InfoItem label="Github Link" value={project.github_url} />
      <InfoItem label="SupraCoders Needed" value={project.coders_needed ?? "Loading..."} />
      <InfoItem label="Tech Stack" value={project.program_languages} />
      <InfoItem label="Need By Date" value={project.end_date} />
      <InfoItem label="Funding Source" value={project.funding_department} />
      <InfoItem label="Funding Source Details" value={project.funding_source} />
      <InfoItem label="Requirements" value={project.requirements} />
      <InfoItem label="Last Updated" value={project.last_updated} />
    </div>
  );


  return (
<Box display="flex" justifyContent="center" minHeight="100vh" bgcolor="rgba(255, 255, 255, 0)" flexDirection="column">
      <Paper
        elevation={5}
        style={{
          borderRadius: "25px",
          background: "rgba(255,255,255, 0.85)",
          padding: "40px",
          marginTop: "25px",
          maxWidth: "800px",
          width: "100%",
          overflow: "auto",
          marginBottom: "50px",
          flexDirection: "column"
        }}
      >
        <ProjectDetailHeader projectName={project.name} projectId={id}/>
        <ProjectDetailActions 
          userType={sessionCookies.user_type} 
          projectState={project} 
        />

        <Divider style={{ marginBottom: "1.5rem" }} />
        
        {renderProjectDetails(project)}
        <CommentsSection id={id}/>
      </Paper>
    </Box>
  );

};

export default ProjectDetailsPage;