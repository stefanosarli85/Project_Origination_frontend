const Italy = ({ onNext }) => {
  return (
    <div className="step-content " id="step2">
      <div className="main-card">
        <h2 className="mb-4">Italy Search Filters</h2>

        {/* <!-- Industry --> */}
        <div className="form-section">
          <h4 className="section-title">Industry</h4>

          <div className="row g-4">
            <div className="col-lg-6">
              <label className="form-label">ATECO Code</label>
              <select className="form-select">
                <option>Select ATECO Code</option>
                <option>62 - Computer Programming</option>
                <option>63 - Information Services</option>
                <option>46 - Wholesale Trade</option>
              </select>
            </div>

            <div className="col-lg-6">
              <label className="form-label">ATECO Subcode</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter subcode"
              />
            </div>
          </div>
        </div>

        {/* <!-- Geography --> */}
        <div className="form-section">
          <h4 className="section-title">Geography</h4>

          <div className="row g-4">
            <div className="col-lg-6">
              <label className="form-label">Province</label>
              <select className="form-select">
                <option>Select Province</option>
                <option>Rome</option>
                <option>Milan</option>
                <option>Naples</option>
              </select>
            </div>

            <div className="col-lg-6">
              <label className="form-label">Municipality</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter municipality"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                className="form-control"
                placeholder="0.000000"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                className="form-control"
                placeholder="0.000000"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Radius (km)</label>
              <input type="number" className="form-control" placeholder="10" />
            </div>
          </div>
        </div>

        {/* <!-- Company Size --> */}
        <div className="form-section">
          <h4 className="section-title">Company Size</h4>

          <div className="row g-4">
            <div className="col-lg-6">
              <label className="form-label">Revenue Min (€)</label>
              <input type="number" className="form-control" placeholder="0" />
            </div>

            <div className="col-lg-6">
              <label className="form-label">Revenue Max (€)</label>
              <input type="number" className="form-control" placeholder="0" />
            </div>

            <div className="col-lg-6">
              <label className="form-label">Employees Min</label>
              <input type="number" className="form-control" />
            </div>

            <div className="col-lg-6">
              <label className="form-label">Employees Max</label>
              <input type="number" className="form-control" />
            </div>
          </div>
        </div>

        {/* <!-- Legal --> */}
        <div className="form-section">
          <h4 className="section-title">Legal & Registry</h4>

          <div className="row g-4">
            <div className="col-lg-6">
              <label className="form-label">Legal Form</label>
              <select className="form-select">
                <option>Select</option>
                <option>S.r.l.</option>
                <option>S.p.A.</option>
              </select>
            </div>

            <div className="col-lg-6">
              <label className="form-label">Business Status</label>
              <select className="form-select">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="col-lg-6">
              <label className="form-label">CCIAA Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter CCIAA code"
              />
            </div>

            <div className="col-lg-6">
              <label className="form-label">REA Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter REA number"
              />
            </div>
          </div>
        </div>

        {/* <!-- Company Name --> */}
        <div className="form-section">
          <h4 className="section-title">Company Name</h4>

          <div className="row g-4">
            <div className="col-lg-6">
              <label className="form-label">Company Name (with wildcard)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter company name"
              />
            </div>

            <div className="col-lg-6">
              <label className="form-label">Autocomplete</label>
              <input
                type="text"
                className="form-control"
                placeholder="Live search"
              />
            </div>
          </div>
        </div>

        {/* <!-- Ownership --> */}
        <div className="form-section">
          <h4 className="section-title">Ownership & Contact</h4>

          <div className="row g-4">
            <div className="col-lg-4">
              <label className="form-label">Owner Tax Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter tax code"
              />
            </div>

            <div className="col-lg-4">
              <label className="form-label">PEC Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter PEC email"
              />
            </div>

            <div className="col-lg-4">
              <label className="form-label">SDI Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter SDI code"
              />
            </div>
          </div>
        </div>

        {/* <!-- Dates --> */}
        <div className="form-section">
          <h4 className="section-title">Dates</h4>

          <div className="row g-4">
            <div className="col-lg-6">
              <label className="form-label">Created After</label>
              <input type="date" className="form-control" />
            </div>

            <div className="col-lg-6">
              <label className="form-label">Updated After</label>
              <input type="date" className="form-control" />
            </div>
          </div>
        </div>

        {/* <!-- Data --> */}
        <div className="form-section">
          <h4 className="section-title">Data & Pagination</h4>

          <div className="row g-4 align-items-end">
            <div className="col-lg-4">
              <label className="form-label">Data Enrichment</label>

              <div className="d-flex gap-2 align-items-center">
                <select className="form-select">
                  <option>Disabled</option>
                  <option>Enabled</option>
                </select>

                <div className="paid-badge">PAID</div>
              </div>
            </div>

            <div className="col-lg-4">
              <label className="form-label">Limit</label>
              <input type="number" className="form-control" placeholder="0" />
            </div>

            <div className="col-lg-4">
              <label className="form-label">Skip</label>
              <input type="number" className="form-control" placeholder="0" />
            </div>

            <div className="col-lg-4">
              <div className="form-check form-switch d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="dryRun"
                />
                <label className="form-check-label ms-3" htmlFor="dryRun">
                  Dry Run — count only (Free)
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="action-buttons">
          <button
            className="btn btn-primary action-btn flex-grow-1"
            id="generateBtn"
            onClick={onNext}
          >
            Generate / Next
          </button>

          <button className="btn btn-light action-btn">Dry Run</button>
          <button className="btn btn-light action-btn">
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            Reset
          </button>

          <button className="btn btn-light border action-btn">
            <i className="bi bi-copy me-1"></i>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Italy;
