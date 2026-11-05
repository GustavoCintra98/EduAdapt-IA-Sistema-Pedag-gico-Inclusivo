import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { 
  Layers, 
  TrendingUp, 
  Sparkles, 
  GraduationCap, 
  Calendar, 
  Search, 
  Clock, 
  Building, 
  CheckCircle2, 
  Filter, 
  X,
  UserCheck
} from 'lucide-react';

interface ContinuousEvaluationViewProps {
  students: Student[];
  selectedStudent: Student;
  onSelectStudent: (student: Student) => void;
  onNavigateToTab: (tab: string, student?: Student) => void;
}

export const ContinuousEvaluationView: React.FC<ContinuousEvaluationViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onNavigateToTab,
}) => {
  // Estado para o modo de pesquisa (RF09 - Pesquisa por nome, sobrenome, sala, turno)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  const current = selectedStudent;
  const axes = current.axesScores;

  // Extrai salas/turmas e turnos únicos disponíveis
  const uniqueShifts = ['all', 'Manhã', 'Tarde', 'Integral'];
  const uniqueClasses = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.className)));
    return ['all', ...list];
  }, [students]);

  // Filtragem no modo de pesquisa por:
  // - Nome ou Sobrenome
  // - Sala / Turma (className ou room)
  // - Turno (shift)
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const query = searchTerm.trim().toLowerCase();
      
      // Filtro por Turno
      if (selectedShift !== 'all') {
        const studentShift = s.shift || (s.className.toLowerCase().includes('tarde') ? 'Tarde' : 'Manhã');
        if (studentShift.toLowerCase() !== selectedShift.toLowerCase()) {
          return false;
        }
      }

      // Filtro por Sala/Turma
      if (selectedClassFilter !== 'all' && s.className !== selectedClassFilter) {
        return false;
      }

      // Se não houver termo de busca textual, passa
      if (!query) return true;

      // Busca por nome completo ou sobrenome
      const nameParts = s.name.toLowerCase().split(/\s+/);
      const matchesNameOrSurname = 
        s.name.toLowerCase().includes(query) ||
        nameParts.some((part) => part.startsWith(query) || part.includes(query));

      // Busca por sala / turma
      const matchesClass = s.className.toLowerCase().includes(query);
      const matchesRoom = s.room ? s.room.toLowerCase().includes(query) : false;

      // Busca por turno
      const studentShift = s.shift || (s.className.toLowerCase().includes('tarde') ? 'Tarde' : 'Manhã');
      const matchesShift = studentShift.toLowerCase().includes(query);

      return matchesNameOrSurname || matchesClass || matchesRoom || matchesShift;
    });
  }, [students, searchTerm, selectedShift, selectedClassFilter]);

  // Lista dos 5 eixos principais conforme RF09:
  // "cinco eixos principais de desenvolvimento: Cognição, Linguagem, Matemática, Motricidade e Funções Executivas."
  const developmentalAxesList = [
    {
      key: 'cognicao',
      name: 'Cognição',
      score: axes.cognicao,
      description: 'Capacidade de raciocínio lógico, atenção seletiva, categorização e resolução de problemas.',
      evolution: '+14% no último ciclo',
      status: 'Progresso Expressivo',
      recommendation: 'Estimular hipóteses dedutivas em pequenos grupos colaborativos.',
      color: 'blue',
    },
    {
      key: 'linguagem',
      name: 'Linguagem',
      score: axes.linguagem,
      description: 'Compreensão leitora, expressão oral, vocabulário e interpretação textual multimodal.',
      evolution: '+8% com suporte ilustrado',
      status: 'Em Desenvolvimento',
      recommendation: 'Manter textos com fontes ampliadas e apoio pictográfico.',
      color: 'indigo',
    },
    {
      key: 'matematica',
      name: 'Matemática',
      score: axes.matematica,
      description: 'Noção de quantidade, cálculo mental, seriação e aplicação concreta de numerais.',
      evolution: '+18% com blocos manipulativos',
      status: 'Apoio Concreto Eficaz',
      recommendation: 'Priorizar materiais manipulativos e representação em grades.',
      color: 'purple',
    },
    {
      key: 'motricidade',
      name: 'Motricidade',
      score: axes.motricidade,
      description: 'Coordenação motora fina e ampla, preensão de instrumentos e noção espaço-temporal.',
      evolution: 'Estável com autonomia plena',
      status: 'Plena Autonomia',
      recommendation: 'Garantir liberdade de exploração motora e pausas ativas na rotina.',
      color: 'emerald',
    },
    {
      key: 'funcoesExecutivas',
      name: 'Funções Executivas',
      score: axes.funcoesExecutivas,
      description: 'Controle inibitório, memória de trabalho, autorregulação e planejamento sequencial.',
      evolution: '+12% com checklist visual',
      status: 'Requer Mediação Visual',
      recommendation: 'Consolidar rotinas de 4 etapas através de painel visual na carteira.',
      color: 'amber',
    },
  ];

  // Cálculo da média global de desenvolvimento
  const averageScore = Math.round(
    (axes.cognicao + axes.linguagem + axes.matematica + axes.motricidade + axes.funcoesExecutivas) / 5
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* ========================================================
          CABEÇALHO GERAL DO MÓDULO DE AVALIAÇÃO CONTÍNUA (RF09)
         ======================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Módulo Funcional RF09 · Acompanhamento Contínuo de Avaliação</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Evolução nos Cinco Eixos de Desenvolvimento
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            Mapeamento dinâmico e longitudinal das conquistas educacionais. Pesquise e selecione estudantes por nome, sobrenome, sala ou turno para visualizar métricas detalhadas.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center min-w-[120px] shrink-0">
          <span className="text-[10px] text-blue-700 font-bold uppercase block tracking-wider">Índice Médio Atual</span>
          <span className="text-3xl font-extrabold text-blue-900 tabular-nums">{averageScore}%</span>
          <span className="text-[10px] text-blue-600 font-medium block mt-0.5">{current.name.split(' ')[0]}</span>
        </div>
      </div>

      {/* ========================================================
          MODO DE PESQUISA (NOME, SOBRENOME, SALA, TURNO, ETC.)
         ======================================================== */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Modo de Pesquisa de Alunos (Nome, Sobrenome, Sala, Turno)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {filteredStudents.length} estudante(s) encontrado(s)
          </span>
        </div>

        {/* Barra de Pesquisa Textual + Filtros Rápidos */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome, sobrenome (ex: Oliveira, Santos, Ferreira), sala (ex: 3º Ano, Sala 102) ou turno (Manhã/Tarde)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-1"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtros em Chips: Turno e Sala/Turma */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Turno:</span>
            </div>
            {uniqueShifts.map((shift) => (
              <button
                key={shift}
                onClick={() => setSelectedShift(shift)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  selectedShift === shift
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {shift === 'all' ? 'Todos os Turnos' : shift}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />

            <div className="flex items-center gap-1.5 text-slate-500 font-semibold mr-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Sala/Turma:</span>
            </div>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 border-none text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Salas</option>
              {uniqueClasses.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {(searchTerm || selectedShift !== 'all' || selectedClassFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedShift('all');
                  setSelectedClassFilter('all');
                }}
                className="ml-auto text-blue-600 hover:text-blue-800 font-semibold text-xs underline"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Resultados da Pesquisa: Cards Clicáveis dos Alunos */}
        <div className="pt-2">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
              <p className="font-semibold text-slate-700">Nenhum aluno encontrado para os critérios pesquisados.</p>
              <p className="text-[11px] mt-1">Verifique a grafia do nome, sobrenome, sala ou altere o turno filtrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredStudents.map((st) => {
                const isSelected = st.id === current.id;
                const studentAvg = Math.round(
                  (st.axesScores.cognicao +
                    st.axesScores.linguagem +
                    st.axesScores.matematica +
                    st.axesScores.motricidade +
                    st.axesScores.funcoesExecutivas) /
                    5
                );
                const shiftLabel = st.shift || (st.className.toLowerCase().includes('tarde') ? 'Tarde' : 'Manhã');

                return (
                  <button
                    key={st.id}
                    onClick={() => onSelectStudent(st)}
                    className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/30'
                        : 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                          {st.name}
                        </span>
                        {isSelected ? (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            Em Foco
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded shrink-0">
                            {studentAvg}%
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{st.room || st.className}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Turno: <strong>{shiftLabel}</strong> · Idade: {st.age} anos</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 text-[10px]">
                        Nível: <strong>{st.learningLevel}</strong>
                      </span>
                      <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-400 group-hover:text-blue-600'}`}>
                        {isSelected ? 'Selecionado' : 'Selecionar →'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          PAINEL DE ANÁLISE DETALHADA DO ESTUDANTE SELECIONADO (RF09)
         ======================================================== */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="text-slate-500">Exibindo avaliação detalhada de: </span>
            <strong className="text-blue-900">{current.name}</strong>
            <span className="text-slate-500"> ({current.className} · Turno {current.shift || 'Manhã'})</span>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('reports', current)}
          className="px-3.5 py-1.5 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-700 rounded-xl font-bold transition-colors shadow-2xs self-start sm:self-auto shrink-0"
        >
          Gerar Relatório Completo (RF08) →
        </button>
      </div>

      {/* Grid com os 5 Eixos Principais de Desenvolvimento (RF09) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {developmentalAxesList.map((axis) => (
          <div
            key={axis.key}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">{axis.name}</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    axis.score >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : axis.score >= 65
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {axis.score}%
                </span>
              </div>

              {/* Barra de Progresso do Eixo */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    axis.score >= 80
                      ? 'bg-emerald-600'
                      : axis.score >= 65
                      ? 'bg-blue-600'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${axis.score}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {axis.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Tendência Evolutiva:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {axis.evolution}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Intervenção Sugerida:</span>
                <span>{axis.recommendation}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Card Síntese de Intervenção Pedagógica Necessária */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300 block mb-1">
              Direcionamento Estratégico
            </span>
            <h3 className="text-base font-bold text-white mb-2">
              Prioridade Pedagógica para {current.name.split(' ')[0]}
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              Os eixos de <strong>Funções Executivas ({axes.funcoesExecutivas}%)</strong> e <strong>Matemática ({axes.matematica}%)</strong> demonstram maior resposta ao apoio com recursos visuais e táteis no ciclo atual.
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => onNavigateToTab('observation', current)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Gerar Atividade Focada (RF10/RF11)
            </button>
          </div>
        </div>
      </div>

      {/* Histórico Temporal de Interações e Avaliações */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Histórico Avaliativo Registrado para {current.name}
        </h3>

        <div className="space-y-3">
          {current.recentHistory.map((hist, idx) => (
            <div
              key={hist.id || idx}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-semibold text-slate-900">{hist.action}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                <span>{hist.author}</span>
                <span>{hist.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
