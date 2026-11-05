# EduAdapt IA — Sistema Pedagógico Inclusivo

> Plataforma educacional inclusiva voltada à personalização do aprendizado, acompanhamento individualizado e geração de intervenções pedagógicas adaptativas orientadas por Inteligência Artificial sob os princípios do **Desenho Universal para a Aprendizagem (DUA)**, alinhada à **BNCC** e em estrita conformidade com a **LGPD**.

---

## 📌 Sumário Executivo

O **EduAdapt IA** foi concebido a partir de um rigoroso documento de requisitos de software (RF01 a RF14 e RNF01 a RNF08), integrando o **Passaporte Pedagógico** do estudante, o **Plano Educacional Individualizado (PEI)**, um motor de análise em linguagem natural e um módulo de **explicabilidade algorítmica**.

O sistema atua com três pilares fundamentais:
1. **Inclusão com Rigor Pedagógico (DUA):** Toda intervenção oferece múltiplos meios de representação, ação e engajamento, sem reduzir a expectativa de aprendizagem da turma.
2. **Restrição Ética e Proteção Legal (LGPD & Bloqueio Clínico):** Anonimização completa de dados de menores antes do envio à IA e filtros éticos rigorosos (*guardrails*) que proíbem terminantemente a emissão de diagnósticos clínicos ou laudos médicos.
3. **Acessibilidade Universal (WCAG):** Interface limpa, com baixo esforço cognitivo, suporte a alto contraste, dimensionamento dinâmico de fontes e menu lateral retrátil (*drawer*).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* **npm** (versão 9 ou superior)

### Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd react-example
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie ou verifique o arquivo `.env` com a sua chave da API do Google Gemini (o sistema possui contingência pedagógica local caso a chave não esteja configurada):
   ```env
   GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
   PORT=3000
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:3000`.

5. **Compilação e Verificação:**
   ```bash
   npm run build
   npm run lint
   ```

---

## 🧭 Guia da Interface e Navegação

A interface foi projetada com alta clareza visual e ergonomia pedagógica:

### 1. Barra Lateral Retrátil (Sidebar com Toggle)
* No canto superior esquerdo, há o botão **"Menu"**.
* **Ao clicar:** a barra lateral se expande suavemente exibindo todos os módulos do sistema organizados por identificador de requisito, ícones e descrições claras.
* **Ao clicar novamente** (no botão Menu, no ícone "X", no fundo escurecido ou em qualquer módulo de destino): a barra se recolhe automaticamente, garantindo área útil máxima de trabalho na tela.

### 2. Barra Superior (Header & Acessibilidade)
* **Marca:** Logotipo e nome da plataforma (*EduAdapt IA*).
* **Identificador Central:** Exibe em tempo real o módulo ativo no qual o educador está trabalhando.
* **Ferramentas WCAG:**
  * **Fonte A- / A+:** Ciclo dinâmico de redimensionamento tipográfico (**100%**, **115%** e **130%**).
  * **Alto Contraste:** Alternador imediato para modo de alto contraste em conformidade com as diretrizes WCAG.
* **Status do Usuário & Logout:** Indica o usuário e o papel ativo na sessão atual.

---

## 📋 Mapeamento Completo de Requisitos Implementados

### 🔐 1. Entrada no Sistema e Gestão de Acessos

#### `RF01` — Tela de Login
* Acesso autenticado via e-mail e senha cadastrados.
* Validação automática de campos vazios ou formatos inválidos com mensagens orientativas.
* Bloqueio com a mensagem padronizada: `"E-mail e/ou senha incorretos!"`.
* Link **"Esqueci minha senha"** direcionando para o procedimento seguro de recuperação (`RF03`).
* Link **"Cadastre-se"** com controle de visibilidade restrito à instituição/coordenação escolar.
* **Atalhos Rápidos de Demonstração:** Botões de teste no rodapé do modal permitindo alternar instantaneamente entre os perfis:
  * *Coordenador(a)*: Acesso irrestrito a cadastros institucionais e turmas.
  * *Professor(a)*: Gestão de sala, observações em linguagem natural, geração DUA e feedbacks.
  * *Pais / Responsáveis*: Acesso restrito e simplificado exclusivo do estudante dependente (`RF14`).
  * *1º Acesso (CPF)*: Demonstração da trava mandatória de redefinição de senha (`RF02`).

