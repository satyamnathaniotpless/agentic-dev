#!/usr/bin/env node
/**
 * agentic-dev MCP Server
 * Provides spec validation, AC coverage checking, telemetry logging,
 * and spec scaffolding tools to all agents in the pipeline.
 */
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const TOOLS = {

  validate_feature_spec: {
    description: "Validate a Feature Spec has all 7 required sections and ACs meet testability standards. Returns a list of issues found.",
    inputSchema: {
      type: "object",
      properties: {
        spec_content: { type: "string", description: "The full Feature Spec markdown content" }
      },
      required: ["spec_content"]
    }
  },

  check_ac_coverage: {
    description: "Check that every AC in the Feature Spec is covered by at least one Task Spec sub-issue. Returns uncovered ACs.",
    inputSchema: {
      type: "object",
      properties: {
        feature_spec_content: { type: "string", description: "The Feature Spec markdown" },
        task_specs: {
          type: "array",
          items: { type: "string" },
          description: "Array of Task Spec markdown strings (one per sub-issue)"
        }
      },
      required: ["feature_spec_content", "task_specs"]
    }
  },

  scaffold_feature_spec: {
    description: "Generate a blank Feature Spec template pre-filled with section headers. Use at the start of PM Agent work.",
    inputSchema: {
      type: "object",
      properties: {
        feature_name: { type: "string" },
        issue_id: { type: "string" },
        has_api: { type: "boolean", description: "Whether the feature has API endpoints" },
        has_ui: { type: "boolean", description: "Whether the feature has UI components" },
        has_db_changes: { type: "boolean", description: "Whether the feature changes the database schema" }
      },
      required: ["feature_name", "issue_id"]
    }
  },

  scaffold_task_spec: {
    description: "Generate a blank Task Spec template for a specific worker type.",
    inputSchema: {
      type: "object",
      properties: {
        parent_id: { type: "string" },
        sub_issue_id: { type: "string" },
        worker_type: {
          type: "string",
          enum: ["Backend", "Frontend", "DB", "Tests", "Infrastructure", "Docs"]
        },
        covers_acs: {
          type: "array",
          items: { type: "string" },
          description: "List of AC IDs this task covers, e.g. ['AC-1', 'AC-3']"
        }
      },
      required: ["parent_id", "sub_issue_id", "worker_type"]
    }
  },

  log_pipeline_event: {
    description: "Log a structured pipeline event for the Retrospective Agent to analyse. Call at every gate transition and escalation.",
    inputSchema: {
      type: "object",
      properties: {
        issue_id: { type: "string" },
        event_type: {
          type: "string",
          enum: ["gate_pass", "gate_fail", "escalation", "escalation_resolved", "ac_fail", "security_blocker", "critical_finding", "deployment_fail", "deployment_success"]
        },
        phase: { type: "string" },
        agent: { type: "string" },
        gate_number: { type: "number" },
        detail: { type: "string", description: "Human-readable detail about the event" }
      },
      required: ["issue_id", "event_type", "phase", "agent"]
    }
  },

  validate_task_spec: {
    description: "Check a Task Spec has all required fields filled (no empty sections, no placeholders, all file paths specified).",
    inputSchema: {
      type: "object",
      properties: {
        task_spec_content: { type: "string" },
        worker_type: {
          type: "string",
          enum: ["Backend", "Frontend", "DB", "Tests", "Infrastructure", "Docs"]
        }
      },
      required: ["task_spec_content", "worker_type"]
    }
  }

};

// ─── TOOL IMPLEMENTATIONS ────────────────────────────────────────────────────

