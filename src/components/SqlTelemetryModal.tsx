import React, { useState, useEffect } from 'react';
import {
  Database,
  X,
  ExternalLink,
  Copy,
  Check,
  Code2,
  Table as TableIcon,
  Download,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { mysqlService, type CandidateSkillTelemetry } from '../lib/mysqlService';

interface SqlTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  sqlTableRows?: any[];
}

export const SqlTelemetryModal: React.FC<SqlTelemetryModalProps> = ({
  isOpen,
  onClose,
  username,
  sqlTableRows = []
}) => {
  const [activeTab, setActiveTab] = useState<'rows' | 'schema'>('rows');
  const [rows, setRows] = useState<CandidateSkillTelemetry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [schemaDdl, setSchemaDdl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  const tableLink = `/api/logs/table/candidate_skill_telemetry/${encodeURIComponent(username || 'candidate')}`;
  const fullEndpointUrl = `${window.location.origin}${tableLink}`;

  const fetchTelemetryData = async () => {
    setLoading(true);
    try {
      const data = await mysqlService.getUserSkillTelemetry(username);
      if (data && data.length > 0) {
        setRows(data);
      } else if (sqlTableRows && sqlTableRows.length > 0) {
        setRows(sqlTableRows);
      }
    } catch {
      if (sqlTableRows && sqlTableRows.length > 0) {
        setRows(sqlTableRows);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSchema = async () => {
    try {
      const res = await mysqlService.getSqlSchema();
      setSchemaDdl(res.schemaDdl);
    } catch {
      setSchemaDdl(`-- KODEXIS Dedicated SQL Relational Telemetry Table
CREATE TABLE IF NOT EXISTS candidate_skill_telemetry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    proficiency_level VARCHAR(50) NOT NULL,
    proficiency_score INT NOT NULL,
    problems_attempted INT NOT NULL DEFAULT 0,
    problems_passed INT NOT NULL DEFAULT 0,
    accuracy_percentage DOUBLE NOT NULL DEFAULT 0.0,
    avg_execution_time_ms DOUBLE DEFAULT 0.0,
    ai_behavior_score DOUBLE DEFAULT 75.0,
    identified_strengths TEXT,
    identified_weaknesses TEXT,
    ai_behavior_notes TEXT,
    visual_preference VARCHAR(50) DEFAULT 'BAR_CHART',
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_skill_telemetry_username (username),
    INDEX idx_skill_telemetry_topic (topic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTelemetryData();
      fetchSchema();
    }
  }, [isOpen, username]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullEndpointUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaDdl);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rows, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `candidate_skill_telemetry_${username}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30';
      case 'STRONG':
        return 'text-brand-violet bg-brand-violet/10 border-brand-violet/30';
      case 'INTERMEDIATE':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'DEVELOPING':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-5xl rounded-2xl border border-cyan-500/30 bg-zinc-950/95 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-border/80 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Database size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-mono font-bold text-zinc-100 uppercase tracking-wide">
                  MySQL Relational Telemetry Storage
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  InnoDB • UTF8MB4
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                Dedicated SQL Table: <span className="text-cyan-400 font-semibold">candidate_skill_telemetry</span> (Candidate: <span className="text-zinc-200">{username}</span>)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchTelemetryData}
              disabled={loading}
              title="Refresh SQL Rows"
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* API LINK & STATS STRIP */}
        <div className="px-5 py-3 bg-zinc-900/40 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider shrink-0">Direct SQL Table Link:</span>
            <code className="text-cyan-300 bg-zinc-950 px-2.5 py-1 rounded border border-cyan-500/20 truncate text-[11px]">
              {tableLink}
            </code>
            <button
              onClick={handleCopyLink}
              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 shrink-0 transition"
              title="Copy endpoint link"
            >
              {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
            <a
              href={fullEndpointUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0 transition"
              title="Open raw JSON API in new tab"
            >
              <ExternalLink size={13} />
            </a>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] text-zinc-400">
              <strong className="text-zinc-200">{rows.length}</strong> Relational Rows Tracked
            </span>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] border border-zinc-700 transition"
            >
              <Download size={12} />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="px-5 pt-3 border-b border-border/40 flex items-center space-x-4 bg-zinc-950/40">
          <button
            onClick={() => setActiveTab('rows')}
            className={`pb-2.5 px-1 font-mono text-xs font-bold flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'rows'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <TableIcon size={14} />
            <span>Candidate Relational Rows ({rows.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 px-1 font-mono text-xs font-bold flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'schema'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Code2 size={14} />
            <span>Dedicated SQL Schema DDL</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-auto p-5">
          {activeTab === 'rows' ? (
            <div className="border border-border/70 rounded-xl overflow-hidden bg-zinc-950">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-zinc-300">
                  <thead className="bg-zinc-900/90 text-zinc-400 uppercase text-[10px] border-b border-border/80">
                    <tr>
                      <th className="p-3">Topic / Category</th>
                      <th className="p-3">Proficiency</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Accuracy</th>
                      <th className="p-3">Attempts / Pass</th>
                      <th className="p-3">AI Identified Strengths</th>
                      <th className="p-3">AI Focus / Weakness</th>
                      <th className="p-3">AI Behavior Telemetry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {rows.length > 0 ? (
                      rows.map((row: any, idx: number) => {
                        const score = row.proficiencyScore ?? row.score ?? 0;
                        const level = row.proficiencyLevel ?? 'DEVELOPING';
                        const accuracy = row.accuracyPercentage != null ? `${Math.round(row.accuracyPercentage)}%` : `${score}%`;
                        const attempts = row.problemsAttempted ?? row.attempts ?? 1;
                        const passed = row.problemsPassed ?? row.passed ?? (score >= 60 ? 1 : 0);

                        return (
                          <tr key={row.id || idx} className="hover:bg-cyan-500/5 transition">
                            <td className="p-3 font-bold text-zinc-100 flex items-center gap-2">
                              <Cpu size={13} className="text-cyan-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{row.topic}</span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadge(level)}`}>
                                {level}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-cyan-400">{score}%</span>
                            </td>
                            <td className="p-3 text-emerald-400 font-semibold">{accuracy}</td>
                            <td className="p-3 text-zinc-400">
                              {attempts} att / <span className="text-emerald-400">{passed} pass</span>
                            </td>
                            <td className="p-3 text-zinc-300 text-[11px] max-w-xs truncate" title={row.identifiedStrengths || row.strengths}>
                              {row.identifiedStrengths || row.strengths || 'Optimal algorithm complexity'}
                            </td>
                            <td className="p-3 text-amber-400/90 text-[11px] max-w-xs truncate" title={row.identifiedWeaknesses || row.weaknesses}>
                              {row.identifiedWeaknesses || row.weaknesses || 'Edge case testing coverage'}
                            </td>
                            <td className="p-3 text-zinc-400 text-[11px] max-w-xs truncate" title={row.aiBehaviorNotes}>
                              {row.aiBehaviorNotes || 'Live AI telemetry calibrated'}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-zinc-500">
                          No rows found in candidate_skill_telemetry for candidate {username}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400">
                  MySQL InnoDB Table Specification & Indexes
                </span>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs border border-zinc-700 transition"
                >
                  {copiedSchema ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copiedSchema ? 'Copied' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                {schemaDdl}
              </pre>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-border/80 bg-zinc-900/60 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dedicated MySQL Table Storage • Zero Data Duplicacy</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition font-bold"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
