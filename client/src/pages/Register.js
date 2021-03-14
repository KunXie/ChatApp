import React, { useState } from "react";

import { Row, Col, Form, Button } from "react-bootstrap";

const Register = () => {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const submitRegisterForm = (e) => {
    // by default it will refresh the page
    e.preventDefault();
    console.log(variables);
  };
  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={variables.email}
              onChange={(e) =>
                setVariables((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={variables.username}
              onChange={(e) =>
                setVariables((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={variables.password}
              onChange={(e) =>
                setVariables((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={variables.confirmPassword}
              onChange={(e) =>
                setVariables((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};
export default Register;
