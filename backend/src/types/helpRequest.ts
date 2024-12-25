export interface HelpRequest {
  id: number;
  mom_id: string;
  volunteer_id?: string;
  description: string;
  active: boolean;
}