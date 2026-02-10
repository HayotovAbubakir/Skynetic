import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CourseCatalog } from './pages/CourseCatalog'
import { Dashboard } from './pages/Dashboard'
import { Home } from './pages/Home'
import { LessonViewer } from './pages/LessonViewer'
import { Profile } from './pages/Profile'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { NotFound } from './pages/NotFound'

const App = () => (
  <AppShell>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<CourseCatalog />} />
      <Route
        path="/lesson/:courseId?/:lessonId?"
        element={
          <ProtectedRoute>
            <LessonViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppShell>
)

export default App
