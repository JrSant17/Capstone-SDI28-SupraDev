import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Typography, Box, Divider, TextField, List, ListItem, Avatar } from '@mui/material';
import { useCookies } from 'react-cookie';
import MilestoneBar from '../components/milestoneBar';
import './ProjectStatus.css';


const ProjectStatus = () => {
    const [bounty, setBounty] = useState(null);
    const { id } = useParams();
    const [sessionCookies, setSessionCookies] = useCookies([
        'username_token', 
        'user_id_token', 
        'userPriv_Token',
        'user_type'
    ])
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [chatposts, setChatposts] = useState([]);
    const [userdata, setUserdata] = useState([])
    const [currentUserDoubloons, setCurrentUserDoubloons] = useState()
    const [milestoneData, setMilestoneData] = useState([]);
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
            const response = await fetch(`http://localhost:8080/projects/${id}/milestones`);

            if (!response.ok) {
                if (response.status === 404) {
                    await createDefaultMilestones();
                } else {
                    throw new Error(`Error fetching milestones: ${response.statusText}`);
                }
            }

            const fetchedMilestoneData = await response.json();
            console.log('Fetched milestone data:', fetchedMilestoneData);
            // const milestonesDataArray = milestoneData.milestones || [];

            setMilestoneData(fetchedMilestoneData);

            if (Array.isArray(fetchedMilestoneData)) {
                setMilestoneTimestamps(
                    milestones.map((milestone, index) => {
                        const fetchedMilestone = fetchedMilestoneData.find(m => m.index === index + 1);
                        return {
                            started: fetchedMilestone?.started || null,
                            completed: fetchedMilestone?.completed || null,
                            is_active: fetchedMilestone?.is_active || false,
                        };
                    })
                );

                const activeMilestone = fetchedMilestoneData.find(m => m.is_active);
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
            const createResponse = await fetch(`http://localhost:8080/projects/${id}/milestones/create`, {
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
        if (id) {
            syncMilestonesWithBackend();
        }
    }, [id]);

    useEffect(() => {
        if (currentMilestoneIndex !== -1) {
            syncMilestonesWithBackend();
        }
    }, [currentMilestoneIndex]);

    const moveToPreviousMilestone = async () => {
        if (currentMilestoneIndex > 0) {
            console.log('Current Milestone Index before move:', currentMilestoneIndex);
            const newIndex = currentMilestoneIndex - 1;
            await updateMilestoneState(newIndex);
            setCanStartCurrentMilestone(milestoneTimestamps[newIndex].started === null);
            setCanCompleteCurrentMilestone(milestoneTimestamps[newIndex].started !== null && milestoneTimestamps[newIndex].completed === null);
            setCurrentMilestoneIndex(newIndex);
        }
    };

    const moveToNextMilestone = async () => {
        console.log('Current Milestone Index before move:', currentMilestoneIndex);
        if (currentMilestoneIndex < milestones.length - 1) {
            const newIndex = currentMilestoneIndex + 1;
            await updateMilestoneState(newIndex);
            setCanStartCurrentMilestone(milestoneTimestamps[newIndex].started === null);
            setCanCompleteCurrentMilestone(milestoneTimestamps[newIndex].started !== null && milestoneTimestamps[newIndex].completed === null);
            setCurrentMilestoneIndex(newIndex);
        }
    };

    const updateMilestoneState = async (newIndex) => {
        try {
            const response = await fetch(`http://localhost:8080/projects/${id}/milestones`, {
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
            const response = await fetch(`http://localhost:8080/projects/${id}/milestones`, {
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
                const response = await fetch(`http://localhost:8080/projects/${id}/milestones`, {
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

    const kickoffStartDate = milestoneTimestamps[0]?.started;
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
        await fetch(`http://localhost:8080/projects/${id}/messages`)
            .then((res) => res.json())
            .then((commentData) => setChatposts(commentData))
    }

    useEffect(() => {
        fetch(`http://localhost:8080/projects/${id}`)
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

    const postCommentFetch = () => {
        console.log(typeof (parseInt(id)))
        console.log(typeof (sessionCookies.user_id_token))
        console.log(typeof (newComment))

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
                            <small className='details-container'>
                                {kickoffStartDate ? (
                                    <span>
                                        Start Date: <span className='start-date'>{new Date(kickoffStartDate).toLocaleDateString()}</span>
                                    </span>
                                ) : (
                                    <span className='no-start-date'>Kickoff has not started yet, check back later for more details.</span>
                                )}
                            </small> <br />
                            {milestoneData[currentMilestoneIndex]?.milestone ? (
                                <small className='details-container'>Developmemt Status:  <span className={`app-status milestone-${currentMilestoneIndex + 1}`}>{milestoneData[currentMilestoneIndex].milestone} </span></small>
                            ) : null}
                            <br />
                            {milestoneData[currentMilestoneIndex]?.description ? (
                                <small className='details-container'>Status Description: <br></br> <span className={`app-description ${milestoneData[currentMilestoneIndex] ? 'visible' : ''}`}><li>{milestoneData[currentMilestoneIndex].description?.replace(/[.]/g, "")}</li></span></small>
                            ) : null}
                        </div>

                    </Typography>


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
                            {sessionCookies.user_type === 4 ? (
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
                                        disabled={ !canCompleteCurrentMilestone || 
                                            currentMilestoneIndex < 0 || 
                                            milestoneTimestamps[currentMilestoneIndex]?.completed}
                                    >
                                        Complete Milestone
                                    </button>
                                </div>
                                ) : (
                                    <>
                                    </>
                                )}
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
                        Thank you for viewing Project Details. Check back often for
                        updates!
                    </Typography>

                    {/* {sessionCookies.userPriv_Token === true &&
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
                    )} */}
                    {/* Comments Section */}
                    <Box marginTop="2rem">
                        <Typography variant="h5">Comments</Typography>
                        <List>
                            {chatposts.map((comment, index) => (
                                <div key={index}>
                                <ListItem>
                                    <div style={{ display: 'flex' }}>
                                        <div>{userImgRender(comment.user_id)}</div>
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