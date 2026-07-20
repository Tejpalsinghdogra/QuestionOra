import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout/Layout';
import Home from './pages/home/Home/Home';
import BlockA from './pages/student/BlockA/BlockA';
import BlockB from './pages/student/BlockB/BlockB';
import BlockC from './pages/student/BlockC/BlockC';

import CoursePage from './pages/student/CoursePage/CoursePage';

import FAQ from './pages/student/FAQ/FAQ';
import Signup from './pages/auth/Signup/Signup';
import Login from './pages/auth/Login/Login';
import AdminPanel from './pages/admin/AdminPanel/AdminPanel';
import TeacherPanel from './pages/teacher/TeacherPanel/TeacherPanel';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import Feedback from './pages/student/Feedback/Feedback';
import TermsOfUse from './pages/legal/TermsOfUse/TermsOfUse';
import PrivacyPolicy from './pages/legal/PrivacyPolicy/PrivacyPolicy';
import ContentSharingPolicy from './pages/legal/ContentSharingPolicy/ContentSharingPolicy';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;