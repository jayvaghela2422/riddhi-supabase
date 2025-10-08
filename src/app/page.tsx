'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from './supabase/client';
import { useAuth } from '../contexts/AuthContext';
import AddBusinessForm from '../components/AddBusinessForm';
import EditBusinessForm from '../components/EditBusinessForm';
import DeleteBusinessModal from '../components/DeleteBusinessModal';
import ViewBusinessDetailsModal from '../components/ViewBusinessDetailsModal';
import AuthForm from '../components/AuthForm';

type Biz = { 
  id: string; 
  name: string; 
  category: string; 
  city: string | null; 
  owner: string; 
  created_at: string; 
};

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createBrowserClient();
  const [biz, setBiz] = useState<Biz[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBusiness, setEditingBusiness] = useState<Biz | null>(null);
  const [deletingBusiness, setDeletingBusiness] = useState<Biz | null>(null);
  const [viewingBusiness, setViewingBusiness] = useState<Biz | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBusinesses = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });
      setBiz((data as Biz[]) || []);
      setLoading(false);
    };

    fetchBusinesses();

    // Set up realtime subscription
    const channel = supabase
      .channel('db')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'businesses' },
        (payload) => {
          console.log('New business added:', payload.new);
          setBiz(prev => [payload.new as Biz, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'businesses' },
        (payload) => {
          console.log('Business updated:', payload.new);
          setBiz(prev => prev.map(b => b.id === payload.new.id ? payload.new as Biz : b));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'businesses' },
        (payload) => {
          console.log('Business deleted:', payload.old);
          setBiz(prev => prev.filter(b => b.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const handleBusinessUpdated = (updatedBusiness: Biz) => {
    setBiz(prev => prev.map(b => b.id === updatedBusiness.id ? updatedBusiness : b));
    setEditingBusiness(null);
  };

  const handleBusinessDeleted = (businessId: string) => {
    setBiz(prev => prev.filter(b => b.id !== businessId));
    setDeletingBusiness(null);
  };

  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuthSuccess={() => window.location.reload()} />;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #eee'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>Go Shop Black - Businesses</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666' }}>Welcome, {user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <AddBusinessForm onCreated={(r) => setBiz(p => [r, ...p])} />

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>All Businesses</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading businesses...</p>
        ) : (
          <div style={{ 
            overflow: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'white'
            }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>City</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {biz.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                      No businesses found. Be the first to add one!
                    </td>
                  </tr>
                ) : (
                  biz.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>{b.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.875rem'
                        }}>
                          {b.category}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#666' }}>{b.city || 'N/A'}</td>
                      <td style={{ padding: '1rem', color: '#666', fontSize: '0.875rem' }}>
                        {new Date(b.created_at).toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setViewingBusiness(b)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            View Details
                          </button>
                          {user && user.id === b.owner && (
                            <>
                              <button
                                onClick={() => setEditingBusiness(b)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#ffc107',
                                  color: '#000',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeletingBusiness(b)}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Business Modal */}
      {editingBusiness && (
        <EditBusinessForm
          business={editingBusiness}
          onUpdated={handleBusinessUpdated}
          onCancel={() => setEditingBusiness(null)}
        />
      )}

      {/* Delete Business Modal */}
      {deletingBusiness && (
        <DeleteBusinessModal
          business={deletingBusiness}
          onDeleted={handleBusinessDeleted}
          onCancel={() => setDeletingBusiness(null)}
        />
      )}

      {/* View Business Details Modal */}
      {viewingBusiness && (
        <ViewBusinessDetailsModal
          business={viewingBusiness}
          onClose={() => setViewingBusiness(null)}
        />
      )}
    </div>
  );
}