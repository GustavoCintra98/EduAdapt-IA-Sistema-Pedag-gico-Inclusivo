import React, { useState } from 'react';
import { ActivityItem, Student, ActivityFeedback } from '../types';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Brain,
  Clock,
  Check
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityItem;
  student: Student;
  onSaveFeedback: (activityId: string, feedback: ActivityFeedback) => void;
  onRecalibrate: (studentId: string, recalibrationResult: any) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  activity,
  student,
  onSaveFeedback,
  onRecalibrate,
}) => {
  // Dados qualitativos (RF12)
  const [engagement, setEngagement] = useState('Alto engajamento ao utilizar fichas visuais e contadores');
  const [autonomy, setAutonomy] = useState('Realizou 4 de 5 etapas sem necessidade de intervenção');
  const [barriers, setBarriers] = useState('Fadiga leve após 18 minutos; necessitou de pausa motora');

  // Dados quantitativos (RF12)
  const [scorePercent, setScorePercent] = useState<number>(85);
  const [completionMinutes, setCompletionMinutes] = useState<number>(18);
  const [grade, setGrade] = useState('A');

  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recalibrationData, setRecalibrationData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const feedback: ActivityFeedback = {
      qualitative: {
        engagement,
        autonomy,
        barriers,
      },
      quantitative: {
        scorePercent: Number(scorePercent),
        completionTimeMinutes: Number(completionMinutes),
        grade,
      },
      submittedBy: 'Prof. Titular',
      submittedAt: new Date().toLocaleDateString('pt-BR'),
    };

    onSaveFeedback(activity.id, feedback);

    // Se houve recalibragem gerada, aplica
    if (recalibrationData) {
      onRecalibrate(student.id, recalibrationData);
    }

    onClose();
  };

  const handleRunRecalibration = async () => {
    setIsRecalibrating(true);
    try {
      const response = await fetch('/api/gemini/recalibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          feedbacks: [
            {
              scorePercent,
              completionMinutes,
              engagement,
              autonomy,
              barriers,
            },
          ],
        }),
      });

      const data = await response.json();
      setRecalibrationData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRecalibrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
              Avaliação de Desempenho e Recalibragem (RF12)
            </span>
            <h2 className="text-xl font-bold">Feedback Pedagógico: {activity.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-light leading-none p-1"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Dados Qualitativos */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              1. Registro Qualitativo (RF12)
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Engajamento e Reação do Aluno:
              </label>
              <input
                type="text"
                value={engagement}
                onChange={(e) => setEngagement(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grau de Autonomia Demonstrado:
                </label>
                <input
                  type="text"
                  value={autonomy}
                  onChange={(e) => setAutonomy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Barreiras ou Desafios Observados:
                </label>
                <input
                  type="text"
                  value={barriers}
                  onChange={(e) => setBarriers(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dados Quantitativos */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              2. Registro Quantitativo (RF12)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Percentual de Acerto (%):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={scorePercent}
                  onChange={(e) => setScorePercent(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-blue-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempo de Conclusão:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={completionMinutes}
                    onChange={(e) => setCompletionMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400">min</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Conceito / Nota:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="A+">A+ (Excelente)</option>
                  <option value="A">A (Muito Bom)</option>
                  <option value="B">B (Bom / Em Desenvolvimento)</option>
                  <option value="C">C (Requer Apoio Contínuo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recalibragem Semanal da IA (RF12) */}
          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Recalibragem Semanal Orientada por IA (RF12)
                </span>
                <p className="text-[11px] text-purple-800">
                  Processa os feedbacks para promover progressão/regressão e atualizar estratégias validadas.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunRecalibration}
                disabled={isRecalibrating}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                {isRecalibrating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Calculando...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-3.5 h-3.5" />
                    <span>Processar Recalibragem</span>
                  </>
                )}
              </button>
            </div>

            {recalibrationData && (
              <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Recomendação do Sistema:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                      recalibrationData.action === 'progressao'
                        ? 'bg-emerald-100 text-emerald-800 flex items-center gap-1'
                        : recalibrationData.action === 'regressao'
                        ? 'bg-rose-100 text-rose-800 flex items-center gap-1'
                        : 'bg-blue-100 text-blue-800 flex items-center gap-1'
                    }`}
                  >
                    {recalibrationData.action === 'progressao' && <TrendingUp className="w-3 h-3" />}
                    {recalibrationData.action === 'regressao' && <TrendingDown className="w-3 h-3" />}
                    {recalibrationData.action === 'manutencao' && <Minus className="w-3 h-3" />}
                    {recalibrationData.action?.toUpperCase()} para "{recalibrationData.newLevel}"
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  {recalibrationData.rationale}
                </p>

                {recalibrationData.newValidatedStrategies && (
                  <div>
                    <span className="font-semibold text-emerald-800 block mb-1">
                      Estratégias Validadas a incorporar no Passaporte:
                    </span>
                    <ul className="list-disc pl-4 text-emerald-900 space-y-0.5">
                      {recalibrationData.newValidatedStrategies.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Salvar Feedback & Desbloquear Trava
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
