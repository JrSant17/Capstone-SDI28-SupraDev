import React from 'react';
import PropTypes from 'prop-types';
import Briefcase01 from '../assets/svg/briefcase-01';
import Mail03 from '../assets/svg/mail-03';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import ComputerIcon from '@mui/icons-material/Computer';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const SocialAbout = (props) => {
  const {
    currentCity,
    job_title,
    email,
    quote,
    languages,
    operating_systems,
    experience,
    time_available,
    availability,
    ...other
  } = props;

  return (
    <Stack
      spacing={3}
      {...other}
    >
      {/* <Card>
        <CardHeader title="Profile Progress" />
        <CardContent>
          <Stack spacing={2}>
            <LinearProgress
              value={profileProgress}
              variant="determinate"
            />
            <Typography
              color="text.secondary"
              variant="subtitle2"
            >
              50% Set Up Complete
            </Typography>
          </Stack>
        </CardContent>
      </Card> */}
      <Card>
        <CardHeader title="About" />
        <CardContent>
          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
            variant="subtitle2"
          >
            &quot;
            {quote}
            &quot;
          </Typography>
          <List disablePadding>
            <ListItem
              disableGutters
              divider
            >
              <ListItemAvatar>
                <SvgIcon color="action">
                  <Briefcase01 />
                </SvgIcon>
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={
                  <Typography variant="subtitle2">
                    {job_title}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem disableGutters divider>
              <ListItemAvatar>
                <SvgIcon color="action">
                  <Mail03/>
                </SvgIcon>
              </ListItemAvatar>

              <ListItemText primary={
                <Typography variant="subtitle2">
                  {email}
                </Typography>} 
              />
            </ListItem>

            <ListItem disableGutters divider>
              <ListItemAvatar>
                <SvgIcon color="action">
                  <ComputerIcon/>
                </SvgIcon>
              </ListItemAvatar>
              <ListItemText 
                  primary={
                    <Typography variant='subtitle2'>
                      Fluent languages: {languages}
                    </Typography>} />
            </ListItem>

            <ListItem disableGutters divider>
              <ListItemAvatar>
                <SvgIcon color='action'>
                  <DeveloperBoardIcon />
                </SvgIcon>
              </ListItemAvatar>
              <ListItemText primary={
                <Typography variant='subtitle2'>
                  Experience level: {experience}
                </Typography>} />
            </ListItem>

            <ListItem disableGutters>
              <ListItemAvatar>
                <SvgIcon color='action'>
                  <AccessTimeIcon />
                </SvgIcon>
              </ListItemAvatar>
              <ListItemText primary={
                <Typography variant='subtitle2'>
                  Hours available each week: {time_available} hours, {availability}
                </Typography>} />
            </ListItem>
            
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
};

SocialAbout.propTypes = {
  currentCity: PropTypes.string.isRequired,
  currentJobCompany: PropTypes.string.isRequired,
  currentJobTitle: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  originCity: PropTypes.string.isRequired,
  previousJobCompany: PropTypes.string.isRequired,
  previousJobTitle: PropTypes.string.isRequired,
  profileProgress: PropTypes.number.isRequired,
  quote: PropTypes.string.isRequired,
};
