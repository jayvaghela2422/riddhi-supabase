'use client';
import { useState, useEffect } from 'react';
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

interface EditBusinessFormProps {
  business: Business;
  onUpdated: (updatedBusiness: Business) => void;
  onCancel: () => void;
}

export default function EditBusinessForm({ business, onUpdated, onCancel }: EditBusinessFormProps) {
  const supabase = createBrowserClient();
  const { user } = useAuth();
  const [name, setName] = useState(business.name);
  const [category, setCategory] = useState(business.category);
  const [city, setCity] = useState(business.city || '');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user owns this business
  const isOwner = user?.id === business.owner;

  useEffect(() => {
    if (!isOwner) {
      setMsg('You can only edit businesses you own.');
    }
  }, [isOwner]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    if (!user || !isOwner) {
      setMsg('You can only edit businesses you own.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('businesses')
        .update({ 
          name, 
          category, 
          city: city || null
        })
        .eq('id', business.id)
        .eq('owner', user.id) // Double-check ownership
        .select('*')
        .single();

      if (error) {
        setMsg(error.message);
      } else {
        onUpdated(data);
        setMsg('Business updated successfully!');
        // Auto-close after 2 seconds
        setTimeout(() => {
          onCancel();
        }, 2000);
      }
    } catch (error) {
      setMsg('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (!isOwner) {
    return (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        borderRadius: '4px',
        color: '#856404',
        margin: '1rem 0'
      }}>
        You can only edit businesses you own.
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
    }}
    onClick={(e) => {
      // Close modal when clicking on the backdrop
      if (e.target === e.currentTarget) {
        onCancel();
      }
    }}
    >
      <div style={{ 
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '1rem',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #eee'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>Edit Business</h3>
          <button
            onClick={onCancel}
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
      <form onSubmit={handleSubmit} style={{ 
        display: 'grid', 
        gap: '1rem', 
        maxWidth: '500px' 
      }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: '#333'
          }}>
            Business Name *
          </label>
          <input
            placeholder='Enter business name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: '#333'
          }}>
            Category *
          </label>
          <input
            placeholder='e.g., Restaurant, Retail, Services'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: '#333'
          }}>
            City
          </label>
          <input
            placeholder='Enter city (optional)'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem'
        }}>
          <button 
            type='button'
            onClick={onCancel}
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
            Cancel
          </button>
          
          <button 
            type='submit' 
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Updating...' : 'Update Business'}
          </button>
        </div>
        
        {msg && (
          <p style={{
            color: msg.includes('successfully') ? '#28a745' : '#dc3545',
            margin: '0.5rem 0 0 0',
            padding: '0.5rem',
            backgroundColor: msg.includes('successfully') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${msg.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`,
            borderRadius: '4px'
          }}>
            {msg}
          </p>
        )}
      </form>
      </div>
    </div>
  );
}
