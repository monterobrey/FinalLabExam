import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Eye, PencilSquare, Trash3 } from 'react-bootstrap-icons';
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
    if (!window.confirm('Delete this patient?')) return;

    try {
      await api.delete(`/patients/${id}`);
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <Container fluid className="py-4 px-3 px-md-5 bg-light min-vh-100">

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <Spinner animation="border" variant="primary" />
              <div className="mt-3 text-muted">Loading patients...</div>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-5 text-muted fs-5">No patients found.</div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-white text-secondary border-bottom fs-sm">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, index) => (
                  <tr key={p.id} className="align-middle">
                    <td className="py-3 px-4 text-muted">{index + 1}</td>
                    <td className="py-3 px-4 fw-semibold">
                      {p.first_name} {p.last_name}
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="d-inline-flex gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          className="border shadow-sm"
                          onClick={() => onSelect(p)}
                          title="View Records"
                        >
                          <Eye className="me-1" /> View
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="border shadow-sm"
                          onClick={() => onEdit(p)}
                          title="Edit Patient"
                        >
                          <PencilSquare className="me-1" /> Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="text-white"
                          onClick={() => deletePatient(p.id)}
                          title="Delete Patient"
                        >
                          <Trash3 className="me-1" /> Delete
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
