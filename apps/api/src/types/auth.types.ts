import { RegisterUserPayload, LoginUserPayload, UpdateUserPayload } from "../schemas/auth.schema";

export type { RegisterUserPayload, LoginUserPayload, UpdateUserPayload };

export interface AccessTokenPayload {
	userId: string;
	email: string;
}

export interface RefreshTokenPayload extends Omit<
	AccessTokenPayload,
	"email"
> {}
