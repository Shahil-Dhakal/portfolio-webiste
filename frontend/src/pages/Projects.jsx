import { useEffect, useState } from 'react';
import { getProjects } from '../api.js';

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    document.title = 'Shahil Dhakal | Projects';
    getProjects()
      .then(setProjects)
      .catch((err) => console.error('Failed to load projects', err));
  }, []);

  return (
    <main className="page-main">
      <div className="page-hero">
        <h1 className="page-title">
          <span className="title-square"></span>Projects
        </h1>
        <p className="page-subtitle">
          A collection of projects born from curiosity, caffeine, and countless hours of
          debugging. From software engineering to data analysis, each one reflects a challenge
          tackled, lessons learned, and results delivered.
        </p>
      </div>

      <div className="projects-container">
        {projects.map((project) => (
          <div className="project-card" key={project._id}>
            <div className="project-info">
              <div className="project-accent"></div>
              <div>
                <h3 className="project-name">{project.name}</h3>
                <p className="project-role">{project.role}</p>
                <p className="project-desc">{project.description}</p>
              </div>
            </div>
            {project.imageUrl ? (
              <div
                className="project-image"
                style={{
                  backgroundImage: `url(${project.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
            ) : (
              <div className={`project-image project-image--${project.imageVariant}`}></div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
