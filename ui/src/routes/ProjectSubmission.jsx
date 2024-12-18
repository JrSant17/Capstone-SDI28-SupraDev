import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import { useCookies } from 'react-cookie';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField, Button, Box, FormControl, Chip, InputLabel, Select, MenuItem } from '@mui/material';
import './ProjectSubmission.css';

const languageOptions = ['JavaScript', 'Python', 'Java', 'C++', 'C', 'Zig', 'Ruby', 'Go', 'Rust', 'PHP', 'C#', 'Swift'];

const ProjectSubmission = () => {
  const [sessionCookies] = useCookies(['username_token', 'user_id_token', 'userPriv_Token']);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [coders, setCoders] = useState(1);
  const [languages, setLanguages] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [appPic, setAppPic] = useState("")

  const handleLanguageChange = (event) => {
    setLanguages(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(coders > 2147483647) {
      console.log('user is trolling you.');
      setCoders(1);
    }


    const projectData = {
      submitter_id: sessionCookies.user_id_token,
      name: projectTitle,
      coders_needed: coders,
      problem_statement: projectDescription,
      program_languages: languages,
      project_owner: sessionCookies.user_id_token,
      requirements: requirements,
      end_date: dueDate
    };

    fetch('http://localhost:8080/projects', {
      method: "POST",
      headers: {
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
          setDialogContent(`You must be registered with the system.`);
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
        <form className='projectSubmit' onSubmit={handleSubmit}>       
          <div className="tooltip">
            <h4>Project Title</h4>
            <span className="tooltiptext">Choose a descriptive name for your project</span>
            <TextField
              className="input-text"
              label='Project Title'
              variant="outlined"
              type='text'
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              size='small'
            />
          </div>
          <div className="tooltip">
            <h4>Project Description</h4>
            <span className="tooltiptext">Describe the purpose of your application</span>
            <TextField
              className="input-text"
              label='Project Description'
              variant="outlined"
              type='text'
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              size='small'
              multiline
              rows={4}
            />
          </div>
          <div className="tooltip">
            <h4>Requirements</h4>
            <span className="tooltiptext">Please list detailed requirements and features desired in your application</span>
            <TextField
              className="input-text"
              label='Requirements'
              variant="outlined"
              type='text'
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              size='small'
              multiline
              rows={4}
            />
          </div>
          <div className="tooltip">
            <h4>Picture</h4>
            <span className="tooltiptext">Please provide a URL to be used for your applicaiton logo</span>
            <TextField
              className="input-text"
              label='URL'
              variant="outlined"
              type='url'  
              value={appPic}  
              onChange={(e) => setRequirements(e.target.value)} 
              size='small'
            />
          </div>
          <div className="date-coders-container">
            <div className="tooltip">
              <h4>Due Date</h4>
              <span className="tooltiptext">Select the estimated need date</span>
              <TextField
                className="input-text-small"
                label='Due Date'
                variant="outlined"
                type='date'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                size='small'
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="tooltip">
              <h4>Coders needed</h4>
              <span className="tooltiptext">How many Supracoders do you expect to need?</span>
              <TextField
                className="input-text-small"
                label='numCoders'
                variant="outlined"
                type="number"
                value={coders}
                onChange={(e) => setCoders(e.target.value)}
                size='small'
                rows={4}
              />
            </div>
          </div>
          <FormControl className='form-group' fullWidth margin="normal" size="small">
              <InputLabel>Programming Languages</InputLabel>
              <Select
                  multiple
                  value={languages}
                  onChange={handleLanguageChange}
                  required
                  renderValue={(selected) => (
                      <Box>
                          {Array.isArray(selected) && selected.map((value) => (
                              <Chip key={value} label={value} />
                          ))}
                      </Box>
                  )}
              >
                  {languageOptions.map((lang) => (
                      <MenuItem key={lang} value={lang}>
                        {lang}
                      </MenuItem>
                  ))}
              </Select>
          </FormControl>
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







