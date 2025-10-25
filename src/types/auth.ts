export interface AuthState {
    user: {
        iud: string;
        displayName: string | null;
        email: string | null;
        photoURL: string | null;
    } | null;
    error: string | null;
    loading: boolean;
}