const Stepper = ({ currentStep }) => {
  return (
    <div className="sticky-topbar">
      <div className="container-fluid px-lg-5 px-3">
        <h1 className="page-title">Company Search Platform</h1>

        <div className="stepper">
          <div
            className={`step-item ${currentStep >= 1 ? "completed" : ""} ${currentStep === 1 ? "active" : ""}`}
            id="indicator1"
          >
            <div className="step-circle">
              <div className="no-step-circle">1</div>
              <i className="bi bi-check2"></i>
            </div>
            <div className="step-title">Region</div>
            <div className="step-line"></div>
          </div>

          <div
            className={`step-item ${currentStep >= 2 ? "completed" : ""} ${currentStep === 2 ? "active" : ""}`}
            id="indicator2"
          >
            <div className="step-circle">
              <div className="no-step-circle">2</div>
              <i className="bi bi-check2"></i>
            </div>
            <div className="step-title">Filters</div>
            <div className="step-line"></div>
          </div>

          <div
            className={`step-item ${currentStep >= 3 ? "completed" : ""} ${currentStep === 3 ? "active" : ""}`}
            id="indicator3"
          >
            <div className="step-circle">
              <div className="no-step-circle">3</div>
              <i className="bi bi-check2"></i>
            </div>
            <div className="step-title">Results</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
