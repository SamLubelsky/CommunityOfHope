export interface HelpRequest {
  id: string;
  mom_id: string;
  volunteer_id?: string;
  emergency: boolean;
  description: string;
  active: boolean;
  placeId?: string;
  travelTime?: string;
  placeName?: string;
}