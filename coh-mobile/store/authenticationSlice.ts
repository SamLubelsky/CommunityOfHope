// Start of Selection
import type { StateCreator } from "zustand";

export interface AuthenticationSlice {
	isSignedIn: boolean;
    email: string;
    password: string;
	setIsSignedIn: (value: boolean) => void;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
}

export const createAuthenticationSlice: StateCreator<AuthenticationSlice> = (
	set,
) => ({
	isSignedIn: false,
    email: '',
    password: '',
	setIsSignedIn: (value: boolean) => set({ isSignedIn: value }),
    setEmail: (value: string) => set({ email: value }),
    setPassword: (value: string) => set({ password: value }),
});
