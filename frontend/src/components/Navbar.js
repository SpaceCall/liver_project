import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth(); 
  const isAdmin = user?.role === 'admin';

  const links = [
    { to: '/profile', icon: 'bi-person', label: 'Профіль' },
    { to: '/patients', icon: 'bi-people', label: 'Пацієнти' },
    ...(isAdmin ? [{ to: '/users', icon: 'bi-person-lines-fill', label: 'Користувачі' }] : []),
  ];

  return (
    <div className="d-flex flex-column bg-light border-end shadow-sm p-3" style={{ minWidth: '200px' }}>
      <Nav className="flex-column">
        {links.map((link) => (
          <Nav.Link
            key={link.to}
            as={Link}
            to={link.to}
            className={`d-flex align-items-center mb-2 px-2 py-2 rounded ${location.pathname.startsWith(link.to) ? 'bg-primary text-white' : 'text-dark'}`}
            style={{ transition: 'all 0.2s' }}
          >
            <i className={`bi ${link.icon} me-2`}></i>
            {link.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}

export default Navbar;
