import React, { useState, useEffect } from 'react';
import { 
  User, 
  Student, 
  ClassGroup, 
  ActivityItem, 
  ActivityFeedback, 
  PeiData, 
  AccessibilitySettings 
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_STUDENTS, 
  INITIAL_CLASSES, 
  INITIAL_ACTIVITIES 
} from './mockData';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AuthModals } from './components/AuthModals';
import { StudentRegisterModal } from './components/StudentRegisterModal';
import { StudentEditModal } from './components/StudentEditModal';
import { NaturalLanguageObservation } from './components/NaturalLanguageObservation';
import { AdaptiveActivitiesView } from './components/AdaptiveActivitiesView';
import { FeedbackModal } from './components/FeedbackModal';
import { ContinuousEvaluationView } from './components/ContinuousEvaluationView';
import { ConsolidatedReportsView } from './components/ConsolidatedReportsView';
import { PeiManagementModal } from './components/PeiManagementModal';
import { ParentsPortal } from './components/ParentsPortal';

export default function App() {
  // State principal da aplicação
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [classes, setClasses] = useState<ClassGroup[]>(INITIAL_CLASSES);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Usuário autenticado (Inicia logado como Professor para validação imediata dos requisitos)
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[1]);

  // Navegação por abas
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Estudante e atividade atualmente em foco
  const [selectedStudent, setSelectedStudent] = useState<Student>(INITIAL_STUDENTS[0]);
  const [currentActivity, setCurrentActivity] = useState<ActivityItem | null>(INITIAL_ACTIVITIES[0] || null);

  // Variações de atividades (RNF07: até 10 opções)
  const [generatedOptions, setGeneratedOptions] = useState<ActivityItem[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // Controle de Modais
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'firstAccess' | 'forgot' | 'register'>('login');
  const [firstAccessUser, setFirstAccessUser] = useState<User | null>(null);

  const [isStudentRegisterOpen, setIsStudentRegisterOpen] = useState(false);
  const [isStudentEditOpen, setIsStudentEditOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activityForFeedback, setActivityForFeedback] = useState<ActivityItem | null>(null);

  const [isPeiModalOpen, setIsPeiModalOpen] = useState(false);

  // Configurações de Acessibilidade WCAG (RNF04)
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'normal',
    reducedMotion: false,
    screenReaderFeedback: true,
  });

  // Atualiza estilos globais de acessibilidade (WCAG RNF04)
  useEffect(() => {
    const root = document.documentElement;
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    const scale =
      accessibility.fontSize === 'large'
        ? '115%'
        : accessibility.fontSize === 'extralarge'
        ? '130%'
        : '100%';
    root.style.setProperty('--font-scale', scale);
  }, [accessibility]);

  // Se o usuário logado for 'pais', direciona para a visão restrita da família (RF14)
  const isParent = currentUser?.role === 'pais';

  // Carrega opções iniciais de atividades adaptativas (RNF07)
  const loadInitialOptions = async (student: Student) => {
    setIsLoadingOptions(true);
    try {
      const res = await fetch('/api/gemini/generate-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          observation: 'Intervenção contínua para fortalecimento de habilidades cognitivas e autônomas',
          count: 6,
        }),
      });
      const data = await res.json();
      if (data.activities && Array.isArray(data.activities)) {
        setGeneratedOptions(data.activities);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      loadInitialOptions(selectedStudent);
    }
  }, [selectedStudent.id]);

  // Login & Autenticação (RF01)
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'pais') {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
    setAuthModalMode('login');
  };

  const handleRegisterUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUserPassword = (userId: string, newPass: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, password: newPass, isFirstAccess: false } : u
      )
    );
  };

  // Cadastro de Estudantes (RF05)
  const handleSaveStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    setSelectedStudent(newStudent);
  };

  // Edição de Estudantes (RF06)
  const handleOpenEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentEditOpen(true);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (selectedStudent.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
  };

  // Observação em Linguagem Natural (RF10) concluída pela IA
  const handleAnalysisComplete = (result: any, activity: ActivityItem) => {
    setActivities((prev) => [activity, ...prev]);
    setCurrentActivity(activity);
    setActiveTab('activities');
  };

  // Feedback de Desempenho e Trava de Bloqueio (RF12)
  const handleOpenFeedback = (activity: ActivityItem) => {
    setActivityForFeedback(activity);
    setIsFeedbackModalOpen(true);
  };

  const handleSaveFeedback = (activityId: string, feedback: ActivityFeedback) => {
    // Atualiza atividade para concluída com feedback
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, status: 'concluida_com_feedback', feedback }
          : a
      )
    );

    // Se a atividade correspondia à trava do estudante, libera a trava!
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === selectedStudent.id) {
          return {
            ...s,
            pendingFeedbackActivityId: null, // Desbloqueia progressão!
            recentHistory: [
              {
                id: `hist-${Date.now()}`,
                date: new Date().toLocaleDateString('pt-BR'),
                action: `Feedback registrado: ${feedback.quantitative.scorePercent}% de aproveitamento. Trava de progressão liberada.`,
                author: feedback.submittedBy,
              },
              ...s.recentHistory,
            ],
          };
        }
        return s;
      })
    );

    setSelectedStudent((prev) => ({
      ...prev,
      pendingFeedbackActivityId: null,
    }));
  };

  // Recalibragem Semanal pela IA (RF12)
  const handleRecalibrate = (studentId: string, recalResult: any) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            learningLevel: recalResult.newLevel || s.learningLevel,
            validatedStrategies: [
              ...(recalResult.newValidatedStrategies || []),
              ...s.validatedStrategies,
            ].filter((v, i, a) => a.indexOf(v) === i),
            recentHistory: [
              {
                id: `hist-${Date.now()}`,
                date: new Date().toLocaleDateString('pt-BR'),
                action: `Recalibragem semanal: Nível atualizado para "${recalResult.newLevel}".`,
                author: 'Assistente IA',
              },
              ...s.recentHistory,
            ],
          };
        }
        return s;
      })
    );

    setSelectedStudent((prev) => ({
      ...prev,
      learningLevel: recalResult.newLevel || prev.learningLevel,
    }));
  };

  // Gestão de PEI (RF13)
  const handleUpdatePei = (studentId: string, pei: PeiData) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, pei } : s))
    );
    if (selectedStudent.id === studentId) {
      setSelectedStudent((prev) => ({ ...prev, pei }));
    }
  };

  // Variações de atividades (RNF07 / RF11)
  const handleRefreshOptions = async (count: number) => {
    setIsLoadingOptions(true);
    try {
      const res = await fetch('/api/gemini/generate-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: selectedStudent,
          observation: 'Geração de alternativas para o plano pedagógico',
          count,
        }),
      });
      const data = await res.json();
      if (data.activities && Array.isArray(data.activities)) {
        setGeneratedOptions(data.activities);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleSelectOptionAsCurrent = (opt: ActivityItem) => {
    const fullActivity: ActivityItem = {
      ...opt,
      id: `act-sel-${Date.now()}`,
      studentId: selectedStudent.id,
      status: 'pendente_aplicacao',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    setCurrentActivity(fullActivity);
    setActivities((prev) => [fullActivity, ...prev]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTab = (tab: string, student?: Student) => {
    if (student) {
      setSelectedStudent(student);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors">
      {/* Header com Top Bar Contract e Acessibilidade WCAG */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        accessibility={accessibility}
        setAccessibility={setAccessibility}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Conteúdo Principal da Aplicação */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ========================================================
            RF14: PAINEL DE CONSULTA PARA PAIS E RESPONSÁVEIS
           ======================================================== */}
        {isParent ? (
          activeTab === 'reports' ? (
            <ConsolidatedReportsView
              students={students}
              selectedStudent={selectedStudent}
              currentUser={currentUser}
              onSelectStudent={setSelectedStudent}
            />
          ) : (
            <ParentsPortal
              currentUser={currentUser}
              students={students}
              onOpenReport={(st) => {
                setSelectedStudent(st);
                setActiveTab('reports');
              }}
            />
          )
        ) : (
          /* ========================================================
              PAINEL COMPLETO DE PROFESSOR E COORDENAÇÃO (RF04 A RF13)
             ======================================================== */
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                students={students}
                classes={classes}
                currentUser={currentUser}
                onSelectStudent={setSelectedStudent}
                onEditStudent={handleOpenEditStudent}
                onOpenCreateStudent={() => setIsStudentRegisterOpen(true)}
                onNavigateToTab={handleNavigateToTab}
              />
            )}

            {activeTab === 'observation' && (
              <NaturalLanguageObservation
                students={students}
                classes={classes}
                selectedStudent={selectedStudent}
                onSelectStudent={setSelectedStudent}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {activeTab === 'activities' && (
              <AdaptiveActivitiesView
                currentActivity={currentActivity}
                student={selectedStudent}
                allActivities={activities}
                onOpenFeedback={handleOpenFeedback}
                onSelectOption={handleSelectOptionAsCurrent}
                onRefreshOptions={handleRefreshOptions}
                isLoadingOptions={isLoadingOptions}
                generatedOptions={generatedOptions}
              />
            )}

            {activeTab === 'evaluation' && (
              <ContinuousEvaluationView
                students={students}
                selectedStudent={selectedStudent}
                onSelectStudent={setSelectedStudent}
                onNavigateToTab={handleNavigateToTab}
              />
            )}

            {activeTab === 'reports' && (
              <ConsolidatedReportsView
                students={students}
                selectedStudent={selectedStudent}
                currentUser={currentUser}
                onSelectStudent={setSelectedStudent}
              />
            )}

            {activeTab === 'pei' && (
              <div className="max-w-4xl mx-auto space-y-6 pb-16">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-purple-700 block mb-1">
                      Módulo Funcional RF13 · PEI Ativo
                    </span>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Plano Educacional Individualizado de {selectedStudent.name}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedStudent.className} · Status: {selectedStudent.pei.active ? 'Ativo' : 'Inativo'} · Período: {selectedStudent.pei.term}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsPeiModalOpen(true)}
                    className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap"
                  >
                    Editar Metas do PEI (RF13)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-purple-950 uppercase tracking-wide">
                      Metas Pedagógicas Obrigatórias (Vinculadas à IA)
                    </h3>
                    <ul className="text-xs text-slate-700 space-y-2">
                      {selectedStudent.pei.goals.map((g, idx) => (
                        <li key={idx} className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-start gap-2">
                          <span className="text-purple-600 font-bold shrink-0">✓</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Adaptações Curriculares e de Acessibilidade
                    </h3>
                    <ul className="text-xs text-slate-700 space-y-2">
                      {selectedStudent.pei.curricularAdaptations.map((a, idx) => (
                        <li key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2">
                          <span className="text-blue-600 font-bold shrink-0">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Discreto Conforme Diretrizes de Design */}
      <footer className="border-t border-slate-200 py-6 bg-white text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 EduAdapt IA · Desenho Universal para a Aprendizagem (DUA) · Alinhado à BNCC e LGPD</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>RNF01 Multiplataforma</span>
            <span>·</span>
            <span>RNF04 Acessibilidade WCAG</span>
            <span>·</span>
            <span>RNF08 Bloqueio Clínico Ético</span>
          </div>
        </div>
      </footer>

      {/* Modais Globais do Sistema */}
      <AuthModals
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
        onUpdateUserPassword={handleUpdateUserPassword}
        initialMode={authModalMode}
        firstAccessUser={firstAccessUser}
      />

      <StudentRegisterModal
        isOpen={isStudentRegisterOpen}
        onClose={() => setIsStudentRegisterOpen(false)}
        classes={classes}
        onSaveStudent={handleSaveStudent}
      />

      {isStudentEditOpen && studentToEdit && (
        <StudentEditModal
          isOpen={isStudentEditOpen}
          onClose={() => setIsStudentEditOpen(false)}
          student={studentToEdit}
          onUpdateStudent={handleUpdateStudent}
        />
      )}

      {isFeedbackModalOpen && activityForFeedback && (
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          activity={activityForFeedback}
          student={selectedStudent}
          onSaveFeedback={handleSaveFeedback}
          onRecalibrate={handleRecalibrate}
        />
      )}

      {isPeiModalOpen && (
        <PeiManagementModal
          isOpen={isPeiModalOpen}
          onClose={() => setIsPeiModalOpen(false)}
          student={selectedStudent}
          onUpdatePei={handleUpdatePei}
        />
      )}
    </div>
  );
}
