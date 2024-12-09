// Start of Selection
import type { StateCreator } from "zustand";

export interface AuthenticationSlice {
	isSignedIn: boolean;
    email: string;
    password: string;
    id: number;
    firstName: string;
    lastName: string;
    role: string;
	setIsSignedIn: (value: boolean) => void;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setId: (value: number) => void;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setRole: (value: string) => void;
}

export const createAuthenticationSlice: StateCreator<AuthenticationSlice> = (
	set,
) => ({
	isSignedIn: false,
    email: '',
    password: '',
    id: -1,
    firstName: '',
    lastName: '',
    role: '',
	setIsSignedIn: (value: boolean) => set({ isSignedIn: value }),
    setEmail: (value: string) => set({ email: value }),
    setPassword: (value: string) => set({ password: value }),
    setId: (value: number) => set({ id: value }),
    setFirstName: (value: string) => set({ firstName: value }),
    setLastName: (value: string) => set({ lastName: value }),
    setRole: (value: string) => set({role: value}),
});

