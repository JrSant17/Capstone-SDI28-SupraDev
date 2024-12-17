import React, { useState } from "react";
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import { useCookies } from 'react-cookie';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ProjectSubmission = () => {
  const [sessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token']);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  const user_id_token = sessionCookies.user_id_token;

  const handleSubmit = (e) => {
    e.preventDefault();

    const projectData = {
      submitter_name: `${firstName} ${lastName}`,
      submitter_email: email,
      submitter_unit: unit,
      project_title: projectTitle,
      project_description: projectDescription,
      requirements: requirements,
      due_date: dueDate
    };

    fetch('http://localhost:8080/projects', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${user_id_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(projectData)
    })
      .then(res => {
        if(res.status == 201){
          res.json()
          setDialogOpen(true);
          setDialogContent("Project Submitted!");
          console.log(res.json);
        } else if(res.status == 400){
          setDialogOpen(true);
          setDialogContent(`You must be registered with the system. Email: ${email} is not registered`);
        }
      })
      .catch(err => {
        console.error(err);
        setDialogOpen(true);
        setDialogContent("Error submitting project.");
      });
  };

  return (
    <div className="submission" sx={{ justifyContent: "center" }}>
      <Card sx={{
        minWidth: 400,
        maxWidth: 1000,
        m: 2,
        marginLeft: '20%',
        marginRight: '20%',
        padding: 1,
        textAlign: 'center',
        background: "rgba(255,255,255, 0.85)",
        borderRadius: '25px',
        marginTop: '25px'
      }} id='submitContainer'>
        <h3>Project Submission Form</h3>
        <form id='projectSubmit' onSubmit={handleSubmit}>
          <div>
            <h4>Requestor's Name</h4>
            <TextField
              label='First Name'
              variant="outlined"
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              size='small'
              style={{ margin: '10px' }}
            />
            <TextField
              label='Last Name'
              variant="outlined"
              type='text'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              size='small'
              style={{ margin: '10px' }}
            />
          </div>
          <div>
            <h4>Requestor's Email</h4>
            <TextField
              label='Email'
              variant="outlined"
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size='small'
              style={{ margin: '10px' }}
            />
          </div>
          <div>
            <h4>Requestor's Unit</h4>
            <TextField
              label='Unit'
              variant="outlined"
              type='text'
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              size='small'
              style={{ margin: '10px' }}
            />
          </div>
          <div>
            <h4>Project Title</h4>
            <TextField
              label='Project Title'
              variant="outlined"
              type='text'
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              size='small'
              style={{ margin: '10px' }}
            />
          </div>
          <div>
            <h4>Project Description</h4>
            <TextField
              label='Project Description'
              variant="outlined"
              type='text'
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              size='small'
              multiline
              rows={4}
              style={{ margin: '10px' }}
            />
          </div>
          <div>
            <h4>Requirements</h4>
            <TextField
              label='Requirements'
              variant="outlined"
              type='text'
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              size='small'
              multiline
              rows={4}
              style={{ margin: '10px' }}
            />
          </div>
          <div>
            <h4>Due Date</h4>
            <TextField
              label='Due Date'
              variant="outlined"
              type='date'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              size='small'
              style={{ margin: '10px' }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <Button type='submit' variant='contained' color='secondary' style={{ gap: '10px', margin: '10px' }}>
            Submit
          </Button>
        </form>
      </Card>
      {dialogOpen && (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Submission Status"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogContent}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectSubmission;







