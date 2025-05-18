import React, { useEffect, useState } from 'react';
import {
  getRegularAnalyses,
  createRegularAnalysis,
  updateRegularAnalysisHeader,
  updateRegularAnalysisText,
  deleteRegularAnalysis
} from './patientApi';

const RegularAnalysis = ({ patientId }) => {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    loadAnalyses();
  }, [patientId]);

  const loadAnalyses = async () => {
    const data = await getRegularAnalyses(patientId);
    const sorted = (data || []).sort((a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate));
    setAnalyses(sorted);
  };

  const handleAdd = async () => {
    const newId = await createRegularAnalysis(patientId);
    const newAnalysis = {
      Id: newId,
      Header_text: 'Новий аналіз',
      Analysis_text: '',
      CreatedDate: new Date().toISOString()
    };
    setAnalyses((prev) => [...prev, newAnalysis]);
  };

  const handleUpdateHeader = async (id, newHeader) => {
    await updateRegularAnalysisHeader(id, newHeader);
  };

  const handleUpdateText = async (id, newText) => {
    await updateRegularAnalysisText(id, newText);
  };

  const handleDelete = async (id) => {
    await deleteRegularAnalysis(id);
    setAnalyses((prev) => prev.filter((a) => a.Id !== id));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString('uk-UA')} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light rounded h-100 p-4">
        <div id="regularAnalysisContainer">
          <h3>Аналізи пацієнта</h3>
          <div className="accordion" id="regularAnalysisAccordion">
            {analyses.map((analysis, index) => (
              <div key={analysis.Id} className="accordion-item">
                <div className="accordion-header input-group" id={`regularAnalysisHeading${index}`}>
                  <div
                    className="accordion-button collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target={`#regularAnalysisContent${index}`}
                    aria-expanded="false"
                    aria-controls={`regularAnalysisContent${index}`}
                  >
                    <span className="input-group-text">{formatDate(analysis.CreatedDate)}</span>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={analysis.Header_text}
                      onBlur={(e) => handleUpdateHeader(analysis.Id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                    />

                    <div className="btn btn-outline-secondary" onClick={() => handleDelete(analysis.Id)}>
                      <i className="bi bi-trash"></i>
                    </div>
                  </div>
                </div>
                <div
                  id={`regularAnalysisContent${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`regularAnalysisHeading${index}`}
                >
                  <textarea
                    className="form-control accordion-body"
                    rows="5"
                    defaultValue={analysis.Analysis_text}
                    onBlur={(e) => handleUpdateText(analysis.Id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <br />
        <div className="container">
          <div className="row">
            <div className="col d-flex justify-content-end">
              <button className="btn btn-primary px-3" onClick={handleAdd}>
                Новий аналіз
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularAnalysis;
