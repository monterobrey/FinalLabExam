import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Save, X } from 'react-bootstrap-icons';
import api from '../../api';

export default function MedicalRecordForm({ patientId, onClose, existing }) {
  const [visitDate, setVisitDate] = useState('');
  const [prescription, setPrescription] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (existing) {
      setVisitDate(existing.visit_date);
      setPrescription(existing.prescription);
      setDiagnosis(existing.diagnosis || '');
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
          prescription,
          diagnosis,
        });
      } else {
        await api.post('/records', {
          patient_id: patientId,
          visit_date: visitDate,
          prescription,
          diagnosis,
        });
      }

      // Clear form and close modal
      setVisitDate('');
      setPrescription('');
      setDiagnosis('');
      onClose();
    } catch (error) {
      console.error('Error saving medical record:', error);
    }
  };

  return (
    <Container fluid className="px-0">
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Header className="bg-white border-bottom-0 px-4 py-3">
          <h5 className="mb-0 fw-semibold text-success">
            {existing ? 'Edit Medical Record' : 'Add Medical Record'}
          </h5>
        </Card.Header>
        <Card.Body className="px-4 py-4">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="formVisitDate">
                  <Form.Label className="fw-semibold">Visit Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select a date.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="mb-3">
                <Form.Group controlId="formDiagnosis">
                  <Form.Label className="fw-semibold">Diagnosis</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a diagnosis.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col className="mb-3">
                <Form.Group controlId="formPrescription">
                  <Form.Label className="fw-semibold">Prescription</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter prescription details"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide prescription details.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4"
                onClick={onClose}
              >
                <X className="me-2" />
                Cancel
              </Button>
              <Button
                variant="success"
                type="submit"
                className="rounded-pill px-4"
              >
                <Save className="me-2" />
                Save Record
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
