import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { 
  Student, 
  ActivityItem, 
  ClassGroup, 
  User, 
  ActivityFeedback 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_CLASSES, 
  INITIAL_USERS, 
  INITIAL_ACTIVITIES 
} from '../mockData';

export interface DbStatusInfo {
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

// In-memory memory fallback to ensure high availability and zero crashes
let inMemoryStudents: Student[] = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
let inMemoryClasses: ClassGroup[] = JSON.parse(JSON.stringify(INITIAL_CLASSES));
let inMemoryUsers: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
let inMemoryActivities: ActivityItem[] = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));

let pool: Pool | null = null;
let isConnected = false;
let lastError: string | null = null;

/**
 * Configure secure connection pool with environment variables
 */
function buildPoolConfig(): PoolOptions {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'eduadapt_user';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'eduadapt_db';
  const connectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10);

  // SSL/TLS configuration for secure cloud/remote connections
  let sslConfig: any = undefined;
  if (process.env.DB_SSL === 'true' || process.env.DB_SSL === 'require') {
    sslConfig = {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
    };

    if (process.env.DB_SSL_CA_PATH && fs.existsSync(process.env.DB_SSL_CA_PATH)) {
      try {
        sslConfig.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH);
      } catch (err) {
        console.warn('[MySQL] Failed to read SSL CA certificate:', err);
      }
    }
  }

  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit,
    queueLimit: 0,
    connectTimeout: 8000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    ssl: sslConfig,
    charset: 'utf8mb4',
  };
}

/**
 * Initialize or retrieve the singleton MySQL connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    const config = buildPoolConfig();
    pool = mysql.createPool(config);
  }
  return pool;
}

/**
 * Verify connectivity securely and record status
 */
