import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Typography, Box, Divider, TextField, List, ListItem, Avatar, } from '@mui/material';
import { useCookies } from 'react-cookie';
import './ProjectDetailsPage.css'

const ProjectDetailsPage = () => {
  const [project, setproject] = useState(null);
  const { id } = useParams();
  const [doubloons, setDoubloons] = useState("");
  const [gitlink, setGitlink] = useState("");
  const [sessionCookies, setSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token', 'user_type']);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [chatposts, setChatposts] = useState([]);
  const [userdata, setUserdata] = useState([]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prevComments) => [...prevComments, newComment]);
      setNewComment("");
    }
  };
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const fetchUsers = async () => {
    await fetch(`http://localhost:8080/users`)
        .then((res) => res.json())
        .then((fetchedUserData) => setUserdata(fetchedUserData));
  };

  const userImgRender = (userIdFromPost) => {
    let imgToRender ="";
    let idOfMatch;
    for (let element in userdata) {     
      if (userdata[element].id == userIdFromPost) {
        imgToRender = userdata[element].profile_pic;
        idOfMatch = userdata[element].id;
      }
    }
    return (
        <div>
            <Avatar src={imgToRender} alt="User Avatar" style={{ float: 'left', outlineWidth: '1px', outlineColor: 'red', width: '40px', height: '40px' }}/>
        </div>
    )
  }

  const fetchPosts = async () => {
    await fetch(`http://localhost:8080/projects/${id}/messages`)
        .then((res) => res.json())
        .then((commentData) => setChatposts(commentData));
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
      fetchPosts();
      fetchUsers();
  }, []);

  if (!project) {
    return <Typography align="center" style={{ marginTop: '2rem' }}>Loading...</Typography>;
  }

  const handleApprove = () => {

    fetch(`http://localhost:8080/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_approved: true,
        project_payout: doubloons
      })
    })
    navigate('/projects');
  }

  const postCommentFetch = ()=> {
    fetch(`http://localhost:8080/projects/${id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "project_id": parseInt(id),
        "user_id": sessionCookies.user_id_token,
        "post_text": newComment
      })
    })
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
    fetch(`http://localhost:8080/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "is_accepted": false,
        "accepted_by_id": sessionCookies.user_id_token
      })
    })
    navigate('/projects');
    window.location.reload();
  }

  const patchToComplete = () => {
    fetch(`http://localhost:8080/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_completed: true,
        is_accepted: false
      })
    })
  }

  const updateUserDoubloonCount = async () => {
    let newDoubloonCount = userdata.supradoubloons + project.project_payout;
    await fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "supradoubloons": newDoubloonCount,
      })
    })
  }

  const handleComplete = () => {
    updateUserDoubloonCount();
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

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="rgba(255, 255, 255, 0)"
      >
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
          }}
        >
          <Typography
            className='title-container'
            variant="h4"
            gutterBottom
            style={{ fontWeight: "bold", marginBottom: "1.5rem" }}
          >
            {project.name}
          </Typography>
          <div className="image-container">
            {project.url ? (
              <img className="project-image" src={project.url} alt="Project Image" />
            ) : (
              <p>No image available</p> // Optional fallback message
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            components="a"
            href={`/projects/${id}/status`}
            style={{ marginBottom: "irem" }}
          >
            View Project Status
          </Button>

          {sessionCookies.userPriv_Token === true &&
          project.is_approved === false &&
          project.is_completed === false ? (
            <TextField
              fullWidth
              className="inputText"
              label="Doubloons"
              variant="outlined"
              type="text"
              value={doubloons}
              onChange={(e) => setDoubloons(e.target.value)}
              placeholder="Doubloons"
              size="small"
              margin="normal"
            />
          ) : (
            <></>
          )}

          <Typography
            variant="h5"
            gutterBottom
            color="blue"
            style={{ fontWeight: "bold", marginBottom: "1.5rem" }}
          >
            {sessionCookies.userPriv_Token === true &&
            project.is_approved === false &&
            project.is_completed === false ? (
              <></>
            ) : (
              <></>
            )}
            <> </>
          </Typography>

          {project.is_approved === true &&
          project.is_completed === false ? (
            <>
              {sessionCookies.user_type === 1 ? (
                <Button
                  onClick={() => handleSupraJoinProject()}
                  variant="contained"
                  color="success"
                  style={{ margin: "5px" }}
                >
                  Join this Project as a Coder
                </Button>
              ) : sessionCookies.user_type === 2 ? (
                <Button
                  onClick={() => handleSponsor()}
                  variant="contained"
                  color="primary"
                  style={{ margin: "5px" }}
                >
                  Sponsor this Project
                </Button>
              ) : null}
            </>
          ) : null}

          {/* Github REPO Text Input */}

          {sessionCookies.user_type === 1 &&
          project.is_approved === true &&
          project.is_accepted === false &&
          project.is_completed === false ? (
            <TextField
              fullWidth
              className="inputText"
              label="Github Link"
              variant="outlined"
              type="text"
              value={gitlink}
              onChange={(e) => setGitlink(e.target.value)}
              placeholder="Github Link"
              size="small"
              margin="normal"
            />
          ) : (
            <></>
          )}
          {/* Github REPO Text Input */}

          {sessionCookies.user_type === 4 &&
          project.is_completed === false &&
          project.is_accepted === true ? (
            <Button
              onClick={() => handleSupraLeaveProject()}
              variant="contained"
              color="error"
              style={{ margin: "5px" }}
            >
              Drop this project?
            </Button>
          ) : (
            <></>
          )}

          {sessionCookies.user_type === 4 &&
          project.is_completed === false &&
          project.is_accepted === true ? (
            <Button
              onClick={() => handleComplete()}
              variant="contained"
              color="success"
              style={{ margin: "5px" }}
            >
              Complete the project?
            </Button>
          ) : (
            <></>
          )}

          <Divider style={{ marginBottom: "1.5rem" }} />
          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            Project Details:
          </Typography>
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
          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            Submitter ID: {project.submitter_id}
          </Typography>
          {/* Git Text render */}

          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            Contact Info:{" "}
            {userdata.find((user) => user.id === project.submitter_id)?.email ||
              "No Email available"}
          </Typography>

          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            Github Link: {project.github_url}
          </Typography>
          {/* Git Text render */}
          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            SupraCoders Needed:{" "}
            {project.coders_needed !== undefined
              ? project.coders_needed
              : "loading..."}
          </Typography>

          <Typography
            color="textSecondary"
            align="right"
            style={{ marginTop: "1.5rem" }}
          >
            Thank you for viewing this Project. Check back often for updates!
          </Typography>

          {sessionCookies.userPriv_Token === true &&
          project.is_approved === false &&
          project.is_completed === false ? (
            <Button
              onClick={() => handleApprove()}
              variant="contained"
              color="success"
              style={{ margin: "5px" }}
            >
              Approve
            </Button>
          ) : (
            <></>
          )}

          {sessionCookies.userPriv_Token === true &&
          project.is_approved === false &&
          project.is_completed === false ? (
            <Button
              onClick={() => thanosSnap()}
              variant="contained"
              color="error"
              style={{ margin: "5px" }}
            >
              Deny
            </Button>
          ) : (
            <></>
          )}
          {/* Comments Section 
          TODO: REFACTOR THIS INTO COMPONENT
          */}
          <Box marginTop="2rem">
            <Typography variant="h5">Comments</Typography>
            <List>
              {chatposts.map((comment, index) => (
                <div key={index}>
                  <ListItem>
                    <div style={{ display: "flex" }}>
                      <div>{userImgRender(comment.user_id)}</div>
                      <Typography>{comment.post_text}</Typography>
                    </div>
                  </ListItem>
                </div>
              ))}
            </List>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment"
              value={newComment}
              onChange={handleCommentChange}
            />
            <Button
              onClick={() => {
                postCommentFetch();
                fetchPosts();
              }}
              variant="contained"
              color="primary"
              style={{ marginTop: "1rem" }}
            >
              Add Comment
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );


};

export default ProjectDetailsPage;