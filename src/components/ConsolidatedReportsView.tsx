import React, { useState } from 'react';
import { Student, User } from '../types';
import { 
  FileText, 
  Download, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  GraduationCap, 
  Loader2, 
  Award,
  Layers,
  Send,
  AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ConsolidatedReportsViewProps {
  students: Student[];
  selectedStudent: Student;
  currentUser: User | null;
  onSelectStudent: (student: Student) => void;
}

export const ConsolidatedReportsView: React.FC<ConsolidatedReportsViewProps> = ({
  students,
  selectedStudent,
  currentUser,
  onSelectStudent,
}) => {
  const current = selectedStudent;
  const isParent = currentUser?.role === 'pais';

  // RF08: Destinatário do Relatório ('educators' vs 'families')
  const [recipientType, setRecipientType] = useState<'educators' | 'families'>(
    isParent ? 'families' : 'educators'
  );
  const [period, setPeriod] = useState('2º Bimestre - 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);

  const [emailStatus, setEmailStatus] = useState<string>('');

  const fetchReport = async (recip: 'educators' | 'families') => {
    setIsGenerating(true);
    setEmailStatus('');
    try {
      const response = await fetch('/api/gemini/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: current,
          recipientType: recip,
          period,
        }),
      });
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    fetchReport(recipientType);
  }, [current.id, recipientType, period]);

  // Exportação em PDF utilizando jsPDF (RF08)
  const handleExportPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const isFamily = recipientType === 'families';

    // Header do PDF
    doc.setFillColor(30, 64, 175); // Blue
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('EduAdapt IA - Sistema Pedagógico Inclusivo', 15, 14);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Relatorio Consolidado de Desempenho (${reportData?.recipient || 'Geral'})`, 15, 22);

    // Dados do Aluno
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Aluno: ${current.name}`, 15, 42);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Turma: ${current.className} | Idade: ${current.age} anos | Periodo: ${period}`, 15, 49);
    doc.text(`Nivel de Aprendizagem: ${current.learningLevel} | PEI: ${current.pei.active ? 'Ativo' : 'Nao requerido'}`, 15, 55);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 60, 195, 60);

    // Resumo Executivo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. Sintese de Desempenho e Engajamento', 15, 68);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const summaryLines = doc.splitTextToSize(
      reportData?.executiveSummary || 'Estudante em evolucao continua atraves de adaptacoes DUA.',
      180
    );
    doc.text(summaryLines, 15, 75);

    let yOffset = 75 + summaryLines.length * 5 + 8;

    // Avaliação nos 5 Eixos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. Evolucao nos Cinco Eixos de Desenvolvimento', 15, yOffset);
    yOffset += 7;

    const evaluations = reportData?.axisEvaluations || [
      { axis: 'Cognicao', scorePercent: current.axesScores.cognicao, status: 'Positivo' },
      { axis: 'Linguagem', scorePercent: current.axesScores.linguagem, status: 'Em desenvolvimento' },
      { axis: 'Matematica', scorePercent: current.axesScores.matematica, status: 'Consolidado com apoio' },
      { axis: 'Motricidade', scorePercent: current.axesScores.motricidade, status: 'Autonomo' },
      { axis: 'Funcoes Executivas', scorePercent: current.axesScores.funcoesExecutivas, status: 'Com rotina visual' },
    ];

    evaluations.forEach((item: any) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`${item.axis}: ${item.scorePercent || 80}% - ${item.status || 'Ativo'}`, 15, yOffset);
      doc.setFont('helvetica', 'normal');
      const obsLines = doc.splitTextToSize(item.observation || '', 175);
      doc.text(obsLines, 20, yOffset + 4);
      yOffset += 6 + obsLines.length * 4;
    });

    yOffset += 4;
    // Destaques e Próximos Passos
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('3. Destaques e Proximas Intervencoes', 15, yOffset);
    yOffset += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    (reportData?.highlights || []).forEach((hl: string) => {
      doc.text(`- ${hl}`, 15, yOffset);
      yOffset += 5;
    });

    // Rodapé de Conformidade
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Documento gerado eletronicamente em conformidade com a LGPD e Diretrizes DUA. Registro pedagogico oficial.',
      15,
      285
    );

    const safeName = current.name.toLowerCase().replace(/\s+/g, '_');
    doc.save(`relatorio_${safeName}_${recipientType}.pdf`);
  };

  // Simulação de envio direto via e-mail para usuários vinculados (RF08)
  const handleSendEmail = () => {
    const targetEmail = isParent ? currentUser?.email : 'pais@familia.com, coordenacao@escola.edu.br';
    setEmailStatus(`Relatório enviado com sucesso via e-mail para: ${targetEmail}`);
    setTimeout(() => {
      setEmailStatus('');
    }, 4500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Cabeçalho de Controle de Relatórios */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Módulo Funcional RF08 · Geração de Relatórios Consolidados</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Relatórios Formatações Adaptadas
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            {recipientType === 'families'
              ? 'Linguagem acessível, afetuosa e representações visuais simplificadas do progresso para os pais e responsáveis (RF14).'
              : 'Métricas detalhadas de aproveitamento, padrões comportamentais identificados pela IA e correlação curricular para docentes e coordenação.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isParent && (
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Estudante</span>
              <select
                value={current.id}
                onChange={(e) => {
                  const found = students.find((s) => s.id === e.target.value);
                  if (found) onSelectStudent(found);
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Período</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
            >
              <option value="1º Bimestre - 2026">1º Bimestre - 2026</option>
              <option value="2º Bimestre - 2026">2º Bimestre - 2026</option>
              <option value="Ciclo Semanal Atual">Ciclo Semanal Atual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seleção do Destinatário (Docente/Coordenação vs Família) */}
      {!isParent && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Formatação do Documento para:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => {
                  setRecipientType('educators');
                  fetchReport('educators');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  recipientType === 'educators'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Docentes e Coordenação (Técnico)
              </button>

              <button
                onClick={() => {
                  setRecipientType('families');
                  fetchReport('families');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  recipientType === 'families'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Família e Responsáveis (Acessível)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar em PDF (RF08)
            </button>

            <button
              onClick={handleSendEmail}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar via E-mail (RF08)
            </button>
          </div>
        </div>
      )}

      {/* Notificação de Envio por E-mail */}
      {emailStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{emailStatus}</span>
        </div>
      )}

      {/* Corpo do Relatório Renderizado na Tela */}
      {isGenerating ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-600 space-y-3">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs font-bold">Consolidando métricas e estruturando relatório adaptado...</p>
        </div>
      ) : reportData ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8 print:border-none print:shadow-none">
          {/* Cabeçalho Institucional do Relatório */}
          <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 block mb-1">
                {reportData.recipient} · {period}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {reportData.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Estudante: <strong>{current.name}</strong></span>
                <span>·</span>
                <span>Turma: {current.className}</span>
                <span>·</span>
                <span>Nível: {current.learningLevel}</span>
              </div>
            </div>

            {isParent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPdf}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Relatório em PDF
                </button>
              </div>
            )}
          </div>

          {/* Resumo Executivo / Mensagem Acolhedora */}
          <div className={`p-5 rounded-2xl border ${
            recipientType === 'families'
              ? 'bg-purple-50/60 border-purple-200 text-purple-950'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2">
              {recipientType === 'families' ? 'Querida Família' : 'Síntese Executiva Pedagógica'}
            </h3>
            <p className="text-xs leading-relaxed font-medium">
              {reportData.executiveSummary}
            </p>
          </div>

          {/* Representações Visuais do Progresso nos 5 Eixos */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {recipientType === 'families'
                ? 'Conquistas nos Eixos de Desenvolvimento'
                : 'Métricas Detalhadas de Aproveitamento e Intervenções (RF08)'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(reportData.axisEvaluations || []).map((axis: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{axis.axis}</span>
                    <span className="font-bold text-blue-700">{axis.scorePercent}% · {axis.status}</span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${axis.scorePercent}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {axis.observation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Destaques e Próximos Passos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
              <span className="text-xs font-bold text-emerald-900 block mb-2 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Destaques e Avanços Conquistados
              </span>
              <ul className="text-xs text-emerald-950 space-y-1.5">
                {(reportData.highlights || []).map((h: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">★</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200">
              <span className="text-xs font-bold text-blue-900 block mb-2 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Próximos Passos e Recomendações
              </span>
              <ul className="text-xs text-blue-950 space-y-1.5">
                {(reportData.nextSteps || []).map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">→</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
