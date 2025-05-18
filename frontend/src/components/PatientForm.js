import React, { useState } from 'react';
import { updatePatientField } from './patientApi';

const fields = [
  { name: 'Name', label: 'ПІБ', type: 'text' },
  { name: 'Age', label: 'Вік', type: 'number' },
  { name: 'Height', label: 'Зріст', type: 'number' },
  { name: 'Weight', label: 'Вага', type: 'number' },
];

const PatientForm = ({ patient }) => {
  const [updatedFields, setUpdatedFields] = useState({});
  const handleBlur = async (field, value) => {
    if (value === '' || value === null || value === undefined) return;
    try {
      await updatePatientField(patient.Id, field, value);
      setUpdatedFields((prev) => ({ ...prev, [field]: true }));

      setTimeout(() => {
        setUpdatedFields((prev) => ({ ...prev, [field]: false }));
      }, 1200);
    } catch (err) {
      console.error(`Помилка оновлення поля ${field}`, err);
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light rounded h-100 p-4">
        <form>
          {fields.map(({ name, label, type }) => (
            <div className="row mb-3" key={name}>
              <label htmlFor={`input-${name}`} className="col-sm-2 col-form-label">
                {label}
              </label>
              <div className="col-sm-10">
                <input
                  type={type}
                  className={`form-control ${updatedFields[name] ? 'is-valid' : ''}`}
                  id={`input-${name}`}
                  defaultValue={patient[name.charAt(0).toUpperCase() + name.slice(1)]}
                  onBlur={(e) =>
                    handleBlur(name, type === 'number' ? +e.target.value : e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
