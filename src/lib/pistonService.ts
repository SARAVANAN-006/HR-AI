/**
 * PISTON & JUDGE0 SANDBOX EXECUTION ENGINE & ADVANCED OUTPUT MATCHER
 * Provides universal code execution with robust output normalization:
 * - Line endings (\r\n vs \n)
 * - Trailing newlines / whitespace
 * - Delimiter and spacing normalization (e.g. "[0, 1]" vs "0,1" vs "[0,1]")
 * - Boolean casing ("true" vs "True")
 * - Multi-line and debug statement tolerance (extracting final return value)
 * - JSON and array structured equivalence
 */

export interface TestCase {
  id?: number | string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string | null;
  executionTimeMs?: number;
}

export interface ExecutionOutcome {
  status: 'SUCCESS' | 'WRONG_ANSWER' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT';
  passedCases: number;
  totalCases: number;
  executionTimeMs: number;
  consoleOutput: string;
  memoryUsedKb?: number | null;
  details: TestCaseResult[];
}

/**
 * Normalizes an output string for reliable algorithmic comparison.
 */
export function normalizeOutput(raw: string | null | undefined): string {
  if (raw === null || raw === undefined) return '';
  return String(raw)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

export function compareSingleLine(act: string, exp: string): boolean {
  if (act === exp) return true;
  if (act.toLowerCase() === exp.toLowerCase()) return true;

  // Whitespace-collapsed
  const collapseA = act.replace(/[ \t]+/g, ' ').trim();
  const collapseE = exp.replace(/[ \t]+/g, ' ').trim();
  if (collapseA === collapseE || collapseA.toLowerCase() === collapseE.toLowerCase()) return true;

  // Spacing around punctuation/brackets: "[0, 1]" -> "[0,1]", "0, 1" -> "0,1"
  const compactA = collapseA.replace(/\s*([,:[\]{}()])\s*/g, '$1');
  const compactE = collapseE.replace(/\s*([,:[\]{}()])\s*/g, '$1');
  if (compactA === compactE || compactA.toLowerCase() === compactE.toLowerCase()) return true;

  // Bracket/quote stripping: "[0,1]" vs "0,1"
  const stripDelims = (s: string) => s.replace(/^[\[\(\{'"\`]+|[\s\)\]\}'"\`]+$/g, '').trim();
  const strippedA = stripDelims(compactA);
  const strippedE = stripDelims(compactE);
  if (strippedA && (strippedA === strippedE || strippedA.toLowerCase() === strippedE.toLowerCase())) return true;

  // Numeric float tolerance
  if (!isNaN(Number(act)) && !isNaN(Number(exp)) && act !== '' && exp !== '') {
    if (Math.abs(Number(act) - Number(exp)) < 1e-4) return true;
  }

  // Structured JSON comparison
  try {
    const cleanA = act.replace(/'/g, '"').replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
    const cleanE = exp.replace(/'/g, '"').replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
    const parsedA = JSON.parse(cleanA);
    const parsedE = JSON.parse(cleanE);
    if (JSON.stringify(parsedA) === JSON.stringify(parsedE)) return true;
  } catch {}

  return false;
}

/**
 * Robust output comparator for algorithmic testcases.
 */
export function compareOutputs(actualRaw: string | null | undefined, expectedRaw: string | null | undefined): boolean {
  const actual = normalizeOutput(actualRaw);
  const expected = normalizeOutput(expectedRaw);

  if (actual === expected) return true;
  if (compareSingleLine(actual, expected)) return true;

  const linesA = actual.split('\n').map(l => l.trim()).filter(Boolean);
  const linesE = expected.split('\n').map(l => l.trim()).filter(Boolean);

  // If candidate printed debug lines before returning final result, evaluate the last line
  if (linesA.length > 1 && linesE.length === 1) {
    if (compareSingleLine(linesA[linesA.length - 1], linesE[0])) return true;
  }

  // Multi-line comparison
  if (linesA.length > 1 && linesA.length === linesE.length) {
    const allMatch = linesA.every((l, idx) => compareSingleLine(l, linesE[idx]));
    if (allMatch) return true;
  }

  return false;
}

/**
 * Judge0 Language ID Mapping
 */
const JUDGE0_LANGUAGE_MAP: Record<string, number> = {
  PYTHON: 71,       // Python 3.8.1
  PYTHON3: 71,
  JAVASCRIPT: 63,   // JavaScript (Node.js 12.14.0)
  NODE: 63,
  JAVA: 62,         // Java (OpenJDK 13.0.1)
  CPP: 54,          // C++ (GCC 9.2.0)
  C: 50,            // C (GCC 9.2.0)
  CSHARP: 51,       // C# (Mono 6.6.0.161)
  GO: 60            // Go (1.13.5)
};

/**
 * Execute code in real sandbox runtime (Judge0 CE / Piston / Local).
 */
export async function executeInSandbox(
  code: string,
  language: string,
  stdin: string = ''
): Promise<{ stdout: string; stderr: string; compileError?: string; status: string; executionTimeMs: number }> {
  const normLang = (language || 'PYTHON').toUpperCase();
  const langId = JUDGE0_LANGUAGE_MAP[normLang] || 71;

  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    const response = await fetch('https://ce.judge0.com/submissions?wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: langId,
        stdin: stdin || ''
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const data = await response.json();
    const executionTimeMs = Math.max(1, Date.now() - start);

    if (data.compile_output) {
      return {
        stdout: '',
        stderr: data.compile_output,
        compileError: data.compile_output,
        status: 'COMPILE_ERROR',
        executionTimeMs
      };
    }

    if (data.status?.id === 5) {
      return {
        stdout: '',
        stderr: 'Time Limit Exceeded (5.0s)',
        status: 'TIMEOUT',
        executionTimeMs: 5000
      };
    }

    if (data.stderr && data.status?.id !== 3) {
      return {
        stdout: data.stdout || '',
        stderr: data.stderr,
        status: 'RUNTIME_ERROR',
        executionTimeMs
      };
    }

    return {
      stdout: data.stdout || data.output || '',
      stderr: data.stderr || '',
      status: 'SUCCESS',
      executionTimeMs
    };
  } catch (err: any) {
    const duration = Math.max(1, Date.now() - start);
    // Primary Judge0 timed out or had issue, failover to Piston Sandbox API
    try {
      const PISTON_LANG_MAP: Record<string, string> = {
        PYTHON: 'python',
        PYTHON3: 'python',
        JAVASCRIPT: 'javascript',
        NODE: 'javascript',
        JAVA: 'java',
        CPP: 'c++',
        C: 'c',
        CSHARP: 'csharp',
        GO: 'go'
      };
      const PISTON_FILE_MAP: Record<string, string> = {
        PYTHON: 'main.py',
        PYTHON3: 'main.py',
        JAVASCRIPT: 'index.js',
        NODE: 'index.js',
        JAVA: 'Main.java',
        CPP: 'main.cpp',
        C: 'main.c',
        CSHARP: 'Program.cs',
        GO: 'main.go'
      };
      const pLang = PISTON_LANG_MAP[normLang] || 'python';
      const pFile = PISTON_FILE_MAP[normLang] || 'solution.txt';
      const pRes = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: pLang,
          version: '*',
          files: [{ name: pFile, content: code }],
          stdin: stdin || ''
        })
      });
      if (pRes.ok) {
        const pData = await pRes.json();
        const pDuration = Math.max(1, Date.now() - start);
        if (pData.compile && pData.compile.code !== 0) {
          const compErr = pData.compile.stderr || pData.compile.output || 'Compilation error';
          return {
            stdout: '',
            stderr: compErr,
            compileError: compErr,
            status: 'COMPILE_ERROR',
            executionTimeMs: pDuration
          };
        }
        if (pData.run) {
          const run = pData.run;
          const isErr = run.code !== 0 && run.stderr;
          return {
            stdout: (run.stdout || run.output || '').trim(),
            stderr: (run.stderr || '').trim(),
            status: isErr ? 'RUNTIME_ERROR' : 'SUCCESS',
            executionTimeMs: pDuration
          };
        }
      }
    } catch (pistonErr) {
      console.warn('Piston failover also encountered network issue:', pistonErr);
    }

    return {
      stdout: '',
      stderr: err.name === 'AbortError' ? 'Execution timed out (sandbox 6.5s)' : (err.message || 'Sandbox connection issue'),
      status: err.name === 'AbortError' ? 'TIMEOUT' : 'RUNTIME_ERROR',
      executionTimeMs: duration
    };
  }
}

/**
 * Execute a complete test suite against candidate code and validate with intelligent output matching.
 */
export async function runTestSuiteWithSandbox(
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<ExecutionOutcome> {
  if (!testCases || testCases.length === 0) {
    const single = await executeInSandbox(code, language, '');
    const isSuccess = single.status === 'SUCCESS';
    return {
      status: isSuccess ? 'SUCCESS' : (single.status as any),
      passedCases: isSuccess ? 1 : 0,
      totalCases: 1,
      executionTimeMs: single.executionTimeMs,
      consoleOutput: single.stdout || single.stderr || 'Executed dry run without testcases.',
      details: [
        {
          input: '(none)',
          expectedOutput: '(dry run)',
          actualOutput: single.stdout || single.stderr || '',
          passed: isSuccess,
          error: single.stderr || null
        }
      ]
    };
  }

  const details: TestCaseResult[] = [];
  let passedCount = 0;
  let totalTime = 0;
  let firstCompileError: string | null = null;
  let firstRuntimeError: string | null = null;
  let hasTimeout = false;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const exec = await executeInSandbox(code, language, tc.input);
    totalTime += exec.executionTimeMs;

    if (exec.status === 'COMPILE_ERROR') {
      firstCompileError = exec.compileError || exec.stderr || 'Compilation Failed';
      details.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: exec.stderr || 'Compilation error',
        passed: false,
        error: firstCompileError,
        executionTimeMs: exec.executionTimeMs
      });
      break; // Abort remaining cases on compile failure
    }

    if (exec.status === 'TIMEOUT') {
      hasTimeout = true;
      details.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: 'Time Limit Exceeded',
        passed: false,
        error: 'Execution exceeded 5000ms limit',
        executionTimeMs: 5000
      });
      continue;
    }

    if (exec.status === 'RUNTIME_ERROR') {
      firstRuntimeError = exec.stderr || 'Runtime Exception';
      details.push({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: exec.stderr || 'Runtime error',
        passed: false,
        error: firstRuntimeError,
        executionTimeMs: exec.executionTimeMs
      });
      continue;
    }

    const actual = exec.stdout;
    const isPassed = compareOutputs(actual, tc.expectedOutput);

    if (isPassed) {
      passedCount++;
    }

    details.push({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: actual.trim(),
      passed: isPassed,
      error: isPassed ? null : `Output mismatch. Expected: "${tc.expectedOutput}", Actual: "${actual.trim()}"`,
      executionTimeMs: exec.executionTimeMs
    });
  }

  let overallStatus: ExecutionOutcome['status'] = 'SUCCESS';
  if (firstCompileError) {
    overallStatus = 'COMPILE_ERROR';
  } else if (hasTimeout) {
    overallStatus = 'TIMEOUT';
  } else if (firstRuntimeError && passedCount === 0) {
    overallStatus = 'RUNTIME_ERROR';
  } else if (passedCount === testCases.length) {
    overallStatus = 'SUCCESS';
  } else {
    overallStatus = 'WRONG_ANSWER';
  }

  const logLines: string[] = [];
  if (firstCompileError) {
    logLines.push(`COMPILE ERROR:\n${firstCompileError}`);
  } else {
    logLines.push(`SANDBOX EXECUTION: ${passedCount}/${testCases.length} Test Cases Passed (${overallStatus})`);
    details.forEach((d, idx) => {
      logLines.push(`Test Case ${idx + 1}: ${d.passed ? 'PASSED ✓' : 'FAILED ✗'} (${d.executionTimeMs || 0}ms)`);
      if (!d.passed) {
        logLines.push(`  Input: ${d.input.replace(/\n/g, ' ')}`);
        logLines.push(`  Expected: ${d.expectedOutput}`);
        logLines.push(`  Actual: ${d.actualOutput}`);
      }
    });
  }

  return {
    status: overallStatus,
    passedCases: passedCount,
    totalCases: testCases.length,
    executionTimeMs: totalTime,
    consoleOutput: logLines.join('\n'),
    memoryUsedKb: 14200,
    details
  };
}
