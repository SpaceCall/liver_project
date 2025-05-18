import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';
import Topbar from '../components/Topbar';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Name', direction: 'asc' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patient');
      console.log('Отримані пацієнти:', res.data);
      setPatients(res.data);
    } catch (err) {
      console.error('Не вдалося отримати пацієнтів:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async () => {
    try {
      const res = await api.post('/patient/create', { name: newName });
      setShowCreateModal(false);
      setNewName('');
      fetchPatients();
      navigate(`/patients/${res.data.id}`);
    } catch (err) {
      console.error('Помилка створення пацієнта:', err);
    }
  };


  const handleDelete = async (id) => {
    try {
      await api.delete(`/patient/${id}`);
      setPatients((prev) => prev.filter((p) => p.Id !== id));
    } catch (err) {
      console.error('Помилка видалення:', err);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.Name?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;

    if (!a[key] || !b[key]) return 0;

    if (key === 'CreatedDate') {
      return (new Date(a[key]) - new Date(b[key])) * dir;
    }

    return a[key].toString().localeCompare(b[key].toString()) * dir;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100">
      <Topbar />
      <div className="d-flex flex-grow-1">
        <Navbar />
        <Container className="mt-4 flex-grow-1">
          <h2 className="mb-4">Список пацієнтів</h2>
          <div className="input-group mb-3" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-primary text-white border-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Пошук за ПІБ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <Table className="table table-borderless table-hover animate__animated animate__fadeIn">
              <thead className="table-light rounded-3">
                <tr className="align-middle">
                  <th onClick={() => handleSort('Name')} style={{ cursor: 'pointer' }}>
                    ПІБ {sortConfig.key === 'Name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('CreatedDate')} style={{ cursor: 'pointer' }}>
                    Дата створення {sortConfig.key === 'CreatedDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {sortedPatients.map((patient) => (
                  <tr key={patient.Id} className="align-middle border-bottom">
                    <td>
                      <Button
                        variant="link"
                        className="text-decoration-none p-0 text-primary"
                        onClick={() => navigate(`/patients/${patient.Id}`)}
                      >
                        {patient.Name}
                      </Button>
                    </td>
                    <td>
                      {patient.CreatedDate
                        ? new Date(patient.CreatedDate).toLocaleDateString('uk-UA')
                        : '—'}
                    </td>
                    <td className="text-nowrap">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/patients/${patient.Id}`)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(patient.Id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end pt-3">
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                      <i className="bi bi-plus me-2"></i>
                      Створити нового пацієнта
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Container>
      </div>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Новий пацієнт</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ім’я пацієнта</Form.Label>
              <Form.Control
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Введіть ім’я"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Скасувати
          </Button>
          <Button variant="success" onClick={handleCreatePatient}>
            Створити
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Patients;
