export type Chat ={
    id: string;
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