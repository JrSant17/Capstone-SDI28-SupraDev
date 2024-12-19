import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Paper, Typography, Box, Divider, TextField, List, ListItem, Avatar } from '@mui/material';
import { useCookies } from "react-cookie";


const useProject = (id) => {
  const [project, setProject] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isUserJoined, setIsUserJoined] = useState(false);
  const [sessionCookies] = useCookies(["username_token", "user_id_token", "userPriv_Token", "user_type"]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:8080/projects/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data) setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
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

  useEffect(() => {
    fetchProject();
    checkUserProjectStatus();
  }, [id]);

  return { project, setProject, isJoining, setIsJoining, isUserJoined, checkUserProjectStatus };
};

const useUsers = () => {
  const [userdata, setUserdata] = useState([]);
  const [currentUserDoubloons, setCurrentUserDoubloons] = useState();
  const [sessionCookies] = useCookies(["user_id_token"]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users`);
      const data = await response.json();
      setUserdata(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCurrentUserDoubloons = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`);
      const data = await response.json();
      setCurrentUserDoubloons(data.supradoubloons);
    } catch (error) {
      console.error("Error fetching doubloons:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { userdata, currentUserDoubloons, fetchCurrentUserDoubloons };
};


const useComments = (id) => {
  const [chatposts, setChatposts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:8080/projects/${id}/messages`);
      const data = await response.json();
      setChatposts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  return { chatposts, newComment, setNewComment, comments, setComments, fetchPosts };
};

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionCookies] = useCookies(["username_token", "user_id_token", "userPriv_Token", "user_type"]);
  const [doubloons, setDoubloons] = useState("");
  const [gitlink, setGitlink] = useState("");

  const { project, setProject, isJoining, setIsJoining, isUserJoined } = useProject(id);
  const { userdata, currentUserDoubloons, fetchCurrentUserDoubloons } = useUsers();
  const { chatposts, newComment, setNewComment, fetchPosts } = useComments(id);

  if (!project) {
    return <Typography align="center" style={{ marginTop: "2rem" }}>Loading...</Typography>;
  }

  const handleApprove = async () => {
    if (sessionCookies.user_type !== 4) {
      alert("Only administrators can approve projects");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      });

      if (response.ok) {
        alert("Project approved successfully");
        navigate("/projects");
      } else {
        alert("Error approving project");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error approving project");
    }
  };

  const postCommentFetch = async () => {
    try {
      await fetch(`http://localhost:8080/projects/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: parseInt(id),
          user_id: sessionCookies.user_id_token,
          post_text: newComment,
        }),
      });
      fetchPosts();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleSponsor = async () => {
    if (sessionCookies.user_type === 1 || sessionCookies.user_type === 3 || sessionCookies.user_type === 4) {
      alert("Only sponsors can fund projects");
      return;
    }

    if (!project.is_approved || project.coders_needed > 0) {
      alert("Project cannot be sponsored at this time");
      return;
    }

    if (window.confirm("Are you sure you want to sponsor this Project")) {
      const sponsor = userdata.find(user => user.id === sessionCookies.user_id_token);
      const sponsorEmail = sponsor ? sponsor.email : '';

      try {
        const response = await fetch(`http://localhost:8080/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            is_approved: true,
            user_type: sessionCookies.user_type,
            funding_poc: sponsorEmail
          }),
        });

        if (response.ok) {
          alert("Project has been successfully sponsored");
          window.location.reload();
        } else {
          alert("Error sponsoring project");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error Sponsoring Project");
      }
    }
  };

  const handleUnsponsor = async () => {
    if (window.confirm("Are you sure you want to unsponsor this Project?")) {
      try {
        const response = await fetch(`http://localhost:8080/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ funding_poc: null }),
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

  const handleJoin = async () => {
    if (isJoining) return;

    if (sessionCookies.user_type !== 1 || !project.is_approved) {
      alert("Cannot join project at this time");
      return;
    }

    if (window.confirm("Are you sure you want to join this project")) {
      setIsJoining(true);
      const isMember = project.accepted_by_id === sessionCookies.user_id_token;

      if (isMember) {
        alert("You have already joined this project!");
        setIsJoining(false);
        return;
      }

      const updatedCodersNeeded = project.coders_needed - 1;
      if (updatedCodersNeeded < 0) {
        alert("This project has met its SupraCoder requirement");
        return;
      }

      try {
        const projectResponse = await fetch(`http://localhost:8080/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            is_accepted: true,
            accepted_by_id: sessionCookies.user_id_token,
            github_url: gitlink,
            coders_needed: updatedCodersNeeded,
          }),
        });

        if (!projectResponse.ok) throw new Error(`HTTP error! status: ${projectResponse.status}`);

        const userProjectResponse = await fetch(`http://localhost:8080/user_projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: sessionCookies.user_id_token,
            project_id: parseInt(id),
            datetime_joined: new Date().toISOString()
          }),
        });

        if (!userProjectResponse.ok) throw new Error(`HTTP error! status: ${userProjectResponse.status}`);

        setProject(prev => ({ ...prev, coders_needed: updatedCodersNeeded }));
        alert("Project joined successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        alert(`Error accepting project: ${error.message}`);
      } finally {
        setIsJoining(false);
      }
    }
  };

  const handleUnjoining = async () => {
    try {
      const updatedCodersNeeded = project.coders_needed + 1;
      const projectResponse = await fetch(`http://localhost:8080/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_accepted: false,
          accepted_by_id: null,
          coders_needed: updatedCodersNeeded,
        }),
      });

      if (!projectResponse.ok) throw new Error("Failed to update project");

      const userProjectResponse = await fetch(`http://localhost:8080/user_projects`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: sessionCookies.user_id_token,
          project_id: parseInt(id)
        }),
      });

      if (!userProjectResponse.ok) throw new Error("Failed to remove user from project");

      setProject(prev => ({ ...prev, coders_needed: updatedCodersNeeded }));
      navigate("/projects");
    } catch (error) {
      console.error("Error:", error);
      alert("Error dropping project");
    }
  };

  const updateUserDoubloonCount = async () => {
    await fetchCurrentUserDoubloons();
    const newDoubloonCount = currentUserDoubloons + project.project_payout;

    try {
      await fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supradoubloons: newDoubloonCount }),
      });
    } catch (error) {
      console.error("Error updating doubloons:", error);
    }
  };

  const handleComplete = () => {
    updateUserDoubloonCount();
    navigate("/projects");
  };

  const thanosSnap = async () => {
    try {
      await fetch(`http://localhost:8080/projects/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      navigate("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const userImgRender = (userIdFromPost) => {
    const user = userdata.find(user => user.id === userIdFromPost);
    if (!user) return null;
    
    return (
      <div>
        <Avatar
          src={user.profile_pic}
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
              project.accepted_by_id !== sessionCookies.user_id_token ? (
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
                <>
                  {project.funding_poc === userdata.find(user => user.id === sessionCookies.user_id_token)?.email ? (
                    <Button
                      onClick={() => handleUnsponsor()}
                      variant="contained"
                      color="error"
                      style={{ margin: "5px" }}
                    >
                      Unsponsor this Project
                    </Button>
                  ) : !project.funding_poc && (
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
            </>
          )}

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

          {project.accepted_by_id === sessionCookies.user_id_token &&
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
          {project.funding_poc && (
            <Typography
              variant="h6"
              style={{ fontWeight: "500", color: "#616161" }}
            >
              Project Funded! POC: {project.funding_poc}
            </Typography>
          )}
          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            {project.coders_needed > 0
              ? `SupraCoders Needed: ${project.coders_needed}`
              : "SupraCoder requirement met"}
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
              onChange={(e) => setNewComment(e.target.value)}
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

export default ProjectDetailsPage