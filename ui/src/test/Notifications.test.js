import { render, screen } from '@testing-library/react';
import Notification from '../components/Notifications';
import '@testing-library/jest-dom';

const projectData = {
  name: 'Project 9',
  is_completed: false,
  is_accepted: false,
};

const props = {
  project: projectData,
  username: 'Alex',
  submitter: 'Alex',
  submitterImg: 'submitter.jpg',
  acceptedImg: 'accepted.jpg',
  submittedUserId: '1',
  acceptedUserId: '2',
};

test('renders submitter avatar and correct message when project is not accepted or completed', () => {
  render(<Notification {...props} />);
  
  const avatar = screen.getByAltText('User Avatar');
  expect(avatar).toHaveProperty('src', expect.stringContaining('submitter.jpg'));
  
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', 'http://localhost:3000/users/1');
  
  const message = screen.getByText(/Project 9 project has been created by Alex/i);
  expect(message).toBeInTheDocument();
});

test('renders accepted avatar and correct message when project is accepted', () => {
  const acceptedProps = {
    ...props,
    project: { ...projectData, is_accepted: true },
  };
  
  render(<Notification {...acceptedProps} />);
  
  const avatar = screen.getByAltText('User Avatar');
  expect(avatar).toHaveProperty('src', expect.stringContaining('accepted.jpg'));
  
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', 'http://localhost:3000/supracoders/2');
  
  const message = screen.getByText(/Project 9 project has been accepted by Alex/i);
  expect(message).toBeInTheDocument();
});

test('renders completed project message when project is completed', () => {
  const completedProps = {
    ...props,
    project: { ...projectData, is_completed: true },
  };
  
  render(<Notification {...completedProps} />);
  
  const message = screen.getByText(/Project 9 project has been completed by Alex/i);
  expect(message).toBeInTheDocument();
});

