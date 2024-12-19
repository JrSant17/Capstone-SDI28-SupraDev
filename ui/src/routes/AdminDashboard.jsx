import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, Box, Avatar, Divider, List, ListItem, ListItemText, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { SHA256 } from 'crypto-js';

const SupracoderProfilePage = () => {
    const [sessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token', 'user_type']);
    const [userObj, setUserObj] = useState([]);
    const [projects, setProjects] = useState([]);
    const [pendingAccounts, setPendingAccounts] = useState([]);
    const [changePassword, setChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [editProfile, setEditProfile] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newJobTitle, setNewJobTitle] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newProfilePic, setNewProfilePic] = useState('');
    const { id } = useParams();

    const userRefetch = async () => {
        await fetch(`http://localhost:8080/users/${id}`)
            .then((res) => res.json())
            .then((fetchData) => setUserObj(fetchData));
    };

    const projectsRefetch = async () => {
        await fetch('http://localhost:8080/projects')
            .then((res) => res.json())
            .then((userFetchData) => setProjects(userFetchData));
    };

    const fetchPendingAccounts = async () => {
        await fetch('http://localhost:8080/users?type=0')
            .then((res) => res.json())
            .then((data) => setPendingAccounts(data));
    };

    useEffect(() => {
        userRefetch();
        projectsRefetch();
        fetchPendingAccounts();
    }, [id]);

    const patchPassword = () => {
        fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "password": SHA256(newPassword).toString(),
            }),
        })
            .then((res) => {
                if (res.ok) {
                    alert('Password successfully changed!');
                    setChangePassword(false);
                } else {
                    alert('Error changing password');
                }
            })
            .catch((err) => console.error("Error changing password:", err));
    };

    const approvePendingAccount = (id, type) => {
        fetch(`http://localhost:8080/users/${id}/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type }),
        })
            .then((res) => {
                if (res.ok) {
                    alert('Account approved successfully!');
                    fetchPendingAccounts();
                } else {
                    alert('Error approving account');
                }
            })
            .catch((err) => console.error("Error approving account:", err));
    };

    const profileSettingsRender = () => {
        if (parseInt(id) === sessionCookies.user_id_token) {
            return (
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6">Profile Settings</Typography>
                        <Button
                            onClick={() => {
                                setNewFirstName(userObj.first_name);
                                setNewLastName(userObj.last_name);
                                setNewJobTitle(userObj.job_title);
                                setNewEmail(userObj.email);
                                setNewDescription(userObj.user_summary);
                                setNewProfilePic(userObj.profile_pic);
                                setEditProfile(true);
                            }}
                            variant="contained"
                            color="primary"
                            style={{ width: "90%", margin: '5px 0' }}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setChangePassword(true)}
                            style={{ width: "90%", margin: '5px 0' }}
                        >
                            Change Password
                        </Button>
                    </CardContent>
                </Card>
            );
        }
        return null;
    };

    const pendingAccountsRender = () => {
        if (pendingAccounts.length > 0) {
            return (
                <Card variant="outlined" style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h6">Pending Accounts</Typography>
                        <List>
                            {pendingAccounts.map((account) => (
                                <ListItem key={account.id}>
                                    <ListItemText
                                        primary={`Username: ${account.username}`}
                                        secondary={`Email: ${account.email}`}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        style={{ marginRight: '10px' }}
                                        onClick={() => approvePendingAccount(account.id, 3)} // Approve as normal user
                                    >
                                        Approve as Normal
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => approvePendingAccount(account.id, 2)} // Approve as leadership
                                    >
                                        Approve as Leadership
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            );
        }
        return <Typography variant="body1">No pending accounts at the moment.</Typography>;
    };

    if (sessionCookies.user_type === 4) {
        return (
            <Box
                display="flex"
                padding="20px"
                height="100vh"
                bgcolor="rgba(255, 255, 255, .85)"
                sx={{ borderRadius: '25px', marginTop: "25px", marginLeft: "50px", marginRight: "50px", marginBottom: "50px" }}
            >
                {/* Side Navigation */}
                <Box display="flex" flexDirection="column" gap="20px" width="250px" pr="20px">
                    <Typography variant="h5" color="primary" mb="20px" sx={{ textAlign: 'center' }}>
                        {`${userObj.first_name}`}'s Profile
                    </Typography>

                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6">Projects</Typography>
                            <Button
                                component={Link}
                                to={`/user/${id}/projects`}
                                variant="contained"
                                color="secondary"
                                style={{ width: "90%", margin: '5px 0' }}
                            >
                                View Projects
                            </Button>
                        </CardContent>
                    </Card>
                    {profileSettingsRender()}
                </Box>

                <Divider orientation="vertical" flexItem />

                {/* Main Content */}
                <Box flex={1} pl="20px">
                    {/* User Info */}
                    <Box display="flex" alignItems="center" gap="20px" mb="30px" style={{ position: 'relative' }}>
                        <Avatar src={userObj.profile_pic} alt="User Avatar" style={{ width: '150px', height: '150px' }} />
                        <Box>
                            <Typography variant="h5" gutterBottom>{userObj.username}</Typography>
                        </Box>
                    </Box>

                    {/* Pending Accounts */}
                    <Box mb="30px">
                        <Typography variant="h6" mb="20px">Pending Accounts</Typography>
                        {pendingAccountsRender()}
                    </Box>

                    {/* Change Password */}
                    {ChangePasswordComponent()}
                </Box>
            </Box>
        );
    } else {
        return <p>Sorry, chief, this person ain't a coder</p>;
    }
}

export default SupracoderProfilePage;
