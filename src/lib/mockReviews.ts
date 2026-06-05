import { Review, Language, Rating } from '../types';
import { simpleHash } from './utils';

type MockFeedbackItem = {
  rating: Rating;
  comments: { line: number; comment: string }[];
  suggestions: string[];
  securityNotes?: string[];
};

const mockFeedback: Record<string, MockFeedbackItem[]> = {
  TypeScript: [
    { rating: 'Good' as Rating, comments: [{ line: 2, comment: "Nice use of strong typing here." }], suggestions: ["Consider extracting this interface into a shared types file.", "Avoid 'any' types if possible (none seen here!)."] },
    { rating: 'Needs Improvement' as Rating, comments: [{ line: 5, comment: "This function could benefit from explicit return types." }, { line: 10, comment: "Variable 'x' is poorly named." }], suggestions: ["Add return types to all public methods.", "Use more descriptive variable names."] },
    { rating: 'Has Issues' as Rating, comments: [{ line: 1, comment: "Missing imports for types." }, { line: 8, comment: "Possible unhandled null/undefined case." }], suggestions: ["Add strict null checks.", "Refactor this logic into smaller, testable functions."], securityNotes: ["Ensure user input is validated before casting types."] }
  ],
  JavaScript: [
    { rating: 'Good' as Rating, comments: [{ line: 3, comment: "Clean and concise arrow function usage." }], suggestions: ["Consider migrating to TypeScript for better type safety."] },
    { rating: 'Needs Improvement' as Rating, comments: [{ line: 6, comment: "Avoid mutating global scope." }], suggestions: ["Use const instead of let where possible.", "Consider adding JSDoc comments."] },
    { rating: 'Has Issues' as Rating, comments: [{ line: 4, comment: "Implicit coercion can lead to bugs here." }, { line: 12, comment: "Deeply nested callbacks (callback hell)." }], suggestions: ["Use async/await instead of callbacks.", "Use strict equality (===)."] }
  ],
  Python: [
    { rating: 'Good' as Rating, comments: [{ line: 4, comment: "Good list comprehension." }], suggestions: ["Ensure PEP 8 compliance."] },
    { rating: 'Needs Improvement' as Rating, comments: [{ line: 7, comment: "Consider using a generator instead of building a large list in memory." }], suggestions: ["Add type hints (PEP 484)."] },
    { rating: 'Has Issues' as Rating, comments: [{ line: 2, comment: "Catching broad generic Exception is a bad practice." }], suggestions: ["Catch specific exceptions.", "Validate untrusted data."], securityNotes: ["Avoid using exec() or eval() on untrusted inputs."] }
  ],
  CSS: [
    { rating: 'Good' as Rating, comments: [{ line: 5, comment: "Good use of CSS variables." }], suggestions: ["Consider using utility classes (like Tailwind) for faster development in the future."] },
    { rating: 'Needs Improvement' as Rating, comments: [{ line: 10, comment: "Use of !important should be avoided." }], suggestions: ["Refactor specificity issues instead of relying on !important."] },
    { rating: 'Has Issues' as Rating, comments: [{ line: 8, comment: "Hardcoded px values can break responsiveness." }], suggestions: ["Use rem/em for sizing.", "Ensure focus states are defined for accessibility."] }
  ],
  HTML: [
    { rating: 'Good' as Rating, comments: [{ line: 2, comment: "Semantic tags used appropriately." }], suggestions: ["Always provide alt text for images."] },
    { rating: 'Needs Improvement' as Rating, comments: [{ line: 6, comment: "Missing aria-labels on interactive elements." }], suggestions: ["Improve document outline (h1, h2 structure)."] },
    { rating: 'Has Issues' as Rating, comments: [{ line: 3, comment: "Script tags in body can block parsing." }], suggestions: ["Move scripts to head with defer.", "Ensure adequate color contrast."], securityNotes: ["Sanitize all user-injected HTML to prevent XSS."] }
  ]
};

export function simulateReview(code: string, language: Language): Promise<Omit<Review, 'id' | 'createdAt'>> {
  return new Promise((resolve) => {
    const hash = simpleHash(code);
    setTimeout(() => {
      const languageFeedback = mockFeedback[language] || mockFeedback['JavaScript'];
      const feedbackIndex = hash % languageFeedback.length;
      const feedback = languageFeedback[feedbackIndex];

      const review: Omit<Review, 'id' | 'createdAt'> = {
        code,
        language,
        rating: feedback.rating,
        inlineComments: feedback.comments.map(c => ({
          // Randomize line slightly based on code length, for realism
          line: Math.max(1, Math.min(code.split('\n').length, c.line + (hash % 3))),
          comment: c.comment
        })),
        suggestions: feedback.suggestions,
        securityNotes: feedback.securityNotes
      };

      resolve(review);
    }, 2000 + (hash % 1500)); // 2-3.5 seconds
  });
}
