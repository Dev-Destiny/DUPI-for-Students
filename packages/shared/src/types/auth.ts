export interface User {
	id: string;
	email: string;
	displayName?: string | null;
	studyField?: string | null;
	profileImageUrl?: string | null;
	isOnboarded: boolean;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends User {}
