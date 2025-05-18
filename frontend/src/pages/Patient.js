import React, { useEffect, useState, useRef } from 'react';
import PatientForm from '../components/PatientForm';
import RegularAnalysis from '../components/RegularAnalysis';
import LiverAnalysis from '../components/LiverAnalysis';
import ImageGallery from '../components/ImageGallery';
import CropModal from '../components/CropModal';
import Spinner from '../components/Spinner';
import { getPatientData } from '../components/patientApi';
import { useParams } from 'react-router-dom';
import { updateLiverAnalysisImage } from '../components/patientApi';
import Navbar from '../components/Navbar';
import Topbar from '../components/Topbar';

const Patient = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageFile, setCropImageFile] = useState(null);
  const [activeLiverId, setActiveLiverId] = useState(null);
  const updateImageLocallyRef = useRef(() => { });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getPatientData(id);
      setPatient(data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const openCropper = (file, liverId) => {
    setCropImageFile(file);
    setActiveLiverId(liverId);
    setShowCropModal(true);
  };

  const closeCropper = () => {
    setShowCropModal(false);
    setCropImageFile(null);
    setActiveLiverId(null);
  };

  const handleCropComplete = (liverId, blob) => {
    if (!blob) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        const fileName = await updateLiverAnalysisImage(id, liverId, base64);
        updateImageLocallyRef.current(liverId, base64, fileName);
        closeCropper();
      } catch (err) {
        console.error('❌ Ошибка обновления изображения:', err);
      }
    };
    reader.readAsDataURL(blob);
  };

  if (loading) return <Spinner />;

  return (
    <div className="d-flex flex-column vh-100">
      <Topbar />
      <div className="d-flex flex-grow-1">
        <Navbar />
        <div className="container-fluid pt-4 px-4">
          <PatientForm patient={patient} />
          <RegularAnalysis patientId={id} />
          <LiverAnalysis
            patientId={id}
            openCropper={openCropper}
            setImageUpdater={updateImageLocallyRef}
          />

          <ImageGallery patientId={id} openCropper={openCropper} />
          <CropModal
            show={showCropModal}
            imageUrl={cropImageFile ? URL.createObjectURL(cropImageFile) : null}
            onClose={closeCropper}
            onCrop={(blob) => handleCropComplete(activeLiverId, blob)}
          />
        </div>
      </div>
    </div>
  );
};

export default Patient;
