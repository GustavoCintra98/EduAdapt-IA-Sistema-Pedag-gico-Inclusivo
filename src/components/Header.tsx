import React from 'react';
import { User, AccessibilitySettings } from '../types';
import { 
  Sun, 
  Moon, 
  Type, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onOpenLogin,
  accessibility,
  setAccessibility,
  activeTab,
  setActiveTab,
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

  const isParent = currentUser?.role === 'pais';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                  EduAdapt <span className="text-blue-600">IA</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                  Sistema Pedagógico Inclusivo
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Single-line Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-600 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Passaporte Pedagógico (RF04)
            </button>

            {!isParent && (
              <>
                <button
                  onClick={() => setActiveTab('observation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'observation'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Observação IA (RF10)
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'activities'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Atividades DUA (RF11/RF07)
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'evaluation'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Avaliação Contínua (RF09)
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'reports'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Relatórios (RF08)
            </button>

            {!isParent && (
              <button
                onClick={() => setActiveTab('pei')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'pei'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Gestão PEI (RF13)
              </button>
            )}
          </nav>

          {/* Zone 3: Accessibility Tools & User Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* WCAG Accessibility Controls (RNF04) */}
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

            {/* User Profile or Login */}
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
                Acessar Sistema (RF01)
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
