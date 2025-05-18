import api from '../api/api';

// === Patient Info ===
export async function getPatientData(id) {
  const res = await api.get(`/patient/getPatientData`, { params: { id } });
  return res.data;
}

export async function updatePatientField(patientId, field, value) {
  const body = {
    patient_id: patientId,
    change: field,
    [field]: value,
  };
  return api.post('/patient/changePatientData', body);
}

// === Regular Analyses ===
export async function getRegularAnalyses(patientId) {
  const res = await api.get('/patient/getRegularAnalyses', { params: { id: patientId } });
  return res.data;
}

export async function createRegularAnalysis(patientId) {
  const res = await api.post('/patient/createRegularAnalyses',  {}, {
    params: { id: patientId }
  });
  return res.data.analysisId;
}

export async function updateRegularAnalysisHeader(regularId, HeaderText) {
  await api.post('/patient/updateRegularAnalysesHeader', { HeaderText }, {
    params: { regular_id: regularId }
  });
}

export async function updateRegularAnalysisText(regularId, AnalysisText) {
  await api.post('/patient/updateRegularAnalysesText', { AnalysisText }, {
    params: { regular_id: regularId }
  });
}

export async function deleteRegularAnalysis(regularId) {
  await api.post('/patient/deleteRegularAnalyses',  {}, {
    params: { regular_id: regularId }
  });
}

// === Liver Analyses ===
export async function getLiverAnalyses(patientId) {
  const res = await api.get('/patient/getLiverAnalyses', { params: { id: patientId } });
  return res.data;
}

export async function createLiverAnalysis(patientId) {
  const res = await api.post('/patient/createLiverAnalyses',  {}, {
    params: { id: patientId }
  });
  return res.data.analysisId;
}

export async function updateLiverAnalysisHeader(liverId, HeaderText) {
  await api.post('/patient/updateLiverAnalysesHeader', { HeaderText }, {
    params: { liver_id: liverId }
  });
}

export async function updateLiverAnalysisImage(patientId, liverId, base64image) {
  let updateLiverAnalysesImageReq = await api.post(
    '/patient/updateLiverAnalysesImage',
    { file: base64image }, 
    {
      params: { liver_id: liverId, patient_id: patientId },
      headers: { 'Content-Type': 'application/json' },
    }
  );
  console.log('updateLiverAnalysesImageReq', updateLiverAnalysesImageReq.data.fileName);
  return updateLiverAnalysesImageReq.data.fileName;
}



export async function analyzeLiverImage(patientId, liverId, type, sensor) {
  const res = await api.post('/patient/analyzeLiverImage', {
    patient_id: patientId,
    liver_id: liverId,
    type,
    sensor
  });
  return res.data;
}

export async function deleteLiverAnalysis(liverId) {
  await api.post('/patient/deleteLiverAnalyses',  {}, {
    params: { liver_id: liverId }
  });
}

// === Gallery ===
export async function getGalleryImages(patientId) {
  const res = await api.get('/patient/getGalleryImages', {
    params: { id: patientId }
  });
  return res.data;
}

export async function addImageToGallery(patientId, file) {
  const formData = new FormData();
  formData.append('file', file); 

  const res = await api.post('/patient/addImageToGallery', formData, {
    params: { id: patientId },
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return res.data?.fileName;
}


export async function deleteImageFromGallery(patientId, fileName) {
  await api.post('/patient/deleteImageFromGallery', { fileName }, {
    params: { id: patientId }
  });
}
