import { useState, useEffect } from 'react';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [consentDate, setConsentDate] = useState(null);

  useEffect(() => {
    // Carregar consentimento do localStorage
    const savedConsent = localStorage.getItem('cookie_consent');
    const savedDate = localStorage.getItem('cookie_consent_date');
    
    if (savedConsent) {
      setConsent(savedConsent);
      setConsentDate(savedDate ? new Date(savedDate) : null);
    }
  }, []);

  const updateConsent = (newConsent) => {
    setConsent(newConsent);
    setConsentDate(new Date());
    
    localStorage.setItem('cookie_consent', newConsent);
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
  };

  const clearConsent = () => {
    setConsent(null);
    setConsentDate(null);
    
    localStorage.removeItem('cookie_consent');
    localStorage.removeItem('cookie_consent_date');
  };

  const hasConsented = () => {
    return consent !== null;
  };

  const hasAcceptedAll = () => {
    return consent === 'all';
  };

  const hasAcceptedEssential = () => {
    return consent === 'essential';
  };

  const hasRejected = () => {
    return consent === 'rejected';
  };

  const getConsentAge = () => {
    if (!consentDate) return null;
    
    const now = new Date();
    const diffTime = Math.abs(now - consentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const shouldShowConsent = () => {
    // Mostrar se não há consentimento ou se passou mais de 1 ano
    if (!consent) return true;
    
    const consentAge = getConsentAge();
    // Só mostrar se passou mais de 365 dias (1 ano)
    return consentAge && consentAge > 365;
  };

  return {
    consent,
    consentDate,
    updateConsent,
    clearConsent,
    hasConsented,
    hasAcceptedAll,
    hasAcceptedEssential,
    hasRejected,
    getConsentAge,
    shouldShowConsent
  };
}; 