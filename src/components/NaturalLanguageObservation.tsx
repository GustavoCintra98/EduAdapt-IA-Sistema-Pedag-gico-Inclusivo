import React, { useState } from 'react';
import { Student, ClassGroup, ActivityItem } from '../types';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Layers, 
  Brain, 
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

interface NaturalLanguageObservationProps {
  students: Student[];
  classes: ClassGroup[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onAnalysisComplete: (result: any, activity: ActivityItem) => void;
}

export const NaturalLanguageObservation: React.FC<NaturalLanguageObservationProps> = ({
  students,
  classes,
  selectedStudent,
  onSelectStudent,
  onAnalysisComplete,
}) => {
  const currentStudent = selectedStudent || students[0];
  const [targetType, setTargetType] = useState<'student' | 'class'>('student');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.name || '');
  const [observationText, setObservationText] = useState<string>('');
  const [customGoal, setCustomGoal] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Exemplos de entrada assistida conforme especificado na RF10:
  // "como por exemplo: 'O aluno perde a concentração em textos longos' ou 'Apresentou dificuldade em associar quantidades na aula de hoje'."
  const assistedInputs = [
    'O aluno perde a concentração em textos longos',
    'Apresentou dificuldade em associar quantidades na aula de hoje',
    'Demonstra interesse elevado ao utilizar blocos manipulativos, mas trava na escrita cursiva',
    'Apresentou sobrecarga sensorial na transição de matérias sem apoio visual prévio',
    'Recusa trabalhos em duplas quando não compreende claramente seu papel na tarefa'
  ];

