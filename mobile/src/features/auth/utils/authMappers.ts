import type {
  CadastroOngFormData,
  CadastroUserFormData,
  CurrentLocation,
  RegisterOngPayload,
  RegisterUserPayload,
} from '../types/auth.types';

export function mapRegisterUserPayload(
  form: CadastroUserFormData,
  location: CurrentLocation,
): RegisterUserPayload {
  return {
    nome_completo: form.nome.trim(),
    cpf: form.cpf.trim(),
    telefone: form.telefone.trim(),
    tem_pet: form.temPet,
    email: form.email.trim().toLowerCase(),
    senha: form.senha.trim(),
    localizacao_lat: location.lat,
    localizacao_lng: location.lng,
  };
}

export function mapRegisterOngPayload(
  form: CadastroOngFormData,
  location: CurrentLocation,
): RegisterOngPayload {
  return {
    email: form.email.trim().toLowerCase(),
    senha: form.senha.trim(),
    telefone: form.telefone.trim(),
    cnpj: form.cnpj.trim(),
    razao_social: form.razaoSocial.trim(),
    nome_fantasia: form.nomeFantasia.trim(),
    endereco_completo: form.endereco.trim(),
    nome_gestor: form.nomeGestor.trim(),
    cpf_gestor: form.cpfGestor.trim(),
    oferece_lar_temporario: form.ofereceLarTemporario,
    vagas_emergenciais: form.vagasEmergenciais,
    capacidade_total: form.capacidadeTotal
      ? parseInt(form.capacidadeTotal, 10)
      : null,
    lotacao_atual: form.lotacaoAtual
      ? parseInt(form.lotacaoAtual, 10)
      : null,
    link_prestacao_contas: form.linkPrestacao.trim() || null,
    localizacao_lat: location.lat,
    localizacao_lng: location.lng,
  };
}
