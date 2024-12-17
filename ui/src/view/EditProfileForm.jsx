import React from 'react';
import styled from '@emotion/styled';
import { TextField, Button, Box, RadioGroup, Radio, FormControlLabel, FormControl, Chip, InputLabel, Select, MenuItem } from '@mui/material';


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
  const [languages, setLanguages] = React.useState(Array.isArray(user.languages) ? user.languages : []);
  const [operatingSystems, setOperatingSystems] = React.useState(Array.isArray(user.operating_systems) ? user.operating_systems : []);

  const [time_available, setTimeAvailable] = React.useState(user.time_available);
  const [availability, setAvailability] = React.useState(user.availability);

  const experienceOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const languageOptions = ['JavaScript', 'Python', 'Java', 'C++', 'C', 'Zig', 'Ruby', 'Go', 'Rust', 'PHP', 'C#', 'Swift'];
  const osOptions = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];


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
      operating_systems: operatingSystems,
      time_available: time_available,
      availability: availability
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

  const handleLanguageChange = (event) => {
    setLanguages(event.target.value);
  };

  const handleOSChange = (event) => {
    setOperatingSystems(event.target.value);
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
          
          <FormControl className='form-group' fullWidth margin="normal" size="small">
            <InputLabel>Experience Level</InputLabel>
              <Select
                value={experience}
                label="Experience Level"
                onChange={(e) => setExperience(e.target.value)}
                required
                >
                {experienceOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
          </FormControl>

          <FormControl className='form-group' fullWidth margin="normal" size="small">
              <InputLabel>Programming Languages</InputLabel>
              <Select
                  multiple
                  value={languages}
                  onChange={handleLanguageChange}
                  required
                  renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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

          <FormControl className='form-group' fullWidth margin="normal" size="small">
                            <InputLabel>Operating Systems</InputLabel>
                            <Select
                                multiple
                                value={operatingSystems}
                                onChange={handleOSChange}
                                required
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {osOptions.map((os) => (
                                    <MenuItem key={os} value={os}>
                                        {os}
                                    </MenuItem>
                                ))}
                            </Select>
          </FormControl>
          
          <div className="form-group">
            <TextField
              fullWidth
              label="Working Hours"
              variant="outlined"
              id="week_hours"
              value={time_available}
              style={{marginBottom: '10px'}}
              onChange={(e) => setTimeAvailable(e.target.value)}
            />
          </div>
          <div className="form-group">
              <RadioGroup id='radio-group' defaultValue="Available!"  name="radio-buttons-group" onChangeCapture={(e) => setAvailability(e.target.value)}>
                <FormControlLabel value={true} control={<Radio />} label='Available! :)'/>
                <FormControlLabel value={false} control={<Radio />} label='Not Available! :( (leave, sick call, etc.)'/>
              </RadioGroup>
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
            value={operatingSystems}
            style={{marginBottom: '10px'}}
            onChange={(e) => setOperatingSystems(e.target.value)}
          />
        </div>
        <div className="form-group">
            <TextField
              fullWidth
              label="Working Hours"
              variant="outlined"
              id="week_hours"
              value={time_available}
              style={{marginBottom: '10px'}}
              onChange={(e) => setTimeAvailable(e.target.value)}
            />
          </div>
          <div className="form-group">
              <RadioGroup id='radio-group' defaultValue="Available!"  name="radio-buttons-group" onChangeCapture={(e) => setAvailability(e.target.value)}>
                <FormControlLabel value={true} control={<Radio />} label='Available! :)'/>
                <FormControlLabel value={false} control={<Radio />} label='Not Available! :( (leave, sick call, etc.)'/>
              </RadioGroup>
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
  function Admin(){
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
  
  if(user.type == 1){
    return (
      <EditProfileFormContainer>
        <SupraCoder/>
      </EditProfileFormContainer>
    )
  } else if (user.type == 2){
    return (
      <EditProfileFormContainer>
        <Leadership/>
      </EditProfileFormContainer>
    )
  } else if (user.type == 3) {
    return (
      <EditProfileFormContainer>
        <Customer />
      </EditProfileFormContainer>
    )
  } else if (user.type == 4) {
    <EditProfileFormContainer>
      <Admin />
    </EditProfileFormContainer>
  }
  
};

export default EditProfileForm;

