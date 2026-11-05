import React, { useState } from 'react';
import { ActivityItem, Student, LearningLevel } from '../types';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  FileText, 
  Award, 
  RefreshCw,
  Clock,
  BookOpen,
  Image as ImageIcon,
  ShieldCheck,
  Check
} from 'lucide-react';

interface AdaptiveActivitiesViewProps {
  currentActivity: ActivityItem | null;
  student: Student;
  allActivities: ActivityItem[];
  onOpenFeedback: (activity: ActivityItem) => void;
  onSelectOption: (activity: ActivityItem) => void;
  onRefreshOptions: (count: number) => Promise<void>;
  isLoadingOptions: boolean;
  generatedOptions: ActivityItem[];
}

export const AdaptiveActivitiesView: React.FC<AdaptiveActivitiesViewProps> = ({
  currentActivity,
  student,
  allActivities,
  onOpenFeedback,
  onSelectOption,
  onRefreshOptions,
  isLoadingOptions,
  generatedOptions,
}) => {
  const [selectedLevelTab, setSelectedLevelTab] = useState<LearningLevel>(student.learningLevel);
  const [activeExplainTab, setActiveExplainTab] = useState<'justification' | 'patterns'>('justification');
  const [targetCount, setTargetCount] = useState<number>(6);

  // Regra de Negócio Crítica (RF12): Trava de Dependência de Feedback
  // Bloqueia a progressão do nível de dificuldade caso a atividade anterior não tenha recebido avaliação de desempenho!
  const hasPendingFeedback = Boolean(student.pendingFeedbackActivityId);
  const isTryingProgression =
    (student.learningLevel === 'Apoio Intensivo' && selectedLevelTab !== 'Apoio Intensivo') ||
    (student.learningLevel === 'Apoio Moderado' && selectedLevelTab === 'Independente');

  const isBlockedByRule = hasPendingFeedback && isTryingProgression;

  if (!currentActivity) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-xl mx-auto space-y-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Nenhuma Atividade Ativa no Momento</h2>
        <p className="text-xs text-slate-500">
          Utilize o módulo de <strong className="text-slate-800">Observação IA (RF10)</strong> para relatar uma situação pedagógica e gerar atividades parametrizadas pelo DUA.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* ========================================================
          RF12: ALERTA DE TRAVA DE DEPENDÊNCIA DE FEEDBACK (REGRA DE NEGÓCIO)
         ======================================================== */}
      {hasPendingFeedback && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-amber-800">
                Trava de Dependência de Feedback Ativa (Regra de Negócio RF12)
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                A progressão do nível de dificuldade de <strong>{student.name}</strong> está bloqueada até que o professor insira a avaliação de desempenho (feedback qualitativo e quantitativo) referente à atividade anterior.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const pendingAct = allActivities.find((a) => a.id === student.pendingFeedbackActivityId) || currentActivity;
              onOpenFeedback(pendingAct);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition-colors"
          >
            Registrar Feedback Pendente (RF12)
          </button>
        </div>
      )}

      {/* Cabeçalho da Atividade Ativa com Vinculação Explícita ao PEI (RF13) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
          {/* Tag de Meta do PEI Vinculada (RF13) */}
          {currentActivity.peiGoalLinked && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-blue-100 text-[11px] font-semibold mb-3 border border-white/25">
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>PEI (RF13): {currentActivity.peiGoalLinked}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-1">
                Eixo Pedagógico: {currentActivity.pedagogicalAxis} · Aluno: {student.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentActivity.title}
              </h1>
              <p className="text-xs text-slate-200 mt-2 max-w-2xl leading-relaxed">
                <strong>Objetivo:</strong> {currentActivity.objective}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/20">
                Nível Alvo: {student.learningLevel}
              </span>
              <span className="text-[11px] text-blue-200">
                Gerado em {currentActivity.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            RF11: SELETOR DE NÍVEIS PARAMETRIZADOS (Apoio Intensivo, Apoio Moderado, Independente)
           ======================================================== */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Parametrização nos Três Níveis de Dificuldade (RF11 / DUA)
              </h3>
              <p className="text-xs text-slate-500">
                Alterne entre os níveis mantendo o mesmo objetivo de aprendizagem.
              </p>
            </div>

            {/* Aviso se tentativa de progressão for bloqueada pela trava de feedback */}
            {isBlockedByRule && (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Bloqueado: Requer feedback prévio
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setSelectedLevelTab('Apoio Intensivo')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedLevelTab === 'Apoio Intensivo'
                  ? 'border-rose-400 bg-rose-50/50 shadow-sm ring-2 ring-rose-200'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-900">Nível 1: Apoio Intensivo</span>
                {student.learningLevel === 'Apoio Intensivo' && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Atual</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600">
                Mediação 1:1, suporte físico, modelo guiado e materiais táteis em relevo.
              </p>
            </button>

            <button
              onClick={() => setSelectedLevelTab('Apoio Moderado')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedLevelTab === 'Apoio Moderado'
                  ? 'border-amber-400 bg-amber-50/50 shadow-sm ring-2 ring-amber-200'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-900">Nível 2: Apoio Moderado</span>
                {student.learningLevel === 'Apoio Moderado' && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Atual</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600">
                Pistas intermediárias, roteiro visual, duplas colaborativas e autonomia parcial.
              </p>
            </button>

            <button
              onClick={() => setSelectedLevelTab('Independente')}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedLevelTab === 'Independente'
                  ? 'border-emerald-400 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-200'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-900">Nível 3: Independente</span>
                {student.learningLevel === 'Independente' && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Atual</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600">
                Resolução individual, desafio conceitual ampliado e folha de autoavaliação.
              </p>
            </button>
          </div>

          {/* Detalhe do Nível Selecionado */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
              <Layers className="w-4 h-4 text-blue-600" />
              Diretrizes de Aplicação para {selectedLevelTab}
            </h4>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {selectedLevelTab === 'Apoio Intensivo'
                ? currentActivity.levels.intensivo.description
                : selectedLevelTab === 'Apoio Moderado'
                ? currentActivity.levels.moderado.description
                : currentActivity.levels.independente.description}
            </p>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800">Passo a passo sugerido ao professor:</span>
              <p>
                {selectedLevelTab === 'Apoio Intensivo'
                  ? currentActivity.levels.intensivo.instructions
                  : selectedLevelTab === 'Apoio Moderado'
                  ? currentActivity.levels.moderado.instructions
                  : currentActivity.levels.independente.instructions}
              </p>
            </div>
          </div>
        </div>

        {/* Recursos Visuais e Exemplos Práticos da Atividade (RF07 / RF11) */}
        <div className="p-6 sm:p-8 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              Recurso Visual / Material Concreto
            </span>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-3">
              <img
                src="/src/assets/images/inclusive_activity_materials_1793833665638.jpg"
                alt="Recursos visuais e blocos manipulativos"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover"
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              {currentActivity.visualResourceSuggestion}
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Exemplo Prático de Aplicabilidade
            </span>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm mb-3">
              <img
                src="/src/assets/images/dua_multimodal_learning_1793833665355.jpg"
                alt="Estudantes em atividade colaborativa multimodal"
                referrerPolicy="no-referrer"
                className="w-full h-44 object-cover"
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              {currentActivity.practicalExample}
            </p>
          </div>
        </div>

        {/* ========================================================
            RF07: MÓDULO DE EXPLICABILIDADE DA INTELIGÊNCIA ARTIFICIAL
           ======================================================== */}
        <div className="p-6 sm:p-8 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                <Brain className="w-4 h-4" />
                <span>Módulo de Explicabilidade da IA (RF07)</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Transparência dos Critérios & Raciocínio Pedagógico
              </h3>
            </div>

            {/* Alternador dos 2 Eixos Principais do RF07 */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveExplainTab('justification')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeExplainTab === 'justification'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Justificativa Técnica/Pedagógica
              </button>
              <button
                onClick={() => setActiveExplainTab('patterns')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeExplainTab === 'patterns'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Análise Contínua de Padrões
              </button>
            </div>
          </div>

          {/* Eixo 1: Justificativa Técnica / Pedagógica */}
          {activeExplainTab === 'justification' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl">
                <h4 className="text-xs font-bold text-purple-950 mb-1">
                  Por que esta atividade é adequada ao momento atual do estudante?
                </h4>
                <p className="text-xs text-purple-900 leading-relaxed">
                  {currentActivity.explicabilityJustification}
                </p>
              </div>

              {/* Critérios Utilizados pela IA (RF07: dificuldade, competências BNCC, estilo de aprendizagem) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Nível de Dificuldade:</span>
                  <span className="font-semibold text-blue-700">{selectedLevelTab}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Competências BNCC:</span>
                  <div className="text-slate-600 space-y-0.5">
                    {currentActivity.bnccCompetencies.map((code, idx) => (
                      <div key={idx}>{code}</div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Estilo de Aprendizagem Focado:</span>
                  <span className="text-slate-600">Visual-Cinestésico com Ancoragem em Interesses</span>
                </div>
              </div>
            </div>
          )}

          {/* Eixo 2: Análise Contínua de Padrões Comportamentais e de Aprendizagem */}
          {activeExplainTab === 'patterns' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                Padrões Comportamentais Identificados pela IA em Sala de Aula:
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                <li>
                  <strong>Tempo Médio de Atenção Sustentada:</strong> 14 a 18 minutos sem interrupção quando há pistas visuais presentes na carteira.
                </li>
                <li>
                  <strong>Correlação com Interesses:</strong> Redução de 65% na taxa de desistência inicial ao conectar enunciados ao universo de astronomia ou animais.
                </li>
                <li>
                  <strong>Recomendação Semanal Calculada (RF07/RF12):</strong> Atingir aproveitamento sustentado $\ge 80\%$ em 3 atividades consecutivas para validar a progressão automática para nível Independente.
                </li>
              </ul>
            </div>
          )}

          {/* Ações Inferiores: Registrar Desempenho (RF12) */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Conforme RNF08: Análise estritamente pedagógica (sem rótulos clínicos).</span>
            </div>

            <button
              onClick={() => onOpenFeedback(currentActivity)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <Award className="w-4 h-4" />
              Registrar Feedback de Desempenho (RF12)
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          RF11 & RNF07: ATÉ 10 OPÇÕES DE ATIVIDADES DE INTERVENÇÃO COM "GERAR NOVAS OPÇÕES"
         ======================================================== */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>RNF07 / RF11 · Variedade de Intervenções</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Banco de Alternativas de Intervenção Pedagógica (Até 10 Opções)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Escolha diferentes abordagens caso necessite de alternativas para trabalhar o mesmo conteúdo com o aluno.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
            >
              <option value={4}>4 Opções</option>
              <option value={6}>6 Opções</option>
              <option value={10}>10 Opções (Máx RNF07)</option>
            </select>

            {/* Botão "Gerar novas opções" (RF11) */}
            <button
              onClick={() => onRefreshOptions(targetCount)}
              disabled={isLoadingOptions}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOptions ? 'animate-spin' : ''}`} />
              Gerar Novas Opções (RF11)
            </button>
          </div>
        </div>

        {isLoadingOptions ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs space-y-2">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mx-auto" />
            <p className="font-bold">Gerando {targetCount} opções distintas de intervenção sob os princípios do DUA...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedOptions.map((opt, idx) => (
              <div
                key={opt.id || idx}
                className="p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between group shadow-none hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span className="text-blue-700 font-bold">{opt.pedagogicalAxis}</span>
                    <span>Opção #{idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {opt.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {opt.objective}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-2 italic line-clamp-2">
                    💡 {opt.practicalExample}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    BNCC: {opt.bnccCompetencies?.[0] || 'EF03MA05'}
                  </span>
                  <button
                    onClick={() => onSelectOption(opt)}
                    className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white border border-slate-300 hover:border-blue-600 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Aplicar Esta Opção
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
