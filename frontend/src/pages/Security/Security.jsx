/**
 * Security Page
 * 
 * Security staff-specific dashboard/features
 */

function Security() {
  return (
    <div className="page-container">
      <h1>Security Staff Dashboard</h1>
      <p>This is the security staff page.</p>
      <p>Manage items received and released from the lost and found center.</p>

      <section className="page-section">
        <h2>Security Operations</h2>
        <ul>
          <li>Receive items into the system</li>
          <li>Release items to claimants</li>
          <li>View transaction history</li>
          <li>Update item status</li>
          <li>Generate reports</li>
        </ul>
      </section>
    </div>
  );
}

export default Security;
