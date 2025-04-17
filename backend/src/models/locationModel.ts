import { executeQuery } from "../config/database";

export const getTravelTime = async (origin_place_id: string, destination_place_id: string) => {
    const rows = await executeQuery('SELECT travel_time_seconds FROM users where origin_place_id=$1 destination_plcae_id=$2',
         [origin_place_id, destination_place_id]);
    if(rows){
        return rows[0];
    } else{
        return Promise.reject(new Error('Travel time not found'));
    }
}
export const addTravelTime = async (origin_place_id: string, destination_place_id: string, travel_time_seconds: number) => {
    const existingTravelTime = await getTravelTime(origin_place_id, destination_place_id);
    if(existingTravelTime){
        return Promise.reject(new Error('Travel time already exists'));
    }
    const query = 'INSERT INTO travel_time (origin_place_id, destination_place_id, travel_time_seconds) VALUES ($1, $2, $3)'
    const values = [origin_place_id, destination_place_id, travel_time_seconds]
    executeQuery(query, values);
    return;
}