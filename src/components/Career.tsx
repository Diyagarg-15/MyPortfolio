import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {/* AIESEC */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Technology Head</h4>
                <h5>AIESEC Delhi IIT</h5>
              </div>
              <h3>2019</h3>
            </div>
            <p>
              Managed web infrastructure and internal portals for a global
              youth non-profit operating across 120+ countries. Built and
              maintained volunteer-facing interfaces using React.js, handling
              deployments and platform stability end-to-end.
            </p>
          </div>

          {/* Startup */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer & UI/UX Designer</h4>
                <h5>Nexora Labs — Startup</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Handled both design and development at an early-stage startup.
              Built component-based design systems and high-fidelity prototypes
              in Figma, then implemented them directly in Next.js & React
              across two core product verticals.
            </p>
          </div>

          {/* Protiviti — Current */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Protiviti Consulting</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Building enterprise web solutions for global client engagements.
              Developing scalable frontends with Next.js & React, backend
              services with .NET & C#, and delivering Figma design handoffs
              from wireframes to production-ready specs.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Career;