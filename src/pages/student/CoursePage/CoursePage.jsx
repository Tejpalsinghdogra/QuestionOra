import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CoursePage.css';

const courseDataMapping = {
  bca: {
    title: 'Bachelor of Computer Applications',
    description: 'This 3-year undergraduate program trains students in computer applications, programming, software development, databases, networking, and web technologies, preparing them with technical expertise and problem-solving skills for careers in IT.',
    semesters: 6,
    departmentId: 'Bca'
  },
  bscdm: {
    title: 'B.Sc in Digital Marketing & Social Networks',
    description: 'This 3-year undergraduate program trains students in digital marketing, social media strategies, branding, analytics, content creation, and online business, preparing them with creativity, communication, and technical skills for dynamic careers.',
    semesters: 6,
    departmentId: 'BscDM'
  },
  bscit: {
    title: 'B.Sc Information Technology',
    description: 'This 3-year undergraduate program trains students in Information Technology, programming, software development, databases, networking, and web technologies, preparing them with technical expertise and problem-solving skills for careers in IT.',
    semesters: 6,
    departmentId: 'BscIt'
  },
  btechae: {
    title: 'B.Tech. Aerospace Engineering',
    description: 'This 4-year undergraduate program trains students in aerospace engineering, aerodynamics, propulsion systems, aircraft design, and space technology, equipping them with technical expertise and problem-solving skills for careers in the aviation and space industry.',
    semesters: 8,
    departmentId: 'BtechAE'
  },
  btechce: {
    title: 'B.Tech. Civil Engineering',
    description: 'This 4-year undergraduate program trains students in civil engineering, structural design, construction management, transportation, and environmental engineering, equipping them with technical expertise and problem-solving skills for careers in infrastructure and development.',
    semesters: 8,
    departmentId: 'BtechCE'
  },
  btechcse: {
    title: 'B.Tech. Computer Science & Engineering',
    description: 'This 4-year undergraduate program trains students in computer science, software engineering, algorithms, data structures, and emerging technologies, equipping them with technical expertise and problem-solving skills for careers in the global tech industry.',
    semesters: 8,
    departmentId: 'BtechCSE'
  },
  btechec2e: {
    title: 'B.Tech. Electronics & Computer Engineering',
    description: 'This 4-year undergraduate program trains students in electronics, digital systems, microprocessors, computer architecture, programming, and embedded systems, equipping them with technical expertise and problem-solving skills for careers in technology and engineering.',
    semesters: 8,
    departmentId: 'BtechECTwoE'
  },
  btechece: {
    title: 'B.Tech. Electronics & Communication Engineering',
    description: 'This 4-year undergraduate program trains students in electronics, communication systems, signal processing, VLSI design, and embedded systems, equipping them with technical expertise and problem-solving skills for careers in the telecommunications and electronics industry.',
    semesters: 8,
    departmentId: 'BtechECE'
  },
  btechmae: {
    title: 'B.Tech. Mechanical & Automation Engineering',
    description: 'This 4-year undergraduate program trains students in mechanical engineering, automation, robotics, manufacturing processes, and thermal systems, equipping them with technical expertise and problem-solving skills for careers in the industrial and automotive sectors.',
    semesters: 8,
    departmentId: 'BtechMAE'
  },
  btechrae: {
    title: 'B.Tech. Robotics & Automation Engineering',
    description: 'This 4-year undergraduate program trains students in robotics, automation, control systems, artificial intelligence, and mechanical design, equipping them with technical expertise and problem-solving skills for careers in advanced manufacturing and technology.',
    semesters: 8,
    departmentId: 'BtechRAE'
  },
  clayout6: {
    title: 'B.Sc Animation & Multimedia',
    description: 'This 3-year undergraduate program trains students in 2D/3D animation, visual effects, design, multimedia, and game development, preparing them with creativity and skills for careers in digital media.',
    semesters: 6,
    departmentId: 'clayout6'
  },
  clayout8: {
    title: 'B.Sc in Digital Marketing & Social Networks',
    description: 'This 3-year undergraduate program trains students in digital marketing, social media strategies, branding, analytics, content creation, and online business, preparing them with creativity, communication, and technical skills for dynamic careers.',
    semesters: 8,
    departmentId: 'clayout8'
  }
};

