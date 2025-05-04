import { getAllCountries, getCountryByCode } from '../services/api';

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ cca3: 'USA', name: { common: 'United States' } }]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('API Service', () => {
  test('getAllCountries should fetch all countries', async () => {
    const countries = await getAllCountries();
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(countries).toEqual([{ cca3: 'USA', name: { common: 'United States' } }]);
  });

  test('getCountryByCode should fetch specific country', async () => {
    const country = await getCountryByCode('USA');
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/alpha/USA'));
    expect(country).toEqual([{ cca3: 'USA', name: { common: 'United States' } }]);
  });

  test('should handle API errors', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );
    
    await expect(getCountryByCode('INVALID')).rejects.toThrow('Failed to fetch country with code: INVALID');
  });
});