// import { useEffect, useState } from 'react';
// import { getResume } from '../api.js';

// function ResumeCard({ entry }) {
//   return (
//     <div className="resume-card">
//       <div className="resume-left">
//         <span className="resume-date">{entry.dateRange}</span>
//         <p className="resume-position">{entry.position}</p>
//         <p className="resume-company">{entry.company}</p>
//         <p className="resume-location">{entry.location}</p>
//       </div>
//       <div className="resume-right">
//         {entry.descriptions?.map((desc, i) => (
//           <p className="resume-desc" key={i}>{desc}</p>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function Resume() {
//   const [resume, setResume] = useState({ experience: [], education: [] });

//   useEffect(() => {
//     document.title = 'Shahil Dhakal | Resume';
//     getResume()
//       .then(setResume)
//       .catch((err) => console.error('Failed to load resume', err));
//   }, []);

//   return (
//     <main className="page-main">
//       <div className="page-hero">
//         <h1 className="page-title">
//           <span className="title-square"></span>Resume
//         </h1>
//       </div>

//       <div className="resume-container">
//         {resume.experience.length > 0 && (
//           <>
//             <div className="resume-header-row">
//               <h2 className="section-heading">Experience</h2>
//               <a href="#" className="btn btn-primary">DOWNLOAD CV</a>
//             </div>
//             {resume.experience.map((entry) => (
//               <ResumeCard key={entry._id} entry={entry} />
//             ))}
//           </>
//         )}

//         {resume.experience.length === 0 && (
//           <div className="resume-header-row">
//             <h2 className="section-heading">Experience</h2>
//             <a href="#" className="btn btn-primary">DOWNLOAD CV</a>
//           </div>
//         )}

//         <div className="resume-header-row" style={{ marginTop: '3rem' }}>
//           <h2 className="section-heading">Education</h2>
//         </div>
//         {resume.education.map((entry) => (
//           <ResumeCard key={entry._id} entry={entry} />
//         ))}
//       </div>
//     </main>
//   );
// }
