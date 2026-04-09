const API_URL = 'http://localhost:5275/api/venues';

export const getVenues = async () => {
    const response = await fetch(API_URL);
    return await response.json();
};
