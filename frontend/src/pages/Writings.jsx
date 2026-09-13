import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WRITING_CATEGORIES } from '../writingCategories.js';

export default function Writings() {
  useEffect(() => {
    document.title = 'Shahil Dhakal | Writings';
  }, []);

  return (
    <main className="page-main">
      <div className="page-hero">
        <h1 className="page-title">
          <span className="title-square"></span>Writings
        </h1>
        <p className="page-subtitle">
          A collection of poems, blogs, and stories born from restless nights, wandering
          thoughts, and the need to put feelings into words instead of code. From verses to
          fiction, each piece reflects a mood captured, a thought chased, and a story worth
          telling.
        </p>
      </div>

      <div className="writing-categories">
        {WRITING_CATEGORIES.map((cat) => (
          <Link to={`/writings/${cat.slug}`} className="writing-category-card" key={cat.slug}>
            <span className="writing-category-square"></span>
            <h2 className="writing-category-name">{cat.label}</h2>
            <p className="writing-category-desc">{cat.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}