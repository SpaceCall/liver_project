import React from 'react';

const Spinner = () => {
  return (
    <div className="fullscreen-spinner">
      <div className="spinner-border text-primary" role="status"></div>
      <span className="sr-only ms-3">Загрузка...</span>
    </div>
  );
};

export default Spinner;
