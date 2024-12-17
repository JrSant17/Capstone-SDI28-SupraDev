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
                    //TODO: handle this
                    console.log(`no milestone found`);
                } else {
                    throw new Error(`Error fetching milestones: ${response.statusText}`);
                }
            }

            const fetchedMilestoneData = await response.json();

            setMilestoneData(fetchedMilestoneData);

            if (Array.isArray(fetchedMilestoneData)) {

                const activeMilestone = fetchedMilestoneData.find(m => m.is_active);
                if (activeMilestone) {
                    setCurrentMilestoneIndex(activeMilestone.index - 1);
                }
            } else {
                throw new Error('Milestone data is not an array');
            }

        } catch (error) {
            console.error('Error syncing milestones:', error);
        }
    };

    useEffect(() => {
        syncMilestonesWithBackend();
    }, [])

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