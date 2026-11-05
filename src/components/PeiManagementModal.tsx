import React, { useState } from 'react';
import { Student, PeiData } from '../types';
import { Brain, CheckCircle2, Plus, Trash2, ShieldCheck, Save, FileText } from 'lucide-react';

interface PeiManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onUpdatePei: (studentId: string, pei: PeiData) => void;
}

export const PeiManagementModal: React.FC<PeiManagementModalProps> = ({
  isOpen,
  onClose,
  student,
  onUpdatePei,
}) => {
  const [active, setActive] = useState(student.pei.active);
  const [term, setTerm] = useState(student.pei.term || '2º Semestre Letivo - 2026');
  const [goals, setGoals] = useState<string[]>(
    student.pei.goals.length > 0
      ? student.pei.goals
      : ['Meta PEI-01: Dominar cálculos aditivos de 2 dígitos com material concreto']
  );
  const [adaptations, setAdaptations] = useState<string[]>(
    student.pei.curricularAdaptations.length > 0
      ? student.pei.curricularAdaptations
      : ['Fontes ampliadas (mínimo 16pt)', 'Apoio visual sequencial contínuo']
  );

  const [newGoal, setNewGoal] = useState('');
  const [newAdaptation, setNewAdaptation] = useState('');

  if (!isOpen) return null;

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, newGoal.trim()]);
    setNewGoal('');
  };

  const handleRemoveGoal = (idx: number) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  const handleAddAdaptation = () => {
    if (!newAdaptation.trim()) return;
    setAdaptations([...adaptations, newAdaptation.trim()]);
    setNewAdaptation('');
  };

  const handleRemoveAdaptation = (idx: number) => {
    setAdaptations(adaptations.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const updatedPei: PeiData = {
      active,
      term,
      goals,
      curricularAdaptations: adaptations,
      lastUpdated: new Date().toLocaleDateString('pt-BR'),
    };

    onUpdatePei(student.id, updatedPei);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-5 bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-purple-200">
              Plano Educacional Individualizado (RF13)
            </span>
            <h2 className="text-xl font-bold">Gestão e Vinculação de PEI: {student.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-light leading-none p-1"
          >
            &times;
          </button>
        </div>

        <div className="p-4 bg-purple-50 border-b border-purple-100 text-xs text-purple-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
          <span>
            <strong>Regra Obrigatória do Motor de IA (RF13):</strong> Toda atividade gerada é compulsoriamente vinculada a uma das metas registradas abaixo, exibindo a meta no cabeçalho e na explicabilidade (RF07).
          </span>
        </div>

        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Status do PEI e Período */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span>PEI Ativo no Sistema Escolar</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-semibold">Período Letivo:</span>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
              />
            </div>
          </div>

          {/* Metas Pedagógicas do PEI */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              1. Metas e Objetivos do PEI Vinculados à IA
            </span>

            <div className="space-y-2">
              {goals.map((g, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-center justify-between gap-2"
                >
                  <span>{g}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remover meta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                placeholder="Adicionar nova meta pedagógica ao PEI..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>
          </div>

          {/* Adaptações Curriculares Estipuladas */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              2. Adaptações Curriculares Estipuladas
            </span>

            <div className="space-y-2">
              {adaptations.map((a, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-center justify-between gap-2"
                >
                  <span>{a}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAdaptation(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remover adaptação"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newAdaptation}
                onChange={(e) => setNewAdaptation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAdaptation()}
                placeholder="Adicionar adaptação (ex: prancheta inclinada, tempo estendido)..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddAdaptation}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              Salvar Plano Individualizado (PEI)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
