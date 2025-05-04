import {
    isAuthenticated,
    login,
    logout,
    getCurrentUser,
    addFavoriteCountry,
    removeFavoriteCountry,
    initAuth,
  } from '../services/auth';
  
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });
  
  describe('Auth Service', () => {
    test('initAuth should initialize auth state from localStorage', () => {
      const mockUser = { id: '1', username: 'demo', favoriteCountries: [] };
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      initAuth();
      
      expect(isAuthenticated()).toBe(true);
      expect(getCurrentUser()).toEqual(mockUser);
    });
  
    test('login should authenticate user and store in localStorage', async () => {
      const user = await login('demo', 'password');
      
      expect(user).toEqual({
        id: '1',
        username: 'demo',
        email: 'demo@example.com',
        favoriteCountries: ['USA', 'CAN', 'JPN'],
      });
      expect(localStorage.getItem('authToken')).toBeTruthy();
      expect(localStorage.getItem('user')).toBeTruthy();
      expect(isAuthenticated()).toBe(true);
    });
  
    test('login should reject invalid credentials', async () => {
      await expect(login('wrong', 'credentials')).rejects.toThrow('Invalid credentials');
    });
  
    test('logout should clear auth state', () => {
      login('demo', 'password').then(() => {
        logout();
        expect(isAuthenticated()).toBe(false);
        expect(getCurrentUser()).toBeNull();
        expect(localStorage.getItem('authToken')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
      });
    });
  
    test('addFavoriteCountry should add country to favorites', async () => {
      await login('demo', 'password');
      const user = await addFavoriteCountry('BRA');
      
      expect(user.favoriteCountries).toContain('BRA');
      expect(JSON.parse(localStorage.getItem('user')).favoriteCountries).toContain('BRA');
    });
  
    test('removeFavoriteCountry should remove country from favorites', async () => {
      await login('demo', 'password');
      const user = await removeFavoriteCountry('CAN');
      
      expect(user.favoriteCountries).not.toContain('CAN');
      expect(JSON.parse(localStorage.getItem('user')).favoriteCountries).not.toContain('CAN');
    });
  });