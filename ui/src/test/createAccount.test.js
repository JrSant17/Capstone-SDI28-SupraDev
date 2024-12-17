import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateAccount from '../components/createAccount';
import '@testing-library/jest-dom';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('CreateAccount Component', () => {
  
  test('renders the Create Account form', () => {
    render(<CreateAccount />);
    
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profile Picture URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/User Type/i)).toBeInTheDocument();
  });


});
