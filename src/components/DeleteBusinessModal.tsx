'use client';
import { useState } from 'react';
import { createBrowserClient } from '../app/supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface Business {
  id: string;
  name: string;
  category: string;
  city: string | null;
  owner: string;
  created_at: string;
}

interface DeleteBusinessModalProps {
  business: Business;
  onDeleted: (businessId: string) => void;
  onCancel: () => void;
}

export default function DeleteBusinessModal({ business, onDeleted, onCancel }: DeleteBusinessModalProps) {
  const supabase = createBrowserClient();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Check if user owns this business
  const isOwner = user?.id === business.owner;

  async function handleDelete() {
    if (!user || !isOwner) {
      setMsg('You can only delete businesses you own.');
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', business.id)
        .eq('owner', user.id); // Double-check ownership

      if (error) {
        setMsg(error.message);
        setLoading(false);
      } else {
        onDeleted(business.id);
        // Modal will close automatically via onDeleted callback
      }
    } catch (error) {
      setMsg('An unexpected error occurred');
      setLoading(false);
    }
  }

  if (!isOwner) {
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
          maxWidth: '400px',
          margin: '1rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#dc3545' }}>Access Denied</h3>
          <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
            You can only delete businesses you own.
          </p>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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
        maxWidth: '400px',
        margin: '1rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#dc3545' }}>Delete Business</h3>
        <p style={{ color: '#666', margin: '0 0 1rem 0' }}>
          Are you sure you want to delete "<strong>{business.name}</strong>"? This action cannot be undone.
        </p>
        
        {msg && (
          <p style={{
            color: '#dc3545',
            margin: '0 0 1rem 0',
            padding: '0.5rem',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px'
          }}>
            {msg}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#6c757d' : '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