function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courseDataMapping[courseId?.toLowerCase()];

  const [selectedSem, setSelectedSem] = useState('Sem-All');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!course) return;

    const fetchPapers = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({ department: course.departmentId });
        if (selectedSem !== 'Sem-All') {
          queryParams.append('semester', selectedSem);
        }

        const res = await fetch(`/api/papers?${queryParams.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setPapers(data);
        } else {
          console.error('Failed to fetch papers:', data.message);
        }
      } catch (err) {
        console.error('Error fetching papers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [selectedSem, course]);

  if (!course) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Course not found.</div>;
  }

  const handleDownload = async (paperId) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/signup');
      return;
    }

    try {
      const res = await fetch(`/api/papers/${paperId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.fileUrl) {
        window.open(data.fileUrl, '_blank');
      } else {
        console.error('Failed to get download link:', data.message);
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // Group papers by Semester and Year
  const groupedPapers = papers.reduce((acc, paper) => {
    const key = `${paper.semester}-${paper.year}`;
    if (!acc[key]) {
      acc[key] = { semester: paper.semester, year: paper.year, papers: [] };
    }
    acc[key].papers.push(paper);
    return acc;
  }, {});

  // Sort semesters correctly, then by year descending
  const sortedGroups = Object.values(groupedPapers).sort((a, b) => {
    const semA = parseInt(a.semester.split('-')[1]);
    const semB = parseInt(b.semester.split('-')[1]);
    if (semA !== semB) return semA - semB;
    return b.year - a.year; // Sort by year descending within the same semester
  });

  return (
    <main>
      <div className="containerm">
        <div id="qoh">{course.title}</div>
        <div id="qocd">{course.description}</div>
      </div>
      <div className="containerS">
        <div className="tophead">Get Question Papers</div>
        <div className="Filters">Filters</div>
        <div className="dropdown">
          <form>
            <select 
              name="selSem" 
              className="Alloptions" 
              value={selectedSem} 
              onChange={(e) => setSelectedSem(e.target.value)}
            >
              <option value="Sem-All">Semester-All</option>
              {[...Array(course.semesters)].map((_, i) => (
                <option key={i + 1} value={`Sem-${i + 1}`}>Semester-{i + 1}</option>
              ))}
            </select>
          </form>
        </div>
      </div>
      <div className="containerTb">
        <div className="tableM">
          <div className="tableME">
            <div className="mhed">Semester</div>
            <div className="mhed">Year</div>
            <div className="mhed" id="unele">Download</div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>Loading papers...</div>
          ) : papers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>No papers found for this selection.</div>
          ) : (
            sortedGroups.map((group, index) => {
              return (
                 <div className="tableE" id={group.semester} style={{ display: 'flex' }} key={index}>
                   <div className="tinfo">{group.semester.replace('Sem-', 'Semester-')}</div>
                   <div className="tinfo">{group.year}</div>
                   <div className="tinfo">
                     {['MSE', 'ESE'].map(type => {
                        const paper = group.papers.find(p => p.type === type);
                        if (paper) {
                          return (
                            <div 
                              key={type} 
                              onClick={() => handleDownload(paper._id)} 
                              style={{ cursor: 'pointer', textDecoration: 'none' }}
                            >
                              <li className="lineend" title={paper.title}>
                                 {type}
                              </li>
                            </div>
                          );
                        } else {
                          return (
                            <div 
                              key={type} 
                              onClick={() => alert("Question papper not uploaded yet!!")} 
                              style={{ cursor: 'pointer', textDecoration: 'none', opacity: 0.6 }}
                            >
                              <li className="lineend">
                                 {type}
                              </li>
                            </div>
                          );
                        }
                     })}
                   </div>
                 </div>
              );
            })
          )}
        </div>
      </div>
      <div className="containerL">
        <div className="lnote">Note: All the download links are provided in PDF format for both Mid-Semester (MSE) and End-Semester (ESE) examination papers of GNA University.</div>
      </div>
    </main>
  );
}

export default CoursePage;