#### `RF02` — Tela de Cadastro Institucional & Primeiro Acesso Obrigatório
* Cadastro de usuários executado com exclusividade pela instituição de ensino (Nome completo, CPF, e-mail e perfil: *Professor*, *Pais/Responsáveis*, *Aluno* ou *Coordenador*).
* Verificação estrita de duplicidade de CPF com mensagem de bloqueio: `"Este CPF já está cadastrado!"`.
* **Credencial Provisória:** O CPF serve como login e senha inicial.
* **Trava de Primeiro Acesso:** Ao efetuar o primeiro login com o CPF, o usuário é obrigatoriamente redirecionado para a tela de alteração de senha.
* **Política de Senhas:** Validação técnica exigindo no mínimo 8 caracteres, pelo menos 1 número e pelo menos 1 caractere especial (`!@#$%^&*...`). Se a confirmação for discordante, o sistema bloqueia o avanço.

#### `RF03` — Recuperação de Senha Segura
* Processamento por e-mail informado.
* **Proteção contra Enumeração de Usuários:** A mensagem não revela se o e-mail possui conta cadastrada (*"Caso exista uma conta associada ao endereço informado, foram enviadas instruções..."*).
* Validação por código de segurança temporário e definição de nova senha sob a mesma política de segurança.

---

### 🎓 2. Passaporte Pedagógico e Gestão de Sala

#### `RF04` — Tela Principal (Dashboard & Passaporte Pedagógico)
* **Passaporte Pedagógico:** Núcleo de informações do estudante compilando habilidades já desenvolvidas, dificuldades observadas, interesses particulares, nível de aprendizagem e estratégias validadas.
* **Mecanismo de Filtros:** Filtro por turma e/ou aluno específico com os botões dedicados **"Filtrar"** e **"Buscar"**.
* **Grid em Colunas:** Organização visual estruturada em 5 blocos (*Habilidades*, *Dificuldades*, *Interesses*, *Estratégias OK* e *Objetivos & PEI*).
* **Histórico Recente:** Registro dos alunos pesquisados ou atendidos durante o dia letivo.
* **Permissões de Acesso:** O botão de cadastro (`RF05`) e o botão de edição (`RF06`) são exibidos apenas para professores e coordenadores, ficando ocultos para o perfil familiar.

#### `RF05` — Cadastro de Alunos ou Turmas
* Formulário completo de inclusão: Nome, idade, turma, habilidades, dificuldades, interesses, objetivos pedagógicos e histórico de estratégias.
* **Ciclo de Aprendizagem do Agente IA:**
  $$\text{Aluno} \longrightarrow \text{Observação} \longrightarrow \text{IA} \longrightarrow \text{Estratégia} \longrightarrow \text{Atividade} \longrightarrow \text{Resultado} \longrightarrow \text{Análise} \longrightarrow \text{Próxima Atividade}$$
* Mapeamento nos 6 perfis pedagógicos: *Cognição*, *Linguagem*, *Matemática*, *Motricidade*, *Aspectos socioemocionais* e *Funções executivas*.

#### `RF06` — Tela de Edição de Informações & Registro de Desempenho
* Acessada a partir do botão **"Editar (RF06)"** no Passaporte Pedagógico.
* Edição de dados pessoais, turma e parâmetros pedagógicos.
* Registro de desempenho qualitativo (engajamento, barreiras) e quantitativo (% de aproveitamento).
* **Confirmação Obrigatória:** Ao clicar em Salvar, exibe modal de confirmação: *"Deseja salvar as alterações realizadas?"*.

---

### 🧠 3. Inteligência Artificial Pedagógica, DUA e Explicabilidade

#### `RF10` — Registro de Situação Pedagógica em Linguagem Natural
* Interface dedicada para o professor relatar desafios e comportamentos observados no cotidiano da sala de aula.
* **Entrada Assistida:** Sugestões rápidas de preenchimento, tais como:
  * *"O aluno perde a concentração em textos longos"*
  * *"Apresentou dificuldade em associar quantidades na aula de hoje"*
