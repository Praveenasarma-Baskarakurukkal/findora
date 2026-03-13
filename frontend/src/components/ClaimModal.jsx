import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ClaimModal.css';
import NICClaim from './claims/NICClaim';
import IDClaim from './claims/IDClaim';
import BankCardClaim from './claims/BankCardClaim';
import PurseClaim from './claims/PurseClaim';
import OtherItemClaim from './claims/OtherItemClaim';
import OTPDisplay from './OTPDisplay';
import { claimsAPI } from '../services/api';

const ClaimModal = ({ isOpen, onClose, item }) => {
  const [currentStep, setCurrentStep] = useState('select'); // select, form, otp
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [claimData, setClaimData] = useState(null);
  const [claimError, setClaimError] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);

  const submitClaim = async (userData) => {
    setClaimError('');
    setClaimLoading(true);
    try {
      const response = await claimsAPI.create(item.id);
      setClaimData(userData);
      setGeneratedOTP(response.data.otp);
      setCurrentStep('otp');
    } catch (error) {
      setClaimError(error.response?.data?.message || 'Failed to submit claim. Please try again.');
    } finally {
      setClaimLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const getCategoryComponent = () => {
    switch (item.category?.toLowerCase()) {
      case 'nic':
        return (
          <NICClaim
            item={item}
            onSubmit={submitClaim}
            onCancel={() => setCurrentStep('select')}
          />
        );
      case 'student id':
      case 'staff id':
        return (
          <IDClaim
            item={item}
            idType={item.category}
            onSubmit={submitClaim}
            onCancel={() => setCurrentStep('select')}
          />
        );
      case 'bank cards':
      case 'bank card':
        return (
          <BankCardClaim
            item={item}
            onSubmit={submitClaim}
            onCancel={() => setCurrentStep('select')}
          />
        );
      case 'purse':
      case 'wallet':
      case 'purse / wallet':
        return (
          <PurseClaim
            item={item}
            onSubmit={submitClaim}
            onCancel={() => setCurrentStep('select')}
          />
        );
      default:
        return (
          <OtherItemClaim
            item={item}
            onSubmit={submitClaim}
            onCancel={() => setCurrentStep('select')}
          />
        );
    }
  };

  const modalContent = (
    <>
      <div className="claim-modal-backdrop" onClick={onClose}></div>

      <div className="claim-modal" role="dialog" aria-modal="true" aria-label="Claim item form">
        <div className="modal-header">
          <h2>Claim Item</h2>
          <button className="claim-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {currentStep === 'select' && (
            <div className="category-form">
              <h3>Item: {item.name}</h3>
              <p className="category-desc">Preparing claim form for {item.category}</p>
              <button
                onClick={() => setCurrentStep('form')}
                className="btn btn-primary"
              >
                Continue to Claim
              </button>
            </div>
          )}

          {currentStep === 'form' && (
            <>
              {claimError && (
                <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{claimError}</p>
              )}
              {claimLoading ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Submitting claim...</p>
              ) : getCategoryComponent()}
            </>
          )}

          {currentStep === 'otp' && (
            <OTPDisplay
              otp={generatedOTP}
              category={item.category}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ClaimModal;
