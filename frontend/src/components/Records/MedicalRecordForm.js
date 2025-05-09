import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';
import api from '../../api';

export default function MedicalRecordForm({ patientId, onClose, existing }) {
  const [visitDate, setVisitDate] = useState('');
  const [prescription, setPrescription] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (existing) {
      setVisitDate(existing.visit_date);
      setPrescription(existing.prescription);
    }
  }, [existing]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      if (existing) {
        await api.put(`/records/${existing.id}`, {
          visit_date: visitDate,
          prescription
        });
      } else {
        await api.post('/records', {
          patient_id: patientId,
          visit_date: visitDate,
          prescription
        });
      }
      // Clear form fields after successful submission
      setVisitDate('');
      setPrescription('');
      onClose();
    } catch (error) {
      console.error('Error saving medical record:', error);
      // You could add error handling UI here
    }
  };

  return (
    <Container fluid>
      <Card className="shadow-sm">
        <Card.Header as="h5" className="bg-primary text-white">
          {existing ? 'Edit Medical Record' : 'Add Medical Record'}
        </Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formVisitDate">
              <Form.Label>Visit Date</Form.Label>
              <Form.Control
                type="date"
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please select a date.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPrescription">
              <Form.Label>Prescription</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter prescription details"
                value={prescription}
                onChange={e => setPrescription(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide prescription details.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}