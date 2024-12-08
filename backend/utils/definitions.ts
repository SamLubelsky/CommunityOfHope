export type Chat ={
    chatId: string;
    volunteer_id: string;
    mom_id: string;
}
export type User = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string;
}