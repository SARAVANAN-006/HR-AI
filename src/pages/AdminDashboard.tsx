import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Database, Plus, Trash2, Edit2, Code, Activity } from 'lucide-react';

interface TestCase {
  id?: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface Question {
  id?: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string;
  expectedTimeComplexity: string;
  expectedSpaceComplexity: string;
  optimalSolutionConcept: string;
  javaTemplate: string;
  pythonTemplate: string;
  javascriptTemplate: string;
  testCases: TestCase[];
}

const AdminDashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form States for creating/updating
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [topic, setTopic] = useState('Arrays');
  const [expectedTimeComplexity, setExpectedTimeComplexity] = useState('O(n)');
  const [expectedSpaceComplexity, setExpectedSpaceComplexity] = useState('O(1)');
  const [optimalSolutionConcept, setOptimalSolutionConcept] = useState('');
  const [javaTemplate, setJavaTemplate] = useState('');
  const [pythonTemplate, setPythonTemplate] = useState('');
  const [javascriptTemplate, setJavascriptTemplate] = useState('');
  
  // Test cases states
  const [tc1Input, setTc1Input] = useState('');
  const [tc1Output, setTc1Output] = useState('');
  const [tc2Input, setTc2Input] = useState('');
  const [tc2Output, setTc2Output] = useState('');

  const loadQuestions = () => {
    setLoading(true);
    axios.get('/api/admin/questions')
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load questions:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !topic) {
      alert("Please fill in key question details.");
      return;
    }

    const payload: Question = {
      title,
      description,
      difficulty,
      topic,
      expectedTimeComplexity,
      expectedSpaceComplexity,
      optimalSolutionConcept,
      javaTemplate,
      pythonTemplate,
      javascriptTemplate,
      testCases: [
        { input: tc1Input, expectedOutput: tc1Output, isHidden: false },
        { input: tc2Input, expectedOutput: tc2Output, isHidden: true }
      ]
    };

