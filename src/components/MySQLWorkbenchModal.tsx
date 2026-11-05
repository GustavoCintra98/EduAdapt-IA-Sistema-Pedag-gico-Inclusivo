import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  Download, 
  Check, 
  Copy, 
  ShieldCheck, 
  Layers, 
  Server, 
  RefreshCw, 
  ExternalLink,
  Table,
  Eye,
  Key,
  Lock,
  FileCode2,
  AlertCircle
} from 'lucide-react';

interface MySQLWorkbenchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DbStatus {
  connected: boolean;
  driver: string;
  host: string;
  port: number;
  database: string;
  user: string;
  sslEnabled: boolean;
  connectionLimit: number;
  message: string;
  lastChecked: string;
}

export const MySQLWorkbenchModal: React.FC<MySQLWorkbenchModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'eer' | 'security' | 'sql'>('eer');
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [sqlContent, setSqlContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedUserSql, setCopiedUserSql] = useState(false);

  // Carregar status do banco
  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/db/status');
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // Testar conexão ativa
  const handleTestConnection = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/db/test', { method: 'POST' });
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // Carregar conteúdo do SQL
  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      fetch('/api/db/download-sql')
        .then((res) => res.text())
        .then((text) => setSqlContent(text))
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySql = () => {
    if (sqlContent) {
      navigator.clipboard.writeText(sqlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyUserScript = () => {
    const script = `-- Criar usuário restrito com princípio de menor privilégio
CREATE USER IF NOT EXISTS 'eduadapt_user'@'%' IDENTIFIED BY 'SuaSenhaForte2026!#';
GRANT SELECT, INSERT, UPDATE, DELETE ON eduadapt_db.* TO 'eduadapt_user'@'%';
FLUSH PRIVILEGES;`;
    navigator.clipboard.writeText(script);
    setCopiedUserSql(true);
    setTimeout(() => setCopiedUserSql(false), 2500);
  };

  const handleDownload = () => {
    window.location.href = '/api/db/download-sql';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mysql-workbench-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="mysql-workbench-modal-title" className="text-lg font-bold tracking-tight">
                  Banco de Dados MySQL Workbench
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MySQL 8.0+ / InnoDB
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Estrutura relacional normalizada com integridade referencial, índices, chaves e conexão segura via SSL.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Fechar"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card de Status da Conexão */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-600'}`} />
              <span className="font-semibold text-slate-800">
                {dbStatus?.connected ? 'Conexão MySQL Ativa' : 'Banco de Dados Estruturado (Pronto para Workbench)'}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-500 border-l border-slate-200 pl-3">
              <span>Driver: <strong className="text-slate-700">mysql2 (Pool)</strong></span>
              <span>•</span>
              <span>Schema: <strong className="text-slate-700">eduadapt_db</strong></span>
              <span>•</span>
              <span>Charset: <strong className="text-slate-700">utf8mb4</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={isLoadingStatus}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 font-medium shadow-sm disabled:opacity-50"
              title="Testar conexão com o servidor MySQL configurado"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
              <span>Testar Conexão</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 font-bold shadow-sm"
              title="Baixar arquivo .sql para importar no MySQL Workbench"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .SQL</span>
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2">
          <button
            onClick={() => setActiveTab('eer')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'eer'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Diagrama EER & Tabelas</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Segurança & Conexão Segura</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Script SQL Completo</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: DIAGRAMA EER & TABELAS */}
          {activeTab === 'eer' && (
            <div className="space-y-6">
              {/* Como gerar o diagrama no Workbench */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  Como visualizar o Diagrama EER no MySQL Workbench
                </h3>
                <ol className="text-xs text-blue-950 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Clique no botão <strong>"Baixar .SQL"</strong> acima para obter o script estruturado.</li>
                  <li>Abra o <strong>MySQL Workbench</strong> e conecte-se à sua instância local ou remota do MySQL.</li>
                  <li>No menu superior, vá em <strong>File → Open SQL Script...</strong> e selecione o arquivo <code>eduadapt_mysql_workbench.sql</code>.</li>
                  <li>Clique no ícone de raio (<span className="font-mono font-bold">⚡ Execute</span>) para criar o banco <code>eduadapt_db</code>, tabelas, chaves e dados iniciais.</li>
                  <li>Para gerar o diagrama visual: vá em <strong>Database → Reverse Engineer... (Ctrl+R)</strong>, selecione <code>eduadapt_db</code> e conclua o assistente. O Workbench criará automaticamente o <strong>EER Diagram</strong> com todos os relacionamentos mapeados!</li>
                </ol>
              </div>

              {/* Visão Geral das Tabelas e Relações */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-slate-400" />
                  Tabelas Relacionais do Modelo de Dados
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Tabela 1: students */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-700">students</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-semibold text-slate-600">Entidade Central</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Passaporte pedagógico, idade, turno, nível de intervenção DUA (Apoio Intensivo, Moderado ou Independente) e trava de feedback.
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-2">
                      <span className="font-mono">PK: id</span>
                      <span>•</span>
                      <span className="font-mono">FK: class_id → classes(id)</span>
                      <span>•</span>
                      <span className="font-mono">UK: cpf</span>
                    </div>
                  </div>

                  {/* Tabela 2: activities */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-700">activities</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-semibold text-slate-600">Intervenções DUA</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Atividades adaptativas parametrizadas com 3 níveis de apoio, alinhamento BNCC, objetivo e explicabilidade pedagógica (RF07).
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-2">
                      <span className="font-mono">PK: id</span>
                      <span>•</span>
                      <span className="font-mono">FK: student_id → students(id)</span>
                      <span>•</span>
                      <span className="font-mono">Enum: pedagogical_axis</span>
                    </div>
                  </div>

                  {/* Tabela 3: activity_feedbacks */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-700">activity_feedbacks</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-semibold">Avaliação Contínua</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Métricas qualitativas (engajamento, barreiras) e quantitativas (aproveitamento %, tempo de foco) para recalibragem e desbloqueio.
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-2">
                      <span className="font-mono">PK: id</span>
                      <span>•</span>
                      <span className="font-mono">FK: activity_id → activities(id)</span>
                      <span>•</span>
                      <span className="font-mono">FK: student_id</span>
                    </div>
                  </div>

                  {/* Tabela 4: pei_plans */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-700">pei_plans</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-semibold text-slate-600">Plano Individual</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Plano Educacional Individualizado (PEI - RF13) com metas formais, vigência letiva e adaptações curriculares recomendadas.
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-2">
                      <span className="font-mono">PK: id</span>
                      <span>•</span>
                      <span className="font-mono">FK: student_id (1:1 com students)</span>
                    </div>
                  </div>

                  {/* Tabela 5: student_axes_scores */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-700">student_axes_scores</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-semibold text-slate-600">Métricas DUA</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pontuações decimais (0 a 100) em Cognição, Linguagem, Matemática, Motricidade, Funções Executivas e Aspectos Socioemocionais.
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-2">
                      <span className="font-mono">PK: student_id → students(id)</span>
                    </div>
                  </div>

                  {/* Tabela 6: users & user_student_links */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-white shadow-xs hover:border-blue-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-700">users & links</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-semibold text-slate-600">RBAC & Famílias</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Autenticação com papéis (coordenador, professor, pais, aluno), flag de 1º acesso e tabela associativa N:N com estudantes (RF14).
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap gap-2">
                      <span className="font-mono">PK: id</span>
                      <span>•</span>
                      <span className="font-mono">user_student_links (user_id, student_id)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Views no Workbench */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-500" />
                  Views Criadas para Consultas Rápidas no Workbench
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <code className="text-blue-700 font-bold block mb-1">vw_students_overview</code>
                    <p className="text-slate-600">
                      Combina aluno, turma, scores dos eixos, status do PEI e indicador de trava de atividade pendente.
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <code className="text-blue-700 font-bold block mb-1">vw_activities_feedback_stats</code>
                    <p className="text-slate-600">
                      Cruza atividades, notas de aproveitamento, tempo de foco e profissional avaliador para relatórios.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEGURANÇA & CONEXÃO SEGURA */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Pilares de Segurança Implementados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-emerald-950 mb-1">Prepared Statements</h4>
                  <p className="text-xs text-emerald-800">
                    100% das consultas utilizam <code>pool.execute()</code> com parâmetros tipados. Imunidade total a SQL Injection.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-blue-950 mb-1">Criptografia SSL/TLS</h4>
                  <p className="text-xs text-blue-800">
                    Suporte nativo a SSL para tráfego seguro entre o app e bancos remotos (AWS RDS, GCP Cloud SQL ou servidores dedicados).
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-2">
                    <Key className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-purple-950 mb-1">Menor Privilégio</h4>
                  <p className="text-xs text-purple-800">
                    Usuário da aplicação limitado a <code>SELECT, INSERT, UPDATE, DELETE</code>, impedindo comandos destrutivos.
                  </p>
                </div>
              </div>

              {/* Variáveis de Ambiente no .env */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  Configuração Segura via Variáveis de Ambiente (.env)
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Nenhuma credencial fica gravada no código fonte. Para conectar sua instância ao MySQL Workbench ou banco externo, adicione as chaves no seu arquivo <code>.env</code>:
                </p>
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
{`DB_HOST=localhost
DB_PORT=3306
DB_NAME=eduadapt_db
DB_USER=eduadapt_user
DB_PASSWORD=SuaSenhaForte2026!#
DB_SSL=false              # Ative 'true' para conexões remotas via internet
DB_CONNECTION_LIMIT=10    # Protege contra exaustão de conexões`}
                </pre>
              </div>

              {/* Script de Criação do Usuário Seguro */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-600" />
                    Script de Criação de Usuário Seguro no MySQL
                  </h4>
                  <button
                    onClick={handleCopyUserScript}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    {copiedUserSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUserSql ? 'Copiado!' : 'Copiar Script'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-200 p-3 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
{`-- Execute este bloco no MySQL Workbench como root para criar o usuário do sistema
CREATE USER IF NOT EXISTS 'eduadapt_user'@'%' IDENTIFIED BY 'SuaSenhaForte2026!#';
GRANT SELECT, INSERT, UPDATE, DELETE ON eduadapt_db.* TO 'eduadapt_user'@'%';
FLUSH PRIVILEGES;`}
                </pre>
              </div>

              {/* Informação sobre LGPD */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Conformidade LGPD & Restrição Ética (RNF03 e RNF08):</strong>
                  Dados sensíveis de identificação de alunos menores (nome e CPF) são anonimizados pelo backend antes de qualquer processamento por modelos de IA. Apenas a chave interna do aluno é mantida para integridade relacional.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VISUALIZADOR DO CÓDIGO SQL */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Arquivo: <code>/database/eduadapt_mysql_workbench.sql</code>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Script pronto para execução imediata no MySQL Workbench (DDL + Tabelas + Índices + Views + Seed inicial).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copiado para Área de Transferência!' : 'Copiar Todo o SQL'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Arquivo</span>
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="bg-slate-900 px-4 py-2 text-xs font-mono text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>MySQL 8.0 DDL & DML</span>
                  <span>UTF-8 Unicode</span>
                </div>
                <pre className="p-4 text-xs font-mono text-blue-200 overflow-x-auto max-h-[50vh] leading-relaxed">
                  {sqlContent || '-- Carregando script SQL...'}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer do Modal */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Compatível com: <strong>MySQL Workbench 8.0+</strong>, <strong>DBeaver</strong>, <strong>phpMyAdmin</strong> e <strong>Datagrip</strong>.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Concluído
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
