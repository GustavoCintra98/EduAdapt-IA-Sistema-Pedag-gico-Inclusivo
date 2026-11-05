import React, { useState } from 'react';
import { Student, ClassGroup, User, LearningLevel } from '../types';
import { 
  Search, 
  Filter, 
  Edit3, 
  UserPlus, 
  Clock, 
  Sparkles, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Layers, 
  Brain,
  FileText,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface DashboardProps {
  students: Student[];
  classes: ClassGroup[];
  currentUser: User | null;
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onOpenCreateStudent: () => void;
  onNavigateToTab: (tab: string, selectedStudent?: Student) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  classes,
  currentUser,
  onSelectStudent,
  onEditStudent,
  onOpenCreateStudent,
  onNavigateToTab,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filtros aplicados após clicar em "Filtrar" ou "Buscar"
  const [appliedClass, setAppliedClass] = useState<string>('all');
  const [appliedStudentId, setAppliedStudentId] = useState<string>('all');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState<string>('');

  const isTeacherOrCoord = currentUser?.role === 'professor' || currentUser?.role === 'coordenador';

  // Executa o filtro selecionado (RF04: Botão "Filtrar")
  const handleApplyFilter = () => {
    setAppliedClass(selectedClass);
    setAppliedStudentId(selectedStudentId);
  };

  // Executa a busca textual (RF04: Botão "Buscar")
  const handleApplySearch = () => {
    setAppliedSearchQuery(searchQuery.trim().toLowerCase());
  };

  // Filtragem dos alunos
  const filteredStudents = students.filter((s) => {
    // Filtro por turma
    if (appliedClass !== 'all' && s.className !== appliedClass) {
      return false;
    }
    // Filtro por aluno específico no dropdown
    if (appliedStudentId !== 'all' && s.id !== appliedStudentId) {
      return false;
    }
    // Filtro por barra de pesquisa (nome, habilidades, dificuldades)
    if (appliedSearchQuery) {
      const matchName = s.name.toLowerCase().includes(appliedSearchQuery);
      const matchClass = s.className.toLowerCase().includes(appliedSearchQuery);
      const matchSkills = s.skills.some((sk) => sk.toLowerCase().includes(appliedSearchQuery));
      if (!matchName && !matchClass && !matchSkills) return false;
    }
    return true;
  });

  // Aluno em foco (se apenas um selecionado ou o primeiro da lista filtrada)
  const activeStudent = filteredStudents.length > 0 ? filteredStudents[0] : students[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Hero com Imagem Educacional Gerada */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img
            src="/src/assets/images/pedagogical_hero_banner_1793833665303.jpg"
            alt="Ambiente pedagógico inclusivo com recursos de aprendizagem"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 p-6 sm:p-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sistema Homologado LGPD · Desenho Universal para a Aprendizagem (DUA)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Passaporte Pedagógico & Gestão Inclusiva
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            Mapeamento dinâmico de habilidades, interesses e estratégias pedagógicas validadas. Planejamento adaptativo orientado por inteligência artificial para garantia do direito de aprender.
          </p>
        </div>
      </div>

      {/* ========================================================
          RF04: BARRA DE FILTROS (Turma, Aluno, "Filtrar" e "Buscar")
         ======================================================== */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Seletor por Turma e por Aluno */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Filtrar por Turma:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas as Turmas</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.studentCount} alunos)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Aluno Específico:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]"
              >
                <option value="all">Todos os Alunos</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão Filtrar (RF04) */}
            <button
              onClick={handleApplyFilter}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
            >
              <Filter className="w-3.5 h-3.5" />
              Filtrar
            </button>
          </div>

          {/* Barra de Pesquisa com Botão Buscar ao lado (RF04) */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplySearch()}
                placeholder="Pesquisar por nome ou habilidade..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Botão Buscar (RF04) */}
            <button
              onClick={handleApplySearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" />
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          RF04: GRID SEPARANDO POR COLUNAS TODOS OS DADOS DO PASSAPORTE
         ======================================================== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Passaportes Pedagógicos em Exibição
            </h2>
            <p className="text-xs text-slate-500">
              {filteredStudents.length} estudante(s) localizado(s)
            </p>
          </div>

          {/* Botão de Cadastro de Alunos e/ou Turmas (RF05) */}
          {isTeacherOrCoord && (
            <button
              onClick={onOpenCreateStudent}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Cadastrar Aluno ou Turma (RF05)
            </button>
          )}
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-700">Nenhum estudante localizado para este filtro.</p>
            <p className="text-xs text-slate-500 mt-1">Experimente redefinir os parâmetros de turma ou busca textual.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-blue-300 transition-all"
              >
                {/* Cabeçalho do Cartão do Aluno com Botão de Editar (RF06) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-slate-900">{student.name}</span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                        {student.className}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          student.learningLevel === 'Apoio Intensivo'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : student.learningLevel === 'Apoio Moderado'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        Nível: {student.learningLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span>Idade: {student.age} anos</span>
                      <span>·</span>
                      <span>PEI: {student.pei.active ? 'Ativo (2026)' : 'Não requerido'}</span>
                      {student.pendingFeedbackActivityId && (
                        <>
                          <span>·</span>
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Avaliação pendente (RF12)
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Botão de Editar (RF06) - Visível apenas para professor ou coordenador */}
                  {isTeacherOrCoord && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditStudent(student)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                        title="Editar Informações Pessoais e Pedagógicas (RF06)"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                        Editar (RF06)
                      </button>

                      <button
                        onClick={() => onNavigateToTab('observation', student)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        title="Registrar Observação em Linguagem Natural (RF10)"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Análise IA (RF10)
                      </button>
                    </div>
                  )}
                </div>

                {/* Colunas estruturadas do Passaporte Pedagógico (RF04) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-5">
                  {/* Coluna 1: Habilidades já desenvolvidas */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      Habilidades
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {student.skills.map((skill, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coluna 2: Dificuldades observadas */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Dificuldades
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {student.difficulties.map((diff, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-amber-500 font-bold shrink-0">•</span>
                          <span>{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coluna 3: Interesses */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      Interesses
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Coluna 4: Estratégias Validadas (Funcionaram) */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Estratégias OK
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {student.validatedStrategies.map((strat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug text-emerald-900">
                          <span className="text-emerald-600 font-bold shrink-0">★</span>
                          <span>{strat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Coluna 5: Objetivos Pedagógicos & PEI */}
                  <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5 text-purple-600" />
                      Objetivos & PEI
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {student.pedagogicalGoals.slice(0, 2).map((goal, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-purple-600 font-bold shrink-0">→</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Linha Inferior com Atalhos de Navegação Pedagógica */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigateToTab('evaluation', student)}
                      className="hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Evolução nos 5 Eixos (RF09)
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => onNavigateToTab('reports', student)}
                      className="hover:text-blue-600 font-medium flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Relatório Consolidado (RF08)
                    </button>
                    {student.pei.active && (
                      <>
                        <span>·</span>
                        <button
                          onClick={() => onNavigateToTab('pei', student)}
                          className="hover:text-blue-600 font-medium flex items-center gap-1 transition-colors text-purple-700"
                        >
                          Plano Individualizado (RF13)
                        </button>
                      </>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Atualizado no ciclo atual · RG/CPF protegido (LGPD)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          RF04: HISTÓRICO DOS ALUNOS RECENTES PESQUISADOS OU UTILIZADOS NO DIA
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Histórico de Alunos Recentes Pesquisados ou Atendidos no Dia
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activeStudent.recentHistory.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col justify-between"
            >
              <div className="font-semibold text-slate-900 mb-1">{item.action}</div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>{item.author}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
