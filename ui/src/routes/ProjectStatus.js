import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Typography, Box, Divider, TextField, List, ListItem, Avatar } from '@mui/material';
import { useCookies } from 'react-cookie';
import './ProjectStatus.css';


const ProjectStatus = () => {
    const [bounty, setBounty] = useState(null);
    const { projectId } = useParams();
    const [doubloons, setDoubloons] = useState("")
    const [gitlink, setGitlink] = useState("")
    const [sessionCookies, setSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token'])
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [chatposts, setChatposts] = useState([]);
    const [userdata, setUserdata] = useState([])
    const [currentUserDoubloons, setCurrentUserDoubloons] = useState()


    const milestones = [
        "Kickoff",
        "Development",
        "Testing",
        "User Showcase",
        "Funding",
        "Deployment",
        "Program of Record"
    ];

    const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(-1);

    const [milestoneTimestamps, setMilestoneTimestamps] = useState(
        milestones.map(() => ({ started: null, completed: null }))
    );

    const [canStartCurrentMilestone, setCanStartCurrentMilestone] = useState(true);
    const [canCompleteCurrentMilestone, setCanCompleteCurrentMilestone] = useState(false);


    const syncMilestonesWithBackend = async () => {
    try {
        const response = await fetch(`http://localhost:8080/projects/${projectId}/milestones`);

        if (!response.ok) {
            if (response.status === 404) {
                await createDefaultMilestones();
            } else {
                throw new Error(`Error fetching milestones: ${response.statusText}`);
            }
        }

        const milestoneData = await response.json();
        console.log('Fetched milestone data:', milestoneData);
        const milestonesDataArray = milestoneData.milestones || [];
        
        if (Array.isArray(milestoneData)) {
            setMilestoneTimestamps(
                milestones.map((milestone, index) => {
                    const fetchedMilestone = milestoneData.find(m => m.index === index + 1);
                    return {
                        started: fetchedMilestone?.started || null,
                        completed: fetchedMilestone?.completed || null,
                        is_active: fetchedMilestone?.is_active || false,
                    };
                })
            );

            const activeMilestone = milestoneData.find(m => m.is_active);
            if (activeMilestone) {
                setCurrentMilestoneIndex(activeMilestone.index - 1);
            }
        } else {
            throw new Error('Milestone data is not an array');
        }

    } catch (error) {
        console.error('Error syncing milestones:', error);
    }
};

    const createDefaultMilestones = async () => {
        try {
            const createResponse = await fetch(`http://localhost:8080/projects/${projectId}/milestones/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!createResponse.ok) {
                throw new Error(`Failed to create default milestones: ${createResponse.statusText}`);
            }

            const createResponseData = await createResponse.json();
            console.log('Default milestones created:', createResponseData.milestones);

            await syncMilestonesWithBackend();

        } catch (error) {
            console.error('Error creating default milestones:', error);
        }
    };

    useEffect(() => {
        if (projectId) {
            syncMilestonesWithBackend();
        }
    }, [projectId]);

    const moveToPreviousMilestone = async () => {
        if (currentMilestoneIndex > 0) {
            console.log('Current Milestone Index before move:', currentMilestoneIndex);
            const newIndex = currentMilestoneIndex - 1;
            await updateMilestoneState(newIndex);
            setCanStartCurrentMilestone(milestoneTimestamps[newIndex].started === null);
            setCanCompleteCurrentMilestone(milestoneTimestamps[newIndex].started !== null && milestoneTimestamps[newIndex].completed === null);
        }
    };

    const moveToNextMilestone = async () => {
        console.log('Current Milestone Index before move:', currentMilestoneIndex);
        if (currentMilestoneIndex < milestones.length - 1) {
            const newIndex = currentMilestoneIndex + 1;
            await updateMilestoneState(newIndex);
            setCanStartCurrentMilestone(milestoneTimestamps[newIndex].started === null);
            setCanCompleteCurrentMilestone(milestoneTimestamps[newIndex].started !== null && milestoneTimestamps[newIndex].completed === null);
        }
    };

    const updateMilestoneState = async (newIndex) => {
        try {
            const response = await fetch(`http://localhost:8080/projects/${projectId}/milestones`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ index: newIndex + 1, is_active: true }) 
            });
            if (!response.ok) {
                throw new Error(`Error updating milestone: ${response.statusText}`);
            }
            const updatedMilestones = await response.json();
            console.log('Updated milestones:', updatedMilestones);
            setCurrentMilestoneIndex(newIndex);
        } catch (error) {
            console.error('Error updating milestone state:', error);
        }
    };

    const updateMilestone = async (action, timestamp) => {
        const updateData = {
            index: currentMilestoneIndex + 1,
        };

        if (action === 'start') {
            updateData.started = timestamp;

            updateData.is_active = true;
        } else if (action === 'complete') {
            updateData.completed = timestamp;
        }

        try {
            const response = await fetch(`http://localhost:8080/projects/${projectId}/milestones`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error('Failed to update milestone');
            }
        } catch (error) {
            console.error('Error updating milestone:', error);
        }
    };

    const startCurrentMilestone = async () => {
        if (canStartCurrentMilestone && currentMilestoneIndex >= 0) {
            const now = new Date().toISOString();

            setMilestoneTimestamps(prev => {
                const updated = [...prev];
                updated[currentMilestoneIndex].started = now;
                return updated;
            });

            setCanStartCurrentMilestone(false);
            setCanCompleteCurrentMilestone(true);

            await updateMilestone('start', now);

            await syncMilestonesWithBackend();
        }
    };

    const completeCurrentMilestone = async () => {
        if (canCompleteCurrentMilestone && currentMilestoneIndex >= 0) {
            const now = new Date().toISOString();

            setMilestoneTimestamps(prev => {
                const updated = [...prev];
                updated[currentMilestoneIndex].completed = now;
                return updated;
            });

            setCanCompleteCurrentMilestone(true);

            await updateMilestone('complete', now);
        }
    };

    const removeTimestamp = async () => {
        if (currentMilestoneIndex >= 0) {
            const currentMilestone = milestoneTimestamps[currentMilestoneIndex];
            let fieldToRemove = null;

            if (currentMilestone.completed) {
                fieldToRemove = 'completed';
                setCanCompleteCurrentMilestone(true);
            } else if (currentMilestone.started) {
                fieldToRemove = 'started';
                setCanStartCurrentMilestone(true);
            }

            if (fieldToRemove) {
                const response = await fetch(`http://localhost:8080/projects/${projectId}/milestones`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        index: currentMilestoneIndex + 1,
                        [fieldToRemove]: null,
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to update milestone on backend:', response.statusText);
                    return;
                }

                setMilestoneTimestamps(prev => {
                    const updated = [...prev];
                    updated[currentMilestoneIndex][fieldToRemove] = null;
                    return updated;
                });

                await syncMilestonesWithBackend();
            }
        }
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments(prevComments => [...prevComments, newComment]);
            setNewComment('');
        }
    };
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const fetchUsers = async () => {
        await fetch(`http://localhost:8080/users`)
            .then((res) => res.json())
            .then((fetchedUserData) => setUserdata(fetchedUserData))
    }

    const fetchCurrentUserDoubloons = async () => {
        await fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`)
            .then((res) => res.json())
            .then((doubloonies) => { setCurrentUserDoubloons(doubloonies.supradoubloons) })
    }


    const userImgRender = (userIdFromPost) => {
        let imgToRender = '';
        let idOfMatch;
        for (let element in userdata) {
            if (userdata[element].id == userIdFromPost) {
                imgToRender = userdata[element].profile_pic;
                idOfMatch = userdata[element].id;
            }
        }
        return (
            <div>
                <Avatar src={imgToRender} alt="User Avatar" style={{ float: 'left', outlineWidth: '1px', outlineColor: 'red', width: '40px', height: '40px' }} />
            </div>
        )
    }

    const fetchPosts = async () => {
        await fetch(`http://localhost:8080/projects/${projectId}/messages`)
            .then((res) => res.json())
            .then((commentData) => setChatposts(commentData))
    }

    useEffect(() => {
        fetch(`http://localhost:8080/projects/${projectId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setBounty(data);
                }
            })
            .catch((error) => {
                console.error("There was an error fetching the bounty:", error);
            });
        fetchPosts();
        fetchUsers();
        fetchCurrentUserDoubloons()
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
                "is_approved": true,
                "bounty_payout": doubloons
            })
        })
        navigate('/projects');


    }

    const postCommentFetch = () => {
        console.log(typeof (parseInt(projectId)))
        console.log(typeof (sessionCookies.user_id_token))
        console.log(typeof (newComment))

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


    const handleAccept = () => {

        fetch(`http://localhost:8080/projects/${projectId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "is_accepted": true,
                "accepted_by_id": sessionCookies.user_id_token,
                "github_url": gitlink
            })
        })
        navigate('/projects');
        window.location.reload();
    }

    const handleUnaccept = () => {

        fetch(`http://localhost:8080/projects/${projectId}`, {
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
        fetch(`http://localhost:8080/projects/${projectId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "is_completed": true,
                "is_accepted": false
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
            <Box display="flex" justifyContent="center" minHeight="100vh" bgcolor="rgba(255, 255, 255, 0)">
                <Paper elevation={5} style={{ borderRadius: '25px', background: 'rgba(255,255,255, 0.85)', padding: '40px', marginTop: '25px', maxWidth: '800px', width: '100%', overflow: 'auto', marginBottom: "50px" }}>

                    <Typography

                        variant="h4"
                        gutterBottom
                        style={{ fontWeight: "bold", marginBottom: "1.5rem" }}>
                        {bounty.name}
                        <div>
                            <small className='details-container'>Application Acceptance Date:</small><br></br>
                            <small className='details-container'>Need By Date:</small><br></br>
                            <small className='details-container'>Product Owner:</small>
                        </div>

                    </Typography>

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
                        style={{ fontWeight: "bold", marginBottom: "1.5rem" }}>

                        {sessionCookies.userPriv_Token === true &&
                            bounty.is_approved === false &&
                            bounty.is_completed === false ? (
                            <></>
                        ) : (
                            <></>
                        )}
                        <> </>
                        {/* <div style={{ display: 'flex' }}>
                            <p>Reward:</p><img src='https://github.com/jsanders36/Capstone-SDI18-SupraDev/blob/main/ui/public/supradoubloon.png?raw=true' style={{ marginTop: '25px', marginLeft: '25px', marginRight: '7px' }} alt='supradoubloons' height='30px' width='30px' /><p style={{ color: 'blue' }}>{bounty.bounty_payout}</p>
                        </div> */}
                    </Typography>

                    {sessionCookies.userPriv_Token === true &&
                        bounty.is_approved === true &&
                        bounty.is_accepted === false &&
                        bounty.is_completed === false ? (


                        <Button
                            onClick={() => handleAccept()}
                            variant="contained"
                            color="success"
                            style={{ margin: "5px" }}>
                            Accept this project?
                        </Button>
                    ) : (
                        <></>
                    )}

                    {/* Github REPO Text Input */}

                    {sessionCookies.userPriv_Token === true &&
                        bounty.is_approved === true &&
                        bounty.is_accepted === false &&
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
                            style={{ margin: "5px" }}>
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
                            style={{ margin: "5px" }}>
                            Complete the project?
                        </Button>
                    ) : (
                        <></>
                    )}

                    <Divider style={{ marginBottom: "1.5rem" }} />
                    <Typography
                        variant="h6"
                        style={{ fontWeight: "500", color: "#616161" }}>
                        <p className='product-status'>Application Development Status:</p>
                        <div>
                            <div className="milestone-wrapper">
                                <div className="milestone-container">
                                    {milestones.map((milestone, index) => (
                                        <div key={index} className={`milestone ${index === currentMilestoneIndex ? 'active' : 'inactive'} `}>
                                            {milestone}
                                        </div>
                                    ))}
                                </div>

                                <div className="button-container">
                                    <button
                                        className="milestone-button"
                                        onClick={moveToPreviousMilestone}
                                        disabled={currentMilestoneIndex <= 0}
                                    >
                                        Previous Milestone
                                    </button>

                                    <button
                                        className="milestone-button"
                                        onClick={moveToNextMilestone}
                                        disabled={currentMilestoneIndex >= milestones.length - 1}
                                    >
                                        Next Milestone
                                    </button>

                                    <button
                                        className="milestone-button"
                                        onClick={removeTimestamp}
                                        disabled={milestoneTimestamps[currentMilestoneIndex]?.started === null &&
                                            milestoneTimestamps[currentMilestoneIndex]?.completed === null}
                                    >
                                        Remove Timestamp
                                    </button>

                                    <button
                                        className="milestone-button"
                                        onClick={startCurrentMilestone}
                                        disabled={!canStartCurrentMilestone || currentMilestoneIndex < 0}
                                    >
                                        Start Milestone
                                    </button>

                                    <button
                                        className="milestone-button"
                                        onClick={completeCurrentMilestone}
                                        disabled={!canCompleteCurrentMilestone || currentMilestoneIndex < 0}
                                    >
                                        Complete Milestone
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="timestamp-contianer">
                            <h3>Milestone History</h3>

                            <ul className="timestamp-list">
                                {milestones.map((milestone, index) => (
                                    <li key={index}>
                                        <strong>{milestone}</strong>
                                        <div>
                                            {milestoneTimestamps[index]?.started && (
                                                <small>Started on: {new Date(milestoneTimestamps[index].started).toLocaleString()}</small>
                                            )}
                                        </div>
                                        <div>
                                            {milestoneTimestamps[index]?.completed && (
                                                <small className='completed-stamp'>Completed on: {new Date(milestoneTimestamps[index].completed).toLocaleString()}</small>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>


                    </Typography>
                    {/* <Typography
                        paragraph
                        style={{
                            fontSize: "1rem",
                            marginTop: "0.5rem",
                            marginBottom: "1.5rem",
                        }}>
                        {bounty.problem_statement}
                    </Typography>
                    <Typography
                        variant="h6"
                        style={{ fontWeight: "500", color: "#616161" }}>
                        Submitter ID: {bounty.submitter_id}
                    </Typography> */}
                    {/* Git Text render */}

                    <Typography
                        variant="h6"
                        style={{ fontWeight: "500", color: "#616161" }}>
                        Github Link: {bounty.github_url}
                    </Typography>
                    {/* Git Text render */}


                    <Typography
                        color="textSecondary"
                        align="right"
                        style={{ marginTop: "1.5rem", "text-align": "center" }}>
                        Thank you for viewing this bounty detail. Check back often for
                        updates!
                    </Typography>

                    {sessionCookies.userPriv_Token === true &&
                        bounty.is_approved === false &&
                        bounty.is_completed === false ? (
                        <Button
                            onClick={() => handleApprove()}
                            variant="contained"
                            color="success"
                            style={{ margin: "5px" }}>
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
                            style={{ margin: "5px" }}>
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
                                        <div style={{ display: 'flex' }}>
                                            <div style={{}}>{userImgRender(comment.user_id)}</div>
                                            <Typography>{comment.post_text}</Typography>
                                        </div>
                                    </ListItem>
                                </div>
                            ))}
                        </List>
                        <TextField fullWidth variant="outlined" placeholder="Add a comment" value={newComment} onChange={handleCommentChange} />
                        <Button onClick={() => { postCommentFetch(); fetchPosts(); }} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                            Add Comment
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

export default ProjectStatus;