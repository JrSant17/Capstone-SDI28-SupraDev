import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Login from "./routes/Login";
import Navbar from "./Navbar";
import SupracoderProfilePage from "./routes/SupracoderProfilePage";
import Home from "./routes/Home";
import MyBounties from "./routes/MyBounties";
import Projects from "./routes/Projects";
import LandingPage from './routes/LandingPage';
import ProjectSubmission from "./routes/ProjectSubmission";
import BountyDetailsPage from "./routes/BountyDetailsPage";
import GenUser from "./routes/MyProfile";
import OtherUser from "./routes/OthersProfile";
import UserList from "./routes/UserList";

function Content() {
  const location = useLocation();

  useEffect(() => {
    const routeTitles = {
      "/": "Welcome to Supra Dev",
      "/home": "Home - Supra Dev",
      "/login": "Login - Supra Dev",
      "/supracoders/:id": "Supracoder Profile - Supra Dev",
      "/supracoders/:id/bounties": "My Bounties - Supra Dev",
      "/projects": "Projects - Supra Dev",
      "/requests": "Project Submission - Supra Dev",
      "/projects/:projectId": "Bounty Details - Supra Dev",
      "/bounties/:bountyId/chat": "Chat - Supra Dev",
      "/users": "User Profile - Supra Dev",
      "/users/:id": "Other User Profile - Supra Dev",
      "/userlist": "User List - Supra Dev"
    };

    const defaultTitle = "Supra Dev";
    document.title = routeTitles[location.pathname] || defaultTitle;
  }, [location]);

  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/supracoders/:id" element={<SupracoderProfilePage />} />
        <Route path="/supracoders/:id/bounties" element={<MyBounties />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/requests" element={<ProjectSubmission />} />
        <Route path="/projects/:projectId" element={<BountyDetailsPage />} />
        <Route path="/users" element={<GenUser />} />
        <Route path="/users/:id" element={<OtherUser />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/mybounties" element={<MyBounties />} />
      </Routes>
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

export default App;

