import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import Protected from './context/Protected';

import Patients from './pages/Patients';
import Patient from './pages/Patient';
import UsersPage from './pages/UsersPage';
import UserEditPage from './pages/UserEditPage';
import UserCreatePage from './pages/UserCreatePage';


function App() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <h4>Завантаження...</h4>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/users" element={
        <Protected roles={['admin']}>
          <UsersPage />
        </Protected>
      } />
      <Route path="/users/:id/edit" element={
        <Protected roles={['admin']}>
          <UserEditPage />
        </Protected>
      } />
      <Route path="/users/create" element={
        <Protected roles={['admin']}>
          <UserCreatePage />
        </Protected>
      } />
      <Route path="/patients" element={<Patients />} />
      <Route path="/patients/:id" element={<Patient />} />
      <Route path="/login" element={
        <Protected publicOnly>
          <LoginPage />
        </Protected>
      } />

      <Route path="/profile" element={
        <Protected>
          <Profile />
        </Protected>
      } />

      {/* другие маршруты */}
      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
}

export default App;
