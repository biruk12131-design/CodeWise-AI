import React, { useState, useEffect } from 'react';
import { Play, Loader2, AlertCircle, CheckCircle2, AlertTriangle, Info, Check, Copy, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Language, Review, Rating } from '../types';
import { simulateReview } from '../lib/mockReviews';
import { v4 as uuidv4 } from 'uuid';
import { RatingBadge } from '../components/Badge';
import { cn } from '../lib/utils';
import { useHotkeys } from '../hooks/useHotkeys';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css';

const highlightCode = (codeText: string, lang: string) => {
  let syntaxLang = lang.toLowerCase();
  if (syntaxLang === 'html') syntaxLang = 'markup';
  
  const grammar = Prism.languages[syntaxLang] || Prism.languages.javascript;
  return Prism.highlight(codeText, grammar, syntaxLang);
};

export const ReviewPage: React.FC = () => {
  const { addReview, snippetToReview, setSnippetToReview } = useAppContext();
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('JavaScript');
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);

  useEffect(() => {
    if (snippetToReview) {
      setCode(snippetToReview.code);
      setLanguage(snippetToReview.language);
      setCurrentReview(null);
    }
  }, [snippetToReview]);

  const handleReview = async () => {
    if (!code.trim() || isReviewing) return;
    
    setIsReviewing(true);
    setCurrentReview(null);

    const newReview = await simulateReview(code, language);
    
    const fullReview: Review = {
      ...newReview,
      id: uuidv4(),
      snippetId: snippetToReview?.id,
      createdAt: new Date().toISOString()
    };

    setCurrentReview(fullReview);
    addReview(fullReview);
    setIsReviewing(false);
    
    // Clear the incoming snippet now that we've reviewed it
    if (snippetToReview) setSnippetToReview(null);
  };

  useHotkeys(() => {
    if (!isReviewing && code.trim()) {
      handleReview();
    }
  });

  const handleExportMarkdown = () => {
    if (!currentReview) return;
    const md = `# CodeWise AI Review
**Language:** ${currentReview.language}
**Rating:** ${currentReview.rating}

## Code Snippet
\`\`\`${currentReview.language.toLowerCase()}
${currentReview.code}
\`\`\`

## Inline Feedback
${currentReview.inlineComments.map(c => `- **Line ${c.line}:** ${c.comment}`).join('\n')}

## Suggestions
${currentReview.suggestions.map(s => `- ${s}`).join('\n')}
${currentReview.securityNotes && currentReview.securityNotes.length > 0 ? `\n## Security Warnings\n${currentReview.securityNotes.map(n => `- ${n}`).join('\n')}` : ''}
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review-${currentReview.id.substring(0,6)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!currentReview) return;
    const json = JSON.stringify(currentReview, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review-${currentReview.id.substring(0,6)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[calc(100vh-6rem)]">
      {/* Left Column: Editor */}
      <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-semibold flex items-center gap-2">
            <CodeIcon />
            Editor
          </h2>
          <div className="flex items-center gap-3">
            <label htmlFor="language" className="sr-only">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="CSS">CSS</option>
              <option value="HTML">HTML</option>
            </select>
            <button
              onClick={handleReview}
              disabled={isReviewing || !code.trim()}
              title="Review Code (Cmd+Enter / Ctrl+Enter)"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white px-4 py-1.5 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-slate-900"
            >
              {isReviewing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Reviewing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Review Code
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto code-editor-container bg-slate-100 dark:bg-slate-900/50">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => highlightCode(code, language)}
            padding={16}
            placeholder="Paste your code here for review..."
            style={{
              fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
              fontSize: 14,
              minHeight: '100%',
              backgroundColor: 'transparent',
            }}
            textareaClassName="focus:outline-none"
            className="w-full min-h-[400px] h-full font-mono dark:text-slate-300"
          />
        </div>
      </div>

      {/* Right Column: Review Panel */}
      <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm h-[600px] lg:h-auto">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {isReviewing ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
              <p className="text-lg font-medium animate-pulse">AI is analyzing your code...</p>
              <p className="text-sm mt-2 opacity-75">Checking for bugs, style issues, and security vulnerabilities.</p>
            </div>
          ) : currentReview ? (
            <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Review Summary</h3>
                  <div className="flex items-center gap-3">
                    <RatingBadge rating={currentReview.rating} />
                    <span className="text-sm text-slate-500">{currentReview.language}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {getRatingIcon(currentReview.rating)}
                  <div className="flex items-center gap-2">
                    <button onClick={handleExportMarkdown} className="text-xs flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors font-medium border border-emerald-200 dark:border-emerald-800" title="Download Report">
                      <Download className="w-3.5 h-3.5" /> Download Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline Comments */}
              {currentReview.inlineComments.length > 0 && (
                <section>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Inline Feedback
                  </h4>
                  <div className="space-y-3">
                    {currentReview.inlineComments.map((comment, idx) => (
                      <div key={idx} className="flex gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-xs font-semibold">
                          L{comment.line}
                        </div>
                        <p className="text-sm pt-1 space-x-1 flex-1">
                          {comment.comment}
                        </p>
                        <button
                          onClick={() => copyToClipboard(comment.comment)}
                          className="shrink-0 text-slate-400 hover:text-emerald-600 transition-colors self-start p-1"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Suggestions */}
              {currentReview.suggestions.length > 0 && (
                <section>
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Suggestions for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {currentReview.suggestions.map((sug, idx) => (
                      <li key={idx} className="flex gap-3 text-sm group">
                        <Check className="w-5 h-5 shrink-0 text-emerald-500" />
                        <span className="pt-0.5 flex-1">{sug}</span>
                        <button
                          onClick={() => copyToClipboard(sug)}
                          className="shrink-0 text-slate-400 hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

               {/* Security Notes */}
               {currentReview.securityNotes && currentReview.securityNotes.length > 0 && (
                <section className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                  <h4 className="text-sm font-bold text-red-800 dark:text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Security Warnings
                  </h4>
                  <ul className="space-y-2">
                    {currentReview.securityNotes.map((note, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-red-900 dark:text-red-300">
                         <span className="font-bold">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 dark:text-slate-600 text-center">
              <CodeIcon className="w-16 h-16 mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-2">Ready to review</h3>
              <p className="max-w-xs text-sm">Paste your code in the editor, select the language, and hit "Review Code" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CodeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const getRatingIcon = (rating: Rating) => {
  switch (rating) {
    case 'Good':
      return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
    case 'Needs Improvement':
      return <AlertCircle className="w-8 h-8 text-amber-500" />;
    case 'Has Issues':
      return <AlertTriangle className="w-8 h-8 text-red-500" />;
  }
};
