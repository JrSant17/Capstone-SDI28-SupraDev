import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.css';

import Login from './routes/Login';
import Navbar from './components/Navbar';
import AdminDashboard from './routes/AdminDashboard';
import Home from './routes/Home';
import MyProjects from './routes/MyProjects';
import Projects from './routes/Projects';
import LandingPage from './routes/LandingPage';
import ProjectSubmission from './routes/ProjectSubmission';
import ProjectDetailsPage from './routes/ProjectDetailsPage';
import ProfilePage from './routes/MyProfile';
import UserList from './routes/UserList';
import ProjectStatus from './routes/ProjectStatus';

function Content() {
  const location = useLocation();
  const [backgroundImage, setBackgroundImage] = useState('/cyber-background.jpg');

  useEffect(() => {
    const routeTitles = {
      "/": "Welcome to Supra Dev",
      "/home": "Home - Supra Dev",
      "/login": "Login - Supra Dev",
      "/admin/:id": "Admin Dashboard - Supra Dev",
      "/profile/:id/projects": "My Projects - Supra Dev",
      "/projects": "Projects - Supra Dev",
      "/requests": "Project Submission - Supra Dev",
      "/projects/:projectId": "Bounty Details - Supra Dev",
      "/projects/:id/chat": "Project Chat - Supra Dev",
      "/users": "User Profile - Supra Dev",
      "/users/:id": "Other User Profile - Supra Dev",
      "/userlist": "User List - Supra Dev"
    };

    const defaultTitle = "Supra Dev";
    document.title = routeTitles[location.pathname] || defaultTitle;
    switch (location.pathname) {
      case '/':
        setBackgroundImage('/cyber-background.jpg');
        break;
      case '/projects':
        setBackgroundImage('/space-background-blue.png');
        break;
      case '/users/':
        setBackgroundImage('/supra-profile-img.png');
        break;
      default:
        setBackgroundImage('/cyber-background.jpg');
    }
  }, [location]);

  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <TransitionGroup>
        <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/:id" element={<AdminDashboard />} />
            <Route path="/user/:id/projects" element={<MyProjects />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/requests" element={<ProjectSubmission />} />
            <Route path="/projects/:id" element={<ProjectDetailsPage />} />
            <Route path="/users" element={<ProfilePage />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/myprojects" element={<MyProjects />} />
            <Route path="/projects/:id/status" element={<ProjectStatus />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <style>{`
        body {
          background-image: url(${backgroundImage});
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
          transition: background-image 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}

function App() {
  return (
    <Router>
      <Content />
    </Router>
  );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);