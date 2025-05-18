import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Form, Button, Modal } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Topbar from '../components/Topbar';

const UserCreatePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        FIO: '',
        Email: '',
        Password: '',
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

    useEffect(() => {
        fetchDepartments();
        fetchPositions();
    }, []);

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

        try {
            const cleanedUser = { ...user };

            if (!cleanedUser.PositionId) delete cleanedUser.PositionId;
            if (!cleanedUser.DepartmentId) delete cleanedUser.DepartmentId;

            await api.post('/users', cleanedUser);


            navigate('/users');
        } catch (err) {
            console.error('Помилка при створенні користувача', err);
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
                    <h2 className="mb-4">Створення користувача</h2>
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
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="text"
                                name="Password"
                                value={user.Password}
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
                                onChange={handleChange}
                            />
                            <Form.Text className="text-muted">
                                Роль можна вказати лише під час створення користувача
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="primary" type="submit">
                                Створити
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
        </div>
    );
};

export default UserCreatePage;
