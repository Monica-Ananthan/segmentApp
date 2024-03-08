import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';


const SegmentCreator = () => {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [newSchema, setNewSchema] = useState('');
  const [newDropdownSchemas, setNewDropdownSchemas] = useState([]);
  const [webhookUrl, setWebhookUrl] = useState('https://webhook.site/3aca797b-08f2-4bf3-96c5-5a54d00c9954');
  const availableSchema = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ];

  const sendSegmentDataToServer = () => {
    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema]: availableSchema.find(item => item.value === schema).label }))
    };

    fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(segmentData)
    })
      .then(response => {
        if (response.ok) {
          alert('Segment data sent successfully!');
        }
      })
      .catch(error => {
        alert('Error: ' + error.message);
      });
  };

  const handleAddNewSchema = () => {
    if (newSchema && !selectedSchemas.includes(newSchema)) {
      const updatedSelectedSchemas = [...selectedSchemas, newSchema];
      const updatedNewDropdownSchemas = [...newDropdownSchemas, newSchema];
      setSelectedSchemas(updatedSelectedSchemas);
      setNewDropdownSchemas(updatedNewDropdownSchemas);
      setNewSchema('');
    }
  };


  const handleSaveSegment = () => {
    setSegmentName('');
    sendSegmentDataToServer();
    setShowModal(false);
  };


  return (
    <div className='main-wrap'>
      <Container>
        <Button variant='' className='prim-btn' onClick={() => setShowModal(true)}>Save segment</Button>

        <Modal className='segment-mod' show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Saving Segment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='form-group'>
              <label>Enter the Name of the Segment</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name of the segment"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
            </div>
            <div className='form-group'>

              {newDropdownSchemas.map((selectedSchema, index) => (
                <select
                  key={index}
                  className='form-select mb-3'
                  value={selectedSchema}
                  onChange={(e) => {
                    const updatedSchemas = [...selectedSchemas];
                    updatedSchemas[index] = e.target.value;
                    setSelectedSchemas(updatedSchemas);
                  }}
                >
                  <option value="">{availableSchema.find(item => item.value === selectedSchema).label}</option>
                  {availableSchema.filter(schema => !selectedSchemas.includes(schema.value)).map((available) => (
                    <option key={available.value} value={available.value}>{available.label}</option>
                  ))}
                </select>
              ))}
            </div>
            <select value={newSchema} onChange={(e) => setNewSchema(e.target.value)} className='form-select'>
              <option value="">Add schema to segment</option>
              {availableSchema.filter(schema => !selectedSchemas.includes(schema.value)).map((schema) => (
                <option key={schema.value} value={schema.value}>
                  {schema.label}
                </option>
              ))}
            </select>
            <button onClick={handleAddNewSchema} className='link-btn'>+ Add new schema</button>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="" className='btn-save' onClick={handleSaveSegment}>Save Segment</Button>
            <Button variant="" className='btn-cancel' onClick={() => setShowModal(false)}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default SegmentCreator;