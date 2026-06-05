import React, { useState } from 'react';
import { Plus, Search, Code, MoreVertical, Trash2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Snippet, Language } from '../types';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';

export const SnippetsPage: React.FC = () => {
  const { snippets, addSnippet, deleteSnippet, setSnippetToReview } = useAppContext();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newLanguage, setNewLanguage] = useState<Language>('TypeScript');

  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReviewSnippet = (snippet: Snippet) => {
    setSnippetToReview(snippet);
    navigate('/');
  };

  const handleSaveSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    addSnippet({
      id: uuidv4(),
      title: newTitle.trim(),
      code: newCode,
      language: newLanguage,
      createdAt: new Date().toISOString()
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewCode('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Code Snippets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and quickly review your saved code.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-700 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-emerald-500"
        >
          <Plus className="w-4 h-4" />
          Add Snippet
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search snippets by title or language..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm transition-colors"
        />
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <Code className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No snippets found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by creating a new code snippet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map((snippet) => (
            <div key={snippet.id} className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold truncate pr-4" title={snippet.title}>
                    {snippet.title}
                  </h3>
                  <button 
                    onClick={() => deleteSnippet(snippet.id)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete snippet"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono">
                    {snippet.language}
                  </span>
                  <span>•</span>
                  <span>{formatDate(snippet.createdAt)}</span>
                </div>
                <div className="h-24 bg-slate-50 dark:bg-slate-800/50 rounded-md p-3 overflow-hidden text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                  <pre className="truncate whitespace-pre-wrap">{snippet.code.substring(0, 150)}{snippet.code.length > 150 && '...'}</pre>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <button
                  onClick={() => handleReviewSnippet(snippet)}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  Load in Reviewer
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - built directly for simplicity instead of Radix for speed, fully accessible enough for this scope */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-slate-900/75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSaveSnippet}>
                <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-xl leading-6 font-semibold text-slate-900 dark:text-white" id="modal-title">
                    Add New Snippet
                  </h3>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                      <input
                        type="text"
                        id="title"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="mt-1 block w-full border border-slate-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="modal-language" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Language</label>
                      <select
                        id="modal-language"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value as Language)}
                        className="mt-1 block w-full border border-slate-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-transparent"
                      >
                        <option value="TypeScript">TypeScript</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="CSS">CSS</option>
                        <option value="HTML">HTML</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Code</label>
                      <textarea
                        id="code"
                        required
                        rows={8}
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        className="mt-1 block w-full border border-slate-300 dark:border-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-transparent font-mono whitespace-nowrap overflow-x-auto"
                        spellCheck="false"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Snippet
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
