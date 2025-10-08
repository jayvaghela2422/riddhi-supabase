'use client';
import { useAuth } from '../contexts/AuthContext';

interface Business {
  id: string;
  name: string;
  category: string;
  city: string | null;
  owner: string;
  created_at: string;
}

interface ViewBusinessDetailsModalProps {
  business: Business;
  onClose: () => void;
}

export default function ViewBusinessDetailsModal({ business, onClose }: ViewBusinessDetailsModalProps) {
  const { user } = useAuth();
  const isOwner = user?.id === business.owner;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '1rem',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #eee'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>Business Details</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              Business Name
            </label>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              color: '#333'
            }}>
              {business.name}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              Category
            </label>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px'
            }}>
              <span style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {business.category}
              </span>
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              City
            </label>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              color: business.city ? '#333' : '#666'
            }}>
              {business.city || 'Not specified'}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              Owner
            </label>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              color: '#333'
            }}>
              {isOwner ? (user?.email || 'You') : 'Other User'}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              Created Date
            </label>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              color: '#333'
            }}>
              {new Date(business.created_at).toLocaleString()}
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '0.5rem' 
            }}>
              Business ID
            </label>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              color: '#666',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              {business.id}
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
