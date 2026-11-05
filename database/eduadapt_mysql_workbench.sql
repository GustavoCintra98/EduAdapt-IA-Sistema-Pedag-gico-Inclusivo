-- ============================================================================
-- EduAdapt IA - Sistema Pedagógico Inclusivo
-- Script DDL & DML Estruturado para MySQL Workbench (MySQL 8.0+)
-- Arquitetura Relacional com Integridade Referencial, Índices e Suporte DUA/PEI
-- ============================================================================

-- 1. Criação do Banco de Dados com Charset Seguro UTF8MB4
CREATE DATABASE IF NOT EXISTS `eduadapt_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `eduadapt_db`;

-- Desativa temporariamente a checagem de chaves estrangeiras para criação limpa
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `activity_feedbacks`;
DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `student_history`;
DROP TABLE IF EXISTS `pei_plans`;
DROP TABLE IF EXISTS `student_axes_scores`;
DROP TABLE IF EXISTS `user_student_links`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `system_audit_logs`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 2. Tabela de Turmas Escolares (classes)
-- ============================================================================
CREATE TABLE `classes` (
  `id` VARCHAR(36) NOT NULL COMMENT 'Identificador único da turma (ex: class-3a)',
  `name` VARCHAR(100) NOT NULL COMMENT 'Nome completo da turma (ex: 3º Ano A - Fundamental I)',
  `grade` VARCHAR(50) NOT NULL COMMENT 'Série / Ano escolar',
  `shift` ENUM('Manhã', 'Tarde', 'Integral') NOT NULL DEFAULT 'Manhã' COMMENT 'Turno de aula',
  `student_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Contagem total de alunos matriculados',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_classes_grade_shift` (`grade`, `shift`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Turmas escolares e agrupamentos de ensino';

-- ============================================================================
-- 3. Tabela de Usuários e Controle de Acesso RBAC (users)
-- ============================================================================
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL COMMENT 'Identificador único do usuário',
  `name` VARCHAR(150) NOT NULL COMMENT 'Nome completo do usuário',
  `cpf` VARCHAR(14) NOT NULL COMMENT 'CPF formatado (000.000.000-00)',
  `email` VARCHAR(150) NOT NULL COMMENT 'E-mail institucional ou de contato',
  `role` ENUM('coordenador', 'professor', 'pais', 'aluno') NOT NULL COMMENT 'Papel do usuário no sistema',
  `is_first_access` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Flag de primeiro acesso para troca obrigatória de senha (RF02)',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hash da senha segura (bcrypt/argon2)',
  `avatar_url` VARCHAR(255) NULL COMMENT 'URL do avatar do usuário',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_cpf` (`cpf`),
  UNIQUE KEY `uk_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Usuários do sistema (Docentes, Coordenação, Famílias e Alunos)';

