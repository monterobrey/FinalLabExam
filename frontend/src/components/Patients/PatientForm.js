import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { X, Save } from 'react-bootstrap-icons';
import api from '../../api';

export default function PatientForm({ onClose, existing }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (existing) {
      setFirstName(existing.first_name);
      setLastName(existing.last_name);
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
        await api.put(`/patients/${existing.id}`, {
          first_name: firstName,
          last_name: lastName
        });
      } else {
        await api.post('/patients', {
          first_name: firstName,
          last_name: lastName
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  return (
    <Container fluid className="px-0">
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Header className="bg-white border-bottom-0 px-4 py-3">
          <h5 className="mb-0 fw-semibold text-primary">
            {existing ? 'Edit Patient' : 'Add New Patient'}
          </h5>
        </Card.Header>
        <Card.Body className="px-4 py-4">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formFirstName">
                  <Form.Label className="fw-semibold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a first name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLastName">
                  <Form.Label className="fw-semibold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a last name.
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
                variant="primary"
                type="submit"
                className="rounded-pill px-4"
              >
                <Save className="me-2" />
                Save Patient
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
