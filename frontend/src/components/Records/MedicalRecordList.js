import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Card,
  Badge,
  Spinner,
  Container,
  Alert,
} from 'react-bootstrap';
import { Pencil, Trash } from 'react-bootstrap-icons';
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

    api
      .get(`/patients/${patient.id}/records`)
      .then((res) => setRecords(res.data))
      .catch((err) => {
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!patient) {
    return (
      <Container fluid className="mt-3">
        <Alert variant="info">Please select a patient to view their medical records.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-3">
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Header className="bg-white border-bottom-0 px-4 py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold text-success">
            Medical Records for {patient.first_name} {patient.last_name}
          </h5>
          <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
            {records.length} {records.length === 1 ? 'Record' : 'Records'}
          </Badge>
        </Card.Header>
        <Card.Body className="px-4 py-4">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2 text-muted">Loading medical records...</p>
            </div>
          ) : records.length === 0 ? (
            <p className="text-center text-muted my-4">
              No medical records found for this patient.
            </p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Visit Date</th>
                  <th>Diagnosis</th>
                  <th>Prescription</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-medium">{formatDate(r.visit_date)}</td>
                    <td>
                      <div
                        style={{
                          maxHeight: '120px',
                          overflow: 'auto',
                          whiteSpace: 'pre-wrap',
                          background: '#f8f9fa',
                          padding: '0.5rem',
                          borderRadius: '0.4rem',
                        }}
                      >
                        {r.diagnosis}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          maxHeight: '120px',
                          overflow: 'auto',
                          whiteSpace: 'pre-wrap',
                          background: '#f8f9fa',
                          padding: '0.5rem',
                          borderRadius: '0.4rem',
                        }}
                      >
                        {r.prescription}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => onEdit(r)}
                        >
                          <Pencil className="me-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-pill"
                          onClick={() => deleteRecord(r.id)}
                        >
                          <Trash className="me-1" />
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