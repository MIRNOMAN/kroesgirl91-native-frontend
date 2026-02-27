type AuthPayload = {
  email: string;
  password: string;
};

export const authService = {
  async login(payload: AuthPayload) {
    return Promise.resolve({
      success: true,
      user: { email: payload.email },
    });
  },
};
