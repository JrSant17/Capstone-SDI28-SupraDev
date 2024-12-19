import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, FormControl, Chip, InputLabel, Select, MenuItem } from '@mui/material';

const ProjectDetailActions = ({ userType, projectState }) => {

  const [sessionCookies] = useCookies(["username_token", "user_id_token", "userPriv_Token", "user_type"]);
  const [userProjects, setUserProjects] =  useState([]);
  const [isMemberOfProject, setIsMemberOfProject] =  useState(false);
  const navigate = useNavigate();

  const handleComplete = () => {
    // patchToComplete();
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

    fetch(`http://localhost:8080/projects/${projectState.id}`, {
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
    if (userType === 1 || userType === 3 || userType === 4) {
      alert("Only leaders can fund projects");
      return;
    }
    if (window.confirm("Are you sure you want to sponsor this Project")) {
      fetch (`http://localhost:8080/projects/${id}`, {
        method: "PATCH" , 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_accepted:true,
          accepted_by_id: sessionCookies.user_id_token,
          funding_poc: sessionCookies.user_id_token
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

  const handleUnsponsor = async () => {
    if (window.confirm("Are you sure you want to unsponsor this Project?")) {
      try {
        const response = await fetch(`http://localhost:8080/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            funding_poc: null,
            accepted_by_id: null,
            is_accepted: false
           }),
        });

        if (response.ok) {
          alert("Project has been successfully unsponsored");
          window.location.reload();
        } else {
          alert("Error unsponsoring project");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error Unsponsoring Project");
      }
    }
  };


  const handleSupraJoinProject = async () => {
    if (sessionCookies.user_type !== 1 || !projectState.is_approved) {
      alert("Cannot join project at this time");
      return;
    }
  
    if (!window.confirm("Are you sure you want to join this project")) {
      return;
    }
  
    if (!isMemberOfProject) {
      const updatedCodersNeeded = projectState.coders_needed - 1;
      if (updatedCodersNeeded < 0) {
        alert("This project has met its SupraCoder requirement");
        return;
      }
  
      try {
        const projectResponse = await fetch(`http://localhost:8080/projects/${projectState.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coders_needed: updatedCodersNeeded,
          }),
        });
  
        if (!projectResponse.ok) {
          throw new Error(`HTTP error! status: ${projectResponse.status}`);
        }
  
        const userProjectResponse = await fetch(`http://localhost:8080/user_projects/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            user_id: sessionCookies.user_id_token,
            project_id: projectState.id,
          })
        });
  
        if (!userProjectResponse.ok) {
          throw new Error(`HTTP error! status: ${userProjectResponse.status}`);
        }
  
        alert("Project joined successfully!");
        navigate('/projects');
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        alert("Error joining project");
      }
    }
  }

  const handleSupraLeaveProject = async () => {
    const updatedCodersNeeded = projectState.coders_needed + 1;
    const projectResponse = await fetch(`http://localhost:8080/projects/${projectState.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        coders_needed: updatedCodersNeeded,
      }),
    });

    if (!projectResponse.ok) throw new Error("Failed to update project");

    fetch(`http://localhost:8080/user_projects`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "user_id": sessionCookies.user_id_token,
        "project_id": projectState.id
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

  useEffect(() => {
    const fetchUserProjects = async () => {
      console.log(`requesting for userid: ${sessionCookies.user_id_token}`);
      try {
        const response = await fetch(`http://localhost:8080/user_projects?user_id=${sessionCookies.user_id_token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        setUserProjects(data);
  
        let is_in_project = false;
        for (const project of data) {
          console.log(`project id: ${project.id} and target id: ${projectState.id}`);
          if (project.project_id === projectState.id) {
            is_in_project = true;
            break;
          }
        }
        setIsMemberOfProject(is_in_project);
        console.log(`user is member? ${isMemberOfProject}`);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchUserProjects();
  }, [sessionCookies.user_id_token, projectState.id]);

  return(
    <>
      {projectState.is_approved && !projectState.isCompleted && (
        <>
          {userType === 1 && projectState.coders_needed > 0 && !isMemberOfProject &&(
            <Button
              onClick={handleSupraJoinProject}
              variant="contained"
              color="success"
              style={{ margin: "5px" }}
            >
              Join this Project as a Coder
            </Button>
          )}
          {userType === 2 && projectState.coders_needed === 0 && (
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
        projectState.is_approved && isMemberOfProject === true &&(
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
        projectState.is_approved && (
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
        !projectState.is_approved && (
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