import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Image, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const location = useLocation();

  const [redirectReason] = useState(location.state?.reason || null);

  useEffect(() => {

    if (location.state?.reason) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);



  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) errors.email = 'Введіть пошту';
    else if (!emailRegex.test(email)) errors.email = 'Некоректний формат пошти';

    if (!password.trim()) errors.password = 'Введіть пароль';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken } = res.data;

      await login(accessToken);
      const from = location.state?.from || '/profile';
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        const msg = err.response.data?.message;
        if (Array.isArray(msg)) {
          const fe = {};
          msg.forEach(m => {
            if (m.includes('email') || m.includes('пошта')) fe.email = 'Некоректна пошта';
            if (m.includes('password') || m.includes('пароль')) fe.password = 'Пароль обов’язковий';
          });
          setFieldErrors(fe);
        } else {
          setGeneralError('Невідомa помилка при валідації.');
        }
      } else if (err.response?.status === 401) {
        setGeneralError('Неправильна пошта або пароль');
      } else {
        setGeneralError('Сервер недоступний або сталася помилка');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 px-3">
      <Card className="p-4 shadow-lg text-center w-100" style={{ maxWidth: '400px' }}>
        <Image src="../authlogo.jpg" alt="Логотип" fluid className="mb-3" style={{ maxHeight: '250px' }} />
        <h2 className="mb-3">Вхід в систему аналізу зображень печінки</h2>
        {generalError && <Alert variant="danger">{generalError}</Alert>}
        {redirectReason === 'expired' && (
          <Alert variant="warning">
            Сесія завершена. Будь ласка, увійдіть повторно.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3 text-start">
            <Form.Label>Пошта</Form.Label>
            <Form.Control
              type="email"
              placeholder="Введіть пошту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!fieldErrors.email}
            />
            <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-3 text-start">
            <Form.Label>Пароль</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Введіть пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!fieldErrors.password}
              />
              <button
                type="button"
                className="position-absolute"
                style={{
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                }}
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
              <Form.Control.Feedback type="invalid">{fieldErrors.password}</Form.Control.Feedback>
            </div>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Увійти'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default LoginPage;
