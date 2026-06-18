import React from 'react';

const ActivityTable = ({ activities }) => {
  return (
    <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>Recent Activities</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'var(--bg-main)' }}>
          <tr>
            <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Activity</th>
            <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>User</th>
            <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Details</th>
            <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.875rem' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease' }} className="table-row-hover">
              <td style={{ padding: '16px 24px', color: 'var(--text-main)', fontWeight: 500 }}>{item.activity}</td>
              <td style={{ padding: '16px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    {item.user.charAt(0)}
                  </div>
                  <span style={{ color: 'var(--text-main)' }}>{item.user}</span>
                </div>
              </td>
              <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>{item.details}</td>
              <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .table-row-hover:hover {
          background-color: var(--bg-main);
        }
      `}</style>
    </div>
  );
};

export default ActivityTable;
