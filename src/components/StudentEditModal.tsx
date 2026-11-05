import React, { useState } from 'react';
import { Student, LearningLevel } from '../types';
import { Save, AlertCircle, CheckCircle2, Award, BookOpen, Brain, Activity } from 'lucide-react';

interface StudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  onUpdateStudent: (updatedStudent: Student) => void;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({
  isOpen,
  onClose,
  student,
  onUpdateStudent,
}) => {
  const [name, setName] = useState(student.name);
  const [age, setAge] = useState(student.age);
  const [className, setClassName] = useState(student.className);
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(student.learningLevel);

  const [skillsText, setSkillsText] = useState(student.skills.join(', '));
  const [difficultiesText, setDifficultiesText] = useState(student.difficulties.join(', '));
  const [interestsText, setInterestsText] = useState(student.interests.join(', '));
  const [goalsText, setGoalsText] = useState(student.pedagogicalGoals.join(', '));
  const [validatedStrategiesText, setValidatedStrategiesText] = useState(student.validatedStrategies.join(', '));
  const [failedStrategiesText, setFailedStrategiesText] = useState(student.failedStrategies.join(', '));

  // Registro qualitativo e quantitativo do desempenho (RF06)
  const [qualitativeNote, setQualitativeNote] = useState('');
  const [quantitativeScore, setQuantitativeScore] = useState<number>(80);
  const [quantitativeAxis, setQuantitativeAxis] = useState<'cognicao' | 'linguagem' | 'matematica' | 'motricidade' | 'funcoesExecutivas'>('cognicao');

  // Modal de confirmação (RF06: "Deseja salvar as alterações realizadas?")
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!isOpen) return null;

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    const updated: Student = {
      ...student,
      name,
      age: Number(age),
      className,
      learningLevel,
      skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      difficulties: difficultiesText.split(',').map((s) => s.trim()).filter(Boolean),
      interests: interestsText.split(',').map((s) => s.trim()).filter(Boolean),
      pedagogicalGoals: goalsText.split(',').map((s) => s.trim()).filter(Boolean),
      validatedStrategies: validatedStrategiesText.split(',').map((s) => s.trim()).filter(Boolean),
      failedStrategies: failedStrategiesText.split(',').map((s) => s.trim()).filter(Boolean),
      axesScores: {
        ...student.axesScores,
        [quantitativeAxis]: Math.min(100, Math.max(0, quantitativeScore)),
      },
      recentHistory: [
        {
          id: `hist-${Date.now()}`,
          date: new Date().toLocaleDateString('pt-BR'),
          action: qualitativeNote
            ? `Edição de dados + registro de desempenho: "${qualitativeNote.slice(0, 40)}..."`
            : 'Edição de informações do Passaporte Pedagógico',
          author: 'Professor/Coordenação',
        },
        ...student.recentHistory,
      ],
    };

    onUpdateStudent(updated);
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
          <div className="px-6 py-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
                Atualização de Registro (RF06)
              </span>
              <h2 className="text-xl font-bold">Tela de Edição de Informações: {student.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-light leading-none p-1"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleOpenConfirm} className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* Dados Pessoais e Turma */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Idade *</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Turma / Série</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nível de Aprendizagem</label>
                <select
                  value={learningLevel}
                  onChange={(e) => setLearningLevel(e.target.value as LearningLevel)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
                >
                  <option value="Apoio Intensivo">Apoio Intensivo</option>
                  <option value="Apoio Moderado">Apoio Moderado</option>
                  <option value="Independente">Independente</option>
                </select>
              </div>
            </div>

            {/* Habilidades e Dificuldades */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Habilidades já Desenvolvidas
                </label>
                <textarea
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Dificuldades Observadas
                </label>
                <textarea
                  value={difficultiesText}
                  onChange={(e) => setDifficultiesText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Interesses e Objetivos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Interesses Particulares
                </label>
                <textarea
                  value={interestsText}
                  onChange={(e) => setInterestsText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5 text-purple-600" />
                  Objetivos Pedagógicos
                </label>
                <textarea
                  value={goalsText}
                  onChange={(e) => setGoalsText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Estratégias que já funcionaram vs não funcionaram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">
                  Estratégias que Já Funcionaram
                </label>
                <textarea
                  value={validatedStrategiesText}
                  onChange={(e) => setValidatedStrategiesText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">
                  Estratégias que NÃO Funcionaram
                </label>
                <textarea
                  value={failedStrategiesText}
                  onChange={(e) => setFailedStrategiesText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Requisito RF06: Registro qualitativo e quantitativo do desempenho após atividade */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                <Activity className="w-4 h-4 text-blue-600" />
                Registro de Desempenho Após Execução da Atividade (RF06)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Registro Qualitativo (Engajamento, autonomia e barreiras observadas)
                  </label>
                  <input
                    type="text"
                    value={qualitativeNote}
                    onChange={(e) => setQualitativeNote(e.target.value)}
                    placeholder="Ex: Demonstrou alta autonomia ao manipular as fichas e concluiu em 15 min."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Eixo de Atualização
                  </label>
                  <select
                    value={quantitativeAxis}
                    onChange={(e) => setQuantitativeAxis(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                  >
                    <option value="cognicao">Cognição</option>
                    <option value="linguagem">Linguagem</option>
                    <option value="matematica">Matemática</option>
                    <option value="motricidade">Motricidade</option>
                    <option value="funcoesExecutivas">Funções Executivas</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Registro Quantitativo (Aproveitamento / Acerto):</span>
                    <span className="text-blue-700 font-bold">{quantitativeScore}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={quantitativeScore}
                    onChange={(e) => setQuantitativeScore(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Botão Salvar (RF06) */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações (RF06)
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Confirmação Obrigatório do RF06:
          "advindo da mensagem 'Deseja salvar as alterações realizadas?', após clicar." */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Deseja salvar as alterações realizadas?
            </h3>
            <p className="text-xs text-slate-600">
              As informações serão atualizadas no Passaporte Pedagógico e no histórico de evolução contínua do estudante.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Não, revisar
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Sim, confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
