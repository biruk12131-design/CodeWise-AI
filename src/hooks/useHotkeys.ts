import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHotkeys = (onCmdEnter?: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid acting on an event that has already been handled
      if (e.defaultPrevented) return;

      // Navigation Shortcuts (Alt+1-4)
      if (e.altKey && ['1', '2', '3', '4'].includes(e.key)) {
        const targetElement = document.activeElement;
        const isInput = targetElement?.tagName === 'INPUT' || targetElement?.tagName === 'TEXTAREA';
        
        if (!isInput) {
            e.preventDefault();
            switch (e.key) {
              case '1':
                navigate('/');
                break;
              case '2':
                navigate('/history');
                break;
              case '3':
                navigate('/snippets');
                break;
              case '4':
                navigate('/dashboard');
                break;
            }
        }
      }

      // Review Submission Shortcut (Cmd+Enter / Ctrl+Enter)
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const targetElement = document.activeElement;
        const isEditorFocused = targetElement?.tagName === 'TEXTAREA';
        
        if (onCmdEnter && isEditorFocused) {
          e.preventDefault();
          onCmdEnter();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onCmdEnter]);
};
