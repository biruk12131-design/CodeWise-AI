import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { RatingBadge } from '../components/Badge';
import { formatDate } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const { reviews, deleteReview, setSnippetToReview } = useAppContext();
  const navigate = useNavigate();

  const handleOpenReview = (review: any) => {
    setSnippetToReview({
      id: review.id, // Mock snippet object from review to re-review it
      title: 'Previous Code',
      code: review.code,
      language: review.language,
      createdAt: new Date().toISOString()
    });
    navigate('/');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Past code reviews analyzed by CodeWise AI.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-slate-500 dark:text-slate-400">No review history yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {reviews.map((review) => (
              <li key={review.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        Reviewed {formatDate(review.createdAt)}
                      </p>
                      <RatingBadge rating={review.rating} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">
                        {review.language}
                      </span>
                      <span>•</span>
                      <span>{review.inlineComments.length} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => handleOpenReview(review)}
                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                        aria-label="Open review code in editor"
                        title="Re-Review Code"
                      >
                       <ExternalLink className="w-4 h-4" />
                     </button>
                    <button
                        onClick={() => deleteReview(review.id)}
                        className="text-slate-400 hover:text-red-600 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        aria-label="Delete review"
                        title="Delete Review"
                      >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
