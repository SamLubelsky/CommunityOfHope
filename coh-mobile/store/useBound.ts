import { create } from "zustand";
import {
	type AuthenticationSlice,
	createAuthenticationSlice,
} from "./authenticationSlice";

export const useBoundStore = create<AuthenticationSlice>((...a) => ({
	...createAuthenticationSlice(...a),
}));
