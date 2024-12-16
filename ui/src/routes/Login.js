import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {
  Button, Dialog, DialogTitle,
  DialogContent, DialogContentText,
  DialogActions, TextField,
  Paper, Card,
} from '@mui/material';
import CreateAccount from '../components/createAccount';

const Login = () => {
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const [setSessionCookies, removeSessionCookies] = useCookies([
    'username_token',
    'user_id_token',
  ]);
  const navigate = useNavigate();

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const displayDialogMessage = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const LogIntoAccount = async () => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: usernameLogin,
          password: passwordLogin,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Set session cookies
        removeSessionCookies('user_id_token');
        removeSessionCookies('username_token');
        setSessionCookies('user_id_token', data.user.id, { path: '/' });
        setSessionCookies('username_token', data.user.username, { path: '/' });
        setSessionCookies('userPriv_Token', data.user.is_supracoder, { path: '/' });

        // Navigate to home and display success message
        navigate('/home');
        window.location.reload();
        setUsernameLogin('');
        setPasswordLogin('');
        displayDialogMessage(
          'Login Successful',
          `Welcome back, ${data.user.first_name} ${data.user.last_name}!`
        );
      } else {
        const errorData = await response.json();
        displayDialogMessage('Login Failed', errorData.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      displayDialogMessage('Error', 'An error occurred during login. Please try again.');
    }
  };

  return (
    <>
      <Paper
        elevation={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(255,255,255, 0)',
          margin: '0 auto',
          padding: '20px',
          maxWidth: '920px',
        }}
      >
        <Card
          sx={{
            width: ['90%', '70%', '60%'],
            m: 2,
            padding: 2,
            textAlign: 'center',
            borderRadius: '25px',
            background: 'rgba(255,255,255, 0.9)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          id="loginContainer"
        >
          <h3>Login</h3>
          <form id="loginCreds">
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={usernameLogin}
              onChange={(e) => setUsernameLogin(e.target.value)}
              placeholder="Username"
              size="small"
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
              placeholder="Password"
              size="small"
              margin="normal"
            />
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="secondary"
              style={{ marginTop: '15px' }}
              onClick={LogIntoAccount}
            >
              Login
            </Button>
          </form>
        </Card>
        <CreateAccount />
      </Paper>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Login;
