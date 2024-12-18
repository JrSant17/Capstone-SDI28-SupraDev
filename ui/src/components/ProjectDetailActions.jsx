import { useEffect } from "react";
import { Button, Paper, Typography, Box, Divider, TextField, List, ListItem, Avatar, } from '@mui/material';
import ProjectDetailInputs from './ProjectDetailInputs';

const ProjectDetailActions = ({ userType, projectState }) => {

  const handleComplete = () => {
    patchToComplete();
    navigate('/projects');
  }

  const thanosSnap = () => {

    fetch(`http://localhost:8080/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    navigate('/projects');
  }

  const handleApprove = () => {

    fetch(`http://localhost:8080/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_approved: true
      })
    })
    navigate('/projects');
  }

  const handleSponsor = () => {
    if (window.confirm("Are you sure you want to sponsor this Project")) {
      fetch (`http://localhost:8080/projects/${id}`, {
        method: "PATCH" , 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_approved:true,
          sponsored_by_id: sessionCookies.user_id_token
        }),
      })
      .then((response) => {
        if (response.ok) {
          alert("Project has been successfully sponsored");
          window.location.reload();
        }else{
          alert("error sponsoring project")
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error Sponsoring Project") 
      });
    }
  };


  const handleSupraJoinProject = () => {
    if (window.confirm("Are you sure you want to join this project")) {
      fetch (`http://localhost:8080/user_projects/`, {
        method: "POST",
        headers: { "Content-Type" : "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: sessionCookies.user_id_token,
          project_id: id,
        })
      })
      .then(response => {
        if(response.ok) {
          alert("Project join successfully!");
          navigate('/projects');
          window.location.reload();
        } else {
          alert("Error accepting project");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Error accepting project");
      });
    }
  }

  const handleSupraLeaveProject = () => {
    fetch(`http://localhost:8080/user_projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "user_id": sessionCookies.user_id_token,
        "project_id": id
      })
    })
    .then(response => {
      if (response.ok) {
        navigate('/projects');
        window.location.reload();
      } else {
        console.error('Failed to delete project:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error occurred while deleting project:', error);
    });
  }

  return(
    <>
      {projectState.is_approved && !projectState.isCompleted && (
        <>
          {userType === 1 && (
            <Button
              onClick={handleSupraJoinProject}
              variant="contained"
              color="success"
              style={{ margin: "5px" }}
            >
              Join this Project as a Coder
            </Button>
          )}
          {userType === 2 && (
            <Button
              onClick={handleSponsor}
              variant="contained"
              color="primary"
              style={{ margin: "5px" }}
            >
              Sponsor this Project
            </Button>
          )}
        </>
      )}
      {userType === 1 &&
        !projectState.isCompleted &&
        projectState.is_accepted && (
          <Button
            onClick={handleSupraLeaveProject}
            variant="contained"
            color="error"
            style={{ margin: "5px" }}
          >
            Drop this Project?
          </Button>
        )}
      {userType === 4 &&
        !projectState.isCompleted &&
        projectState.is_accepted && (
          <Button
            onClick={handleComplete}
            variant="contained"
            color="success"
            style={{ margin: "5px" }}
          >
            Complete the Project?
          </Button>
        )}
        {userType === 4 &&
        !projectState.isCompleted &&
        !projectState.is_accepted && (
          <Button
            onClick={handleApprove}
            variant="contained"
            color="success"
            style={{ margin: "5px" }}
          >
            Approve the Project?
          </Button>
        )}
    </>
  );

}

  export default ProjectDetailActions;