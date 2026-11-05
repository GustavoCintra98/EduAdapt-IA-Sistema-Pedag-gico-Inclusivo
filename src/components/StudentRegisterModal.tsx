import React, { useState } from 'react';
import { Student, ClassGroup, LearningLevel } from '../types';
import { UserPlus, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassGroup[];
  onSaveStudent: (newStudent: Student) => void;
}

export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  isOpen,
  onClose,
  classes,
  onSaveStudent,
}) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [age, setAge] = useState(8);
  const [className, setClassName] = useState(classes[0]?.name || '3º Ano A - Fundamental I');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>('Apoio Moderado');

  const [skillsText, setSkillsText] = useState('Boa memória visual, facilidade com desenhos');
  const [difficultiesText, setDifficultiesText] = useState('Dificuldade de foco em leituras extensas');
  const [interestsText, setInterestsText] = useState('Dinossauros, robótica, esportes');
  const [goalsText, setGoalsText] = useState('Consolidar operações básicas e rotina com checklist');
  const [validatedStrategiesText, setValidatedStrategiesText] = useState('Cartões visuais e mediação concreta');
  const [failedStrategiesText, setFailedStrategiesText] = useState('Instruções puramente orais longas');

  const [hasPei, setHasPei] = useState(true);
  const [peiGoal, setPeiGoal] = useState('Adaptação curricular em matemática e apoio visual contínuo');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      cpf: cpf.trim() || '000.000.000-00',
      age: Number(age) || 8,
      className,
      skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      difficulties: difficultiesText.split(',').map((s) => s.trim()).filter(Boolean),
      interests: interestsText.split(',').map((s) => s.trim()).filter(Boolean),
      learningLevel,
      pedagogicalGoals: goalsText.split(',').map((s) => s.trim()).filter(Boolean),
      validatedStrategies: validatedStrategiesText.split(',').map((s) => s.trim()).filter(Boolean),
      failedStrategies: failedStrategiesText.split(',').map((s) => s.trim()).filter(Boolean),
      axesScores: {
        cognicao: 75,
        linguagem: 70,
        matematica: 70,
        motricidade: 80,
        funcoesExecutivas: 65,
        aspectosSocioemocionais: 75,
      },
      pei: {
        active: hasPei,
        term: 'Ciclo 2026',
        lastUpdated: new Date().toLocaleDateString('pt-BR'),
        goals: hasPei ? [peiGoal] : [],
        curricularAdaptations: hasPei ? ['Fontes ampliadas', 'Pistas visuais estruturadas'] : [],
      },
      recentHistory: [
        {
          id: `hist-${Date.now()}`,
          date: new Date().toLocaleDateString('pt-BR'),
          action: 'Cadastro inicial efetuado no sistema',
          author: 'Coordenação/Docente',
        },
      ],
      pendingFeedbackActivityId: null,
    };

    onSaveStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
              Mapeamento de Entrada (RF05)
            </span>
            <h2 className="text-xl font-bold">Cadastro de Aluno no Passaporte Pedagógico</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-2xl font-light leading-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Ciclo de Aprendizagem do Agente IA (RF05) */}
        <div className="p-4 bg-blue-50/70 border-b border-blue-100 text-xs text-blue-900">
          <span className="font-bold block mb-1">Ciclo de Aprendizagem com Agente IA Integrado:</span>
          <div className="flex flex-wrap items-center gap-1.5 font-medium">
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Aluno</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Observação</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-bold">IA DUA</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Estratégia</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Atividade</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Resultado</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
            <span className="bg-white px-2 py-0.5 rounded border border-blue-200">Análise</span>
            <ArrowRight className="w-3 h-3 text-blue-500" />
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Próxima Atividade</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Aluno *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mateus Henrique Ramos"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Idade *</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min={3}
                max={18}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Turma / Série *</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nível de Aprendizagem Inicial *</label>
              <select
                value={learningLevel}
                onChange={(e) => setLearningLevel(e.target.value as LearningLevel)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900"
              >
                <option value="Apoio Intensivo">Apoio Intensivo (Mediação total 1:1)</option>
                <option value="Apoio Moderado">Apoio Moderado (Pistas e autonomia parcial)</option>
                <option value="Independente">Independente (Desafio e autoavaliação)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Habilidades Já Desenvolvidas (separadas por vírgula)
            </label>
            <textarea
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dificuldades Observadas (separadas por vírgula)
            </label>
            <textarea
              value={difficultiesText}
              onChange={(e) => setDifficultiesText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Interesses Particulares (Hiperfoco / Motivação)
              </label>
              <input
                type="text"
                value={interestsText}
                onChange={(e) => setInterestsText(e.target.value)}
                placeholder="Ex: Espaço, robôs, música, futebol"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Objetivos Pedagógicos Imediatos
              </label>
              <input
                type="text"
                value={goalsText}
                onChange={(e) => setGoalsText(e.target.value)}
                placeholder="Ex: Alfabetização funcional, cálculo aditivo"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>

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

          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-purple-900 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPei}
                  onChange={(e) => setHasPei(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                Ativar Plano Educacional Individualizado (PEI - RF13)
              </label>
            </div>
            {hasPei && (
              <div>
                <label className="block text-[11px] font-semibold text-purple-800 mb-1">
                  Meta Principal do PEI vinculada ao motor de IA:
                </label>
                <input
                  type="text"
                  value={peiGoal}
                  onChange={(e) => setPeiGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-purple-300 rounded-xl text-xs text-slate-900"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
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
              <UserPlus className="w-4 h-4" />
              Salvar Cadastro no Passaporte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
