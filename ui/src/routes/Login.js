import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {
  Button, Dialog, DialogTitle,
  DialogContent, DialogContentText,
  DialogActions, TextField,
  Paper, Card,
} from '@mui/material';
import { SHA256 } from 'crypto-js';
import CreateAccount from '../components/createAccount';

const Login = () => {
  const [usersSummary, setUsersSummary] = useState([]);
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  const [sessionCookies, setSessionCookies, removeSessionCookies] = useCookies([
    'username_token',
    'user_id_token',
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    usersRefetch();
  }, []);

  const usersRefetch = async () => {
    await fetch('http://localhost:8080/users')
      .then((res) => res.json())
      .then((userFetchData) => setUsersSummary(userFetchData));
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const displayDialogMessage = (title, message) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const LogIntoAccount = async () => {
    let accountMatch = false;
    for (var element of usersSummary) {
      if (element.username === usernameLogin) {
        accountMatch = true;
        if (element.password === SHA256(passwordLogin).toString()) {
          removeSessionCookies('user_id_token');
          removeSessionCookies('username_token');
          setSessionCookies('user_id_token', element.id, { path: '/' });
          setSessionCookies('username_token', element.username, { path: '/' });
          setSessionCookies('userPriv_Token', element.is_supracoder, { path: '/' });
          navigate('/home');
          window.location.reload();
          setUsernameLogin('');
          setPasswordLogin('');
          displayDialogMessage(
            'Login Successful',
            `Login successful for ${element.first_name} ${element.last_name}.`
          );
          break;
        } else {
          displayDialogMessage(
            'Incorrect Password',
            `Incorrect password for ${element.first_name} ${element.last_name}.`
          );
          break;
        }
      }
    }
    if (!accountMatch) {
      displayDialogMessage('Account Not Found', 'No account found for that username.');
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
              className="inputText"
              label="Username"
              variant="outlined"
              type="text"
              value={usernameLogin}
              onChange={(e) => setUsernameLogin(e.target.value)}
              placeholder="Username"
              size="small"
              margin="normal"
            />
            <TextField
              fullWidth
              className="inputText"
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
              type="submit"
              variant="contained"
              color="secondary"
              style={{ marginTop: '15px' }}
              onClick={() => LogIntoAccount()}
            >
              Login
            </Button>
          </form>
        </Card>
        <CreateAccount />
      </Paper>

      {/* Dialog for displaying messages */}
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

