export interface HelpRequest {
  id: string;
  mom_id: string;
  volunteer_id?: string;
  emergency: boolean;
  description: string;
  active: boolean;
}