import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BookOpen, FileCode2, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { RatingBadge } from '../components/Badge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DashboardPage: React.FC = () => {
  const { reviews, snippets, theme } = useAppContext();

  // Basic stats
  const totalReviews = reviews.length;
  const totalSnippets = snippets.length;
  const issuesFound = reviews.filter(r => r.rating !== 'Good').length;
  
  // Chart Data preparation
  const languageCounts = reviews.reduce((acc, current) => {
    acc[current.language] = (acc[current.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const labels = Object.keys(languageCounts);
  const data = Object.values(languageCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Reviews by Language',
        data,
        backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.8)' : 'rgba(5, 150, 105, 0.8)',
        borderColor: theme === 'dark' ? 'rgba(52, 211, 153, 1)' : 'rgba(5, 150, 105, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        ticks: {
          color: theme === 'dark' ? '#94a3b8' : '#64748b',
        },
        grid: {
          display: false,
        }
      }
    },
  };

  const recentReviews = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Metrics and activity for your code reviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalReviews}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Saved Snippets</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSnippets}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Issues Flagged</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{issuesFound}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Reviews by Language
          </h3>
          <div className="flex-1 min-h-[300px]">
            {labels.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No data to display.
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
           <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Recent Activity
          </h3>
          {recentReviews.length > 0 ? (
            <div className="flow-root flex-1 overflow-y-auto">
              <ul className="-mb-8">
                {recentReviews.map((review, reviewIdx) => (
                  <li key={review.id}>
                    <div className="relative pb-8">
                      {reviewIdx !== recentReviews.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ring-8 ring-white dark:ring-slate-900">
                            <CodeIcon className="h-4 w-4 text-emerald-500" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Reviewed <span className="font-medium text-slate-900 dark:text-white">{review.language}</span> code
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                               <RatingBadge rating={review.rating} />
                            </div>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-slate-500">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
                No activity yet.
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
