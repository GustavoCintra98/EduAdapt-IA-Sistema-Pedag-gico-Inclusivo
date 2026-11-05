import React, { useState } from 'react';
import { Student } from '../types';
import { 
  Layers, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  Award,
  BarChart3,
  Calendar,
  FileText
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
  const current = selectedStudent;
  const axes = current.axesScores;

  // Lista dos 5 eixos principais conforme RF09:
  // "cinco eixos principais de desenvolvimento: Cognição, Linguagem, Matemática, Motricidade e Funções Executivas."
  const developmentalAxesList = [
    {
      key: 'cognicao',
      name: 'Cognição',
      score: axes.cognicao,
      description: 'Capacidade de raciocínio lógico, atenção seletiva, categorização e resolução de problemas.',
      evolution: '+14% no último bimestre',
      status: 'Progresso Expressivo',
      recommendation: 'Estimular hipóteses dedutivas em pequenos grupos.',
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
      recommendation: 'Garantir liberdade de exploração motora em sala.',
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
      {/* Cabeçalho do Acompanhamento Contínuo (RF09) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Módulo Funcional RF09 · Acompanhamento Contínuo de Avaliação</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Evolução nos Cinco Eixos de Desenvolvimento
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Histórico evolutivo centralizado para monitoramento contínuo, detecção precoce de barreiras e direcionamento de intervenções pedagógicas individualizadas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Estudante em Foco</span>
            <select
              value={current.id}
              onChange={(e) => {
                const found = students.find((s) => s.id === e.target.value);
                if (found) onSelectStudent(found);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.className})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center min-w-[90px]">
            <span className="text-[10px] text-blue-700 font-bold block">Índice Médio</span>
            <span className="text-2xl font-extrabold text-blue-900 tabular-nums">{averageScore}%</span>
          </div>
        </div>
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
              Prioridade Pedagógica da Semana
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              O eixo de <strong>Funções Executivas ({axes.funcoesExecutivas}%)</strong> e <strong>Matemática ({axes.matematica}%)</strong> demonstram maior sensibilidade ao apoio de recursos visuais e táteis no ciclo atual.
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
          Linha do Tempo das Últimas Interações Avaliativas
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