* Seletor de estudante ou turma completa.
* Botão **"Analisar e Gerar Estratégia"**: Dispara o cruzamento da situação relatada com o histórico do Passaporte Pedagógico e com as metas do PEI, respeitando o tempo de resposta inferior a 8 segundos (`RNF05`).

#### `RF11` & `RNF07` — Geração de Atividades Adaptativas e Banco de Alternativas
* Atividades estruturadas e parametrizadas nos três níveis de suporte do DUA:
  * **Apoio Intensivo:** Mediação direta 1:1, suporte físico, modelo guiado e materiais táteis em alto relevo.
  * **Apoio Moderado:** Pistas intermediárias, roteiros visuais sequenciais e autonomia parcial.
  * **Independente:** Desafio conceitual autônomo e folha de autoavaliação.
* **Banco de Alternativas (`RNF07`):** Botão **"Gerar novas opções"** capaz de gerar e listar até **10 opções distintas de intervenção** para a mesma demanda pedagógica.
* Cada atividade traz instruções de aplicação, recursos visuais, materiais concretos e exemplos práticos.

#### `RF07` — Módulo de Explicabilidade da Inteligência Artificial
Transparência algorítmica estruturada em dois eixos principais:
1. **Justificativa Técnica/Pedagógica:** Texto explicativo gerado pela IA demonstrando *"por que"* aquela atividade é adequada ao momento do estudante (ex: índice de erro anterior, canal sensorial preferencial, ancoragem nos hiperfocos).
2. **Análise Contínua de Padrões Comportamentais:** Tempo médio de foco sustentado, resposta a rotinas visuais e recomendação calculada para o fechamento do ciclo semanal.
* Exibição explícita de: nível de dificuldade, competências da **BNCC** (ex: `EF03MA05`, `EF15LP03`) e estilos de aprendizagem.

#### `RF13` — Gestão e Vinculação ao Plano Educacional Individualizado (PEI)
* Cadastro e manutenção das metas do PEI e adaptações curriculares estipuladas para o semestre letivo.
* **Regra Mandatória de IA:** Toda atividade ou estratégia gerada pelo motor inteligente é compulsoriamente vinculada a pelo menos uma meta ativa do PEI.
* A meta atendida fica permanentemente visível no cabeçalho da atividade e no Módulo de Explicabilidade.

---

### 📊 4. Avaliação Contínua, Trava de Dependência e Relatórios

#### `RF09` — Acompanhamento Contínuo de Avaliação (com Modo de Pesquisa)
* Painel centralizado monitorando os 5 eixos principais de desenvolvimento:
  1. **Cognição**
  2. **Linguagem**
  3. **Matemática**
  4. **Motricidade**
  5. **Funções Executivas**
* **Modo de Pesquisa Avançado (Sem Combobox):**
  * Busca textual dinâmica em tempo real por **nome ou sobrenome** (ex: *Oliveira*, *Santos*, *Mendes*, *Ferreira*), **sala/turma** (ex: *Sala 102*, *3º Ano A*) ou **turno** (*Manhã*, *Tarde*).
  * Filtros rápidos em *chips* para alternar turnos (*Todos*, *Manhã*, *Tarde*) e salas.
  * Lista de cards interativos dos estudantes encontrados com índices médios. Ao clicar no card, o estudante é selecionado instantaneamente, atualizando gráficos e linha do tempo de evolução.

#### `RF12` — Registro de Feedback de Desempenho e Recalibragem Semanal
* Registro qualitativo (engajamento, autonomia e barreiras) e quantitativo (percentual de acerto, tempo de conclusão e conceito).
* **Trava de Dependência de Feedback (Regra de Negócio Crítica):**
  > O sistema bloqueia automaticamente a progressão de nível de dificuldade do estudante se a atividade imediatamente anterior estiver sem avaliação de desempenho registrada.
  * Exibe um alerta chamativo na tela com botão direto para preenchimento da pendência.
* **Recalibragem Semanal Orientada por IA:** Processa os dados avaliados ao final do ciclo para promover a progressão, manutenção ou regressão do nível de suporte e atualiza automaticamente as estratégias validadas no Passaporte Pedagógico.

