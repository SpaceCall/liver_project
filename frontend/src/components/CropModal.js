import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'cropperjs';


const CropModal = ({ show, onClose, onCrop, imageUrl }) => {
  const imageRef = useRef(null);
  const cropperRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log(imageUrl);
  useEffect(() => {
    if (!show) return;

    return () => {
      cropperRef.current?.destroy();
      cropperRef.current = null;
      setImageLoaded(false);
    };
  }, [show]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
        viewMode: 1,
        autoCropArea: 0.5,
        responsive: true,
        background: false,
        scalable: true,
        zoomable: true,
      });
      setImageLoaded(true);
    }
  };

  const handleCrop = () => {
    
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas();
      canvas.toBlob((blob) => {
        onCrop(blob); 
        onClose();
      }, 'image/png');
    }
  };
  

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-xl" style={{ maxWidth: '95vw', width: '95vw', height: '85vh' }}>
        <div className="modal-content" style={{ height: '100%' }}>
          <div className="modal-header">
            <h5 className="modal-title">Обрізання зображення</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ height: '100%', overflow: 'hidden' }}>
            <div
              className="img-container"
              style={{
                width: '100%',
                height: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
              }}
            >
              {imageUrl && (
                <img
                  ref={imageRef}
                  src={imageUrl || ''}
                  onLoad={handleImageLoad}
                  alt="To crop"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />

              )}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Відмінити
            </button>
            <button className="btn btn-primary" onClick={handleCrop} disabled={!imageLoaded}>
              Обрізати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
