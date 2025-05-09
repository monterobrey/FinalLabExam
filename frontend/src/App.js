import React, { useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import PatientList from './components/Patients/PatientList';
import PatientForm from './components/Patients/PatientForm';
import MedicalRecordList from './components/Records/MedicalRecordList';
import MedicalRecordForm from './components/Records/MedicalRecordForm';

function App() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [refreshRecords, setRefreshRecords] = useState(0);

  const resetPatientForm = () => {
    setShowPatientForm(false);
    setEditingPatient(null);
  };

  const resetRecordForm = () => {
    setShowRecordForm(false);
    setEditingRecord(null);
    // Trigger a refresh of the records list
    setRefreshRecords(prev => prev + 1);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Mapatay Medical Clinic</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {selectedPatient && (
                <Nav.Link onClick={() => setSelectedPatient(null)}>
                  Back to Patients
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mb-5">
        {!selectedPatient ? (
          <>
            {showPatientForm || editingPatient ? (
              <div className="mb-4">
                <PatientForm
                  onClose={resetPatientForm}
                  existing={editingPatient}
                />
              </div>
            ) : (
              <>
                <Row className="mb-4">
                  <Col>
                    <div className="d-flex justify-content-between align-items-center">
                      <h2>Patient Management</h2>
                      <Button 
                        variant="success" 
                        onClick={() => setShowPatientForm(true)}
                      >
                        + Add Patient
                      </Button>
                    </div>
                  </Col>
                </Row>
                <PatientList
                  onSelect={setSelectedPatient}
                  onEdit={setEditingPatient}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Row className="mb-4">
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Button 
                      variant="outline-secondary" 
                      className="mb-2"
                      onClick={() => setSelectedPatient(null)}
                    >
                      ← Back to Patients
                    </Button>
                    <h2 className="mt-2">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </h2>
                  </div>
                  {!showRecordForm && !editingRecord && (
                    <Button 
                      variant="success" 
                      onClick={() => setShowRecordForm(true)}
                    >
                      + Add Medical Record
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
            
            {showRecordForm || editingRecord ? (
              <div className="mb-4">
                <MedicalRecordForm
                  patientId={selectedPatient.id}
                  onClose={resetRecordForm}
                  existing={editingRecord}
                />
              </div>
            ) : null}
            
            <MedicalRecordList
              patient={selectedPatient}
              onEdit={setEditingRecord}
              refreshTrigger={refreshRecords}
            />
          </>
        )}
      </Container>

      <footer className="bg-light py-3 mt-5">
        <Container className="text-center text-muted">
          <p className="mb-0">© 2025 Mapatay Medical Clinic. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
}

export default App;