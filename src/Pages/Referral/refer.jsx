import React, { useState } from 'react';
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
import './refer.scss'; 

function Refer() {
  const [showModal, setShowModal] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const referralCode = localStorage.getItem('ReferralCode'); 

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const generateReferralLink = () => {
    const link = `https://Play929.com/?r=${referralCode}`;
    setReferralLink(link);
    handleShow();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => alert('Copied to clipboard'))
      .catch((err) => console.error('Failed to copy:', err));
  };

  return (
    <>
      <Button variant="primary" onClick={generateReferralLink}>
        Referral
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        
        <Modal.Body>
            
          <p>{`https://Play929.com/?r=${referralCode}`}</p>
          <InputGroup className="mb-3">
            <FormControl
              readOnly
              value={`https://Play929.com/?r=${referralCode}`}
            />
            <Button variant="outline-secondary" onClick={copyToClipboard}>
              Copy
            </Button>
            <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          </InputGroup>
          
        </Modal.Body>
        
      </Modal>
    </>
  );
}

export default Refer;
