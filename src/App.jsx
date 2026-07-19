import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BlockA from './pages/BlockA';
import BlockB from './pages/BlockB';
import BlockC from './pages/BlockC';

import CoursePage from './pages/CoursePage';

import FAQ from './pages/FAQ';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import TeacherPanel from './pages/TeacherPanel';
import ProtectedRoute from './components/ProtectedRoute';
import Feedback from './pages/Feedback';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContentSharingPolicy from './pages/ContentSharingPolicy';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blocka" element={<BlockA />} />
          <Route path="blockb" element={<BlockB />} />
          {/* Using hyphen variants just in case */}
          <Route path="block-a" element={<BlockA />} />
          <Route path="block-b" element={<BlockB />} />
          <Route path="block-c" element={<BlockC />} />

          <Route path="course/:courseId" element={<CoursePage />} />

          <Route path="faq" element={<FAQ />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="teacher" element={<ProtectedRoute allowedRoles={['teacher', 'admin']}><TeacherPanel /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="tou" element={<TermsOfUse />} />
          <Route path="pp" element={<PrivacyPolicy />} />
          <Route path="csp" element={<ContentSharingPolicy />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;