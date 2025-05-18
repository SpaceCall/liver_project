import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Form, Button, Modal } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Topbar from '../components/Topbar';

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    FIO: '',
    Email: '',
    DepartmentId: '',
    PositionId: '',
    IsAdmin: false,
  });
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  const [showDepModal, setShowDepModal] = useState(false);
  const [showPosModal, setShowPosModal] = useState(false);
  const [newDepName, setNewDepName] = useState('');
  const [newPosName, setNewPosName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error('Помилка при завантаженні користувача', err);
      navigate('/users');
    }
  };

  const fetchDepartments = async () => {
    const res = await api.get('/departments');
    setDepartments(res.data);
  };

  const fetchPositions = async () => {
    const res = await api.get('/positions');
    setPositions(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      FIO: user.FIO,
      Email: user.Email,
      DepartmentId: user.DepartmentId,
      PositionId: user.PositionId,
    };
    

    try {
      await api.put(`/users/${id}`, updatedData);
      navigate('/users');
    } catch (err) {
      console.error('Помилка при збереженні користувача', err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${id}`);
      navigate('/users');
    } catch (err) {
      console.error('Не вдалося видалити користувача', err);
      alert('Помилка при видаленні користувача.');
    }
  };


  const createDepartment = async () => {
    if (!newDepName.trim()) return;
    const res = await api.post('/departments', { Name: newDepName });
    await fetchDepartments();
    setUser((prev) => ({ ...prev, DepartmentId: res.data.Id }));
    setShowDepModal(false);
    setNewDepName('');
  };

  const createPosition = async () => {
    if (!newPosName.trim()) return;
    const res = await api.post('/positions', { Name: newPosName });
    await fetchPositions();
    setUser((prev) => ({ ...prev, PositionId: res.data.Id }));
    setShowPosModal(false);
    setNewPosName('');
  };

  return (
    <div className="d-flex flex-column vh-100">
      <Topbar />
      <div className="d-flex flex-grow-1">
        <Navbar />
        <div className="container mt-4">
          <h2 className="mb-4">Редагування користувача</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ПІБ</Form.Label>
              <Form.Control
                type="text"
                name="FIO"
                value={user.FIO}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пошта</Form.Label>
              <Form.Control
                type="email"
                name="Email"
                value={user.Email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Департамент</Form.Label>
              <div className="d-flex gap-2">
                <Form.Select
                  name="DepartmentId"
                  value={user.DepartmentId || ''}
                  onChange={handleChange}
                >
                  <option value="">—</option>
                  {departments.map((dep) => (
                    <option key={dep.Id} value={dep.Id}>
                      {dep.Name}
                    </option>
                  ))}
                </Form.Select>
                <Button variant="outline-primary" onClick={() => setShowDepModal(true)}>
                  ➕
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Посада</Form.Label>
              <div className="d-flex gap-2">
                <Form.Select
                  name="PositionId"
                  value={user.PositionId || ''}
                  onChange={handleChange}
                >
                  <option value="">—</option>
                  {positions.map((pos) => (
                    <option key={pos.Id} value={pos.Id}>
                      {pos.Name}
                    </option>
                  ))}
                </Form.Select>
                <Button variant="outline-primary" onClick={() => setShowPosModal(true)}>
                  ➕
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Адміністратор"
                name="IsAdmin"
                checked={user.IsAdmin}
                disabled
              />
              <Form.Text className="text-muted">
                Роль користувача не можна змінити після створення
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-between gap-2">
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Видалити користувача
              </Button>

              <Button variant="primary" type="submit">
                Зберегти
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <Modal show={showDepModal} onHide={() => setShowDepModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Новий департамент</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            value={newDepName}
            onChange={(e) => setNewDepName(e.target.value)}
            placeholder="Назва департаменту"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDepModal(false)}>
            Скасувати
          </Button>
          <Button variant="primary" onClick={createDepartment}>
            Створити
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPosModal} onHide={() => setShowPosModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Нова посада</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            value={newPosName}
            onChange={(e) => setNewPosName(e.target.value)}
            placeholder="Назва посади"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPosModal(false)}>
            Скасувати
          </Button>
          <Button variant="primary" onClick={createPosition}>
            Створити
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Підтвердження видалення</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ви впевнені, що хочете видалити цього користувача?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Скасувати
          </Button>
          <Button variant="danger" onClick={async () => {
            setShowDeleteModal(false);
            await handleDelete();
          }}>
            Підтвердити
          </Button>
        </Modal.Footer>
      </Modal>

    </div>


  );
};

export default UserEditPage;