#### `RF08` — Geração de Relatórios Consolidados & Exportação em PDF
* **Relatório Técnico para Docentes e Coordenação:** Métricas detalhadas de aproveitamento por eixo, padrões comportamentais identificados pela IA, correlação com o PEI e alinhamento curricular BNCC.
* **Relatório Acolhedor para Famílias (`RF14`):** Linguagem acessível, afetuosa, sem jargões complexos e com representações visuais simplificadas do progresso.
* **Exportação Real em PDF:** Geração client-side em formato `.pdf` através da biblioteca `jsPDF`.
* **Envio por E-mail:** Simulação de disparo eletrônico direto aos responsáveis vinculados.

#### `RF14` — Painel de Consulta para Pais e Responsáveis
* Visão restrita e acolhedora associada unicamente aos estudantes sob responsabilidade daquele usuário.
* Oculta botões de gestão, edição de dados e geradores de atividade da escola.
* Acesso facilitado à evolução por eixo e download do boletim de conquistas em PDF.

---

## 🛡️ Requisitos Não-Funcionais (RNF01 a RNF08)

| Identificador | Requisito | Como é Atendido no Sistema |
| :--- | :--- | :--- |
| **`RNF01`** | **Multiplataforma (Mobile e Web)** | Interface responsiva e fluida construída em React + Tailwind CSS, operando com excelência em smartphones, tablets e desktops. |
| **`RNF02`** | **Arquitetura de Backend e Dados** | Servidor estruturado em Node.js + Express (`server.ts`) com proxy de API para execução segura da IA e modelos relacionais consistentes. |
| **`RNF03`** | **Segurança, Anonimização e LGPD** | Antes do envio de qualquer contexto para a IA, os dados identificáveis (Nome Completo e CPF de menores) são removidos e substituídos por pseudônimos seguros (ex: `Estudante [ID_ANON_102]`). |
| **`RNF04`** | **Acessibilidade WCAG** | Atributos ARIA, contraste elevado auditado, alternador de alto contraste, ampliação de fontes (100% / 115% / 130%) e baixa carga cognitiva. |
| **`RNF05`** | **Tempo de Resposta da IA** | Chamadas ao modelo `gemini-3.8-flash` otimizadas para responder em até 8 segundos, com indicador visual de etapas e cronômetro em tempo real. |
| **`RNF06`** | **Diretriz Pedagógica DUA** | Todas as atividades geradas estruturam múltiplos meios de representação, ação/expressão e engajamento. |
| **`RNF07`** | **Capacidade de Variações** | Mecanismo de geração configurável capaz de listar até 10 opções distintas de atividades adaptativas para o mesmo contexto. |
| **`RNF08`** | **Restrição Ética / Bloqueio Clínico** | *Guardrails* de prompt e validações no servidor que proíbem terminantemente laudos médicos ou diagnósticos de neurodivergências (como afirmar que o aluno "tem TDAH" ou "TEA"), restringindo-se unicamente ao perfil funcional e pedagógico. |

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React (ícones), Motion.
* **Backend:** Node.js, Express, tsx.
* **Inteligência Artificial:** SDK `@google/genai` (Modelo `gemini-3.8-flash`) com diretrizes de engenharia de prompt e guardrails éticos.
* **Documentos e PDFs:** `jsPDF` para exportação direta de relatórios pedagógicos formatados.
* **Build & Dev:** Vite.

---

## 👥 Perfis de Acesso Pré-Cadastrados para Teste

| Perfil | E-mail / Login | Senha | Descrição de Acesso |
| :--- | :--- | :--- | :--- |
| **Coordenador** | `coordenacao@escola.edu.br` | `Password123#` | Acesso completo à instituição, cadastro de usuários e turmas. |
| **Professor** | `professor@escola.edu.br` | `Password123#` | Acesso pedagógico pleno (Observação IA, Atividades DUA, Feedbacks e PEI). |
| **Pais / Responsáveis** | `pais@familia.com` | `Password123#` | Painel simplificado e acolhedor exclusivo do aluno dependente. |
| **1º Acesso (CPF)** | `ana.primeiroacesso@escola.edu.br` | `456.789.012-33` | Demonstração da tela compulsória de redefinição de senha (`RF02`). |

---

## 📄 Licença

Distribuído sob a licença **Apache-2.0**.
