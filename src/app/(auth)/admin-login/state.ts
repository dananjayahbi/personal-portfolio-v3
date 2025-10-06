export type LoginState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<'email' | 'password', string>>;
};

export const loginInitialState: LoginState = { status: 'idle' };
