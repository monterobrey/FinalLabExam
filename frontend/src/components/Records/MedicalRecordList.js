import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Badge, Spinner, Container, Alert } from 'react-bootstrap';
import api from '../../api';

export default function MedicalRecordList({ patient, onEdit, refreshTrigger = 0 }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patient?.id) {
      fetchRecords();
    }
  }, [patient, refreshTrigger]);

  const fetchRecords = () => {
    setLoading(true);
    setError(null);
    
    api.get(`/patients/${patient.id}/records`)
      .then(res => setRecords(res.data))
      .catch(err => {
        console.error('Error fetching records:', err);
        setError('Failed to load medical records. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medical record?')) return;
    
    try {
      await api.delete(`/records/${id}`);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Failed to delete the record. Please try again.');
    }
  };

  // Format date for better display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!patient) {
    return (
      <Container fluid className="mt-3">
        <Alert variant="info">
          Please select a patient to view their medical records.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Medical Records for {patient.first_name} {patient.last_name}
          </h5>
          <Badge bg="light" text="dark">
            {records.length} {records.length === 1 ? 'Record' : 'Records'}
          </Badge>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading medical records...</p>
            </div>
          ) : records.length === 0 ? (
            <p className="text-center text-muted my-4">No medical records found for this patient.</p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Visit Date</th>
                  <th>Prescription</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td>{formatDate(r.visit_date)}</td>
                    <td>
                      <div style={{ maxHeight: '100px', overflow: 'auto' }}>
                        {r.prescription}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => onEdit(r)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => deleteRecord(r.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}