import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { ReviewPage } from './pages/ReviewPage';
import { HistoryPage } from './pages/HistoryPage';
import { SnippetsPage } from './pages/SnippetsPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ReviewPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="snippets" element={<SnippetsPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

