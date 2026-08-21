export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginUser {
  id_conta: string | number;
  name: string;
  email: string;
  tipo_conta: string;
}

export interface LoginResponse {
  access_token: string;
  user: LoginUser;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetPayload {
  email: string;
  codigo_verificacao: string;
  nova_senha: string;
}

export interface RegisterUserPayload {
  nome_completo: string;
  cpf: string;
  telefone: string;
  tem_pet: boolean;
  email: string;
  senha: string;
  localizacao_lat: number | null;
  localizacao_lng: number | null;
}

export interface RegisterOngPayload {
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

export type CadastroUserStep = 1 | 2;
export type CadastroOngStep = 1 | 2 | 3;
export type PasswordRecoveryStep = 1 | 2;

export interface CadastroUserFormData {
  nome: string;
  cpf: string;
  telefone: string;
  temPet: boolean;
  email: string;
  senha: string;
}

export interface CadastroOngFormData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: string;
  ofereceLarTemporario: boolean;
  vagasEmergenciais: boolean;
  capacidadeTotal: string;
  lotacaoAtual: string;
  linkPrestacao: string;
  nomeGestor: string;
  cpfGestor: string;
  telefone: string;
  email: string;
  senha: string;
}

export interface CurrentLocation {
  lat: number | null;
  lng: number | null;
}
