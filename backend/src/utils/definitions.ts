export type Chat ={
    id: string;
    volunteerId: string;
    momId: string;
}
export type User = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    password?: string;
}