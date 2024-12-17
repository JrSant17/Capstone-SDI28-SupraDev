import { useCookies } from 'react-cookie';
import React, { useEffect, useState } from 'react';

const milestones = [
    "Kickoff",
    "Development",
    "Testing",
    "User Showcase",
    "Funding",
    "Deployment",
    "Program of Record"
];
export default function MilestoneBar({ id }) {
    const [milestoneData, setMilestoneData] = useState([]);
    const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(-1);

    const syncMilestonesWithBackend = async () => {
        try {
            const response = await fetch(`http://localhost:8080/projects/${id}/milestones`);
            if (!response.ok) {
                if (response.status === 404) {
                    setMilestoneData([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const fetchedMilestoneData = await response.json();
    
            if (!Array.isArray(fetchedMilestoneData)) {
                throw new Error('Milestone data is not an array');
            }
            setMilestoneData(fetchedMilestoneData);
            const activeMilestone = fetchedMilestoneData.find(m => m.is_active);
            if (activeMilestone) {
                setCurrentMilestoneIndex(activeMilestone.index - 1);
            }
    
        } catch (error) {
            if (error.message !== 'HTTP error! status: 404') {
                console.error('Error syncing milestones:', error);
            }
            setMilestoneData([]);
        }
    };

    useEffect(() => {
        syncMilestonesWithBackend();
    }, [id])

    return (
        <div className="milestone-container">
            {milestones.map((milestone, index) => (
                <div key={index} className={`milestone ${index === currentMilestoneIndex ? 'active' : 'inactive'} `}>
                    {milestone}
                </div>
            ))}
        </div>
    );
}