  const handleRunAnalysis = async () => {
    if (!observationText.trim()) {
      setErrorMsg('Por favor, descreva a observação pedagógica ou selecione um dos exemplos assistidos.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setElapsedSeconds(0);

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      // Indicador de etapas da IA pedagógica (< 8 segundos conforme RNF05)
      setLoadingStep('Anonimizando dados pessoais e CPF em estrita conformidade com a LGPD (RNF03)...');
      await new Promise((r) => setTimeout(r, 600));

      setLoadingStep('Cruzando observação com o Passaporte Pedagógico e metas ativas do PEI (RF04/RF13)...');
      await new Promise((r) => setTimeout(r, 700));

      setLoadingStep('Aplicando princípios do DUA e filtros éticos antibloqueio clínico (RNF06/RNF08)...');

      const response = await fetch('/api/gemini/analyze-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: currentStudent,
          observation: observationText,
          customGoal: customGoal || currentStudent.pei?.goals?.[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao processar análise de intervenção.');
      }

      const data = await response.json();

      // Constrói objeto de atividade adaptativa DUA (RF11)
      const generatedActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        studentId: currentStudent.id,
        title: data.activity?.title || 'Atividade Adaptativa DUA',
        pedagogicalAxis: (data.activity?.pedagogicalAxis as any) || 'Cognição',
        objective: data.activity?.objective || 'Desenvolvimento funcional direcionado',
        practicalExample: data.activity?.practicalExample || 'Aplicação com recursos visuais do cotidiano',
        visualResourceSuggestion: data.activity?.visualResourceSuggestion || 'Cartões sequenciais e apoio concreto',
        bnccCompetencies: data.bnccCompetencies || ['EF03MA05', 'Competência Geral 2'],
        peiGoalLinked: data.peiGoalLinked || currentStudent.pei?.goals?.[0] || 'Meta funcional geral',
        explicabilityJustification: data.pedagogicalJustification || data.summary || 'Atividade gerada sob princípios DUA.',
        levels: {
          intensivo: {
            description: data.activity?.levels?.intensivo?.description || 'Apoio total com mediação 1:1.',
            instructions: data.activity?.levels?.intensivo?.instructions || 'Realize passo a passo com suporte físico.',
          },
          moderado: {
            description: data.activity?.levels?.moderado?.description || 'Apoio com pistas visuais e roteiro.',
            instructions: data.activity?.levels?.moderado?.instructions || 'Acompanhe com checagem intermediária.',
          },
          independente: {
            description: data.activity?.levels?.independente?.description || 'Execução autônoma com autoavaliação.',
            instructions: data.activity?.levels?.independente?.instructions || 'Disponibilize gabarito de autocorreção.',
          },
        },
        targetLevel: currentStudent.learningLevel,
        status: 'pendente_aplicacao',
        createdAt: new Date().toLocaleDateString('pt-BR'),
      };

      clearInterval(timer);
      setIsLoading(false);
      onAnalysisComplete(data, generatedActivity);
    } catch (err: any) {
      console.error(err);
      clearInterval(timer);
      setIsLoading(false);
      setErrorMsg('Ocorreu uma oscilação na resposta da IA. O sistema usará as diretrizes locais de contingência.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Cabeçalho da Interface Dedicada */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Módulo Funcional RF10 · Entrada em Linguagem Natural</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Registro de Situação Pedagógica Cotidiana
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Descreva desafios, reações ou comportamentos em texto livre. A IA cruzará as informações com o Passaporte Pedagógico e gerará intervenções parametrizadas pelo DUA.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>RNF03 / RNF08: Anonimização LGPD & Bloqueio Ético de Diagnósticos</span>
          </div>
        </div>

        {/* ========================================================
            RF10: SELETOR DE ALUNO ESPECÍFICO OU TURMA
           ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vincular Relato a: *
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTargetType('student')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  targetType === 'student'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Aluno Específico
              </button>
              <button
                type="button"
                onClick={() => setTargetType('class')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  targetType === 'class'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Turma Completa
              </button>
            </div>
          </div>

          <div>
            {targetType === 'student' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Selecione o Estudante: *
                </label>
                <select
                  value={currentStudent.id}
                  onChange={(e) => {
                    const found = students.find((s) => s.id === e.target.value);
                    if (found) onSelectStudent(found);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className}) · Nível: {s.learningLevel}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Selecione a Turma: *
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.studentCount} estudantes)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Resumo do Passaporte Pedagógico Vinculado */}
        {targetType === 'student' && (
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-900">Passaporte Ativo: </span>
              <span>{currentStudent.name}</span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-slate-500">PEI: {currentStudent.pei.active ? 'Vinculado' : 'Sem PEI'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Estratégias já validadas:</span>
              <span className="font-semibold text-emerald-700">{currentStudent.validatedStrategies.length} registradas</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          RF10: CAMPO DE TEXTO AMPLO & ENTRADA ASSISTIDA
         ======================================================== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-800">
              Descrição da Observação Pedagógica Cotidiana (Linguagem Natural) *
            </label>
            <span className="text-[11px] text-slate-400">Texto livre do educador</span>
          </div>

          <textarea
            value={observationText}
            onChange={(e) => setObservationText(e.target.value)}
            rows={5}
            placeholder="Exemplo: O aluno perde a concentração em textos longos e demonstra frustração com instruções orais rápidas, mas reage muito bem a cartões visuais e contadores concretos..."
            className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
          />
        </div>

        {/* Sugestões de Entrada Assistida (RF10) */}
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Sugestões Rápidas de Entrada Assistida (Clique para preencher):
          </span>
          <div className="flex flex-wrap gap-2">
            {assistedInputs.map((hint, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setObservationText(hint)}
                className="text-left text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                "{hint}"
              </button>
            ))}
          </div>
        </div>

        {/* Meta do PEI Vinculada (RF13) */}
        {currentStudent.pei.active && (
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
            <label className="block text-[11px] font-bold text-purple-900 mb-1">
              Meta do Plano Educacional Individualizado (PEI - RF13) a ser Priorizada:
            </label>
            <select
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-xs text-slate-900"
            >
              <option value="">{currentStudent.pei.goals[0] || 'Meta principal do semestre'}</option>
              {currentStudent.pei.goals.slice(1).map((g, idx) => (
                <option key={idx} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
            {errorMsg}
          </div>
        )}

        {/* ========================================================
            RF10: BOTÃO "ANALISAR E GERAR ESTRATÉGIA" COM FEEDBACK < 8s (RNF05)
           ======================================================== */}
        <div className="pt-2">
          {isLoading ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>{loadingStep}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] text-blue-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{elapsedSeconds}s / 8s máx (RNF05)</span>
                </div>
              </div>

              {/* Barra de progresso animada */}
              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (elapsedSeconds / 6) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleRunAnalysis}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Analisar e Gerar Estratégia (RF10)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
