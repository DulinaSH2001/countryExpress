import React from 'react';
import { act } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import CountryCard from '../components/CountryCard';
import { isAuthenticated, login } from '../services/auth';

jest.mock('../services/auth');

const mockCountry = {
  cca3: 'USA',
  name: { common: 'United States' },
  flags: { svg: 'https://flagcdn.com/us.svg' },
  capital: ['Washington D.C.'],
  region: 'Americas',
  population: 329500000,
};

describe('CountryCard', () => {
  test('renders country information', () => {
    render(
      <MemoryRouter>
        <CountryCard country={mockCountry} />
      </MemoryRouter>
    );

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Washington D.C.')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('329,500,000')).toBeInTheDocument();
  });

  test('shows favorite button when authenticated', async () => {
    isAuthenticated.mockReturnValue(true);
    render(
      <MemoryRouter>
        <CountryCard country={mockCountry} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('does not show favorite button when not authenticated', () => {
    isAuthenticated.mockReturnValue(false);
    render(
      <MemoryRouter>
        <CountryCard country={mockCountry} />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('toggles favorite status when clicked', async () => {
    isAuthenticated.mockReturnValue(true);
    login.mockResolvedValue({ favoriteCountries: [] });
  
    render(
      <MemoryRouter>
        <CountryCard country={mockCountry} />
      </MemoryRouter>
    );
  
    const button = screen.getByRole('button');
  
    // Wrap the click event in `act` to handle state updates
    await act(async () => {
      fireEvent.click(button);
    });
  
    // Assert that the button has the updated class
    expect(button).toHaveClass('bg-yellow-400');
  });
});