export interface HelpRequest {
  id: number;
  mom_id: number;
  volunteer_id?: number;
  description: string;
  active: boolean;
}