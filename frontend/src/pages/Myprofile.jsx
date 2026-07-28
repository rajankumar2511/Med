import React, { useEffect, useState } from 'react';
import { getMe } from '../lib/api';

const Myprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      const result = await getMe();

      if (result.success) {
        setUser(result.data?.user || result.data);
      } else {
        setError(result.message || 'Unable to load profile');
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-6 text-center">No profile found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">My Profile</h2>
        <div className="mt-4 space-y-2 text-gray-700">
          <p><span className="font-medium">Name:</span> {user.fullName || 'N/A'}</p>
          <p><span className="font-medium">Email:</span> {user.email || 'N/A'}</p>
          <p><span className="font-medium">Role:</span> {user.role || 'N/A'}</p>
          <p><span className="font-medium">Location:</span> {user.location || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
