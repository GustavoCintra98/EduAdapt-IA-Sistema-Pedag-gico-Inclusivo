import React from 'react';
import { User, AccessibilitySettings } from '../types';
import { 
  Sun, 
  Type, 
  LogOut, 
  BookOpen,
  Menu,
  X,
  Database
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  activeTab: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenMySQLModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenLogin,
  accessibility,
  setAccessibility,
  activeTab,
  isSidebarOpen,
  onToggleSidebar,
  onOpenMySQLModal,
}) => {
  const toggleContrast = () => {
    setAccessibility((prev) => ({
      ...prev,
      highContrast: !prev.highContrast,
    }));
  };

  const cycleFontSize = () => {
    setAccessibility((prev) => {
      const nextSize =
        prev.fontSize === 'normal'
          ? 'large'
          : prev.fontSize === 'large'
          ? 'extralarge'
          : 'normal';
      return { ...prev, fontSize: nextSize };
    });
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Passaporte Pedagógico (RF04)';
      case 'observation':
        return 'Observação IA (RF10)';
      case 'activities':
        return 'Atividades DUA (RF11/RF07)';
      case 'evaluation':
        return 'Avaliação Contínua (RF09)';
      case 'reports':
        return 'Relatórios Consolidados (RF08)';
      case 'pei':
        return 'Gestão PEI (RF13)';
      default:
        return 'Painel Educacional';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Botão de Menu da Barra Lateral + Marca */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Botão de Toggle da Barra Lateral: ao clicar abre, ao clicar novamente recolhe */}
            <button
              onClick={onToggleSidebar}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${
                isSidebarOpen
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
              title={isSidebarOpen ? 'Recolher Menu Lateral' : 'Abrir Menu Lateral de Opções'}
              aria-label={isSidebarOpen ? 'Fechar barra lateral' : 'Abrir barra lateral de navegação'}
              aria-expanded={isSidebarOpen}
              aria-controls="app-sidebar"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="hidden sm:inline">Menu</span>
            </button>

            {/* Marca Wordmark */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                  EduAdapt <span className="text-blue-600">IA</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase hidden sm:block">
                  Sistema Pedagógico Inclusivo
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Identificador Central do Módulo Ativo */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Módulo:</span>
            <span className="text-xs font-bold text-slate-800">{getTabLabel(activeTab)}</span>
          </div>

          {/* Zone 3: Acessibilidade WCAG e Status do Usuário */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Ferramentas de Acessibilidade WCAG (RNF04) */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={cycleFontSize}
                title={`Tamanho da Fonte: ${
                  accessibility.fontSize === 'normal'
                    ? 'Padrão'
                    : accessibility.fontSize === 'large'
                    ? 'Grande (+15%)'
                    : 'Extra Grande (+30%)'
                }`}
                aria-label="Ajustar tamanho da fonte"
                className="p-1.5 rounded text-slate-700 hover:bg-white hover:text-slate-900 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="text-[10px]">
                  {accessibility.fontSize === 'normal' ? '100%' : accessibility.fontSize === 'large' ? '115%' : '130%'}
                </span>
              </button>

              <button
                onClick={toggleContrast}
                title={accessibility.highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
                aria-label="Alternar modo de alto contraste para acessibilidade"
                className={`p-1.5 rounded transition-colors ${
                  accessibility.highContrast
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-700 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botão de Acesso ao Banco MySQL Workbench */}
            <button
              onClick={onOpenMySQLModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100/90 text-blue-900 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-2xs"
              title="Visualizar estrutura do banco de dados relacional para MySQL Workbench e conexão segura"
              aria-label="Abrir modal do banco de dados MySQL Workbench"
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">MySQL Workbench</span>
            </button>

            {/* Usuário / Botão de Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-medium text-blue-600 capitalize">
                    {currentUser.role === 'pais' ? 'Pais / Responsáveis' : currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sair da sessão"
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                  aria-label="Encerrar sessão"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Acessar (RF01)
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
