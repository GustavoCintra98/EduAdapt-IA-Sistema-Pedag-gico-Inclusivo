import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Building,
  GraduationCap,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLoginSuccess: (user: User) => void;
  onRegisterUser: (newUser: User) => void;
  onUpdateUserPassword: (userId: string, newPass: string) => void;
  initialMode?: 'login' | 'firstAccess' | 'forgot' | 'register';
  firstAccessUser?: User | null;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
  onRegisterUser,
  onUpdateUserPassword,
  initialMode = 'login',
  firstAccessUser = null,
}) => {
  const [mode, setMode] = useState<'login' | 'firstAccess' | 'forgot' | 'register' | 'forgotReset'>(initialMode);
  const [currentUserForFirstAccess, setCurrentUserForFirstAccess] = useState<User | null>(firstAccessUser);

  // Login form state
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [resetPasswordNew, setResetPasswordNew] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // First access state
  const [firstPass, setFirstPass] = useState('');
  const [firstConfirm, setFirstConfirm] = useState('');
  const [firstError, setFirstError] = useState('');

  // Register user state (RF02 - Instituição)
  const [regName, setRegName] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('professor');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  if (!isOpen) return null;

  // Validador de política de senhas do sistema (RF02 / RF03):
  // No mínimo 8 caracteres, pelo menos um número e um caractere especial.
  const validatePasswordPolicy = (pass: string): { valid: boolean; message?: string } => {
    if (pass.length < 8) {
      return { valid: false, message: 'A senha deve possuir no mínimo 8 caracteres.' };
    }
    if (!/\d/.test(pass)) {
      return { valid: false, message: 'A senha deve conter pelo menos um número.' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      return { valid: false, message: 'A senha deve conter pelo menos um caractere especial (ex: @, #, $, !).' };
    }
    return { valid: true };
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!emailOrCpf.trim() || !password.trim()) {
      setLoginError('Por favor, preencha todos os campos obrigatórios (e-mail e senha).');
      return;
    }

    // Busca usuário por email ou CPF
    const cleanInput = emailOrCpf.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanInput || u.cpf.replace(/\D/g, '') === cleanInput.replace(/\D/g, '')
    );

    if (!user) {
      setLoginError('E-mail e/ou senha incorretos!');
      return;
    }

    // Verifica credencial
    const isPasswordMatch = user.password === password || (user.isFirstAccess && user.cpf === password);
    if (!isPasswordMatch) {
      setLoginError('E-mail e/ou senha incorretos!');
      return;
    }

    // Se for primeiro acesso, redireciona obrigatoriamente para troca de senha (RF02)
    if (user.isFirstAccess) {
      setCurrentUserForFirstAccess(user);
      setMode('firstAccess');
      return;
    }

    onLoginSuccess(user);
    onClose();
  };

  const handleFirstAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFirstError('');

    if (!firstPass || !firstConfirm) {
      setFirstError('Preencha os dois campos de senha.');
      return;
    }

    if (firstPass !== firstConfirm) {
      setFirstError('A nova senha e a confirmação são diferentes. Corrija para concluir.');
      return;
    }

    const policy = validatePasswordPolicy(firstPass);
    if (!policy.valid) {
      setFirstError(policy.message || 'Senha não atende à política.');
      return;
    }

    if (currentUserForFirstAccess) {
      onUpdateUserPassword(currentUserForFirstAccess.id, firstPass);
      const updatedUser: User = { ...currentUserForFirstAccess, isFirstAccess: false, password: firstPass };
      onLoginSuccess(updatedUser);
      onClose();
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setLoginError('Informe um formato de e-mail válido.');
      return;
    }

    // Regra RF03: "Para proteger as informações dos usuários, a mensagem apresentada
    // não deverá revelar se o endereço informado possui ou não uma conta cadastrada."
    setForgotSuccessMessage(
      'Caso exista uma conta associada ao endereço informado, foram enviadas instruções e um código de verificação para redefinição da senha.'
    );
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!recoveryCode.trim() || recoveryCode.length < 4) {
      setResetError('Informe o código de verificação recebido (ex: 789456).');
      return;
    }

    if (resetPasswordNew !== resetPasswordConfirm) {
      setResetError('A nova senha e a confirmação são diferentes.');
      return;
    }

    const policy = validatePasswordPolicy(resetPasswordNew);
    if (!policy.valid) {
      setResetError(policy.message || 'A senha não atende aos requisitos.');
      return;
    }

    // Atualiza a senha se encontrar o usuário pelo e-mail
    const targetUser = users.find((u) => u.email.toLowerCase() === forgotEmail.toLowerCase());
    if (targetUser) {
      onUpdateUserPassword(targetUser.id, resetPasswordNew);
    }

    setResetSuccess(true);
    setTimeout(() => {
      setMode('login');
      setResetSuccess(false);
      setForgotSuccessMessage('');
      setRecoveryCode('');
    }, 2000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regCpf.trim() || !regEmail.trim()) {
      setRegError('Todos os campos essenciais são obrigatórios no momento do registro pela instituição.');
      return;
    }

    // Verifica se CPF ou e-mail já existe (RF02)
    const cpfExists = users.some((u) => u.cpf.replace(/\D/g, '') === regCpf.replace(/\D/g, ''));
    if (cpfExists) {
      setRegError('Este CPF já está cadastrado!');
      return;
    }

    const emailExists = users.some((u) => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailExists) {
      setRegError('Este e-mail já está cadastrado no sistema!');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      cpf: regCpf.trim(),
      email: regEmail.trim(),
      role: regRole,
      isFirstAccess: true, // Login e senha inicial é o CPF; primeiro acesso obrigatório
      password: regCpf.trim(),
    };

    onRegisterUser(newUser);
    setRegSuccess(
      `Usuário cadastrado com sucesso! Credencial provisória de acesso: CPF (${newUser.cpf}) como login e senha inicial.`
    );
    setTimeout(() => {
      setRegName('');
      setRegCpf('');
      setRegEmail('');
      setMode('login');
      setRegSuccess('');
    }, 2500);
  };

  const handleQuickDemoLogin = (targetUser: User) => {
    if (targetUser.isFirstAccess) {
      setCurrentUserForFirstAccess(targetUser);
      setMode('firstAccess');
    } else {
      onLoginSuccess(targetUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Top Banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
              Ambiente Pedagógico Inclusivo
            </span>
            <h2 className="text-xl font-bold">
              {mode === 'login' && 'Autenticação de Usuário (RF01)'}
              {mode === 'firstAccess' && 'Alteração de Senha - Primeiro Acesso (RF02)'}
              {mode === 'forgot' && 'Recuperação de Acesso (RF03)'}
              {mode === 'forgotReset' && 'Definição de Nova Senha (RF03)'}
              {mode === 'register' && 'Cadastro Institucional de Usuários (RF02)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-light leading-none p-1"
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* ========================================================
              RF01: TELA DE LOGIN
             ======================================================== */}
          {mode === 'login' && (
            <div>
              <p className="text-sm text-slate-600 mb-6">
                Acesse o sistema com suas credenciais educacionais autorizadas.
              </p>

              {loginError && (
                <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail ou CPF Cadastrado *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={emailOrCpf}
                      onChange={(e) => setEmailOrCpf(e.target.value)}
                      placeholder="seu.email@escola.edu.br ou CPF"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Senha de Acesso *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  {/* Link Esqueci minha senha (RF01/RF03) */}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setLoginError('');
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Esqueci minha senha
                  </button>

                  {/* Link Cadastre-se: Visível apenas para instituição/coordenação (RF01) */}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setLoginError('');
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Building className="w-3.5 h-3.5" />
                    Cadastre-se (Acesso Coordenador)
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md mt-4"
                >
                  Entrar no Sistema
                </button>
              </form>

              {/* Botões de Acesso Rápido para Avaliação/Testes */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  Perfis Rápidos para Teste dos Requisitos
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(users[0])}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Coordenador</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">Gestão total & cadastro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(users[1])}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Professor</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">Observação IA & DUA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(users[2])}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Pais / Responsáveis</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">Painel restrito (RF14)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(users[3])}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800">1º Acesso (CPF)</span>
                    </div>
                    <span className="text-[10px] text-amber-700 block truncate">Testar troca obrigatória</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              RF02: ALTERAÇÃO DE SENHA NO PRIMEIRO ACESSO
             ======================================================== */}
          {mode === 'firstAccess' && (
            <div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-amber-900 text-xs">
                <strong>Primeiro Acesso Detectado:</strong> Por motivos de segurança, você ingressou utilizando seu CPF provisório. É obrigatório definir uma senha pessoal respeitando a política institucional antes de prosseguir.
              </div>

              {firstError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{firstError}</span>
                </div>
              )}

              <form onSubmit={handleFirstAccessSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nova Senha (Mínimo 8 caracteres, 1 número, 1 especial) *
                  </label>
                  <input
                    type="password"
                    value={firstPass}
                    onChange={(e) => setFirstPass(e.target.value)}
                    placeholder="Ex: EduSegura@2026"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmar Nova Senha *
                  </label>
                  <input
                    type="password"
                    value={firstConfirm}
                    onChange={(e) => setFirstConfirm(e.target.value)}
                    placeholder="Confirme a mesma senha digitada"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Critérios obrigatórios:</div>
                  <div className={firstPass.length >= 8 ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                    ✓ Mínimo de 8 caracteres
                  </div>
                  <div className={/\d/.test(firstPass) ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                    ✓ Pelo menos um número
                  </div>
                  <div className={/[!@#$%^&*(),.?":{}|<>]/.test(firstPass) ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                    ✓ Pelo menos um caractere especial (!, @, #, $, etc.)
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md mt-4"
                >
                  Confirmar e Concluir Acesso
                </button>
              </form>
            </div>
          )}

          {/* ========================================================
              RF03: RECUPERAÇÃO DE SENHA
             ======================================================== */}
          {mode === 'forgot' && (
            <div>
              <p className="text-sm text-slate-600 mb-4">
                Informe o e-mail cadastrado na instituição para iniciar o procedimento de recuperação segura.
              </p>

              {forgotSuccessMessage ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs leading-relaxed flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Solicitação processada com segurança</p>
                      <p>{forgotSuccessMessage}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                    <p className="font-bold mb-1">Simulação de Código Temporário de E-mail:</p>
                    <p className="mb-2">Para fins de validação do protótipo, seu código de segurança é: <strong className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-blue-300">789456</strong></p>
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryCode('789456');
                        setMode('forgotReset');
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Inserir Código e Definir Nova Senha →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail Cadastrado *
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="seu.email@escola.edu.br"
                      required
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md"
                  >
                    Recuperar Senha
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                >
                  ← Voltar para o Login (RF01)
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              RF03: DEFINIÇÃO DE NOVA SENHA APÓS CÓDIGO
             ======================================================== */}
          {mode === 'forgotReset' && (
            <div>
              <p className="text-sm text-slate-600 mb-4">
                Digite o código de verificação recebido e sua nova senha respeitando a política.
              </p>

              {resetError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Senha redefinida com sucesso! Redirecionando para a Tela de Login (RF01)...</span>
                </div>
              )}

              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Código Temporário *
                  </label>
                  <input
                    type="text"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="789456"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nova Senha (Mínimo 8 caracteres, 1 número, 1 especial) *
                  </label>
                  <input
                    type="password"
                    value={resetPasswordNew}
                    onChange={(e) => setResetPasswordNew(e.target.value)}
                    placeholder="Nova senha segura"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmação da Nova Senha *
                  </label>
                  <input
                    type="password"
                    value={resetPasswordConfirm}
                    onChange={(e) => setResetPasswordConfirm(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetSuccess}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md"
                >
                  Salvar Nova Senha e Ir para o Login
                </button>
              </form>
            </div>
          )}

          {/* ========================================================
              RF02: CADASTRO INSTITUCIONAL DE USUÁRIOS
             ======================================================== */}
          {mode === 'register' && (
            <div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl mb-4 text-blue-900 text-xs">
                <strong>Base Oficial Institucional (RF02):</strong> O cadastro é realizado exclusivamente pela instituição para inserção de dados essenciais (Nome, CPF, e-mail e vínculo). O CPF cadastrado será a credencial inicial (login e senha).
              </div>

              {regError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ex: Juliana Costa Ferreira"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      value={regCpf}
                      onChange={(e) => setRegCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vínculo / Perfil *
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                    >
                      <option value="professor">Professor(a)</option>
                      <option value="pais">Pais / Responsáveis</option>
                      <option value="aluno">Aluno(a)</option>
                      <option value="coordenador">Coordenador(a)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail Institucional ou Pessoal *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="juliana.costa@escola.edu.br"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md mt-2"
                >
                  Efetivar Registro Institucional
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                >
                  ← Voltar para a Tela de Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
