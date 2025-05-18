import React, { useEffect, useState } from 'react';
import {
  getLiverAnalyses,
  createLiverAnalysis,
  updateLiverAnalysisImage,
  updateLiverAnalysisHeader,
  analyzeLiverImage,
  deleteLiverAnalysis,
} from './patientApi';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3090';

const LiverAnalysisItem = ({
  item,
  index,
  patientId,
  handleUpdateHeader,
  handleImageChange,
  handleAnalyze,
  handleDelete,
  openCropper,
  setAnalyses
}) => {
  console.log('LiverAnalysisItem', item);
  const updateItem = (updated) => {
    setAnalyses((prev) =>
      prev.map((a) => (a.Id === updated.Id ? updated : a))
    );
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString('uk-UA')} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div key={item.Id} className="accordion-item">
      <div className="accordion-header input-group" id={`liverHeading${index}`}>
        <div
          className="accordion-button collapsed"
          data-bs-toggle="collapse"
          data-bs-target={`#liverContent${index}`}
          aria-expanded="false"
          aria-controls={`liverContent${index}`}
        >
          <span className="input-group-text">{formatDate(item.CreatedDate)}</span>
          <input
            type="text"
            className="form-control"
            defaultValue={item.Header_text}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => handleUpdateHeader(item.Id, e.target.value)}
            onFocus={(e) => e.stopPropagation()}
          />
          <div className="btn btn-outline-secondary" onClick={() => handleDelete(item.Id)}>
            <i className="bi bi-trash"></i>
          </div>
        </div>
      </div>
      <div
        id={`liverContent${index}`}
        className="accordion-collapse collapse"
        aria-labelledby={`liverHeading${index}`}
      >
        <div className="accordion-body">
          <div className="form-floating mb-3">
            <select
              className="form-select"
              defaultValue={item.Type}
              onChange={(e) => updateItem({ ...item, Type: parseInt(e.target.value) })}
            >
              <option value="1">Норма/Патологія</option>
              <option value="2">Ступінь фіброзу</option>
            </select>
            <label>Тип аналізу</label>
          </div>

          <div className="form-floating mb-3">
            <select
              className="form-select"
              defaultValue={item.Sensor || 'convex'}
              onChange={(e) => updateItem({ ...item, Sensor: e.target.value })}
            >
              <option value="convex">Конвексний</option>
              <option value="linear">Лінійний</option>
              <option value="reinforced_linear">Лінійний в посиленому режимі</option>
            </select>
            <label>Тип датчику</label>
          </div>

          <div className="row">
            <div className="col-md-5 d-flex justify-content-center align-items-center mb-3 mb-md-0">
              <div
                className="drop-zone analysisDropZone"
                onClick={() => document.getElementById(`fileInput${index}`).click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault();
                  const dt = e.dataTransfer;
                  if (dt.files && dt.files[0]) {
                    const file = dt.files[0];
                    handleImageChange(file, item, updateItem);
                  }
                  else if (dt.types.includes('text/plain')) {
                    const url = dt.getData('text/plain');
                    try {
                      const res = await fetch(url);
                      const blob = await res.blob();
                      const file = new File([blob], 'dragged.png', { type: blob.type });
                      handleImageChange(file, item, updateItem);
                    } catch (err) {
                      console.error('❌ Не вдалося завантажити зображення:', err);
                    }
                  }
                }}

                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: '200px',
                  border: '2px dashed #ccc',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="file"
                  id={`fileInput${index}`}
                  className="d-none"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleImageChange(file, item, updateItem);
                  }}
                />
                {item.Filename || item.previewUrl ? (
                  <img
                    src={
                      item.previewUrl
                        ? item.previewUrl
                        : `${BASE_URL}/images/${patientId}/analysesImages/${item.Filename}`
                    }
                    alt="Аналіз"
                    className="img-fluid"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                  />
                ) : (
                  <div className="text-muted text-center">
                    <div className="display-4">+</div>
                    <div>Натисніть або перетягніть файл</div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-7">
              {item.loading ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border me-2 text-primary" role="status" />
                  <span>Аналіз триває...</span>
                </div>
              ) : (
                <>
                  {item.Analysis_text_head && (
                    <p
                      className="fs-6 fw-medium"
                      dangerouslySetInnerHTML={{
                        __html: item.Analysis_text_head.replace(/\n/g, '<br>'),
                      }}
                    />
                  )}
                  {item.Type === 2 && item.Analysis_text_body && (
                    <>
                      <button
                        className="btn btn-light border border-1 mb-1"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseText${index}`}
                        aria-expanded="false"
                        aria-controls={`collapseText${index}`}
                      >
                        Більше інформації про аналіз
                      </button>
                      <div
                        className="collapse fs-6 fw-medium"
                        id={`collapseText${index}`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.Analysis_text_body.replace(/\n/g, '<br>'),
                          }}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>


          <button
            type="button"
            className="btn btn-primary mt-3"
            disabled={!item.Filename && !item.previewUrl || item.loading}
            onClick={() => handleAnalyze(item, updateItem, item.Type, item.Sensor)}
          >
            {item.loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                Аналіз...
              </>
            ) : (
              'Аналіз'
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

const LiverAnalysis = ({ patientId, openCropper, setImageUpdater }) => {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    loadAnalyses();
  }, [patientId]);

  useEffect(() => {
    if (setImageUpdater) {
      setImageUpdater.current = (liverId, base64, fileName) => {
        setAnalyses((prev) =>
          prev.map((item) =>
            item.Id === liverId
              ? { ...item, Filename: fileName, previewUrl: base64 }
              : item
          )
        );
      };
    }
  }, [setImageUpdater]);

  const loadAnalyses = async () => {
    const data = await getLiverAnalyses(patientId);
    const sorted = (data || []).sort((a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate));
    setAnalyses(sorted);
  };

  const handleAdd = async () => {
    const newId = await createLiverAnalysis(patientId);
    const newItem = {
      Id: newId,
      Header_text: 'Новий аналіз',
      Type: 2,
      Sensor: 'convex',
      Analysis_text_head: '',
      Analysis_text_body: '',
      Filename: null,
      CreatedDate: new Date().toISOString()
    };
    setAnalyses((prev) => [...prev, newItem]);
  };

  const handleUpdateHeader = async (id, value) => {
    await updateLiverAnalysisHeader(id, value);
  };

  const handleAnalyze = async (item, updateItem, type, sensor) => {
    updateItem({ ...item, loading: true });

    try {
      const data = await analyzeLiverImage(patientId, item.Id, type, sensor);
      updateItem({
        ...item,
        Analysis_text_head: data.Analysis_text_head,
        Analysis_text_body: data.Analysis_text_body,
        Type: parseInt(type),
        Sensor: sensor,
        loading: false,
      });
    } catch (error) {
      console.error('Аналіз не вдався:', error);
      updateItem({ ...item, loading: false });
    }
  };


  const handleImageChange = async (file, item, updateItem) => {
    openCropper(file, item.Id);
  };

  const handleDelete = async (id) => {
    await deleteLiverAnalysis(id);
    setAnalyses((prev) => prev.filter((a) => a.Id !== id));
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light rounded h-100 p-4">
        <h3>Аналізи печінки</h3>
        <div className="accordion" id="liverAnalysisContainer">
          {analyses.map((item, index) => (
            <LiverAnalysisItem
              key={`${item.Id}-${item.Filename}-${item.previewUrl?.length || 0}`}
              item={item}
              index={index}
              patientId={patientId}
              handleUpdateHeader={handleUpdateHeader}
              handleImageChange={handleImageChange}
              handleAnalyze={handleAnalyze}
              handleDelete={handleDelete}
              openCropper={openCropper}
              setAnalyses={setAnalyses}
            />
          ))}
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

export default LiverAnalysis;
