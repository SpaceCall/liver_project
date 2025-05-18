import React, { useEffect, useState, useRef } from 'react';
import { getGalleryImages, deleteImageFromGallery, addImageToGallery } from './patientApi';
import { Modal, Button, Spinner } from 'react-bootstrap';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3090';

const ImageGallery = ({ patientId }) => {
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!patientId) return;
    (async () => {
      try {
        const data = await getGalleryImages(patientId);
        setImages(data.images || []);
      } catch (err) {
        console.error('Failed to load images:', err);
      }
    })();
  }, [patientId]);

  const handleDeleteClick = (fileName) => {
    setSelectedImage(fileName);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteImageFromGallery(patientId, selectedImage);
      setImages((prev) => prev.filter((img) => img !== selectedImage));
    } catch (err) {
      console.error('Error deleting image:', err);
    } finally {
      setShowModal(false);
      setSelectedImage(null);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await uploadImages(files);
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    await uploadImages(files);
  };

  const uploadImages = async (files) => {
    if (!files.length || !patientId) return;
    setLoading(true);
    try {
      for (const file of files) {
        const fileName = await addImageToGallery(patientId, file);
        setImages((prev) => [...prev, fileName]);
      }
    } catch (err) {
      console.error('Error uploading files:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pt-4 px-4">
      <div className="bg-light rounded h-100 p-4">
        <h4>Оригінальні зображення</h4>

        <div
          className="border rounded mb-4 p-3"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          style={{
            cursor: 'pointer',
            background: '#f8f9fa',
            minHeight: '150px'
          }}
        >
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <>
              <div className="text-center mb-2 text-muted">
                Натисніть або перетягніть сюди файли
              </div>
              <div className="row">
                {images.map((img, i) => (
                  <div className="col-md-3 mb-3 position-relative" key={i}>
                    <img
                      src={`${BASE_URL}/images/${patientId}/originals/${img}`}
                      alt={img}
                      className="img-thumbnail"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', `${BASE_URL}/images/${patientId}/originals/${img}`);
                      }}
                      style={{
                        width: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                      }}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <button
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      style={{
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        padding: '0',
                        fontWeight: 'bold',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(img);
                      }}
                      title="Видалити зображення"
                    >
                      &times;
                    </button>
                    <div className="text-center small text-muted mt-1">{img}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Підтвердження</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ви впевнені, що хочете <strong>видалити</strong> зображення <br />
          <code>{selectedImage}</code>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Скасувати
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Видалити
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageGallery;
