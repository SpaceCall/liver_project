import React from 'react';
import { Container, Card } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();
  console.log(user)

  return (
    <div className="d-flex flex-column vh-100">
      <Topbar />
      <div className="d-flex flex-grow-1">
        <Navbar />
        <Container className="mt-5 flex-grow-1 d-flex justify-content-center align-items-start">
          <Card className="p-4 shadow-sm" style={{ width: '100%', maxWidth: '600px' }}>
            <h3 className="mb-4">Профіль користувача</h3>
            <p><strong>ПІБ:</strong> {user?.FIO || '——'}</p>
            <p><strong>Пошта:</strong> {user?.Email || '——'}</p>
            <p><strong>Посада:</strong> {user?.Position?.Name || '——'}</p>
            <p><strong>Відділ:</strong> {user?.Department?.Name || '——'}</p>
            <p><strong>Роль:</strong> {user?.IsAdmin ? 'Адміністратор' : 'Лікар'}</p>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default Profile;
