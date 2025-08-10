'use client';

import { useAuthStore } from '@/store';

export default function DebugAuthPage() {
  const { user, token, isAuthenticated, loading } = useAuthStore();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Debug Info</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">Is Authenticated:</h3>
          <p>{isAuthenticated ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">Loading:</h3>
          <p>{loading ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">Token:</h3>
          <p>{token ? 'Present' : 'Not present'}</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">User Data:</h3>
          <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">LocalStorage Token:</h3>
          <p>{typeof window !== 'undefined' ? localStorage.getItem('auth-token') || 'Not found' : 'SSR'}</p>
        </div>
      </div>
    </div>
  );
}
