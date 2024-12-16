import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Typography, Box, Divider, TextField, List, ListItem, Avatar, } from '@mui/material';
import { useCookies } from 'react-cookie';

const ProjectDetailsPage = () => {
  const [bounty, setBounty] = useState(null);
  const { projectId } = useParams();
  const [doubloons, setDoubloons] = useState("");
  const [gitlink, setGitlink] = useState("");
  const [sessionCookies, setSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token', 'user_type']);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [chatposts, setChatposts] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [currentUserDoubloons, setCurrentUserDoubloons] = useState();
  // const [coders_needed, setCodersNeeded] = useState({coders_needed: 0 });

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

  const fetchCurrentUserDoubloons = async () => {
    await fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`)
        .then((res) => res.json())
        .then((doubloonies) => {setCurrentUserDoubloons(doubloonies.supradoubloons)});
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
    await fetch(`http://localhost:8080/projects/${projectId}/messages`)
        .then((res) => res.json())
        .then((commentData) => setChatposts(commentData));
    await fetch(`http://localhost:8080/projects/${projectId}`)
        .then((res) => res.json())
        .then((data) => setBounty(data));
  };

  useEffect(() => {
    fetch(`http://localhost:8080/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(`received data: ${JSON.stringify(data)}`);
        if (data) {
          setBounty(data);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the bounty:", error);
      });
      fetchPosts();
      fetchUsers();
      fetchCurrentUserDoubloons();
  }, []);

  if (!bounty) {
    return <Typography align="center" style={{ marginTop: '2rem' }}>Loading...</Typography>;
  }

  const handleApprove = () => {

    fetch(`http://localhost:8080/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_approved: true,
        bounty_payout: doubloons
      })
    })
    navigate('/projects');
  }

  const postCommentFetch = ()=> {
    console.log(typeof(parseInt(projectId)))
    console.log(typeof(sessionCookies.user_id_token))
    console.log(typeof(newComment))
    
    fetch(`http://localhost:8080/projects/${projectId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "project_id": parseInt(projectId),
        "user_id": sessionCookies.user_id_token,
        "post_text": newComment
      })
    })
  }

  const handleSponsor = () => {
    if (window.confirm("Are you sure you want to sponsor this Project")) {
      fetch (`http://localhost:8080/projects/${projectId}`, {
        method: "PATCH" , 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_approved:true,
          sponsored_by_id: sessionCookies.user_id_token, user_type: sessionCookies.user_type
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
  


const handleAccept = () => {
  if (window.confirm("Are you sure you want to join this project")) {
    fetch(`http://localhost:8080/projects/${projectId}/members/${sessionCookies.user_id_token}`)
      .then(response => response.json())
      .then(data => {
        if (data.isMember) {
          alert("You have already joined this project!");
          return;
        }
        
        const updatedCodersNeeded = bounty.coders_needed - 1;
        if (updatedCodersNeeded < 0) {
          alert("This project has met its SupraCoder requirement");
          return;
        }

    fetch (`http://localhost:8080/projects/${projectId}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        is_accepted: true,
        accepted_by_id: sessionCookies.user_id_token,
        github_url: gitlink,
        coders_needed: updatedCodersNeeded
      })
    })
    .then(async response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text().then(text => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      });
    })
    .then(() => {
      setBounty(prevBounty => ({
        ...prevBounty,
        coders_needed: updatedCodersNeeded
      }));
      alert("Project joined successfully!");
    })
    .catch(error => {
      console.error("Error:", error);
      alert(`Error accepting project: ${error.message}`);
    });
    });
  }
}
  const handleUnaccept = async () => {
    try {
      const updatedCodersNeeded = bounty.coders_needed + 1;
      const response = await fetch(`http://localhost:8080/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_accepted: false,
          accepted_by_id: null,
          coders_needed: updatedCodersNeeded
        })
      });
      
      if (response.ok) {
        setBounty(prev => ({...prev, coders_needed: updatedCodersNeeded}));
        navigate('/projects');
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error dropping project");
    }
  }

  const patchToComplete = () => {
    fetch(`http://localhost:8080/projects/${projectId}`, {
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
    await fetchCurrentUserDoubloons();
    console.log(currentUserDoubloons)
    console.log(bounty.bounty_payout)
    let newDoubloonCount = currentUserDoubloons + bounty.bounty_payout;
    console.log(newDoubloonCount);

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

    fetch(`http://localhost:8080/projects/${projectId}`, {
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
            variant="h4"
            gutterBottom
            style={{ fontWeight: "bold", marginBottom: "1.5rem" }}
          >
            {bounty.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            components="a"
            href={`/projects/${projectId}/status`}
            style={{ marginBottom: "irem" }}
          >
            View Project Status
          </Button>

          {sessionCookies.userPriv_Token === true &&
          bounty.is_approved === false &&
          bounty.is_completed === false ? (
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
            bounty.is_approved === false &&
            bounty.is_completed === false ? (
              <></>
            ) : (
              <></>
            )}
            <> </>
          </Typography>

          {bounty.is_approved === true &&
          bounty.coders_needed > 0 &&
          bounty.is_completed === false ? (
            <>
              {sessionCookies.user_type === 1 && bounty.accepted_by_id !== sessionCookies.user_id_token ? (
                <Button
                  onClick={() => handleAccept()}
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
          bounty.is_approved === true &&
          bounty.coders_needed > 0 &&
          bounty.is_completed === false ? (
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

          {bounty.accepted_by_id === sessionCookies.user_id_token &&
          bounty.is_completed === false &&
          bounty.is_accepted === true ? (
            <Button
              onClick={() => handleUnaccept()}
              variant="contained"
              color="error"
              style={{ margin: "5px" }}
            >
              Drop this project?
            </Button>
          ) : (
            <></>
          )}

          {bounty.accepted_by_id === sessionCookies.user_id_token &&
          bounty.is_completed === false &&
          bounty.is_accepted === true ? (
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
            {bounty.problem_statement}
          </Typography>
          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            Submitter ID: {bounty.submitter_id}
          </Typography>
          {/* Git Text render */}

          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            Contact Info:{" "}
            {userdata.find((user) => user.id === bounty.submitter_id)?.email ||
              "No Email available"}
          </Typography>

          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            Github Link: {bounty.github_url}
          </Typography>
          {/* Git Text render */}
          <Typography
            variant="h6"
            style={{ fontWeight: "500", color: "#616161" }}
          >
            {bounty.coders_needed > 0 
              ? `SupraCoders Needed: ${bounty.coders_needed}`
              : "SupraCoder requirement met"}
          </Typography>

          <Typography
            color="textSecondary"
            align="right"
            style={{ marginTop: "1.5rem" }}
          >
            Thank you for viewing this Project. Check back often for updates!
          </Typography>

          {sessionCookies.userPriv_Token === true &&
          bounty.is_approved === false &&
          bounty.is_completed === false ? (
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
          bounty.is_approved === false &&
          bounty.is_completed === false ? (
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