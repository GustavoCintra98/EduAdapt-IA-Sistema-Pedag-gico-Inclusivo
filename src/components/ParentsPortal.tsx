import React from 'react';
import { Student, User } from '../types';
import { 
  Users, 
  FileText, 
  Download, 
  Award, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface ParentsPortalProps {
  currentUser: User;
  students: Student[];
  onOpenReport: (student: Student) => void;
}

export const ParentsPortal: React.FC<ParentsPortalProps> = ({
  currentUser,
  students,
  onOpenReport,
}) => {
  // RF14: Vinculado EXCLUSIVAMENTE ao(s) aluno(s) sob sua responsabilidade
  const linkedIds = currentUser.linkedStudentIds || ['student-1'];
  const myChildren = students.filter((s) => linkedIds.includes(s.id));
  const child = myChildren[0] || students[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Banner de Boas-Vindas à Família */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-200 uppercase tracking-wider mb-2">
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          <span>Painel da Família (RF14) · Visão Acessível & Acolhedora</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Olá, {currentUser.name}!
        </h1>
        <p className="text-xs text-purple-100 mt-2 max-w-xl leading-relaxed">
          Este é o espaço exclusivo para você acompanhar o desenvolvimento pedagógico e as conquistas do seu filho(a) na escola. Todas as informações são traduzidas em linguagem clara e visual.
        </p>
      </div>

      {/* Cartão do Aluno sob Responsabilidade */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
              Estudante Vinculado
            </span>
            <h2 className="text-xl font-bold text-slate-900">{child.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {child.className} · {child.age} anos · Professores: Equipe Multidisciplinar
            </p>
          </div>

          <button
            onClick={() => onOpenReport(child)}
            className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm shrink-0"
          >
            <FileText className="w-4 h-4" />
            Visualizar Boletim de Conquistas (RF08)
          </button>
        </div>

        {/* ========================================================
            RF14: REPRESENTAÇÕES VISUAIS SIMPLIFICADAS DA EVOLUÇÃO
           ======================================================== */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            Como seu filho(a) está evoluindo nos eixos de desenvolvimento:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Raciocínio & Criatividade (Cognição)</span>
                <span className="text-emerald-700">{child.axesScores.cognicao}% · Muito Positivo</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${child.axesScores.cognicao}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600">
                Demonstra muita curiosidade e excelente memória visual ao manusear ilustrações.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Comunicação & Linguagem</span>
                <span className="text-blue-700">{child.axesScores.linguagem}% · Em Crescimento</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${child.axesScores.linguagem}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600">
                Participa alegremente das conversas e se apoia em livros ilustrados.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Matemática com Jogos e Materiais</span>
                <span className="text-amber-700">{child.axesScores.matematica}% · Com Recursos</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${child.axesScores.matematica}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600">
                Adora agrupar pecinhas e blocos para aprender continhas de forma divertida.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Movimento & Brincadeiras (Motricidade)</span>
                <span className="text-purple-700">{child.axesScores.motricidade}% · Excelente</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{ width: `${child.axesScores.motricidade}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600">
                Plena autonomia física, energia positiva e disposição nas atividades ao ar livre.
              </p>
            </div>
          </div>
        </div>

        {/* Dicas para Estimular em Casa */}
        <div className="p-5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
          <span className="text-xs font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Dicas Práticas para Apoiar em Casa (Alinhadas à Escola)
          </span>
          <ul className="text-xs text-purple-950 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <span>
                <strong>Aproveite os interesses:</strong> Converse sobre {child.interests.join(', ')} durante leituras conjuntas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">✓</span>
              <span>
                <strong>Rotina previsível:</strong> Estabeleça pequenas listas ilustradas com as etapas da manhã e da lição de casa.
              </span>
            </li>
          </ul>
        </div>

        {/* Nota de Restrição de Perfil Conforme RF14:
            "Nesse painel, os botões de criação/edição de turmas, alteração de dados pedagógicos e geração de atividades ficarão ocultos." */}
        <div className="pt-2 text-center">
          <span className="text-[11px] text-slate-400">
            Painel restrito em conformidade com a LGPD e perfil familiar (RF14). Funções de gestão restritas ao corpo docente.
          </span>
        </div>
      </div>
    </div>
  );
};
