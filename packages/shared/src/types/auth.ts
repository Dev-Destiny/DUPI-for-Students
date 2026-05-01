export interface UserPreferences {
	aiTone?: string;
	responseLength?: string;
}

export interface UserNotifications {
	flashcardDue: boolean;
	testResults: boolean;
	weeklyReport: boolean;
	productUpdates: boolean;
}

export interface User {
	id: string;
	email: string;
	displayName?: string | null;
	studyField?: string | null;
	profileImageUrl?: string | null;
	isOnboarded: boolean;
	preferences?: UserPreferences | null;
	notifications?: UserNotifications | null;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
} 

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends User {}