function validateFeatureSpec(specContent) {
  const issues = [];
  const requiredSections = [
    { marker: '## 1.', name: 'Problem Statement' },
    { marker: '## 2.', name: 'User Stories' },
    { marker: '## 3.', name: 'Acceptance Criteria' },
    { marker: '## 4.', name: 'Out of Scope' },
    { marker: '## 5.', name: 'API Contract' },
    { marker: '## 6.', name: 'UI State Specification' },
    { marker: '## 7.', name: 'Data Model Changes' },
  ];

  // Check sections present
  for (const section of requiredSections) {
    if (!specContent.includes(section.marker)) {
      issues.push({ type: 'BLOCKER', section: section.name, message: `Section "${section.name}" is missing` });
    }
  }

  // Check for TBD markers
  const tbdMatches = specContent.match(/\bTBD\b|\btodo\b|\bfixme\b|\bplaceholder\b/gi) || [];
  if (tbdMatches.length > 0) {
    issues.push({ type: 'BLOCKER', section: 'General', message: `Found ${tbdMatches.length} placeholder(s): TBD/TODO/FIXME/placeholder — all sections must be complete` });
  }

  // Extract and validate ACs
  const acMatches = specContent.match(/AC-\d+[^:]*:\s*\n.*?Given.*?\n.*?When.*?\n.*?Then(.*?)(?=\n\n|AC-\d+|##|$)/gs) || [];
  const subjectiveWords = ['quickly', 'fast', 'slow', 'good', 'bad', 'better', 'improved', 'acceptable', 'correctly', 'properly', 'efficient', 'seamless'];

  for (const ac of acMatches) {
    const thenMatch = ac.match(/Then(.*)/s);
    if (thenMatch) {
      const thenClause = thenMatch[1].toLowerCase();
      for (const word of subjectiveWords) {
        if (thenClause.includes(word)) {
          issues.push({ type: 'BLOCKER', section: 'Acceptance Criteria', message: `Subjective language "${word}" found in Then clause — must be replaced with measurable outcome` });
        }
      }
      if ((thenClause.match(/ and /g) || []).length > 0) {
        issues.push({ type: 'BLOCKER', section: 'Acceptance Criteria', message: 'AC Then clause contains "and" — split into separate ACs' });
      }
    }
  }

  return {
    valid: issues.filter(i => i.type === 'BLOCKER').length === 0,
    blockers: issues.filter(i => i.type === 'BLOCKER'),
    warnings: issues.filter(i => i.type === 'WARNING'),
    total_issues: issues.length
  };
}

function checkAcCoverage(featureSpecContent, taskSpecs) {
  // Extract AC IDs from feature spec
  const featureACs = [...featureSpecContent.matchAll(/\*\*?(AC-\d+)\*\*?/g)].map(m => m[1]);
  const uniqueFeatureACs = [...new Set(featureACs)];

  // Extract AC IDs from all task specs
  const coveredACs = new Set();
  for (const taskSpec of taskSpecs) {
    const covered = [...taskSpec.matchAll(/AC-\d+/g)].map(m => m[0]);
    covered.forEach(ac => coveredACs.add(ac));
  }

  const uncoveredACs = uniqueFeatureACs.filter(ac => !coveredACs.has(ac));

  return {
    feature_spec_acs: uniqueFeatureACs,
    covered_acs: [...coveredACs].filter(ac => uniqueFeatureACs.includes(ac)),
    uncovered_acs: uncoveredACs,
    coverage_complete: uncoveredACs.length === 0,
    message: uncoveredACs.length === 0
      ? `All ${uniqueFeatureACs.length} ACs are covered across ${taskSpecs.length} task specs.`
      : `Gate 4 FAIL: ${uncoveredACs.join(', ')} are not covered by any task spec.`
  };
}

function scaffoldFeatureSpec({ feature_name, issue_id, has_api = true, has_ui = true, has_db_changes = true }) {
  return `# Feature Spec: ${feature_name}
**Linear Issue:** ${issue_id}
**Version:** 1.0
**Status:** Draft

## 1. Problem Statement
[One paragraph. User perspective only. No solution references. No technical details.
A non-technical stakeholder must understand the 'why' from this paragraph alone.]

## 2. User Stories
- US-1: As a [role], I want [goal] so that [benefit].

## 3. Acceptance Criteria
**AC-1** (covers US-1):
  Given [precondition]
  When [action]
  Then [single observable outcome — no "and", no subjective language]

## 4. Out of Scope
- [Item explicitly excluded]: [reason it is excluded]

${has_api ? `## 5. API Contract
[METHOD] [/path/to/endpoint]
Auth: [Bearer token / public]
Rate limit: [N req/min per tenant]

Request:
  field_name: Type (required/optional, constraints)

Response 200:
  field_name: Type

Response 400: { error: "ERROR_CODE", message: "...", field: "field_name|null" }
Response 401: { error: "UNAUTHORIZED" }
Response 403: { error: "FORBIDDEN" }
Response 404: { error: "NOT_FOUND_CODE" }
` : `## 5. API Contract
N/A — no API changes.
`}

${has_ui ? `## 6. UI State Specification
**Loading state:**
  Visible: [what user sees]

**Empty state:**
  Visible: [what user sees]
  Available actions: [what user can do]

**Error state:**
  Visible: [error message text — exact wording]
  Available actions: [recovery action]

**Success state:**
  Visible: [what user sees]
` : `## 6. UI State Specification
N/A — no UI changes.
`}

${has_db_changes ? `## 7. Data Model Changes
Table: [table_name]  Operation: CREATE / ALTER
  column_name: TYPE NOT NULL [DEFAULT value]
  index_name: INDEX ON (column_name) [UNIQUE]

Migration strategy: additive
Rollback: ALTER TABLE [table_name] DROP COLUMN [column_name];
` : `## 7. Data Model Changes
N/A — no schema changes.
`}`;
}

function scaffoldTaskSpec({ parent_id, sub_issue_id, worker_type, covers_acs = [] }) {
  const acList = covers_acs.length > 0 ? covers_acs.join(', ') : 'AC-[N]';

  return `# Task Spec: ${sub_issue_id} ${worker_type}: [Description]

**Parent:** ${parent_id}
**Worker:** ${worker_type}
**Covers ACs:** ${acList}
**Depends on:** [sub-issue ID] | none

## Target Files
CREATE: path/to/NewFile.ext
MODIFY: path/to/ExistingFile.ext  [reason: what changes]

## Implementation Spec

${worker_type === 'DB' ? `### Migration: V[N]__[description].sql

**Changes:**
  - CREATE TABLE / ALTER TABLE / ADD INDEX [description]

**Each change:**
  column_name: TYPE NOT NULL [constraints]

**Access patterns supported:**
  - [query that needs this index/column]

**Migration strategy:** additive
**Rollback SQL:**
  [reverse SQL statements]
` : ''}
${worker_type === 'Backend' ? `### MethodName(ParamType param): ReturnType

**Validation:**
  - param: @NotNull | max 255 chars | must belong to current tenant

**Happy path:**
  [2-3 sentences describing the correct execution flow]

**Error cases:**
  - [condition] → XxxException (HTTP 404, code: "NOT_FOUND")
  - [condition] → XxxException (HTTP 400, code: "VALIDATION_ERROR")
  - [condition] → ExternalApiException (HTTP 502, retryable: true)
` : ''}
${worker_type === 'Frontend' ? `### ComponentName({ prop: PropType }): ReactNode

**States:**
  - loading: [what renders]
  - empty: [what renders]
  - error: [error message text]
  - success: [what renders]

**Props:**
  - prop: Type — [description, required/optional]

**Behaviour:**
  [Description of interactions and state transitions]
` : ''}
${worker_type === 'Tests' ? `### Test Class: [ClassName]Test

**AC mapping:**
${covers_acs.map(ac => `  - ${ac}: test[Entity]_${ac.replace('-','')}_[description]`).join('\n')}

**Test structure:**
  [Describe mock setup, test data, assertion pattern]
` : ''}

## Pattern References
Read before implementing: path/to/PatternFile.ext
Follow specifically: ClassName.methodName

## Completeness Checklist
- [ ] All target paths verified as real
- [ ] All signatures/props complete (no "etc." or vague descriptions)
- [ ] All error cases specified
- [ ] All ACs mapped
- [ ] Pattern references verified as real files
- [ ] Dependencies correctly sequenced`;
}

function validateTaskSpec(taskSpecContent, workerType) {
  const issues = [];

  // Check required sections
  if (!taskSpecContent.includes('## Target Files')) {
    issues.push({ type: 'BLOCKER', field: 'Target Files', message: 'Missing Target Files section' });
  }
  if (!taskSpecContent.includes('## Implementation Spec')) {
    issues.push({ type: 'BLOCKER', field: 'Implementation Spec', message: 'Missing Implementation Spec section' });
  }
  if (!taskSpecContent.includes('## Pattern References')) {
    issues.push({ type: 'BLOCKER', field: 'Pattern References', message: 'Missing Pattern References section' });
  }
  if (!taskSpecContent.includes('Covers ACs:')) {
    issues.push({ type: 'BLOCKER', field: 'AC Coverage', message: 'Missing "Covers ACs:" field' });
  }

  // Check for placeholder content
  const placeholders = taskSpecContent.match(/\[.*?\]/g) || [];
  const unfilled = placeholders.filter(p => {
    const clean = p.replace(/[\[\]]/g, '').toLowerCase();
    return clean.includes('description') || clean.includes('reason') || clean.includes('method') || clean.includes('path') || clean.includes('type') || clean.includes('name');
  });
  if (unfilled.length > 0) {
    issues.push({ type: 'BLOCKER', field: 'Completeness', message: `${unfilled.length} placeholder(s) still unfilled: ${unfilled.slice(0,3).join(', ')}${unfilled.length > 3 ? '...' : ''}` });
  }

  // Check completeness checklist
  const unchecked = (taskSpecContent.match(/- \[ \]/g) || []).length;
  if (unchecked > 0) {
    issues.push({ type: 'BLOCKER', field: 'Completeness Checklist', message: `${unchecked} checklist item(s) still unchecked` });
  }

  return {
    valid: issues.filter(i => i.type === 'BLOCKER').length === 0,
    blockers: issues.filter(i => i.type === 'BLOCKER'),
    total_issues: issues.length
  };
}

function logPipelineEvent({ issue_id, event_type, phase, agent, gate_number, detail }) {
  const logDir = path.join(process.cwd(), '.agentic-dev', 'telemetry');
  try {
    fs.mkdirSync(logDir, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const entry = JSON.stringify({
      issue_id, event_type, phase, agent,
      gate_number: gate_number || null,
      detail: detail || '',
      timestamp: new Date().toISOString()
    }) + '\n';
    fs.appendFileSync(path.join(logDir, `${date}.jsonl`), entry);
    return { logged: true, file: `${date}.jsonl` };
  } catch (e) {
    return { logged: false, error: e.message };
  }
}

// ─── MCP STDIO TRANSPORT ─────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin });

rl.on('line', (line) => {
  let msg;
  try { msg = JSON.parse(line); } catch { return; }

  let response;

  if (msg.method === 'initialize') {
    response = {
      jsonrpc: '2.0', id: msg.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'agentic-dev', version: '1.0.0' }
      }
    };
  } else if (msg.method === 'tools/list') {
    response = {
      jsonrpc: '2.0', id: msg.id,
      result: {
        tools: Object.entries(TOOLS).map(([name, def]) => ({
          name,
          description: def.description,
          inputSchema: def.inputSchema
        }))
      }
    };
  } else if (msg.method === 'tools/call') {
    const { name, arguments: args } = msg.params;
    let result;

    try {
      switch (name) {
        case 'validate_feature_spec':
          result = validateFeatureSpec(args.spec_content);
          break;
        case 'check_ac_coverage':
          result = checkAcCoverage(args.feature_spec_content, args.task_specs);
          break;
        case 'scaffold_feature_spec':
          result = { template: scaffoldFeatureSpec(args) };
          break;
        case 'scaffold_task_spec':
          result = { template: scaffoldTaskSpec(args) };
          break;
        case 'log_pipeline_event':
          result = logPipelineEvent(args);
          break;
        case 'validate_task_spec':
          result = validateTaskSpec(args.task_spec_content, args.worker_type);
          break;
        default:
          result = { error: `Unknown tool: ${name}` };
      }
    } catch (e) {
      result = { error: e.message };
    }

    response = {
      jsonrpc: '2.0', id: msg.id,
      result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    };
  } else {
    response = { jsonrpc: '2.0', id: msg.id, result: {} };
  }

  process.stdout.write(JSON.stringify(response) + '\n');
});
