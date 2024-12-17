import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupracoderProfilePage from '../routes/SupracoderProfilePage';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

global.fetch = jest.fn();

const mockUserData = {
  id: 1,
  first_name: 'test',
  last_name: 'test',
  username: 'test',
  job_title: 'Developer',
  email: 'test@example.com',
  user_summary: 'test user',
  profile_pic: 'https://example.com/profile-pic.jpg',
  supradoubloons: 100,
  is_supracoder: true,
};

const mockProjectsData = [
  { id: 1, accepted_by_id: 1, is_completed: true },
  { id: 2, accepted_by_id: 1, is_completed: false },
];

describe('SupracoderProfilePage', () => {
  beforeEach(() => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([mockUserData]),
    });
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockProjectsData),
    });
  });

  test('displays "Sorry, chief" message when user is not a supracoder', async () => {
    mockUserData.is_supracoder = false;

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([mockUserData]),
    });

    render(
      <CookiesProvider>
        <MemoryRouter initialEntries={['/profile/1']}>
          <SupracoderProfilePage />
        </MemoryRouter>
      </CookiesProvider>
    );

    await waitFor(() => screen.getByText(/Sorry, chief/i));

    expect(screen.getByText('Sorry, chief, this person ain\'t a coder')).toBeInTheDocument();
  });


  test('does not show "Change Password" and "Edit Profile" buttons when the user is not logged in as themselves', async () => {
    render(
      <CookiesProvider>
        <MemoryRouter initialEntries={['/profile/2']}>
          <SupracoderProfilePage />
        </MemoryRouter>
      </CookiesProvider>
    );

    await waitFor(() => screen.getByText(/Sorry, chief/i));

    expect(screen.queryByText(/Change Password/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Edit Profile/i)).not.toBeInTheDocument();
  });

});
