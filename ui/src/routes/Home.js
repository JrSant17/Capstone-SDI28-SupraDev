import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Card, CardContent, CardHeader, Grid, Typography, Paper, Button, Divider
} from '@mui/material';
import { useCookies } from 'react-cookie';
import { styled, useTheme } from '@mui/system';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Notification from '../components/Notifications'
import { useNavigate } from 'react-router-dom';
import MilestoneBar from '../components/milestoneBar';

const HomePage = () => {
    const theme = useTheme();
    const [recentProjects, setRecentProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [usersProjects, setUsersProjects] = useState([]);
    const [sessionCookies, setSessionCookies, removeSessionCookies] = useCookies([
    'username_token',
    'user_id_token',
    'userPriv_Token',
    'user_type'
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentProjectsWithUserInfo = async () => {
          setIsLoading(true);
          try {
            const projectsWithUserInfo = await getMostRecentProjectInfo(5);
            setRecentProjects(projectsWithUserInfo);
          } catch (error) {
            console.error('Error fetching projects:', error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchRecentProjectsWithUserInfo();
        getUserProjectInfo();
      }, []);

    const getMostRecentProjectInfo = async (numberProjects) => {
        try {
            const projectsResponse = await fetch(`http://localhost:8080/projects?_sort=last_updated&_order=desc&_limit=${numberProjects}&is_accepted=true`);
            if (!projectsResponse.ok) {
              throw new Error('non 200 resp code');
            }
            const projects = await projectsResponse.json();
        
            const projectsWithUserInfo = await Promise.all(projects.map(async (project) => {
                //TODO: this info should probably be in the user_projects table!
              const [submitterResponse, acceptorResponse] = await Promise.all([
                fetch(`http://localhost:8080/users/${project.submitter_id}`),
                fetch(`http://localhost:8080/users/${project.accepted_by_id}`)
              ]);
        
              const submitterData = await submitterResponse.json();
              const acceptorData = await acceptorResponse.json();
        
              return {
                ...project,
                submitter: {
                  username: submitterData.username,
                  avatar_url: submitterData.avatar_url
                },
                acceptor: {
                  username: acceptorData.username,
                  avatar_url: acceptorData.avatar_url
                }
              };
            }));
        
            return projectsWithUserInfo;
          } catch (error) {
            console.error('Error fetching recent prokects:', error);
            return [];
          }
    }

    const getUserProjectInfo = async () => {
        try {
            const userProj = await fetch(`http://localhost:8080/user_projects/${sessionCookies.user_id_token}`);
            if (!userProj.ok) {
                throw new Error('Failed to fetch user projects');
            }
            const userProjects = await userProj.json();
            const detailedProjects = await Promise.all(userProjects.map(async (userProject) => {
                const projectResponse = await fetch(`http://localhost:8080/projects/${userProject.project_id}`);
                if (!projectResponse.ok) {
                    console.error(`Failed to fetch details for project ${userProject.project_id}`);
                    return { ...userProject, details: null };
                }
                const projectDetails = await projectResponse.json();
                return { ...userProject, details: projectDetails };
            }));
    
            setUsersProjects(detailedProjects);
        } catch (error) {
            console.error('Error fetching user project info:', error);
        }
    }

    const handleProjectClick = (projectId) => (e) => {
        e.preventDefault();
        navigate(`/projects/${projectId}`);
    };

    const spaceSoftware = [
        {
            title: "SSC Data-Management Software Plays Critical Role in SDA, Afghanistan Airlift",
            description: "Sophisticated data management and analytic software programs are not only enhancing Space Systems Command’s (SSC) ability to carry out its Space Domain Awareness mission, but also have been leveraged to provide a rapid response to humanitarian crises across the globe. \"Data is the life blood of our digital force and our commercial partners have a lot that they can offer,” said Col. Jennifer M. Krolikowski, senior materiel leader for SSC Enterprise Corps’ West Coast data/cyber coding factory serving the United States Space Force (USSF). “These commercial solutions allow us to go faster which ultimately helps us turn that data into knowledge to drive decision-making.\”",
            link: "https://www.spaceforce.mil/News/Article-Display/Article/2813059/ssc-data-management-software-plays-critical-role-in-sda-afghanistan-airlift/"
        },
        {
            title: "The ever-evolving digital war fighter",
            description: "Supra coders are Airmen and Guardians who develop, manage, and design software for the U.S. Space Force. These individuals serve in a variety of specialties. Once they complete the Software Development Immersive (SDI) class, a software development boot camp that teaches full-stack JavaScript development and application deployment, they return to their bases to begin developing applications and solutions. U.S. Air Force Tech. Sgt. Urich Garcia, 45th Security Forces Squadron supra coder, and U.S. Air Force Staff Sgt. Brian Hardy, 45th SFS supra coder, completed the SDI class December 3, 2021 making them the first supra coders at Patrick SFB and the first supra coders in the security forces career field.",
            link: "https://www.spaceforce.mil/News/Article-Display/Article/3029674/the-ever-evolving-digital-war-fighter/"
        },
        {
            title: "Digital University: Enabling a force for the future",
            description: "Maintaining the U.S. Space Force’s strategic advantage in the space domain requires cutting-edge technology, but it also takes a workforce that can effectively and efficiently leverage that technology. To develop its force for the future, the Space Force is working with industry to provide educational resources in topics like Data Science, Artificial Intelligence, Software Development, Product Management, Design, Cybersecurity and Cloud Architecture through its Digital University.",
            link: "https://www.spaceforce.mil/News/Article/2926515/digital-university-enabling-a-force-for-the-future/"
        },
        {
            title: "Space Cockpit a new way to visualize space operations",
            description: "Space Cockpit is a situational awareness tool that allows satellite operators to visualize the satellites they control in a real-time, video game-like application. Originally commercial software, 1st Lieutenants Tory Smith and Jacqueline Cromer, Space Commercially Augmented Mission Platform (Space CAMP) software development leads, along with their product development team, spent months developing the software for Space Force professional’s use.",
            link: "https://www.spaceforce.mil/News/Article/2434500/space-cockpit-a-new-way-to-visualize-space-operations/"
        },
        {
            title: "392d CTS completes its first USEUCOM-focused SPACE FLAG exercise",
            description: "...“For the first time in SPACE FLAG, Cyber Guardians and Super Coders planned and executed simulated combat operations in real-time throughout the entirety of the exercise,” said U.S. Space Force Capt. Karl Pruhsmeier, 392d CTS and SPACE FLAG 23-1 exercise director. “Using a U.S. Air Force cyber range, the 527th Space Aggressor squadron was able to help us train multi-domain mission planning and execution, which exposed numerous opportunities to enhance mission assurance for orbital warfare, space domain awareness, space battle management, and other space warfighting functions.”",
            link: "https://www.spaceforce.mil/News/Article-Display/Article/3251072/392d-cts-completes-its-first-useucom-focused-space-flag-exercise/"
        }

    ]

    return (
        <Box
            component={motion.div}
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
                backgroundImage: 'url(/path-to-your-space-background-image)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Hero Section */}
            <Paper elevation={3} sx={{
                width: '100%',
                textAlign: 'center',
                padding: '40px 0',
                mb: 4,
                backgroundImage: 'url(https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/9-abstract-smoke-duxx.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                color: '#FFF',
                borderRadius: '15px',
            }}>
                <Typography variant="h2" fontWeight="600" fontFamily="'Orbitron', sans-serif">
                    Welcome to Supra Dev!
                </Typography>
                <Typography variant="subtitle1" mt={2} fontFamily="'Orbitron', sans-serif">
                    Bridging the Gap Between Creativity and Collaboration
                </Typography>
                {sessionCookies.user_type === 1 || sessionCookies.user_type === 2 || sessionCookies.user_type === 3 || sessionCookies.user_type === 4 ? (
                    <>
                    </>
                ): (
                        <Link to="/Login" style={{ textDecoration: 'none', marginTop: '20px' }}>
                            <Box mt={3}>
                                <Button variant="contained" style={{ backgroundColor: theme?.palette?.primary?.main || 'purple', color: '#fff' }} endIcon={<ArrowForwardIcon />}>
                                    Login to see your projects
                                </Button>
                            </Box>
                        </Link>
                )}
            </Paper>
            <Grid container spacing={2} sx={{ width: '100%' }}>
                {/* Notifications */}
                <Grid item xs={20} md={3}>
                    <Card elevation={3} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(5px)' }}>
                        <CardHeader title="Recent Activity" titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }} />
                        <Typography variant="subtitle2" color="textSecondary">
                            {`There are currently ${recentProjects.length} projects being worked, 5 most recent:`}
                        </Typography>
                        <CardContent>
                            {recentProjects.slice(0, 5).map((project) => (
                                <div className="notification-section" key={project.id}>
                                    <Notification
                                        project={project}
                                        username={project.acceptor.username}
                                        submitter={project.submitter.username}
                                        submittedUserId={project.submitter_id}
                                        acceptedUserId={project.accepted_by_id}
                                        submitterImg={project.submitter.avatar_url}
                                        acceptedImg={project.acceptor.avatar_url}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>


                {sessionCookies.user_type === 1 || sessionCookies.user_type === 2 || sessionCookies.user_type === 3 || sessionCookies.user_type === 4 ? (
                    <Grid item xs={12} md={9}>
                        <Card elevation={3} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                            <CardHeader
                                title="Project Status"
                                titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
                            />
                            <CardContent>
                                <div className='project-status-container' style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                }}>
                                    {usersProjects.map((userProject) => (
                                        <div key={userProject.project_id} 
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                backgroundColor: '#f5f5f5',
                                                padding: '15px',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <div className='project-info' style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'auto 1fr',
                                                gap: '10px',
                                                marginBottom: '15px'
                                            }}>
                                                <div style={{ gridColumn: '1 / -1', fontWeight: 'bold', fontSize: '1.2em', marginBottom: '10px' }}>
                                                    {userProject.details?.name || 'Project name unknown'}
                                                </div>
                                                <div style={{ fontWeight: 'bold' }}>End Date:</div>
                                                <div>{userProject.details?.end_date || 'No end date'}</div>
                                                <div style={{ fontWeight: 'bold' }}>Working Repository:</div>
                                                <div>
                                                    {userProject.details?.github_url ?
                                                        <a href={userProject.details.github_url} target="_blank" rel="noopener noreferrer">GitHub Repository</a>
                                                        : 'No repo'}
                                                </div>
                                                <div style={{ fontWeight: 'bold' }}>Coders needed:</div>
                                                <div>{userProject.details?.coders_needed || 'No coders needed'}</div>
                                            </div>
                                            <div className='status-bars' style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                            }}
                                            onClick={handleProjectClick(userProject.project_id)}
                                            >
                                                <MilestoneBar id={userProject.project_id} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ): (
                        <Grid item xs={10} md={9}>
                            <Card className="card" elevation={3}>
                                <CardHeader title="Space Software News" titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }} />
                                <CardContent>
                                    {spaceSoftware.map((softwareItem, index) => (
                                        <div key={index}>
                                            <Typography variant="h6" color="primary">
                                                <a href={softwareItem.link} target="_blank" rel="noopener noreferrer">{softwareItem.title.slice(0, 100)}</a>
                                            </Typography>
                                            <Typography variant="body1" mt={1}>
                                                {softwareItem.description.slice(0, 500)}...
                                            </Typography>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                )}
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ width: '100%', textAlign: 'center', mt: 4, color: 'white', backgroundImage: 'linear-gradient(135deg, #020024 0%, #090979 37%, #00d4ff 100%)' }}>

                <Typography variant="body2">
                    © 2024 Supra Dev. All Rights Reserved.
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;
