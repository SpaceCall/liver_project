import React, { useState } from 'react';
import { Navbar, Button, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowConfirm(false);
    navigate('/login');
  };

  const username = user?.FIO || 'Користувач';

  return (
    <>
      <Navbar className="p-3 bg-light shadow-sm w-100">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <h5 className="m-0 text-muted">Система аналізу зображень печінки</h5>
          <div className="d-flex align-items-center">
            <div className="me-3 d-flex align-items-center">
              <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-2"
                style={{ width: '36px', height: '36px', fontSize: '0.95rem' }}
              >
                {username
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map(word => word[0]?.toUpperCase())
                  .join('')}
              </div>

              <span className="text-dark">{username}</span>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowConfirm(true)}
              style={{ padding: '5px 10px', fontSize: '0.875rem' }}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Вийти
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Модальне підтвердження */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Підтвердження виходу</Modal.Title>
        </Modal.Header>
        <Modal.Body>Ви дійсно хочете вийти із системи?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Скасувати
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Вийти
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Topbar;
