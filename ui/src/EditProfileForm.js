import React from 'react';
import styled from '@emotion/styled';
import { TextField, Button, TextareaAutosize, Box } from '@mui/material';

const EditProfileFormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;

  .form-group {
    width: 100%;
    height: 100%;
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      padding: 8px 16px;
    }
  }
  `;

const EditProfileForm = ({ user, onSubmit, onCancel }) => {
  const [firstName, setFirstName] = React.useState(user.first_name);
  const [lastName, setLastName] = React.useState(user.last_name);
  const [jobTitle, setJobTitle] = React.useState(user.job_title);
  const [command, setCommand] = React.useState(user.command);
  const [profilePic, setProfilePic] = React.useState(user.profile_pic);
  const [email, setEmail] = React.useState(user.email);
  const [userSummary, setUserSummary] = React.useState(user.user_summary);
  const [experience, setExperience] = React.useState(user.experience);
  const [languages, setLanguages] = React.useState(user.languages);
  const [opsystems, setOpSystems] = React.useState(user.opsystems);


  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      profile_pic: profilePic,
      email: email,
      user_summary: userSummary,
      experience: experience,
      languages: languages,
      opsystems: opsystems
    };
    window.location.reload();
    onSubmit(updatedUser)
      .then(() => {
        onCancel();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function SupraCoder(){
      return (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              id="firstName"
              value={firstName}
              style={{marginBottom: '10px'}}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              id="lastName"
              value={lastName}
              style={{marginBottom: '10px'}}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Job Title"
              variant="outlined"
              id="jobTitle"
              value={jobTitle}
              style={{marginBottom: '10px'}}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Profile Picture URL"
              variant="outlined"
              id="profilePic"
              value={profilePic}
              style={{marginBottom: '10px'}}
              onChange={(e) => setProfilePic(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              id="email"
              value={email}
              style={{marginBottom: '10px'}}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Experience"
              variant="outlined"
              id="exp"
              value={experience}
              style={{marginBottom: '10px'}}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Languages"
              variant="outlined"
              id="exp"
              value={languages}
              style={{marginBottom: '10px'}}
              onChange={(e) => setLanguages(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              fullWidth
              label="Operating Systems Experience"
              variant="outlined"
              id="exp"
              value={opsystems}
              style={{marginBottom: '10px'}}
              onChange={(e) => setOpSystems(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              style={{marginBottom: '10px'}}
              fullWidth="100%"
              multiline
              rows={5}
              label="User Summary"
              variant="outlined"
              id="userSummary"
              value={userSummary}
              onChange={(e) => setUserSummary(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="contained" color="primary">
              Update Profile
            </Button>
            <Button onClick={onCancel} variant="outlined" color="primary">
              Cancel
            </Button>
          </div>
        </form>
      )
  }
  function Leadership(){
    return (
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            id="firstName"
            value={firstName}
            style={{marginBottom: '10px'}}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            id="lastName"
            value={lastName}
            style={{marginBottom: '10px'}}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Job Title"
            variant="outlined"
            id="jobTitle"
            value={jobTitle}
            style={{marginBottom: '10px'}}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Command"
            variant="outlined"
            id="jobTitle"
            value={command}
            style={{marginBottom: '10px'}}
            onChange={(e) => setCommand(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Profile Picture URL"
            variant="outlined"
            id="profilePic"
            value={profilePic}
            style={{marginBottom: '10px'}}
            onChange={(e) => setProfilePic(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            id="email"
            value={email}
            style={{marginBottom: '10px'}}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Experience"
            variant="outlined"
            id="exp"
            value={experience}
            style={{marginBottom: '10px'}}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Languages"
            variant="outlined"
            id="exp"
            value={languages}
            style={{marginBottom: '10px'}}
            onChange={(e) => setLanguages(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Operating Systems Experience"
            variant="outlined"
            id="exp"
            value={opsystems}
            style={{marginBottom: '10px'}}
            onChange={(e) => setOpSystems(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            style={{marginBottom: '10px'}}
            fullWidth="100%"
            multiline
            rows={5}
            label="User Summary"
            variant="outlined"
            id="userSummary"
            value={userSummary}
            onChange={(e) => setUserSummary(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <Button type="submit" variant="contained" color="primary">
            Update Profile
          </Button>
          <Button onClick={onCancel} variant="outlined" color="primary">
            Cancel
          </Button>
        </div>
      </form>
    )
  }
  function Customer(){
    return (
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            id="firstName"
            value={firstName}
            style={{marginBottom: '10px'}}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            id="lastName"
            value={lastName}
            style={{marginBottom: '10px'}}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="Profile Picture URL"
            variant="outlined"
            id="profilePic"
            value={profilePic}
            style={{marginBottom: '10px'}}
            onChange={(e) => setProfilePic(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label="POC"
            variant="outlined"
            id="email"
            value={email}
            style={{marginBottom: '10px'}}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <TextField
            style={{marginBottom: '10px'}}
            fullWidth="100%"
            multiline
            rows={5}
            label="User Summary"
            variant="outlined"
            id="userSummary"
            value={userSummary}
            onChange={(e) => setUserSummary(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <Button type="submit" variant="contained" color="primary">
            Update Profile
          </Button>
          <Button onClick={onCancel} variant="outlined" color="primary">
            Cancel
          </Button>
        </div>
      </form>
    )
  }
  
  if(user.job_type == 1){
    return (
      <EditProfileFormContainer>
        <SupraCoder/>
      </EditProfileFormContainer>
    )
  } else if (user.job_type == 2){
    return (
      <EditProfileFormContainer>
        <Leadership/>
      </EditProfileFormContainer>
    )
  } else {
    return (
      <EditProfileFormContainer>
        <Customer/>
      </EditProfileFormContainer>
    )
  }
  
};

export default EditProfileForm;