-- ============================================================================
-- 4. Tabela de Estudantes do Passaporte Pedagógico (students)
-- ============================================================================
CREATE TABLE `students` (
  `id` VARCHAR(36) NOT NULL COMMENT 'Identificador único do estudante (ex: student-1)',
  `name` VARCHAR(150) NOT NULL COMMENT 'Nome completo do estudante (LGPD: dados anonimizados para IA)',
  `cpf` VARCHAR(14) NOT NULL COMMENT 'CPF do estudante',
  `age` TINYINT UNSIGNED NOT NULL COMMENT 'Idade do estudante em anos',
  `class_id` VARCHAR(36) NULL COMMENT 'Chave estrangeira para a turma matriculada',
  `class_name` VARCHAR(100) NOT NULL COMMENT 'Nome da turma no momento do cadastro',
  `shift` ENUM('Manhã', 'Tarde', 'Integral') NOT NULL DEFAULT 'Manhã',
  `room` VARCHAR(50) NULL COMMENT 'Sala ou bloco da aula (ex: Sala 102 - Bloco A)',
  `learning_level` ENUM('Apoio Intensivo', 'Apoio Moderado', 'Independente') NOT NULL DEFAULT 'Apoio Moderado' COMMENT 'Nível funcional atual de intervenção pedagógica',
  `skills` JSON NOT NULL COMMENT 'Array JSON de habilidades desenvolvidas',
  `difficulties` JSON NOT NULL COMMENT 'Array JSON de barreiras e dificuldades observadas',
  `interests` JSON NOT NULL COMMENT 'Array JSON de interesses particulares do aluno (DUA: engajamento)',
  `pedagogical_goals` JSON NOT NULL COMMENT 'Array JSON de metas pedagógicas gerais',
  `validated_strategies` JSON NOT NULL COMMENT 'Array JSON de estratégias que já funcionaram comprovadamente',
  `failed_strategies` JSON NOT NULL COMMENT 'Array JSON de estratégias que causaram sobrecarga ou falharam',
  `pending_feedback_activity_id` VARCHAR(36) NULL COMMENT 'ID da atividade pendente que bloqueia nova atividade (RF12)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_students_cpf` (`cpf`),
  INDEX `idx_students_class_id` (`class_id`),
  INDEX `idx_students_level` (`learning_level`),
  CONSTRAINT `fk_students_class`
    FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Perfil do estudante e Passaporte Pedagógico Inclusivo';

-- ============================================================================
-- 5. Tabela de Vínculo Família x Aluno (user_student_links)
-- ============================================================================
CREATE TABLE `user_student_links` (
  `user_id` VARCHAR(36) NOT NULL COMMENT 'ID do usuário (perfil pais/responsável)',
  `student_id` VARCHAR(36) NOT NULL COMMENT 'ID do estudante vinculado',
  `relationship` VARCHAR(50) NOT NULL DEFAULT 'Responsável Legal' COMMENT 'Grau de parentesco (Pai, Mãe, Tutor)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `student_id`),
  CONSTRAINT `fk_usl_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usl_student`
    FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Relação N:N entre responsáveis familiares e estudantes para acesso restrito (RF14)';

-- ============================================================================
-- 6. Tabela de Pontuações nos Eixos de Desenvolvimento (student_axes_scores)
-- ============================================================================
CREATE TABLE `student_axes_scores` (
  `student_id` VARCHAR(36) NOT NULL COMMENT 'ID do estudante',
  `cognicao` DECIMAL(5,2) NOT NULL DEFAULT 50.00 COMMENT 'Score no eixo Cognição (0-100)',
  `linguagem` DECIMAL(5,2) NOT NULL DEFAULT 50.00 COMMENT 'Score no eixo Linguagem (0-100)',
  `matematica` DECIMAL(5,2) NOT NULL DEFAULT 50.00 COMMENT 'Score no eixo Matemática (0-100)',
  `motricidade` DECIMAL(5,2) NOT NULL DEFAULT 50.00 COMMENT 'Score no eixo Motricidade (0-100)',
  `funcoes_executivas` DECIMAL(5,2) NOT NULL DEFAULT 50.00 COMMENT 'Score no eixo Funções Executivas (0-100)',
  `aspectos_socioemocionais` DECIMAL(5,2) NOT NULL DEFAULT 50.00 COMMENT 'Score no eixo Aspectos Socioemocionais (0-100)',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  CONSTRAINT `fk_axes_student`
    FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Métricas multidimensionais de desenvolvimento funcional dos estudantes';

-- ============================================================================
-- 7. Tabela de Planos Educacionais Individualizados (pei_plans)
-- ============================================================================
CREATE TABLE `pei_plans` (
  `id` VARCHAR(36) NOT NULL COMMENT 'Identificador único do PEI',
  `student_id` VARCHAR(36) NOT NULL COMMENT 'ID do estudante a quem pertence o PEI',
  `active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Status ativo ou inativo do PEI',
  `term` VARCHAR(100) NOT NULL COMMENT 'Período letivo de vigência (ex: 2º Semestre Letivo - 2026)',
  `goals` JSON NOT NULL COMMENT 'Array JSON com as metas formais do PEI',
  `curricular_adaptations` JSON NOT NULL COMMENT 'Array JSON com as adaptações curriculares e ambientais',
  `last_updated` VARCHAR(30) NOT NULL COMMENT 'Data textual de última revisão',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pei_student` (`student_id`),
  CONSTRAINT `fk_pei_student`
    FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Planos de Ensino Individualizados (PEI) vinculados aos estudantes (RF13)';

-- ============================================================================
-- 8. Tabela de Histórico de Ações e Recalibragens (student_history)
-- ============================================================================
CREATE TABLE `student_history` (
  `id` VARCHAR(36) NOT NULL,
  `student_id` VARCHAR(36) NOT NULL,
  `action_date` VARCHAR(30) NOT NULL,
  `action` TEXT NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_history_student_date` (`student_id`, `created_at`),
  CONSTRAINT `fk_history_student`
    FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Linha do tempo e auditoria de evolução do passaporte pedagógico';

-- ============================================================================
-- 9. Tabela de Atividades Adaptativas DUA (activities)
-- ============================================================================
CREATE TABLE `activities` (
  `id` VARCHAR(36) NOT NULL COMMENT 'Identificador da atividade adaptada',
  `student_id` VARCHAR(36) NOT NULL COMMENT 'Estudante foco da atividade',
  `title` VARCHAR(200) NOT NULL COMMENT 'Título pedagógico da atividade',
  `pedagogical_axis` ENUM('Cognição', 'Linguagem', 'Matemática', 'Motricidade', 'Aspectos socioemocionais', 'Funções executivas') NOT NULL,
  `objective` TEXT NOT NULL COMMENT 'Objetivo pedagógico claro',
  `practical_example` TEXT NOT NULL COMMENT 'Exemplo prático contextualizado com a rotina e interesses',
  `visual_resource_suggestion` TEXT NOT NULL COMMENT 'Recursos visuais ou concretos recomendados',
  `bncc_competencies` JSON NOT NULL COMMENT 'Array JSON de códigos de competência BNCC (ex: EF03MA05)',
  `pei_goal_linked` TEXT NULL COMMENT 'Meta do PEI associada diretamente',
  `explicability_justification` TEXT NOT NULL COMMENT 'Justificativa pedagógica da IA: por que esta atividade é indicada (RF07)',
  `levels` JSON NOT NULL COMMENT 'Configurações dos 3 níveis DUA: intensivo, moderado e independente',
  `target_level` ENUM('Apoio Intensivo', 'Apoio Moderado', 'Independente') NOT NULL DEFAULT 'Apoio Moderado',
  `status` ENUM('pendente_aplicacao', 'aplicada_pendente_feedback', 'concluida_com_feedback') NOT NULL DEFAULT 'pendente_aplicacao',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_activities_student` (`student_id`),
  INDEX `idx_activities_status` (`status`),
  INDEX `idx_activities_axis` (`pedagogical_axis`),
  CONSTRAINT `fk_activities_student`
    FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Atividades adaptativas parametrizadas segundo os 3 pilares do DUA';

-- ============================================================================
-- 10. Tabela de Devolutivas e Feedbacks de Desempenho (activity_feedbacks)
-- ============================================================================
CREATE TABLE `activity_feedbacks` (
  `id` VARCHAR(36) NOT NULL COMMENT 'ID único do feedback',
  `activity_id` VARCHAR(36) NOT NULL COMMENT 'Atividade correspondente',
  `student_id` VARCHAR(36) NOT NULL COMMENT 'Estudante avaliado',
  `qualitative_engagement` TEXT NOT NULL COMMENT 'Avaliação qualitativa do engajamento',
  `qualitative_autonomy` TEXT NOT NULL COMMENT 'Nível de autonomia demonstrado',
  `qualitative_barriers` TEXT NOT NULL COMMENT 'Barreiras atitudinais ou sensoriais observadas',
  `quantitative_score_percent` DECIMAL(5,2) NOT NULL COMMENT 'Porcentagem de aproveitamento (0-100%)',
  `quantitative_completion_time_minutes` INT UNSIGNED NOT NULL COMMENT 'Tempo de execução em minutos',
  `quantitative_grade` VARCHAR(10) NULL COMMENT 'Conceito opcional atribuído',
  `submitted_by` VARCHAR(150) NOT NULL COMMENT 'Nome ou matrícula do educador que submeteu o feedback',
  `submitted_at` VARCHAR(50) NOT NULL COMMENT 'Data e hora da submissão',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_feedback_activity` (`activity_id`),
  INDEX `idx_feedback_student` (`student_id`),
  CONSTRAINT `fk_feedback_activity`
    FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_feedback_student`
    FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Feedbacks de execução para recalibragem de nível e liberação de travas (RF12)';

-- ============================================================================
-- 11. Tabela de Logs de Auditoria LGPD (system_audit_logs)
-- ============================================================================
CREATE TABLE `system_audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(36) NULL,
  `action_type` VARCHAR(50) NOT NULL COMMENT 'Tipo da ação: LOGIN, ANON_IA_QUERY, UPDATE_PEI, EXPORT_REPORT',
  `target_student_id` VARCHAR(36) NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_action` (`action_type`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Logs de auditoria e conformidade LGPD para acesso a dados sensíveis de menores';

-- ============================================================================
-- 12. VIEWS ESTRUTURADAS PARA O MYSQL WORKBENCH
-- ============================================================================

-- Visão consolidada de estudantes com turma, scores médios e PEI
CREATE OR REPLACE VIEW `vw_students_overview` AS
SELECT 
  s.id AS student_id,
  s.name AS student_name,
  s.cpf AS student_cpf,
  s.age,
  c.name AS class_name,
  c.shift AS class_shift,
  s.learning_level,
  ax.cognicao,
  ax.linguagem,
  ax.matematica,
  ax.motricidade,
  ax.funcoes_executivas,
  ax.aspectos_socioemocionais,
  p.active AS pei_active,
  p.term AS pei_term,
  s.pending_feedback_activity_id IS NOT NULL AS has_pending_lock
FROM `students` s
LEFT JOIN `classes` c ON s.class_id = c.id
LEFT JOIN `student_axes_scores` ax ON s.id = ax.student_id
LEFT JOIN `pei_plans` p ON s.id = p.student_id;

-- Visão analítica de atividades e métricas de feedback
CREATE OR REPLACE VIEW `vw_activities_feedback_stats` AS
SELECT 
  a.id AS activity_id,
  a.student_id,
  s.name AS student_name,
  a.title AS activity_title,
  a.pedagogical_axis,
  a.target_level,
  a.status,
  f.quantitative_score_percent AS score_percent,
  f.quantitative_completion_time_minutes AS duration_minutes,
  f.submitted_by,
  f.submitted_at
FROM `activities` a
JOIN `students` s ON a.student_id = s.id
LEFT JOIN `activity_feedbacks` f ON a.id = f.activity_id;

-- ============================================================================
-- 13. DADOS INICIAIS (SEED DATA) COMPATÍVEIS COM O SISTEMA
-- ============================================================================

-- Inserção de Turmas
INSERT INTO `classes` (`id`, `name`, `grade`, `shift`, `student_count`) VALUES
('class-3a', '3º Ano A - Fundamental I', '3º Ano', 'Manhã', 22),
('class-3b', '3º Ano B - Fundamental I', '3º Ano', 'Tarde', 24),
('class-4a', '4º Ano A - Fundamental I', '4º Ano', 'Manhã', 20),
('class-2c', '2º Ano C - Fundamental I', '2º Ano', 'Manhã', 19);

-- Inserção de Usuários com hashes fictícios compatíveis
INSERT INTO `users` (`id`, `name`, `cpf`, `email`, `role`, `is_first_access`, `password_hash`) VALUES
('user-coord', 'Profa. Dra. Mariana Silva', '123.456.789-00', 'coordenacao@escola.edu.br', 'coordenador', 0, '$2a$10$wT0X8U3f0e8f.8W7k9P7Me/Q7h5u7h/8x4u5p8u5i9'),
('user-prof', 'Prof. Carlos Eduardo Mendes', '234.567.890-11', 'professor@escola.edu.br', 'professor', 0, '$2a$10$wT0X8U3f0e8f.8W7k9P7Me/Q7h5u7h/8x4u5p8u5i9'),
('user-pais', 'Marcos Vinicius de Oliveira (Pai)', '345.678.901-22', 'pais@familia.com', 'pais', 0, '$2a$10$wT0X8U3f0e8f.8W7k9P7Me/Q7h5u7h/8x4u5p8u5i9'),
('user-primeiro', 'Ana Carolina Peixoto', '456.789.012-33', 'ana.primeiroacesso@escola.edu.br', 'professor', 1, '$2a$10$wT0X8U3f0e8f.8W7k9P7Me/Q7h5u7h/8x4u5p8u5i9');

-- Inserção de Estudantes
INSERT INTO `students` (
  `id`, `name`, `cpf`, `age`, `class_id`, `class_name`, `shift`, `room`, `learning_level`,
  `skills`, `difficulties`, `interests`, `pedagogical_goals`, `validated_strategies`, `failed_strategies`,
  `pending_feedback_activity_id`
) VALUES
(
  'student-1',
  'Lucas Gabriel de Oliveira',
  '567.890.123-44',
  8,
  'class-3a',
  '3º Ano A - Fundamental I',
  'Manhã',
  'Sala 102 - Bloco A',
  'Apoio Moderado',
  JSON_ARRAY(
    'Excelente memória visual e espacial',
    'Compreensão rápida com ilustrações e esquemas',
    'Interesse elevado por astronomia e animais',
    'Boa motricidade ampla e sociabilidade em duplas'
  ),
  JSON_ARRAY(
    'Perda de concentração em textos extensos com fontes densas',
    'Hesitação em operações matemáticas abstratas sem material concreto',
    'Sobrecarga em transições rápidas de atividades sem aviso prévio'
  ),
  JSON_ARRAY(
    'Astronomia',
    'Dinossauros',
    'Construção com blocos de madeira',
    'Histórias em quadrinhos'
  ),
  JSON_ARRAY(
    'Consolidar operações de adição e subtração com recurso manipulativo',
    'Aumentar o tempo de foco em leitura compartilhada para 15 minutos contínuos',
    'Desenvolver autonomia na rotina diária através de checklist visual ilustrado'
  ),
  JSON_ARRAY(
    'Cartões visuais sequenciais antes de cada atividade',
    'Uso de blocos coloridos e ábaco para ancoragem numérica',
    'Pausa motora de 1 minuto a cada 15 minutos de concentração'
  ),
  JSON_ARRAY(
    'Instruções orais com mais de 3 passos simultâneos sem apoio gráfico',
    'Avaliações exclusivamente dissertativas sem imagens explicativas'
  ),
  'act-sample-1'
),
(
  'student-2',
  'Beatriz Vasconcelos Santos',
  '678.901.234-55',
  8,
  'class-3a',
  '3º Ano A - Fundamental I',
  'Manhã',
  'Sala 102 - Bloco A',
  'Apoio Intensivo',
  JSON_ARRAY(
    'Comunicação expressiva verbal rica',
    'Gosto por narrativas orais e música',
    'Empatia e cooperação espontânea com colegas'
  ),
  JSON_ARRAY(
    'Dificuldade de retenção de instruções puramente orais sem âncora gráfica',
    'Insegurança em escrita cursiva contínua'
  ),
  JSON_ARRAY(
    'Música instrumental',
    'Pintura em tela',
    'Contos folclóricos'
  ),
  JSON_ARRAY(
    'Produção autônoma de pequenos parágrafos ilustrados',
    'Coordenação motora fina com adaptação de pegador de lápis'
  ),
  JSON_ARRAY(
    'Uso de engrossador de lápis ergonômico',
    'Fracionamento de tarefas em blocos de 10 minutos'
  ),
  JSON_ARRAY(
    'Exigência de cópia extensa do quadro branco'
  ),
  NULL
);

-- Vínculo de Aluno com Responsável
INSERT INTO `user_student_links` (`user_id`, `student_id`, `relationship`) VALUES
('user-pais', 'student-1', 'Pai / Responsável Legal');

-- Scores Multidimensionais
INSERT INTO `student_axes_scores` (`student_id`, `cognicao`, `linguagem`, `matematica`, `motricidade`, `funcoes_executivas`, `aspectos_socioemocionais`) VALUES
('student-1', 78.00, 72.00, 68.00, 86.00, 64.00, 80.00),
('student-2', 82.00, 85.00, 60.00, 65.00, 62.00, 88.00);

-- Planos de Ensino Individualizados (PEI)
INSERT INTO `pei_plans` (`id`, `student_id`, `active`, `term`, `goals`, `curricular_adaptations`, `last_updated`) VALUES
(
  'pei-student-1',
  'student-1',
  1,
  '2º Semestre Letivo - 2026',
  JSON_ARRAY(
    'Meta PEI-01: Dominar cálculos aditivos de 2 dígitos usando material concreto e representação gráfica.',
    'Meta PEI-02: Localizar informações explícitas em parágrafos curtos ilustrados.',
    'Meta PEI-03: Seguir rotina de 4 etapas escolares com suporte de cronograma visual.'
  ),
  JSON_ARRAY(
    'Enunciados com fonte ampliada (mínimo 16pt) e espaçamento 1.5',
    'Permissão de resposta oral gravada ou apontamento ilustrado',
    'Tempo estendido (+50%) em atividades de fixação escrita'
  ),
  '10/10/2026'
),
(
  'pei-student-2',
  'student-2',
  1,
  '2º Semestre Letivo - 2026',
  JSON_ARRAY(
    'Meta PEI-01: Fortalecer escrita com apoio de prancha de palavras-chave ilustradas.',
    'Meta PEI-02: Desenvolver rotina de checagem com checklist pictográfico de 3 etapas.'
  ),
  JSON_ARRAY(
    'Engrossador de lápis triangular anatômico',
    'Prancha inclinada de apoio para escrita'
  ),
  '15/10/2026'
);

-- Histórico de Evolução
INSERT INTO `student_history` (`id`, `student_id`, `action_date`, `action`, `author`) VALUES
('hist-1', 'student-1', '04/11/2026', 'Atividade adaptada de Matemática aplicada em sala', 'Prof. Carlos'),
('hist-2', 'student-1', '01/11/2026', 'Recalibragem semanal com avanço para Apoio Moderado', 'Sistema IA'),
('hist-3', 'student-1', '28/10/2026', 'Atualização das estratégias validadas no PEI', 'Profa. Mariana');

-- Atividades Adaptativas Iniciais
INSERT INTO `activities` (
  `id`, `student_id`, `title`, `pedagogical_axis`, `objective`, `practical_example`,
  `visual_resource_suggestion`, `bncc_competencies`, `pei_goal_linked`,
  `explicability_justification`, `levels`, `target_level`, `status`
) VALUES
(
  'act-sample-1',
  'student-1',
  'Missão Espacial dos Números: Adição Concreta',
  'Matemática',
  'Consolidar a soma de dois dígitos utilizando representação concreta de constelações e blocos de contagem.',
  'O aluno monta foguetes e planetas com blocos de madeira e registra os totais em uma folha com fontes ampliadas e ícones dos planetas que ele mais admira.',
  'Cartões plastificados de foguetes numerados e cubos coloridos tipo Material Dourado com apoio magnético.',
  JSON_ARRAY('EF03MA05', 'EF03MA06'),
  'Meta PEI-01: Dominar cálculos aditivos de 2 dígitos usando material concreto e representação gráfica.',
  'O estudante apresenta excelente resposta a estímulos visuais temáticos de astronomia, mas relata insegurança em operações puramente abstratas no quadro. A atividade ancora os números em quantidades manipuláveis respeitando o ritmo e reduzindo a ansiedade cognitiva (RF07 / RNF08).',
  JSON_OBJECT(
    'intensivo', JSON_OBJECT(
      'description', 'Atividade mediada 1:1 pelo educador com contadores físicos e gabarito visual colorido.',
      'instructions', 'O professor monta o foguete junto com o aluno, faz a contagem em voz alta e posiciona as fichas.'
    ),
    'moderado', JSON_OBJECT(
      'description', 'Execução em dupla com roteiro visual de 3 etapas na carteira e verificação por cartões resposta.',
      'instructions', 'O estudante consulta a ficha guia de constelações, monta as quantidades e anota os resultados.'
    ),
    'independente', JSON_OBJECT(
      'description', 'Resolução autônoma da trilha matemática com autoavaliação comentada.',
      'instructions', 'O aluno resolve a cartela de desafios espaciais e valida seus pontos no mapa estelar da sala.'
    )
  ),
  'Apoio Moderado',
  'aplicada_pendente_feedback'
);

-- Criação de Usuário com Menor Privilégio para a Aplicação (Boa Prática de Segurança)
-- Executar no MySQL com privilégios de root caso deseje isolar o banco:
-- CREATE USER IF NOT EXISTS 'eduadapt_user'@'%' IDENTIFIED BY 'EduAdaptSecurePass2026!';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON eduadapt_db.* TO 'eduadapt_user'@'%';
-- FLUSH PRIVILEGES;
