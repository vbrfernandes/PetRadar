import api from '../../../services/api';

interface LoginPayload {
  email: string;
  senha: string;
}

interface LoginUser {
  id_conta: string | number;
  name: string;
  email: string;
  tipo_conta: string;
}

interface LoginResponse {
  access_token: string;
  user: LoginUser;
}

interface PasswordResetRequestPayload {
  email: string;
}

interface PasswordResetPayload {
  email: string;
  codigo_verificacao: string;
  nova_senha: string;
}

interface RegisterUserPayload {
  nome_completo: string;
  cpf: string;
  telefone: string;
  tem_pet: boolean;
  email: string;
  senha: string;
  localizacao_lat: number | null;
  localizacao_lng: number | null;
}

interface RegisterOngPayload {
  email: string;
  senha: string;
  telefone: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  endereco_completo: string;
  nome_gestor: string;
  cpf_gestor: string;
  oferece_lar_temporario: boolean;
  vagas_emergenciais: boolean;
  capacidade_total: number | null;
  lotacao_atual: number | null;
  link_prestacao_contas: string | null;
  localizacao_lat: number | null;
  localizacao_lng: number | null;
}

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
