import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Login from "./Login";
import Navbar from "./Navbar";
import SupracoderProfilePage from "./SupracoderProfilePage";
import Home from "./Home";
import MyBounties from "./MyBounties";
import Projects from "./Projects";
import LandingPage from './LandingPage';
import ProjectSubmission from "./ProjectSubmission";
import BountyDetailsPage from "./BountyDetailsPage";
import GenUser from "./MyProfile";
import OtherUser from "./OthersProfile";
import ChatPage from "./ChatPage";
import UserList from "./UserList";

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
        <Route path="/bounties/:bountyId/chat" element={<ChatPage />} />
        <Route path="/users" element={<GenUser />} />
        <Route path="/users/:id" element={<OtherUser />} />
        <Route path="/userlist" element={<UserList />} />
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

