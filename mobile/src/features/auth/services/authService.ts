import api from '../../../core/api';
import type {
  LoginPayload,
  LoginResponse,
  PasswordResetPayload,
  PasswordResetRequestPayload,
  RegisterOngPayload,
  RegisterUserPayload,
} from '../types/auth.types';

const authService = {
  login(payload: LoginPayload) {
    return api.post<LoginResponse>('/auth/login', payload);
  },

  requestPasswordReset(payload: PasswordResetRequestPayload) {
    return api.post<unknown>('/auth/esqueceu-senha', payload);
  },

  resetPassword(payload: PasswordResetPayload) {
    return api.post<unknown>('/auth/redefinir-senha', payload);
  },

  registerUser(payload: RegisterUserPayload) {
    return api.post<unknown>('/auth/registro/usuario', payload);
  },

  registerOng(payload: RegisterOngPayload) {
    return api.post<unknown>('/auth/registro/ong', payload);
  },
};

export default authService;
