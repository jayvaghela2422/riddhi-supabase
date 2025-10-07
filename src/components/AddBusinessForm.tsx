'use client';
import { useState } from 'react';
import { createBrowserClient } from '../app/supabase/client';
import { useAuth } from '../contexts/AuthContext';

interface AddBusinessFormProps {
  onCreated: (row: any) => void;
}

export default function AddBusinessForm({ onCreated }: AddBusinessFormProps) {
  const supabase = createBrowserClient();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    if (!user) {
      setMsg('Please sign in first.');
      setLoading(false);
      return;
    }

    try {
      console.log('user', user);
      const { data, error } = await supabase
        .from('businesses')
        .insert({ 
          name, 
          category, 
          city: city || null, 
          owner: user.id 
        })
        .select('*')
        .single();

      if (error) {
        setMsg(error.message);
      } else {
        onCreated(data);
        setName('');
        setCategory('');
        setCity('');
        setMsg('Business created successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (error) {
      setMsg('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        borderRadius: '4px',
        color: '#856404'
      }}>
        Please sign in to add a business.
      </div>
    );
  }

  return (
    <div style={{ 
      margin: '2rem 0', 
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #ddd'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>Add New Business</h3>
      <form onSubmit={submit} style={{ 
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
        
        <button 
          type='submit' 
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Creating...' : 'Add Business'}
        </button>
        
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
  );
}