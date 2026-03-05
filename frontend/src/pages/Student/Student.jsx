/**
 * Student Page
 * 
 * Student-specific dashboard/features
 */

function Student() {
  return (
    <div className="page-container">
      <h1>Student Dashboard</h1>
      <p>This is the student-specific page.</p>
      <p>Here you can manage your lost and found items.</p>

      <section className="page-section">
        <h2>Your Activities</h2>
        <ul>
          <li>View lost items you've reported</li>
          <li>Check found items matching your losses</li>
          <li>Track claim status</li>
          <li>Communicate with security staff</li>
        </ul>
      </section>
    </div>
  );
}

export default Student;
