import React from 'react';
import { act } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { login } from '../services/auth';

jest.mock('../services/auth');

describe('LoginPage', () => {
  test('renders login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText('Username and password are required')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    login.mockResolvedValue({ username: 'demo' });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'demo' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    expect(login).toHaveBeenCalledWith('demo', 'password');
  });

  test('shows error when login fails', async () => {
    login.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'demo' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
  });

  test('displays loading state during login', async () => {
    login.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ username: 'demo' }), 1000);
        })
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'demo' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    expect(screen.getByText(/signing in.../i)).toBeInTheDocument();

    await act(async () => {
      expect(login).toHaveBeenCalledWith('demo', 'password');
    });
  });
});