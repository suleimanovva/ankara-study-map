import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();
  const [pendingSpots, setPendingSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==============================
  // LOAD PENDING SPOTS
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem('token'); // ✅ FIXED

    if (!token) {
      alert("Access denied. Admin only.");
      navigate('/');
      return;
    }

    fetch('http://localhost:5000/api/venues/admin/pending', { // ✅ FIXED
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized or server error");
        return res.json();
      })
      .then(data => {
        setPendingSpots(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Admin fetch error:", err);
        alert("Failed to load dashboard. Make sure you have Admin rights!");
        navigate('/');
      });
  }, [navigate]);

  // ==============================
  // APPROVE
  // ==============================
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token'); // ✅ FIXED

      const res = await fetch(
        `http://localhost:5000/api/venues/admin/${id}/approve`, // ✅ FIXED
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        setPendingSpots(prev => prev.filter(spot => spot.id !== id));
        alert("Spot successfully approved and added to the map! ✅");
      } else {
        alert("Error approving spot.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // REJECT
  // ==============================
  const handleReject = async (id) => {
    const confirmReject = window.confirm("Are you sure you want to completely delete this spot?");
    if (!confirmReject) return;

    try {
      const token = localStorage.getItem('token'); // ✅ FIXED

      const res = await fetch(
        `http://localhost:5000/api/venues/admin/${id}/reject`, // ✅ FIXED
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (res.ok) {
        setPendingSpots(prev => prev.filter(spot => spot.id !== id));
        alert("Spot rejected and deleted. ❌");
      } else {
        alert("Error rejecting spot.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] pt-20 px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-emerald-600 font-bold hover:underline mb-8 inline-block">
          ← Back to Main Map
        </Link>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-gray-500 mb-10">
            Review and approve suggested study spots before they go public.
          </p>

          {isLoading ? (
            <div className="text-center py-10 italic text-gray-500">
              Loading pending spots...
            </div>
          ) : pendingSpots.length === 0 ? (
            <div className="bg-gray-50 p-10 rounded-2xl text-center border border-gray-200">
              <span className="text-4xl mb-4 block">🎉</span>
              <p className="text-gray-600 font-bold text-lg">All caught up!</p>
              <p className="text-gray-500">
                There are no pending spots to review right now.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 text-gray-400 uppercase tracking-wider text-sm">
                    <th className="p-4 font-bold">Venue Name</th>
                    <th className="p-4 font-bold">Address</th>
                    <th className="p-4 font-bold">Amenities</th>
                    <th className="p-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSpots.map(spot => (
                    <tr key={spot.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{spot.name}</td>
                      <td className="p-4 text-gray-500 text-sm max-w-xs truncate" title={spot.address}>
                        {spot.address}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 text-xl">
                          {spot.outlet_availability && <span title="Has Outlets">🔌</span>}
                          {spot.has_food && <span title="Has Food/Coffee">☕</span>}
                        </div>
                      </td>
                      <td className="p-4 flex justify-center gap-3">
                        <button
                          onClick={() => handleApprove(spot.id)}
                          className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-200 transition-colors"
                        >
                          Approve ✅
                        </button>
                        <button
                          onClick={() => handleReject(spot.id)}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-200 transition-colors"
                        >
                          Reject ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}