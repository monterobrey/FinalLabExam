import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Badge, Spinner, Container } from 'react-bootstrap';
import api from '../../api';

export default function PatientList({ onSelect, onEdit }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    setLoading(true);
    api.get('/patients')
      .then(res => setPatients(res.data))
      .catch(err => console.error('Error fetching patients:', err))
      .finally(() => setLoading(false));
  };

  const deletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      await api.delete(`/patients/${id}`);
      // Refresh the patient list after deletion
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      // You could add error handling UI here
    }
  };

  return (
    <Container fluid className="mt-3">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Patients</h5>
          <Badge bg="light" text="dark">
            {patients.length} {patients.length === 1 ? 'Patient' : 'Patients'}
          </Badge>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading patients...</p>
            </div>
          ) : patients.length === 0 ? (
            <p className="text-center text-muted my-4">No patients found.</p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td>{p.first_name} {p.last_name}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => onSelect(p)}
                        >
                          View Records
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => onEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => deletePatient(p.id)}
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