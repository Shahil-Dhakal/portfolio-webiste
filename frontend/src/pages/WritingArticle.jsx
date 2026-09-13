import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { getWriting } from '../api.js';
import { getCategoryMeta } from '../writingCategories.js';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function WritingArticle() {
  const { category, id } = useParams();
  const meta = getCategoryMeta(category);
  const [writing, setWriting] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!meta) return;
    getWriting(category, id)
      .then((data) => {
        setWriting(data);
        document.title = `Shahil Dhakal | ${data.title}`;
      })
      .catch(() => setNotFound(true));
  }, [category, id, meta]);

  if (!meta) return <Navigate to="/writings" replace />;
  if (notFound) return <Navigate to={`/writings/${category}`} replace />;
  if (!writing) return null;

  return (
    <main className="page-main">
      <div className="writing-article">
        <Link to={`/writings/${category}`} className="btn btn-outline writing-article-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ width: 14, height: 14 }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {' '}BACK TO {meta.label.toUpperCase()}
        </Link>

        <h1 className="writing-article-title">{writing.title}</h1>
        <p className="writing-article-meta">{formatDate(writing.createdAt)}</p>

        <div className="writing-article-body">
            {writing.content}
        </div>
      </div>
    </main>
  );
}