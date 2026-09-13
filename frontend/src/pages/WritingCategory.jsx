import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getWritingsByCategory } from '../api.js';
import { getCategoryMeta } from '../writingCategories.js';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function WritingCategory() {
  const { category } = useParams();
  const meta = getCategoryMeta(category);
  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!meta) return;
    document.title = `Shahil Dhakal | ${meta.label}`;
    setLoading(true);
    getWritingsByCategory(category)
      .then(setWritings)
      .finally(() => setLoading(false));
  }, [category, meta]);

  // Unknown category slug in the URL — bounce back to the writings landing page
  if (!meta) return <Navigate to="/writings" replace />;

  return (
    <main className="page-main">
      <div className="page-hero">
        <h1 className="page-title">
          <span className="title-square"></span>{meta.label}
        </h1>
        <p className="page-subtitle">{meta.description}</p>
      </div>

      <div className="writing-list">
        {!loading && writings.length === 0 && (
          <p className="writing-empty">Nothing published here yet - check back soon.</p>
        )}

        {writings.map((writing) => (
          <Link
            to={`/writings/${category}/${writing._id}`}
            className="writing-list-item"
            key={writing._id}
          >
            <h2 className="writing-list-title">{writing.title}</h2>
            {writing.excerpt && <p className="writing-list-excerpt">{writing.excerpt}</p>}
            <span className="writing-list-meta">{formatDate(writing.createdAt)}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}