import React from 'react';
import { User } from '../types';
import { 
  BookOpen, 
  X, 
  Sparkles, 
  Layers, 
  FileText, 
  Brain, 
  LogOut, 
  ShieldCheck, 
  UserCheck,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onClose,
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenLogin,
}) => {
  const isParent = currentUser?.role === 'pais';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Passaporte Pedagógico',
      badge: 'RF04',
      icon: BookOpen,
      desc: 'Visão geral, filtros de turma e históricos',
      visible: true,
    },
    {
      id: 'observation',
      label: 'Observação IA',
      badge: 'RF10',
      icon: Sparkles,
      desc: 'Entrada em linguagem natural e DUA',
      visible: !isParent,
    },
    {
      id: 'activities',
      label: 'Atividades DUA',
      badge: 'RF11/RF07',
      icon: Layers,
      desc: 'Parametrização em 3 níveis & explicabilidade',
      visible: !isParent,
    },
    {
      id: 'evaluation',
      label: 'Avaliação Contínua',
      badge: 'RF09',
      icon: GraduationCap,
      desc: 'Evolução nos 5 eixos de desenvolvimento',
      visible: true,
    },
    {
      id: 'reports',
      label: 'Relatórios Consolidados',
      badge: 'RF08',
      icon: FileText,
      desc: 'Exportação em PDF e envio direto',
      visible: true,
    },
    {
      id: 'pei',
      label: 'Gestão PEI',
      badge: 'RF13',
      icon: Brain,
      desc: 'Plano individualizado e metas curriculares',
      visible: !isParent,
    },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop com fechamento ao clicar fora */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel da Barra Lateral Retrátil */}
      <aside
        id="app-sidebar"
        aria-label="Menu principal de navegação"
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col border-r border-slate-200 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabeçalho da Barra Lateral */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                EduAdapt <span className="text-blue-600">IA</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Menu de Navegação
              </span>
            </div>
          </div>

          <button
            onClick={onToggle}
            title="Recolher barra lateral"
            aria-label="Fechar barra lateral"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações de Perfil / Acesso do Usuário no Topo da Barra */}
        <div className="p-4 border-b border-slate-100 bg-blue-50/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Perfil Atual:</span>
            <span className="font-bold text-blue-700 capitalize bg-white px-2 py-0.5 rounded-md border border-blue-200">
              {currentUser ? (currentUser.role === 'pais' ? 'Pais / Responsáveis' : currentUser.role) : 'Visitante'}
            </span>
          </div>
          {currentUser && (
            <div className="text-xs font-semibold text-slate-900 truncate mt-1">
              {currentUser.name}
            </div>
          )}
        </div>

        {/* Lista de Opções da Barra Lateral */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            Módulos do Sistema
          </div>

          {navItems
            .filter((item) => item.visible)
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left p-3 rounded-2xl flex items-start gap-3 transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {item.label}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/80 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] leading-tight line-clamp-1 ${
                        isActive ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              );
            })}
        </nav>

        {/* Rodapé da Barra Lateral com Logout e Conformidade */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>LGPD · DUA · Acessibilidade WCAG</span>
          </div>

          {currentUser ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              Encerrar Sessão
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenLogin();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              Acessar Sistema (RF01)
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