    try {
      if (editId) {
        await axios.put(`/api/admin/questions/${editId}`, payload);
      } else {
        await axios.post('/api/admin/questions', payload);
      }
      resetForm();
      loadQuestions();
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question. Check logs.');
    }
  };

  const handleEdit = (q: Question) => {
    setIsEditing(true);
    setEditId(q.id || null);
    setTitle(q.title);
    setDescription(q.description);
    setDifficulty(q.difficulty);
    setTopic(q.topic);
    setExpectedTimeComplexity(q.expectedTimeComplexity || 'O(n)');
    setExpectedSpaceComplexity(q.expectedSpaceComplexity || 'O(1)');
    setOptimalSolutionConcept(q.optimalSolutionConcept || '');
    setJavaTemplate(q.javaTemplate || '');
    setPythonTemplate(q.pythonTemplate || '');
    setJavascriptTemplate(q.javascriptTemplate || '');
    
    // Seed test cases in form inputs
    if (q.testCases && q.testCases.length >= 2) {
      setTc1Input(q.testCases[0].input);
      setTc1Output(q.testCases[0].expectedOutput);
      setTc2Input(q.testCases[1].input);
      setTc2Output(q.testCases[1].expectedOutput);
    } else {
      setTc1Input('');
      setTc1Output('');
      setTc2Input('');
      setTc2Output('');
    }
  };

  const handleDelete = async (qid: number) => {
    if (!window.confirm("Permanently delete this question and all its test cases?")) return;
    try {
      await axios.delete(`/api/admin/questions/${qid}`);
      loadQuestions();
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setTitle('');
    setDescription('');
    setDifficulty('MEDIUM');
    setTopic('Arrays');
    setExpectedTimeComplexity('O(n)');
    setExpectedSpaceComplexity('O(1)');
    setOptimalSolutionConcept('');
    setJavaTemplate('');
    setPythonTemplate('');
    setJavascriptTemplate('');
    setTc1Input('');
    setTc1Output('');
    setTc2Input('');
    setTc2Output('');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* HEADER */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono text-zinc-100 uppercase flex items-center gap-2">
            <Shield className="text-red-400" size={20} />
            Administrator Laboratory Console
          </h2>
          <p className="text-xs text-zinc-400 font-mono">Telemetry database controls and grading properties</p>
        </div>
      </div>

      {/* METRIC READOUT STRIPS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        {[
          { label: 'Active Sandboxes', val: '5 ONLINE', color: 'text-brand-cyan border-brand-cyan/20 bg-brand-cyan/5' },
          { label: 'Total Questions Seeding', val: questions.length + ' SEEDED', color: 'text-brand-violet border-brand-violet/20 bg-brand-violet/5' },
          { label: 'Scoring Weights', val: 'Multi-Factor v1.0', color: 'text-zinc-300 border-zinc-700/60 bg-zinc-900/40' },
          { label: 'System Lockout', val: 'Standard CORS Enabled', color: 'text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5' }
        ].map((m, i) => (
          <div key={i} className={`p-4 border rounded ${m.color}`}>
            <span className="text-[9px] text-zinc-500 uppercase block">{m.label}</span>
            <span className="text-sm font-bold block mt-1">{m.val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* QUESTIONS LIST */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database size={14} /> Seeding Question Bank
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-brand-cyan text-background font-mono font-bold text-[10px] rounded hover:bg-brand-cyan/90 transition"
              >
                <Plus size={10} />
                <span>Add Question</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center p-8 font-mono text-xs text-zinc-500">Querying entries...</div>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {questions.map((q) => (
                <div key={q.id} className="p-4 border border-border bg-background-panel rounded flex justify-between items-start gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-zinc-200 truncate">{q.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        q.difficulty === 'EASY' ? 'text-green-400 bg-green-500/10' :
                        q.difficulty === 'MEDIUM' ? 'text-brand-cyan bg-brand-cyan/10' : 'text-brand-violet bg-brand-violet/10'
                      }`}>{q.difficulty}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500">Topic: {q.topic} | Time: {q.expectedTimeComplexity} | Space: {q.expectedSpaceComplexity}</p>
                  </div>
                  <div className="flex space-x-2 shrink-0">
                    <button
                      onClick={() => handleEdit(q)}
                      className="p-1.5 border border-border hover:bg-zinc-800 text-zinc-400 hover:text-brand-cyan rounded transition"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id || 0)}
                      className="p-1.5 border border-border hover:bg-red-500/15 text-zinc-400 hover:text-red-400 rounded transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDITOR FORM */}
        <div className="lg:col-span-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="border border-border bg-background-panel rounded p-6 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-border pb-3 mb-2">
                <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                  <Code size={14} className="text-brand-cyan" />
                  {editId ? 'UPDATE QUESTION DETAILS' : 'CREATE NEW QUESTION'}
                </span>
                <button type="button" onClick={resetForm} className="text-[10px] text-zinc-500 hover:text-zinc-300">
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Question Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Three Sum"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-brand-cyan"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Topic Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stacks"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-brand-cyan"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase">Markdown Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Specify problem description details, input formats, and constraints..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-zinc-200 focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-background border border-border rounded px-2 py-2 text-zinc-200 focus:outline-none focus:border-brand-cyan"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Exp. Time</label>
                  <input
                    type="text"
                    placeholder="O(n)"
                    value={expectedTimeComplexity}
                    onChange={(e) => setExpectedTimeComplexity(e.target.value)}
                    className="w-full bg-background border border-border rounded px-2 py-2 text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Exp. Space</label>
                  <input
                    type="text"
                    placeholder="O(1)"
                    value={expectedSpaceComplexity}
                    onChange={(e) => setExpectedSpaceComplexity(e.target.value)}
                    className="w-full bg-background border border-border rounded px-2 py-2 text-zinc-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase">Optimal Solution Concept</label>
                <input
                  type="text"
                  placeholder="Explain optimal data structure mechanics..."
                  value={optimalSolutionConcept}
                  onChange={(e) => setOptimalSolutionConcept(e.target.value)}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-zinc-200 focus:outline-none"
                />
              </div>

              {/* Boilerplate text fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Python Template Boilerplate</label>
                  <textarea
                    rows={3}
                    placeholder="def solution()..."
                    value={pythonTemplate}
                    onChange={(e) => setPythonTemplate(e.target.value)}
                    className="w-full bg-background border border-border rounded p-2 text-[10px] text-zinc-300 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Java Template Boilerplate</label>
                  <textarea
                    rows={3}
                    placeholder="public class Main..."
                    value={javaTemplate}
                    onChange={(e) => setJavaTemplate(e.target.value)}
                    className="w-full bg-background border border-border rounded p-2 text-[10px] text-zinc-300 font-mono"
                  />
                </div>
              </div>

              {/* TEST CASE SUBSECTION */}
              <div className="border border-border/80 bg-zinc-950/20 p-3 rounded space-y-2">
                <p className="text-[9px] uppercase font-bold text-zinc-500">TEST CASES CONFIGURATION (Seeding 2 Cases)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] text-zinc-500 uppercase">Case 1 Input (Public)</label>
                    <input
                      type="text"
                      placeholder="e.g. 9\n2,7,11"
                      value={tc1Input}
                      onChange={(e) => setTc1Input(e.target.value)}
                      className="w-full bg-background border border-border rounded p-1 text-[10px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-zinc-500 uppercase">Case 1 Expected Output</label>
                    <input
                      type="text"
                      placeholder="0,1"
                      value={tc1Output}
                      onChange={(e) => setTc1Output(e.target.value)}
                      className="w-full bg-background border border-border rounded p-1 text-[10px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] text-zinc-500 uppercase">Case 2 Input (Hidden)</label>
                    <input
                      type="text"
                      placeholder="e.g. 6\n3,3"
                      value={tc2Input}
                      onChange={(e) => setTc2Input(e.target.value)}
                      className="w-full bg-background border border-border rounded p-1 text-[10px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-zinc-500 uppercase">Case 2 Expected Output</label>
                    <input
                      type="text"
                      placeholder="0,1"
                      value={tc2Output}
                      onChange={(e) => setTc2Output(e.target.value)}
                      className="w-full bg-background border border-border rounded p-1 text-[10px]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded bg-brand-cyan text-background font-bold text-xs uppercase hover:bg-brand-cyan/95 transition"
              >
                Save Seed Record
              </button>
            </form>
          ) : (
            <div className="border border-border bg-background-panel rounded p-8 text-center font-mono text-xs text-zinc-500 space-y-2">
              <Activity className="mx-auto text-zinc-700" size={24} />
              <h4>Telemetry Question Configuration Panel</h4>
              <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">Select a question to refactor its templates, or click Add Question to introduce new test targets to the repository.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