export async function testDbConnection(): Promise<DbStatusInfo> {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const database = process.env.DB_NAME || 'eduadapt_db';
  const user = process.env.DB_USER || 'eduadapt_user';
  const sslEnabled = process.env.DB_SSL === 'true' || process.env.DB_SSL === 'require';
  const connectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10);

  // If credentials are obviously not provided or pointing to non-existent localhost
  if (!process.env.DB_HOST && !process.env.DB_PASSWORD) {
    isConnected = false;
    lastError = 'Variáveis DB_HOST ou DB_PASSWORD não configuradas no arquivo .env. Modo Mock em memória ativado.';
    return {
      connected: false,
      driver: 'mysql2/promise',
      host,
      port,
      database,
      user,
      sslEnabled,
      connectionLimit,
      message: lastError,
      lastChecked: new Date().toISOString(),
    };
  }

  try {
    const activePool = getPool();
    // Test with prepared ping query
    const [rows] = await activePool.execute('SELECT 1 AS ping_test');
    isConnected = true;
    lastError = null;
    return {
      connected: true,
      driver: 'mysql2/promise',
      host,
      port,
      database,
      user,
      sslEnabled,
      connectionLimit,
      message: 'Conexão segura com MySQL Workbench / Servidor MySQL estabelecida com sucesso.',
      lastChecked: new Date().toISOString(),
    };
  } catch (err: any) {
    isConnected = false;
    lastError = err?.message || 'Falha ao conectar com o banco de dados MySQL.';
    return {
      connected: false,
      driver: 'mysql2/promise',
      host,
      port,
      database,
      user,
      sslEnabled,
      connectionLimit,
      message: `Modo Mock Ativo: ${lastError}`,
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * Get current DB status snapshot
 */
export function getCurrentDbStatus(): DbStatusInfo {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const database = process.env.DB_NAME || 'eduadapt_db';
  const user = process.env.DB_USER || 'eduadapt_user';
  const sslEnabled = process.env.DB_SSL === 'true' || process.env.DB_SSL === 'require';
  const connectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10);

  return {
    connected: isConnected,
    driver: 'mysql2/promise',
    host,
    port,
    database,
    user,
    sslEnabled,
    connectionLimit,
    message: isConnected 
      ? 'Conectado de forma segura ao MySQL.' 
      : (lastError || 'Operando em modo de dados locais (Mock) seguro e desacoplado.'),
    lastChecked: new Date().toISOString(),
  };
}

// ============================================================================
// DATA ACCESS LAYER: STUDENTS
// ============================================================================

export async function getAllStudents(): Promise<Student[]> {
  if (isConnected && pool) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          s.id, s.name, s.cpf, s.age, s.class_name as className, s.shift, s.room,
          s.learning_level as learningLevel, s.skills, s.difficulties, s.interests,
          s.pedagogical_goals as pedagogicalGoals, s.validated_strategies as validatedStrategies,
          s.failed_strategies as failedStrategies, s.pending_feedback_activity_id as pendingFeedbackActivityId,
          ax.cognicao, ax.linguagem, ax.matematica, ax.motricidade, ax.funcoes_executivas as funcoesExecutivas,
          ax.aspectos_socioemocionais as aspectosSocioemocionais,
          p.active as pei_active, p.term as pei_term, p.goals as pei_goals, 
          p.curricular_adaptations as pei_adaptations, p.last_updated as pei_last_updated
        FROM students s
        LEFT JOIN student_axes_scores ax ON s.id = ax.student_id
        LEFT JOIN pei_plans p ON s.id = p.student_id
      `);

      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          cpf: r.cpf,
          age: r.age,
          className: r.className,
          shift: r.shift,
          room: r.room,
          learningLevel: r.learningLevel,
          skills: typeof r.skills === 'string' ? JSON.parse(r.skills) : (r.skills || []),
          difficulties: typeof r.difficulties === 'string' ? JSON.parse(r.difficulties) : (r.difficulties || []),
          interests: typeof r.interests === 'string' ? JSON.parse(r.interests) : (r.interests || []),
          pedagogicalGoals: typeof r.pedagogicalGoals === 'string' ? JSON.parse(r.pedagogicalGoals) : (r.pedagogicalGoals || []),
          validatedStrategies: typeof r.validatedStrategies === 'string' ? JSON.parse(r.validatedStrategies) : (r.validatedStrategies || []),
          failedStrategies: typeof r.failedStrategies === 'string' ? JSON.parse(r.failedStrategies) : (r.failedStrategies || []),
          pendingFeedbackActivityId: r.pendingFeedbackActivityId,
          axesScores: {
            cognicao: Number(r.cognicao || 75),
            linguagem: Number(r.linguagem || 70),
            matematica: Number(r.matematica || 65),
            motricidade: Number(r.motricidade || 80),
            funcoesExecutivas: Number(r.funcoesExecutivas || 65),
            aspectosSocioemocionais: Number(r.aspectosSocioemocionais || 75),
          },
          pei: {
            active: Boolean(r.pei_active),
            term: r.pei_term || '2º Semestre Letivo - 2026',
            lastUpdated: r.pei_last_updated || '10/10/2026',
            goals: typeof r.pei_goals === 'string' ? JSON.parse(r.pei_goals) : (r.pei_goals || []),
            curricularAdaptations: typeof r.pei_adaptations === 'string' ? JSON.parse(r.pei_adaptations) : (r.pei_adaptations || []),
          },
          recentHistory: [],
        }));
      }
    } catch (err) {
      console.warn('[MySQL] Error querying students, falling back to mock:', err);
    }
  }

  return inMemoryStudents;
}

export async function saveOrUpdateStudent(student: Student): Promise<Student> {
  // Always update in-memory cache
  const idx = inMemoryStudents.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    inMemoryStudents[idx] = student;
  } else {
    inMemoryStudents.unshift(student);
  }

  if (isConnected && pool) {
    try {
      // Prepared statement query (Prevents SQL Injection)
      await pool.execute(`
        INSERT INTO students (
          id, name, cpf, age, class_name, shift, room, learning_level,
          skills, difficulties, interests, pedagogical_goals,
          validated_strategies, failed_strategies, pending_feedback_activity_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          cpf = VALUES(cpf),
          age = VALUES(age),
          class_name = VALUES(class_name),
          shift = VALUES(shift),
          room = VALUES(room),
          learning_level = VALUES(learning_level),
          skills = VALUES(skills),
          difficulties = VALUES(difficulties),
          interests = VALUES(interests),
          pedagogical_goals = VALUES(pedagogical_goals),
          validated_strategies = VALUES(validated_strategies),
          failed_strategies = VALUES(failed_strategies),
          pending_feedback_activity_id = VALUES(pending_feedback_activity_id)
      `, [
        student.id,
        student.name,
        student.cpf,
        student.age,
        student.className,
        student.shift || 'Manhã',
        student.room || '',
        student.learningLevel,
        JSON.stringify(student.skills),
        JSON.stringify(student.difficulties),
        JSON.stringify(student.interests),
        JSON.stringify(student.pedagogicalGoals),
        JSON.stringify(student.validatedStrategies),
        JSON.stringify(student.failedStrategies),
        student.pendingFeedbackActivityId || null,
      ]);

      // Save axes scores with prepared statement
      if (student.axesScores) {
        await pool.execute(`
          INSERT INTO student_axes_scores (
            student_id, cognicao, linguagem, matematica, motricidade, funcoes_executivas, aspectos_socioemocionais
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            cognicao = VALUES(cognicao),
            linguagem = VALUES(linguagem),
            matematica = VALUES(matematica),
            motricidade = VALUES(motricidade),
            funcoes_executivas = VALUES(funcoes_executivas),
            aspectos_socioemocionais = VALUES(aspectos_socioemocionais)
        `, [
          student.id,
          student.axesScores.cognicao,
          student.axesScores.linguagem,
          student.axesScores.matematica,
          student.axesScores.motricidade,
          student.axesScores.funcoesExecutivas,
          student.axesScores.aspectosSocioemocionais || 70,
        ]);
      }

      // Save PEI with prepared statement
      if (student.pei) {
        await pool.execute(`
          INSERT INTO pei_plans (
            id, student_id, active, term, goals, curricular_adaptations, last_updated
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            active = VALUES(active),
            term = VALUES(term),
            goals = VALUES(goals),
            curricular_adaptations = VALUES(curricular_adaptations),
            last_updated = VALUES(last_updated)
        `, [
          `pei-${student.id}`,
          student.id,
          student.pei.active ? 1 : 0,
          student.pei.term || '2º Semestre Letivo - 2026',
          JSON.stringify(student.pei.goals || []),
          JSON.stringify(student.pei.curricularAdaptations || []),
          student.pei.lastUpdated || new Date().toLocaleDateString('pt-BR'),
        ]);
      }
    } catch (err) {
      console.warn('[MySQL] Failed to persist student into MySQL:', err);
    }
  }

  return student;
}

// ============================================================================
// DATA ACCESS LAYER: ACTIVITIES & FEEDBACK
// ============================================================================

export async function getAllActivities(): Promise<ActivityItem[]> {
  if (isConnected && pool) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          a.id, a.student_id as studentId, a.title, a.pedagogical_axis as pedagogicalAxis,
          a.objective, a.practical_example as practicalExample, 
          a.visual_resource_suggestion as visualResourceSuggestion,
          a.bncc_competencies as bnccCompetencies, a.pei_goal_linked as peiGoalLinked,
          a.explicability_justification as explicabilityJustification,
          a.levels, a.target_level as targetLevel, a.status, a.created_at as createdAt,
          f.id as feedbackId, f.qualitative_engagement as fb_engagement, 
          f.qualitative_autonomy as fb_autonomy, f.qualitative_barriers as fb_barriers,
          f.quantitative_score_percent as fb_score, f.quantitative_completion_time_minutes as fb_time,
          f.quantitative_grade as fb_grade, f.submitted_by as fb_by, f.submitted_at as fb_at
        FROM activities a
        LEFT JOIN activity_feedbacks f ON a.id = f.activity_id
        ORDER BY a.created_at DESC
      `);

      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((r: any) => ({
          id: r.id,
          studentId: r.studentId,
          title: r.title,
          pedagogicalAxis: r.pedagogicalAxis,
          objective: r.objective,
          practicalExample: r.practicalExample,
          visualResourceSuggestion: r.visualResourceSuggestion,
          bnccCompetencies: typeof r.bnccCompetencies === 'string' ? JSON.parse(r.bnccCompetencies) : (r.bnccCompetencies || []),
          peiGoalLinked: r.peiGoalLinked,
          explicabilityJustification: r.explicabilityJustification,
          levels: typeof r.levels === 'string' ? JSON.parse(r.levels) : r.levels,
          targetLevel: r.targetLevel,
          status: r.status,
          createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
          feedback: r.feedbackId ? {
            qualitative: {
              engagement: r.fb_engagement || '',
              autonomy: r.fb_autonomy || '',
              barriers: r.fb_barriers || '',
            },
            quantitative: {
              scorePercent: Number(r.fb_score || 0),
              completionTimeMinutes: Number(r.fb_time || 0),
              grade: r.fb_grade,
            },
            submittedBy: r.fb_by || 'Professor',
            submittedAt: r.fb_at || new Date().toISOString(),
          } : undefined,
        }));
      }
    } catch (err) {
      console.warn('[MySQL] Error querying activities, using mock:', err);
    }
  }

  return inMemoryActivities;
}

