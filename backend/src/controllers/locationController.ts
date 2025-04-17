import { Request, Response } from 'express';
export const getAutocomplete = async (req: Request, res: Response): Promise<any> => {
    try {
        const { query } = req.body;
        const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
        url.searchParams.append('input', query);
        url.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY || '');
        url.searchParams.append('radius', '300000');
        url.searchParams.append('location', '38.6270, -90.1994'); // St. Louis, MO coordinates
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
}
export const getGoogleDistanceData = async (origin_place_id: string, destination_place_id: string): Promise<any> => {
    try{
        const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
        url.searchParams.append('origins', origin_place_id);
        url.searchParams.append('destinations', destination_place_id);
        url.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY || '');
        url.searchParams.append('units', 'imperial');
        url.searchParams.append('mode', 'driving');
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const data = await response.json();
    }
    catch(error){
        console.error('Error fetching Google Distance Matrix API:', error);
        throw error;
    }
}