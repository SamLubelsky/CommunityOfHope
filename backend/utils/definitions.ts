export type Chat ={
    chatId: string;
    volunteerId: string;
    momId: string;
}
export type User = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string;
}