import { useCookies } from 'react-cookie';
import React, { useState, useEffect } from 'react';

const milestones = [
    "Kickoff",
    "Developing",
    "Testing",
    "Staging",
    "Seeking Funds",
    "Deploy",
    "Sustainment"
];

export default function MilestoneBar({view}) {
    const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(-1);
    const [milestoneTimestamps, setMilestoneTimestamps] = useState(
        milestones.map(() => ({ started: null, completed: null }))
    );
    const [sessionCookies, setSessionCookies, removeSessionCookies] = useCookies([
        'username_token',
        'user_id_token',
        'userPriv_Token',
        'user_type'
    ]);
    const [canStartCurrentMilestone, setCanStartCurrentMilestone] = useState(true);
    const [canCompleteCurrentMilestone, setCanCompleteCurrentMilestone] = useState(false);


    const getStatusClass = (index) => {
        if (index === currentMilestoneIndex) {
            return 'active';
        } else if (index < currentMilestoneIndex) {
            return 'completed';
        }
        return 'inactive';
    };

    const moveToPreviousMilestone = () => {
        if (currentMilestoneIndex > 0) {
            setCurrentMilestoneIndex(currentMilestoneIndex - 1);

            updateCompleteButtonState(currentMilestoneIndex - 1);
        }
    };

    const moveToNextMilestone = () => {
        if (currentMilestoneIndex < milestones.length - 1) {
            setCurrentMilestoneIndex(currentMilestoneIndex + 1);

            updateCompleteButtonState(currentMilestoneIndex + 1);
            setCanStartCurrentMilestone(true);
            setCanCompleteCurrentMilestone(true);
        }
    };

    const startCurrentMilestone = () => {
        if (canStartCurrentMilestone && currentMilestoneIndex >= 0) {
            const now = new Date().toLocaleString();
            setMilestoneTimestamps(prev => {
                const updated = [...prev];
                updated[currentMilestoneIndex].started = now;
                return updated;
            });
            setCanStartCurrentMilestone(false);
            setCanCompleteCurrentMilestone(true);
        }
    };

    const completeCurrentMilestone = () => {
        if (canCompleteCurrentMilestone && currentMilestoneIndex >= 0 && milestoneTimestamps[currentMilestoneIndex].started) {
            const now = new Date().toLocaleString();
            setMilestoneTimestamps(prev => {
                const updated = [...prev];
                updated[currentMilestoneIndex].completed = now;
                return updated;
            });
            setCanCompleteCurrentMilestone(false);
        }
    };

    const removeTimestamp = () => {
        if (currentMilestoneIndex >= 0 && milestoneTimestamps[currentMilestoneIndex]) {
            setMilestoneTimestamps(prev => {
                const updated = [...prev];
                const currentMilestone = updated[currentMilestoneIndex];


                if (currentMilestone.completed) {
                    currentMilestone.completed = null;
                    setCanCompleteCurrentMilestone(true);
                } else if (currentMilestone.started) {
                    currentMilestone.started = null;
                    setCanStartCurrentMilestone(true);
                }

                return updated;
            });
        }
    };

    const updateCompleteButtonState = (index) => {
        if (milestoneTimestamps[index]?.started && !milestoneTimestamps[index]?.completed) {
            setCanCompleteCurrentMilestone(true);
        } else {
            setCanCompleteCurrentMilestone(false);
        }
    };

    return (
        <div className="milestone-wrapper">
            <div className="milestone-container">
                {milestones.map((milestone, index) => (
                    <div key={index} className={`milestone ${getStatusClass(index)}`}>
                        {milestone}
                    </div>
                ))}
            </div>
            {sessionCookies.user_type === 4 ? (
                <div className="button-container">
                    <button
                        className="milestone-button"
                        onClick={moveToPreviousMilestone}
                        disabled={currentMilestoneIndex <= 0} // Disable when at the first milestone
                    >
                        Previous Milestone
                    </button>

                    <button
                        className="milestone-button"
                        onClick={moveToNextMilestone}
                        disabled={currentMilestoneIndex >= milestones.length - 1} // Disable when at the last milestone
                    >
                        Next Milestone
                    </button>

                    <button
                        className="milestone-button"
                        onClick={removeTimestamp}
                        disabled={milestoneTimestamps[currentMilestoneIndex]?.started === null && milestoneTimestamps[currentMilestoneIndex]?.completed === null}
                    >
                        Remove Timestamp
                    </button>

                    <button
                        className="milestone-button"
                        onClick={startCurrentMilestone}
                        disabled={!canStartCurrentMilestone || currentMilestoneIndex < 0}
                    >
                        Start Milestone
                    </button>

                    <button
                        className="milestone-button"
                        onClick={completeCurrentMilestone}
                        disabled={!(milestoneTimestamps[currentMilestoneIndex]?.started) || currentMilestoneIndex < 0}
                    >
                        Complete Milestone
                    </button>
                </div>
            ): (
                <>
                </>
            )}
            {view === 'status' ? (
                <div className="timestamp-list">
                    <h3>Milestone History</h3>
                    <ul>
                        {milestones.map((milestone, index) => (
                            <li key={index}>
                                <strong>{milestone}</strong>
                                <div>
                                    {milestoneTimestamps[index]?.started && (
                                        <small>Started on: {milestoneTimestamps[index].started}</small>
                                    )}
                                </div>
                                <div>
                                    {milestoneTimestamps[index]?.completed && (
                                        <small className='completed-stamp'>Completed on: {milestoneTimestamps[index].completed}</small>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ): (
                <>
                </>
            )}
        </div>
    );
}