export async function saveActivity(activity: ActivityItem): Promise<ActivityItem> {
  inMemoryActivities.unshift(activity);

  if (isConnected && pool) {
    try {
      await pool.execute(`
        INSERT INTO activities (
          id, student_id, title, pedagogical_axis, objective, practical_example,
          visual_resource_suggestion, bncc_competencies, pei_goal_linked,
          explicability_justification, levels, target_level, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        activity.id,
        activity.studentId,
        activity.title,
        activity.pedagogicalAxis,
        activity.objective,
        activity.practicalExample,
        activity.visualResourceSuggestion,
        JSON.stringify(activity.bnccCompetencies || []),
        activity.peiGoalLinked || null,
        activity.explicabilityJustification,
        JSON.stringify(activity.levels),
        activity.targetLevel,
        activity.status,
      ]);
    } catch (err) {
      console.warn('[MySQL] Failed to save activity into MySQL:', err);
    }
  }

  return activity;
}

export async function saveFeedback(activityId: string, feedback: ActivityFeedback): Promise<boolean> {
  // Update in-memory
  const act = inMemoryActivities.find((a) => a.id === activityId);
  if (act) {
    act.status = 'concluida_com_feedback';
    act.feedback = feedback;
  }

  // Release lock on student if pending
  const student = inMemoryStudents.find((s) => s.id === act?.studentId);
  if (student && student.pendingFeedbackActivityId === activityId) {
    student.pendingFeedbackActivityId = null;
  }

  if (isConnected && pool && act) {
    try {
      await pool.execute(`
        UPDATE activities SET status = 'concluida_com_feedback' WHERE id = ?
      `, [activityId]);

      await pool.execute(`
        INSERT INTO activity_feedbacks (
          id, activity_id, student_id, qualitative_engagement, qualitative_autonomy,
          qualitative_barriers, quantitative_score_percent,
          quantitative_completion_time_minutes, quantitative_grade,
          submitted_by, submitted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        `fb-${Date.now()}`,
        activityId,
        act.studentId,
        feedback.qualitative.engagement,
        feedback.qualitative.autonomy,
        feedback.qualitative.barriers,
        feedback.quantitative.scorePercent,
        feedback.quantitative.completionTimeMinutes,
        feedback.quantitative.grade || null,
        feedback.submittedBy,
        feedback.submittedAt,
      ]);

      await pool.execute(`
        UPDATE students SET pending_feedback_activity_id = NULL 
        WHERE id = ? AND pending_feedback_activity_id = ?
      `, [act.studentId, activityId]);
    } catch (err) {
      console.warn('[MySQL] Failed to save feedback to MySQL:', err);
    }
  }

  return true;
}

export async function getAllClasses(): Promise<ClassGroup[]> {
  return inMemoryClasses;
}

export async function getAllUsers(): Promise<User[]> {
  return inMemoryUsers;
}
