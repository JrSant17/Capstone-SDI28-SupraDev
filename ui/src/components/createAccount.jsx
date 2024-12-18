import { useState } from 'react';
import {
    Button,Dialog,DialogTitle,DialogContent,
    DialogContentText,DialogActions,TextField,Card,
    FormControl,InputLabel,Select, MenuItem, 
    Chip, Box
  } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CreateAccount() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [password, setPassword] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [availability, setAvailability] = useState('');
    const [experience, setExperience] = useState('');
    const [languages, setLanguages] = useState([]);
    const [operatingSystems, setOperatingSystems] = useState([]);
    const [timeAvailable, setTimeAvailable] = useState(2);

    const [defProfilePic, setDefProfilePic] = useState(
      'https://as1.ftcdn.net/v2/jpg/02/85/15/18/1000_F_285151855_XaVw4eFq1QufklRbMFDxdAJos1OadAD1.jpg'
    );
    const [usersSummary, setUsersSummary] = useState([]);
    const [userType, setUserType] = useState('normal');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [command, setCommand] = useState('');

    const experienceOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const languageOptions = ['JavaScript', 'Python', 'Java', 'C++', 'C', 'Zig', 'Ruby', 'Go', 'Rust', 'PHP', 'C#', 'Swift'];
    const osOptions = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
    const navigate = useNavigate();

    const handleLanguageChange = (event) => {
        setLanguages(event.target.value);
    };

    const handleOSChange = (event) => {
        setOperatingSystems(event.target.value);
    };

    const handleTimeAvailableChange = (event) => {
        setTimeAvailable(event.target.value);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    
      const displayDialogMessage = (title, message) => {
        setDialogTitle(title);
        setDialogMessage(message);
        setDialogOpen(true);
    };

    const usersRefetch = async () => {
        await fetch('http://localhost:8080/users')
          .then((res) => res.json())
          .then((userFetchData) => setUsersSummary(userFetchData));
      };

    const CreateAccount = async () => {
        console.log(jobTitle)
        let profPicToSet = '';
        let submitUserType;
        let isSupraVal = false;
        if(userType == 'normal') {
            submitUserType = 3;
        } else if(userType == 'supracoder') {
            submitUserType = 1;
            isSupraVal = true;
            console.log(`is supra: ${isSupraVal}`)
        } else if(userType == 'leadership') {
            submitUserType = 2;
        } else if(userType == 'admin') {
            submitUserType = 4;
        }

        if (profilePic === '') {
          profPicToSet = defProfilePic;
        } else {
          profPicToSet = profilePic;
        }

        console.log(`submitted password ${password}`);

        await fetch('http://localhost:8080/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },


          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            job_title: jobTitle,
            type: submitUserType,
            password: password.toString(),
            profile_pic: profPicToSet,
            availability: availability,
            experience: experience,
            languages: languages,
            operating_systems: operatingSystems,
            time_available: timeAvailable,
            user_summary: `Username: ${username} \n email: ${email}`,
            is_supracoder: isSupraVal,
            command: command
          }),
        })
        .then((resp) => {
            if(resp.status == 201){
                new Promise((resolve) => {
                    resetForm();
                    displayDialogMessage('Account Created', 'Please login now.');
                    setTimeout(resolve, 2000);
                  })
                  .then(() => {
                    usersRefetch();
                  });
            } else if(resp.status == 500){
                displayDialogMessage('Creation Failure','Account creation failure!');
            } else if(resp.status == 409) {
                resp.json().then(errorData => {
                    displayDialogMessage('Account Taken', `${errorData.error}`);
                });
            }
        })
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setUsername('');
        setEmail('');
        setJobTitle('');
        setPassword('');
        setProfilePic('');
        setAvailability('');
        setExperience('');
        setLanguages([]);
        setOperatingSystems([]);
        setTimeAvailable(2);
        setUserType('normal');
      };

    return(
        <>
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
                id="createAccountContainer"
            >
                <h3>Create Account</h3>
                <div id="createAccountInputName">
                    <TextField
                        fullWidth
                        className="inputText"
                        label="First Name"
                        variant="outlined"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        size="small"
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        className="inputText"
                        label="Last Name"
                        variant="outlined"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        size="small"
                        margin="normal"
                        required
                    />
                </div>
                <div id="createAccountUserCreds">
                    <TextField
                        fullWidth
                        className="inputText"
                        label="Username"
                        variant="outlined"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        size="small"
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        className="inputText"
                        label="email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        size="small"
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        className="inputText"
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        size="small"
                        margin="normal"
                        required
                    />
                </div>
                <div id="createAccountPicNDesc">
                    <TextField
                        fullWidth
                        className="inputText"
                        label="Profile Picture URL"
                        variant="outlined"
                        type="text"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        placeholder="Profile Picture URL"
                        size="small"
                        margin="normal"
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        className="inputText"
                        label="Job Title"
                        variant="outlined"
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Job Title"
                        size="small"
                        margin="normal"
                    />
                </div>
                <FormControl fullWidth margin="normal" size="small">
                    <InputLabel id="user-type-label">User Type</InputLabel>
                    <Select
                        labelId="user-type-label"
                        value={userType}
                        label="User Type"
                        onChange={(e) => setUserType(e.target.value)}
                    >
                        <MenuItem value="normal">Normal User</MenuItem>
                        <MenuItem value="leadership">Leadership</MenuItem>
                        <MenuItem value="supracoder">Supracoder</MenuItem>
                    </Select>
                </FormControl>

                {userType === 'supracoder' && (
                    <>
                        <FormControl fullWidth margin="normal" size="small">
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

                        <FormControl fullWidth margin="normal" size="small">
                            <InputLabel>Programming Languages</InputLabel>
                            <Select
                                multiple
                                value={languages}
                                onChange={handleLanguageChange}
                                required
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
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

                        <TextField
                            fullWidth
                            className="inputText"
                            label="Operating System(s)"
                            variant="outlined"
                            type="text"
                            value={operatingSystems}
                            onChange={(e) => setOperatingSystems(e.target.value)}
                            // placeholder="Availability (times of day + timezone)"
                            size="small"
                            margin="normal"
                            required
                        />

                        <FormControl fullWidth margin="normal" size="small" required>
                            <InputLabel>Time Available per Week</InputLabel>
                            <Select
                                value={timeAvailable}
                                label="Time Available per Week"
                                onChange={handleTimeAvailableChange}
                            >
                                <MenuItem value={1}>1 hour</MenuItem>
                                <MenuItem value={2}>2 hours</MenuItem>
                                <MenuItem value={5}>5 hours</MenuItem>
                                <MenuItem value={10}>10 hours</MenuItem>
                                <MenuItem value={20}>20 hours</MenuItem>
                                <MenuItem value={30}>30 hours</MenuItem>
                                <MenuItem value={40}>40 hours</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            className="inputText"
                            label="Availability"
                            variant="outlined"
                            type="text"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            placeholder="Availability (times of day + timezone)"
                            size="small"
                            margin="normal"
                            required
                        />
                    </>
                )}

                {userType === 'leadership' && (
                    <>
                        <TextField
                            fullWidth
                            className="inputText"
                            label="Current Command"
                            variant="outlined"
                            type="text"
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            placeholder="Current Command"
                            size="small"
                            margin="normal"
                            required
                        />

                        <FormControl fullWidth margin="normal" size="small">
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

                        <FormControl fullWidth margin="normal" size="small">
                            <InputLabel>Programming Languages</InputLabel>
                            <Select
                                multiple
                                value={languages}
                                onChange={handleLanguageChange}
                                required
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
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

                        <TextField
                            fullWidth
                            className="inputText"
                            label="Operating System(s)"
                            variant="outlined"
                            type="text"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            // placeholder="Availability (times of day + timezone)"
                            size="small"
                            margin="normal"
                            required
                        />

                        <FormControl fullWidth margin="normal" size="small" required>
                            <InputLabel>Time Available per Week</InputLabel>
                            <Select
                                value={timeAvailable}
                                label="Time Available per Week"
                                onChange={handleTimeAvailableChange}
                            >
                                <MenuItem value={1}>1 hour</MenuItem>
                                <MenuItem value={2}>2 hours</MenuItem>
                                <MenuItem value={5}>5 hours</MenuItem>
                                <MenuItem value={10}>10 hours</MenuItem>
                                <MenuItem value={20}>20 hours</MenuItem>
                                <MenuItem value={30}>30 hours</MenuItem>
                                <MenuItem value={40}>40 hours</MenuItem>
                            </Select>
                        </FormControl>

                    </>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    style={{ marginTop: '15px' }}
                    onClick={() => CreateAccount()}
                >
                    Create Account
                </Button>
            </Card>
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
}


