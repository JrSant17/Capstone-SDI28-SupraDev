import React, { useEffect, useState } from 'react';
import { Button, Avatar } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import NavbarConnect from './NavbarConnect';


const Navbar = () => {
    const [sessionCookies, removeSessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token', 'user_type']);
    const navigate = useNavigate();
    const [userObj, setUserObj] = useState([])

    let loginButton;
    let logoutButton;
    let currentUserInfo;
    let profileButton;
    let requestsButton;
    let navConnect;

    const userRefetch = async () => {
        //TODO: handle case where cookie's are set but the backend can't find the userid
        if(sessionCookies.user_id_token != undefined){
            await fetch(`http://localhost:8080/users/${sessionCookies.user_id_token}`)
            .then((res) => res.json())
            .then((fetchData) => {
                setUserObj(fetchData)
            })
        }
    }

    useEffect(() => {
        userRefetch();
    }, [sessionCookies.username_token])

    if (sessionCookies.username_token === undefined) {
        loginButton = <Button className="button" onClick={() => navigate('/login')} variant='outlined' color='secondary' style={{ textAlign: 'center', gap: '10px', margin: '10px', backgroundColor: 'transparent', color: "#ffffff", borderColor: "#ffffff" }}>Login Page</Button>;
        navConnect = <></>
    } else {
        loginButton = <></>
        navConnect = <NavbarConnect />
    }


    if (sessionCookies.username_token) {
        logoutButton = <Button onClick={() => { removeSessionCookies('username_token'); removeSessionCookies('user_id_token'); removeSessionCookies('userPriv_Token'); alert('You have been logged out'); navigate('/login') }} variant='outlined' color='error' style={{ textAlign: 'center', gap: '10px', margin: '10px', backgroundColor: 'transparent', color: "red", borderColor: "red" }}>Logout</Button>;
        currentUserInfo = <Avatar src={userObj.profile_pic} alt="User Avatar" style={{ float: 'right', outlineWidth: '1px', outlineColor: 'red', width: '50px', height: '50px' }} />
        requestsButton = <Button onClick={() => navigate('/requests')} variant='outlined' color='secondary' style={{ textAlign: 'center', gap: '10px', margin: '10px', backgroundColor: 'transparent', color: "#ffffff", borderColor: "#ffffff" }}>Submit Request</Button>;
        if (sessionCookies.user_type === 4) {

            profileButton = <Button onClick={() => navigate(`/admin/${sessionCookies.user_id_token}`)} variant='outlined' color='secondary' style={{ textAlign: 'center', gap: '10px', marginLeft: '10px', marginTop: '10px', marginBottom: '10px', marginRight: 'auto', backgroundColor: 'transparent', color: "#ffffff", borderColor: "#ffffff" }}>Admin Dashboard</Button>
        } else {
            profileButton = <Button onClick={() => navigate(`/users/`)} variant='outlined' color='secondary' style={{ textAlign: 'center', gap: '10px', marginLeft: '10px', marginTop: '10px', marginBottom: '10px', marginRight: 'auto', backgroundColor: 'transparent', color: "#ffffff", borderColor: "#ffffff" }}>User Page</Button>
        }
    }

    return (
        <div id='navbar' style={{ display: 'flex', backgroundColor: 'transparent', padding: '10px' }}>
            <Button className="button" onClick={() => navigate('/home')} variant='outlined' color='primary' style={{ textAlign: 'center', gap: '10px', margin: '10px', backgroundColor: 'transparent', color: "#ffffff", borderColor: "#ffffff" }}>Home</Button>
            <Button className="button" onClick={() => navigate('/projects')} variant='outlined' color='secondary' style={{ textAlign: 'center', gap: '10px', margin: '10px', backgroundColor: 'transparent', color: "#ffffff", borderColor: "#ffffff" }}>Projects</Button>
            {requestsButton}
            {profileButton}
            {loginButton}
            {navConnect}
        </div>
    )
}


export default Navbar;