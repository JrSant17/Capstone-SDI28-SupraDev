import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Paper, Typography, Box, Divider, TextField, List, ListItem, Avatar, } from '@mui/material';
import { useCookies } from "react-cookie";

const ProjectDetailsPage = () => {
  const [project, setproject] = useState(null);
  const { id } = useParams();
  const [doubloons, setDoubloons] = useState("");
  const [gitlink, setGitlink] = useState("");
  const [sessionCookies, setSessionCookies] = useCookies([
    "username_token",
    "user_id_token",
    "userPriv_Token",
    "user_type",
  ]);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [chatposts, setChatposts] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [currentUserDoubloons, setCurrentUserDoubloons] = useState();
  const [isJoining, setIsJoining] = useState(false);
  const [isUserJoined, setIsUserJoined] = useState(false);


  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments((prevComments) => [...prevComments, newComment]);
      setNewComment("");
    }
  };

  const checkUserProjectStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user_projects?user_id=${sessionCookies.user_id_token}&project_id=${id}`);
      const data = await response.json();
      setIsUserJoined(data.length > 0);
    } catch (error) {
      console.error("Error checking user project status:", error);
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

  const fetchCurrentUserDoubloons = async () => {
    await fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`)
      .then((res) => res.json())
      .then((doubloonies) => {
        setCurrentUserDoubloons(doubloonies.supradoubloons);
      });
  };

  const userImgRender = (userIdFromPost) => {
    let imgToRender = "";
    let idOfMatch;
    for (let element in userdata) {
      if (userdata[element].id === userIdFromPost) {
        imgToRender = userdata[element].profile_pic;
        idOfMatch = userdata[element].id;
      }
    }
    return (
      <div>
        <Avatar
          src={imgToRender}
          alt="User Avatar"
          style={{
            float: "left",
            outlineWidth: "1px",
            outlineColor: "red",
            width: "40px",
            height: "40px",
          }}
        />
      </div>
    );
  };

  const fetchPosts = async () => {
    await fetch(`http://localhost:8080/projects/${id}/messages`)
      .then((res) => res.json())
      .then((commentData) => setChatposts(commentData));
    await fetch(`http://localhost:8080/projects/${id}`)
      .then((res) => res.json())
      .then((data) => setproject(data));
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
    checkUserProjectStatus();
  }, []);

  if (!project) {
    return (
      <Typography align="center" style={{ marginTop: "2rem" }}>
        Loading...
      </Typography>
    );
  }

  const handleApprove = () => {
    // Only allow type 4 users (Admins) to approve projects
    if (sessionCookies.user_type !== 4) {
      alert("Only administrators can approve projects");
      return;
    }

    fetch(`http://localhost:8080/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_approved: true,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Project approved successfully");
          navigate("/projects");
        } else {
          alert("Error approving project");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error approving project");
      });
  };

  const postCommentFetch = () => {
    console.log(typeof parseInt(id));
    console.log(typeof sessionCookies.user_id_token);
    console.log(typeof newComment);

    fetch(`http://localhost:8080/projects/${id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: parseInt(id),
        user_id: sessionCookies.user_id_token,
        post_text: newComment,
      }),
    });
  };

  const handleSponsor = () => {
    // Only allow type 2 users (Sponsors) to sponsor projects
    if (sessionCookies.user_type === 1 || sessionCookies.user_type === 3 || sessionCookies.user_type === 4) {
      alert("Only sponsors can fund projects");
      return;
    }

    // Check if project is approved
    if (!project.is_approved) {
      alert("This project is pending approval and cannot be sponsored yet");
      return;
    }

    // Check if project has met SupraCoder requirement
    if (project.coders_needed > 0) {
      alert("This project needs more SupraCoders before it can be sponsored");
      return;
    }

    if (window.confirm("Are you sure you want to sponsor this Project")) {
      fetch(`http://localhost:8080/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_approved: true,
          sponsored_by_id: sessionCookies.user_id_token,
          user_type: sessionCookies.user_type,
        }),
      })
        .then((response) => {
          if (response.ok) {
            alert("Project has been successfully sponsored");
            window.location.reload();
          } else {
            alert("error sponsoring project");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Error Sponsoring Project");
        });
    }
  };

  const handleJoin = () => {
    if (isJoining) {
      return; // Prevent multiple clicks while processing
    }

    // Only allow type 1 users (SupraCoders) to join projects
    if (sessionCookies.user_type !== 1) {
      alert("Only SupraCoders can join projects");
      return;
    }

    // Check if project is approved
    if (!project.is_approved) {
      alert("This project is pending approval and cannot be joined yet");
      return;
    }

    if (window.confirm("Are you sure you want to join this project")) {
      setIsJoining(true);
      // Check if user is already a member
      const isMember = project.accepted_by_id === sessionCookies.user_id_token;

      if (isMember) {
        alert("You have already joined this project!");
        setIsJoining(false);
        return;
      }

      const updatedCodersNeeded = project.coders_needed - 1;
      console.log('Current coders needed:', project.coders_needed);
      console.log('Updated coders needed:', updatedCodersNeeded);
      
      if (updatedCodersNeeded < 0) {
        alert("This project has met its SupraCoder requirement");
        return;
      }

      const requestBody = {
        is_accepted: true,
        accepted_by_id: sessionCookies.user_id_token,
        github_url: gitlink,
        coders_needed: updatedCodersNeeded,
      };
      console.log('Sending request with body:', requestBody);

      // First update the project
      fetch(`http://localhost:8080/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          // Then create the user_project association
          return fetch(`http://localhost:8080/user_projects`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: sessionCookies.user_id_token,
              project_id: parseInt(id),
              datetime_joined: new Date().toISOString()
            })
          });
        })
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          setproject((prevproject) => ({
            ...prevproject,
            coders_needed: updatedCodersNeeded,
          }));
          
          alert("Project joined successfully!");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(`Error accepting project: ${error.message}`);
        })
        .finally(() => {
          setIsJoining(false); // Set loading state to false
        });
    }
  };
  
  const handleUnjoining = async () => {
    try {
      // First update the project
      const updatedCodersNeeded = project.coders_needed + 1;
      const projectResponse = await fetch(
        `http://localhost:8080/projects/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_accepted: false,
            accepted_by_id: null,
            coders_needed: updatedCodersNeeded,
          }),
        },
      );

      if (!projectResponse.ok) {
        throw new Error("Failed to update project");
      }

      // Then delete the user_project association
      const userProjectResponse = await fetch(
        `http://localhost:8080/user_projects`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: sessionCookies.user_id_token,
            project_id: parseInt(id)
          }),
        }
      );

      if (!userProjectResponse.ok) {
        throw new Error("Failed to remove user from project");
      }

      setproject((prev) => ({ ...prev, coders_needed: updatedCodersNeeded }));
      navigate("/projects");
    } catch (error) {
      console.error("Error:", error);
      alert("Error dropping project");
    }
  };

  const updateUserDoubloonCount = async () => {
    await fetchCurrentUserDoubloons();
    console.log(currentUserDoubloons);
    console.log(project.project_payout);
    let newDoubloonCount = currentUserDoubloons + project.project_payout;
    console.log(newDoubloonCount);

    await fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supradoubloons: newDoubloonCount,
      }),
    });
  };

  const handleComplete = () => {
    updateUserDoubloonCount();
    navigate("/projects");
  };

  const thanosSnap = () => {
    fetch(`http://localhost:8080/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/projects");
  };

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
            variant="h4"
            gutterBottom
            style={{ fontWeight: "bold", marginBottom: "1.5rem" }}
          >
            {project.name}
          </Typography>
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

          {project.is_approved === true && project.is_completed === false && (
            <>
              {project.coders_needed > 0 && sessionCookies.user_type === 1 &&
              isUserJoined !== true ? (
                <Button
                  onClick={() => handleJoin()}
                  variant="contained"
                  color="success"
                  style={{ margin: "5px" }}
                >
                  Join this Project as a Coder
                </Button>
             ) : null}
              {sessionCookies.user_type === 2 && project.coders_needed === 0 && (
                <Button
                  onClick={() => handleSponsor()}
                  variant="contained"
                  color="primary"
                  style={{ margin: "5px" }}
                >
                  Sponsor this Project
                </Button>
              )}
            </>
          )}

          {/* Github REPO Text Input */}

          {sessionCookies.user_type === 1 &&
          project.is_approved === true &&
          project.coders_needed > 0 &&
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

          {isUserJoined 
           &&
          project.is_completed === false 
          &&
          project.is_accepted === true 
          ? (
            <Button
              onClick={() => handleUnjoining()}
              variant="contained"
              color="error"
              style={{ margin: "5px" }}
            >
              Drop this project?
            </Button>
          ) : (
            <></>
          )}

          {isUserJoined === true &&
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
            Submitter:{" "}
            {(() => {
              const user = userdata.find((user) => user.id === project.submitter_id);
              return user ? `${user.first_name} ${user.last_name}` : "Name not available";
            })()}
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
            {project.coders_needed > 0
              ? `SupraCoders Needed: ${project.coders_needed}`
              : "SupraCoder requirement met"}
          </Typography>

          <Typography
          variant="h6"
          style={{ fontWeight: "500", color: "#616161" }}
          >
          Languages Requested: {project.program_languages}
          </Typography>

          <Typography
          variant="h6"
          style={{ fontWeight: "500", color: "#616161" }}
          >
          Project End Date: {project.end_date}
          </Typography>

          <Typography
            color="textSecondary"
            align="right"
            style={{ marginTop: "1.5rem" }}
          >
            Thank you for viewing this Project. Check back often for updates!
          </Typography>

          {sessionCookies.userPriv_Token === false && sessionCookies.user_type === 4 &&
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

          {sessionCookies.userPriv_Token === false && sessionCookies.user_type === 4 &&
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
          {/* Comments Section */}
          <Box marginTop="2rem">
            <Typography variant="h5">Comments</Typography>
            <List>
              {chatposts.map((comment, index) => (
                <div>
                  <ListItem key={index}>
                    <div style={{ display: "flex" }}>
                      <div style={{}}>{userImgRender(comment.user_id)}</div>
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