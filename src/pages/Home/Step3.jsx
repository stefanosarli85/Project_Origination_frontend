const Step3 = () => {
  return (
    <div className="step-content" id="step3">
      <div className="summary-box">
        <div className="row g-4 align-items-center">
          <div className="col-lg-12">
            <h2 className="mb-0">Search Results</h2>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="text-results-label">Total Results</div>
            <div className="summary-number">8</div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="text-results-label">Region</div>
            <div className="summary-search-tt">Italy 🇮🇹</div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="text-results-label">Filters Applied</div>
            <div className="summary-search-tt">1</div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="text-results-label">Data Quality</div>
            <div className="hightlight-tt">High</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
