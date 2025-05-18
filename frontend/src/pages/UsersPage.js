import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UsersPage.css';
import api from '../api/api';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Topbar from '../components/Topbar';

const sortUsers = (users, key, direction) => {
  const sorted = [...users].sort((a, b) => {
    const aValue = key === 'Department' ? a.Department?.Name
                  : key === 'Position' ? a.Position?.Name
                  : key === 'IsAdmin' ? (a.IsAdmin ? '1' : '0')
                  : a[key];

    const bValue = key === 'Department' ? b.Department?.Name
                  : key === 'Position' ? b.Position?.Name
                  : key === 'IsAdmin' ? (b.IsAdmin ? '1' : '0')
                  : b[key];

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [sortKey, setSortKey] = useState('FIO');
  const [sortDirection, setSortDirection] = useState('asc');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      if (err.response?.status === 403) {
        alert('Недостатньо прав для перегляду користувачів.');
      }
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  const handleSort = (key) => {
    const direction = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(direction);
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc'
      ? <i className="bi bi-caret-up-fill ms-1"></i>
      : <i className="bi bi-caret-down-fill ms-1"></i>;
  };

  const filteredAndSortedUsers = sortUsers(
    users.filter(user => user.FIO.toLowerCase().includes(search.toLowerCase())),
    sortKey,
    sortDirection
  );

  return (
    <div className="d-flex flex-column vh-100">
      <Topbar />
      <div className="d-flex flex-grow-1">
        <Navbar />
        <div className="container-fluid mt-4">
          <h2 className="mb-4">Список користувачів</h2>
          <div className="input-group mb-4 shadow-sm rounded overflow-hidden" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-primary text-white"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control border-start-0 shadow-none"
              placeholder="Пошук за ФІО..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-borderless table-hover animate__animated animate__fadeIn">
              <thead className="table-light rounded-3">
                <tr className="align-middle">
                  <th onClick={() => handleSort('FIO')} style={{ cursor: 'pointer' }}>
                    ФІО {sortIcon('FIO')}
                  </th>
                  <th>Пошта</th>
                  <th onClick={() => handleSort('Department')} style={{ cursor: 'pointer' }}>
                    Департамент {sortIcon('Department')}
                  </th>
                  <th onClick={() => handleSort('Position')} style={{ cursor: 'pointer' }}>
                    Позиція {sortIcon('Position')}
                  </th>
                  <th onClick={() => handleSort('IsAdmin')} style={{ cursor: 'pointer' }}>
                    Роль {sortIcon('IsAdmin')}
                  </th>
                  <th>Редагувати</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.Id} className="align-middle animate__animated animate__fadeInUp border-bottom">
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                          style={{ minWidth: '40px', minHeight: '40px', width: '40px', height: '40px', fontWeight: 'bold' }}
                        >
                          {user.FIO.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                        </div>
                        {user.FIO}
                      </div>
                    </td>
                    <td>{user.Email}</td>
                    <td>{user.Department?.Name || '—'}</td>
                    <td>{user.Position?.Name || '—'}</td>
                    <td>{user.IsAdmin ? 'Адміністратор' : 'Лікар'}</td>
                    <td>
                      <Link to={`/users/${user.Id}/edit`} className="btn btn-primary btn-sm">
                        Редагувати
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="6" className="text-end pt-3">
                    <Link to="/users/create" className="btn btn-success">
                      <i className="bi bi-plus-circle me-2"></i>
                      Створити користувача
                    </Link>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
