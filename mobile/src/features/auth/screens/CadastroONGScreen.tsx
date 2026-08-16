import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import api from '../../../services/api';

const COLORS = {
  primary: '#1F5C4D',
  primaryLight: '#E8F5E9',
  accent: '#10B981',
  background: '#F4F7F6',
  surface: '#FFFFFF',
  textTitle: '#1A1A1A',
  textBody: '#666666',
  border: '#E2E8F0',
  placeholder: '#A0AEC0',
};

export default function CadastroONGScreen({ navigation }: any) {
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Etapa 1: Dados Institucionais
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [endereco, setEndereco] = useState('');

  // Etapa 2: Capacidade e Estrutura
  const [ofereceLarTemporario, setOfereceLarTemporario] = useState(false);
  const [vagasEmergenciais, setVagasEmergenciais] = useState(false);
  const [capacidadeTotal, setCapacidadeTotal] = useState('');
  const [lotacaoAtual, setLotacaoAtual] = useState('');
  const [linkPrestacao, setLinkPrestacao] = useState('');

  // Etapa 3: Gestor e Acesso
  const [nomeGestor, setNomeGestor] = useState('');
  const [cpfGestor, setCpfGestor] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [comprovanteUri, setComprovanteUri] = useState<string | null>(null);

  const selecionarComprovante = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setComprovanteUri(result.assets[0].uri);
    }
  };

  const avançarEtapa1 = () => {
    if (!cnpj.trim() || !razaoSocial.trim() || !nomeFantasia.trim() || !endereco.trim()) {
      Alert.alert('Campos Obrigatórios', 'Preencha todos os campos da Etapa 1.');
      return;
    }
    setEtapa(2);
  };

  const avançarEtapa2 = () => {
    setEtapa(3);
  };

  const handleCadastroFinal = async () => {
    if (!nomeGestor.trim() || !cpfGestor.trim() || !email.trim() || !senha || !telefone.trim()) {
      Alert.alert('Campos Obrigatórios', 'Preencha todos os campos obrigatórios do gestor e conta.');
      return;
    }

    if (senha !== confirmaSenha) {
      Alert.alert('Erro de Senha', 'As senhas informadas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      let lat: number | null = null;
      let lng: number | null = null;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        lat = location.coords.latitude;
        lng = location.coords.longitude;
      }

      const payload = {
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
        telefone: telefone.trim(),
        cnpj: cnpj.trim(),
        razao_social: razaoSocial.trim(),
        nome_fantasia: nomeFantasia.trim(),
        endereco_completo: endereco.trim(),
        nome_gestor: nomeGestor.trim(),
        cpf_gestor: cpfGestor.trim(),
        oferece_lar_temporario: ofereceLarTemporario,
        vagas_emergenciais: vagasEmergenciais,
        capacidade_total: capacidadeTotal ? parseInt(capacidadeTotal, 10) : null,
        lotacao_atual: lotacaoAtual ? parseInt(lotacaoAtual, 10) : null,
        link_prestacao_contas: linkPrestacao.trim() || null,
        localizacao_lat: lat,
        localizacao_lng: lng,
      };

      await api.post('/auth/registro/ong', payload);

      Alert.alert('Sucesso', 'Instituição cadastrada com sucesso!', [
        { text: 'Ir para Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.response?.data?.detail || 'Ocorreu um erro ao cadastrar a ONG.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => etapa > 1 ? setEtapa((etapa - 1) as any) : navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.stepIndicator}>Etapa {etapa} de 3</Text>
          </View>

          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="domain" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.brandTitle}>Cadastro de ONG</Text>
            <Text style={styles.brandTagline}>Gerencie resgates e prestação de contas no PetRadar.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* ETAPA 1 */}
            {etapa === 1 && (
              <>
                <Text style={styles.sectionTitle}>1. Dados Institucionais</Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>CNPJ *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="business-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="00.000.000/0001-00" placeholderTextColor={COLORS.placeholder} keyboardType="numeric" value={cnpj} onChangeText={setCnpj} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Razão Social *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Nome Jurídico Completo" placeholderTextColor={COLORS.placeholder} value={razaoSocial} onChangeText={setRazaoSocial} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Nome Fantasia *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Nome de divulgação da ONG" placeholderTextColor={COLORS.placeholder} value={nomeFantasia} onChangeText={setNomeFantasia} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Endereço Completo *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="Rua, Número, Bairro, Cidade - UF" placeholderTextColor={COLORS.placeholder} value={endereco} onChangeText={setEndereco} />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={avançarEtapa1}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.submitButtonText}>Próximo: Estrutura</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* ETAPA 2 */}
            {etapa === 2 && (
              <>
                <Text style={styles.sectionTitle}>2. Capacidade e Operação</Text>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Oferece Lar Temporário?</Text>
                  <Switch value={ofereceLarTemporario} onValueChange={setOfereceLarTemporario} trackColor={{ false: '#CBD5E1', true: COLORS.accent }} />
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Possui vagas para lar emergencial?</Text>
                  <Switch value={vagasEmergenciais} onValueChange={setVagasEmergenciais} trackColor={{ false: '#CBD5E1', true: COLORS.accent }} />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Capacidade Total de Animais</Text>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Ex: 50" placeholderTextColor={COLORS.placeholder} keyboardType="numeric" value={capacidadeTotal} onChangeText={setCapacidadeTotal} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Lotação Atual</Text>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Ex: 35" placeholderTextColor={COLORS.placeholder} keyboardType="numeric" value={lotacaoAtual} onChangeText={setLotacaoAtual} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Link de Prestação de Contas (Opcional)</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="link-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="https://..." placeholderTextColor={COLORS.placeholder} autoCapitalize="none" value={linkPrestacao} onChangeText={setLinkPrestacao} />
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={avançarEtapa2}>
                  <View style={styles.buttonContent}>
                    <Text style={styles.submitButtonText}>Próximo: Gestor e Acesso</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                  </View>
                </TouchableOpacity>
              </>
            )}

            {/* ETAPA 3 */}
            {etapa === 3 && (
              <>
                <Text style={styles.sectionTitle}>3. Responsável e Acesso</Text>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Nome do Gestor *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="Nome completo do responsável" placeholderTextColor={COLORS.placeholder} value={nomeGestor} onChangeText={setNomeGestor} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>CPF do Gestor *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="000.000.000-00" placeholderTextColor={COLORS.placeholder} keyboardType="numeric" value={cpfGestor} onChangeText={setCpfGestor} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Telefone / WhatsApp *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="(00) 00000-0000" placeholderTextColor={COLORS.placeholder} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>E-mail de Acesso *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="ong@exemplo.com" placeholderTextColor={COLORS.placeholder} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Senha *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={COLORS.placeholder} secureTextEntry={!showPassword} value={senha} onChangeText={setSenha} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.textBody} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Confirma Senha *</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={COLORS.placeholder} secureTextEntry={!showPassword} value={confirmaSenha} onChangeText={setConfirmaSenha} />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Comprovante de Vínculo (Opcional)</Text>
                  <TouchableOpacity style={styles.uploadButton} onPress={selecionarComprovante}>
                    <Ionicons name="document-attach-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.uploadText}>{comprovanteUri ? 'Comprovante Anexado ✓' : 'Anexar documento'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleCadastroFinal} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.submitButtonText}>Finalizar Cadastro</Text>
                      <Ionicons name="checkmark-circle-outline" size={22} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  stepIndicator: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  header: { alignItems: 'center', marginBottom: 20 },
  logoBadge: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  brandTitle: { fontSize: 26, fontWeight: '800', color: COLORS.primary },
  brandTagline: { fontSize: 13, color: COLORS.textBody, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 16 },
  inputWrapper: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textTitle, marginBottom: 6, textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 14, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: COLORS.border },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textTitle, fontWeight: '500' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 14 },
  switchLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textTitle, flex: 1 },
  uploadButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight, padding: 14, borderRadius: 14, gap: 10 },
  uploadText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  submitButton: { backgroundColor: COLORS.primary, borderRadius: 16, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});