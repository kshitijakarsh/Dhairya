import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL, STORAGE_KEYS } from '../../constants';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const InvoiceViewer = () => {
  const { membershipId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        const response = await fetch(
          `${API_BASE_URL}/invoices/${membershipId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch invoice');
        }

        // Convert the PDF blob to a URL
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice');
        navigate('/user/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (membershipId) {
      fetchInvoice();
    }

    // Cleanup function to revoke the URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [membershipId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-4"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Membership Invoice</h1>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        <div className="p-4">
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-[800px] border-0 rounded-md"
              title="Membership Invoice"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceViewer; 