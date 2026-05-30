/**
 * Tiny parser for the `flowchart` subset of mermaid syntax used in our wiki.
 *
 * Supports just enough to render every diagram we author by hand:
 *   - direction:  flowchart TD | LR | BT | RL
 *   - nodes:      id[Label] | id(Label) | id((Label)) | id[(Label)] | id{Label}
 *   - edges:      A --> B, A -.-> B (dashed), A --- B (no arrow)
 *   - edge label: A -->|label| B
 *   - implicit node declarations on either side of an edge
 *
 * Returns a structured graph for downstream rendering (React Flow + dagre),
 * or `null` if it can't confidently parse the source — caller should fall
 * back to the mermaid renderer in that case.
 */

export type FlowDirection = 'TB' | 'LR' | 'BT' | 'RL';
export type NodeShape = 'rect' | 'round' | 'circle' | 'cylinder' | 'diamond';

export interface ParsedNode {
  id: string;
  label: string;
  shape: NodeShape;
}

export interface ParsedEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
  noArrow?: boolean;
}

export interface ParsedFlow {
  direction: FlowDirection;
  nodes: ParsedNode[];
  edges: ParsedEdge[];
}

// Leading `id` of a node token.
const NODE_ID = /^([A-Za-z_][\w-]*)/;
// Bracket pairs, longest-open-first so `[(` beats `[` and `((` beats `(`.
const SHAPE_BRACKETS: { open: string; close: string; shape: NodeShape }[] = [
  { open: '[(', close: ')]', shape: 'cylinder' },
  { open: '((', close: '))', shape: 'circle' },
  { open: '[', close: ']', shape: 'rect' },
  { open: '(', close: ')', shape: 'round' },
  { open: '{', close: '}', shape: 'diamond' },
];

/** Parsed node plus whether it came from a real `id[...]` declaration (vs a
 *  bare `id` reference). `declared` lets a later declaration replace a bare
 *  ref without a fragile label===id heuristic. */
interface ParsedNodeDecl extends ParsedNode {
  declared: boolean;
}

/** Normalize a node label: strip mermaid's optional wrapping double-quotes and
 *  collapse `<br/>` line breaks (React Flow renders plain text, so a literal
 *  tag would otherwise show through). */
function cleanLabel(raw: string): string {
  let s = raw.trim();
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
  s = s.replace(/<br\s*\/?>/gi, ' ');
  return s.trim();
}

function tryParseNode(token: string): ParsedNodeDecl | null {
  const idMatch = NODE_ID.exec(token);
  if (!idMatch) return null;
  const id = idMatch[1];
  const rest = token.slice(id.length);
  // Bare reference: just the id, no brackets.
  if (rest === '') return { id, label: id, shape: 'rect', declared: false };
  // Match the bracket pair by exact open prefix + close suffix, so labels are
  // free to contain `(`/`)` (e.g. `BB[(Blackboard (shared))]`).
  for (const { open, close, shape } of SHAPE_BRACKETS) {
    if (
      rest.length >= open.length + close.length &&
      rest.startsWith(open) &&
      rest.endsWith(close)
    ) {
      const label = cleanLabel(rest.slice(open.length, rest.length - close.length));
      if (label.length === 0) continue;
      return { id, label, shape, declared: true };
    }
  }
  return null;
}

/** Split a line at the connector while keeping bracketed labels intact. */
function splitOnConnector(
  line: string,
): { left: string; conn: string; label?: string; right: string } | null {
  // Iterate so brackets aren't split across.
  // Connectors: `<-->`/`<-.->` (bidirectional), `-.->`, `-->`, `---`, `-.-`.
  // Bidirectional forms are listed first so `<-->` wins over `-->`.
  const re = /\s*(<-{2,3}>|<-\.+>|-{2,3}>|-\.+>|-{2,3}|-\.+-)\s*/g;
  let depth = 0;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '[' || c === '(' || c === '{') depth++;
    else if (c === ']' || c === ')' || c === '}') depth--;
    if (depth !== 0) continue;
    re.lastIndex = i;
    const m = re.exec(line);
    if (!m || m.index !== i) continue;
    const left = line.slice(0, i).trim();
    let after = line.slice(re.lastIndex);
    let label: string | undefined;
    // Optional `|label|` after the connector.
    const labelMatch = /^\|([^|]+)\|\s*/.exec(after);
    if (labelMatch) {
      label = labelMatch[1].trim();
      after = after.slice(labelMatch[0].length);
    }
    return { left, conn: m[1], label, right: after.trim() };
  }
  return null;
}

function parseDirection(token: string): FlowDirection | null {
  switch (token.toUpperCase()) {
    case 'TD':
    case 'TB':
      return 'TB';
    case 'LR':
      return 'LR';
    case 'BT':
      return 'BT';
    case 'RL':
      return 'RL';
    default:
      return null;
  }
}

export function parseFlowchart(source: string): ParsedFlow | null {
  const lines = source.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('%%'));
  if (lines.length === 0) return null;

  let direction: FlowDirection = 'TB';
  let startIdx = 0;
  const head = lines[0].match(/^(?:flowchart|graph)\s+(\w+)/i);
  if (head) {
    const dir = parseDirection(head[1]);
    if (!dir) return null;
    direction = dir;
    startIdx = 1;
  }

  const nodes = new Map<string, ParsedNodeDecl>();
  const edges: ParsedEdge[] = [];

  function recordNode(token: string): string | null {
    const n = tryParseNode(token);
    if (!n) return null;
    // First real declaration wins for label/shape; a real `id[...]` declaration
    // replaces a prior bare `id` reference, but bare refs never overwrite a
    // declaration — even one whose author chose a label equal to its id.
    const existing = nodes.get(n.id);
    if (!existing || (!existing.declared && n.declared)) {
      nodes.set(n.id, n);
    }
    return n.id;
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    const parts = splitOnConnector(line);
    if (parts) {
      const a = recordNode(parts.left);
      const b = recordNode(parts.right);
      if (!a || !b) return null;
      edges.push({
        id: `e-${a}-${b}-${edges.length}`,
        source: a,
        target: b,
        label: parts.label,
        dashed: parts.conn.includes('.'),
        noArrow: !parts.conn.includes('>'),
      });
      continue;
    }
    // Standalone node declaration.
    if (recordNode(line) == null) return null;
  }

  if (nodes.size === 0) return null;
  return { direction, nodes: [...nodes.values()], edges };
}
