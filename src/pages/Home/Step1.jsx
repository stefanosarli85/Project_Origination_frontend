import { useState } from "react";

const Step1 = ({ onNext }) => {
  const [selectedRegion, setSelectedRegion] = useState("");

  const regions = [
    { name: "India", flag: "🇮🇳" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "UAE", flag: "🇦🇪" },
    { name: "UK", flag: "🇬🇧" },
  ];

  return (
    <div className="step-content active" id="step1">
      <div className="row justify-content-center">
        <div className="col-xl-7 col-lg-9">
          <div className="main-card text-center">
            <h2 className="fw-bold mb-2 text-center">Select Region</h2>
            <p className="card-info-p">
              Choose a region to search for companies
            </p>

            <div className="region-grid">
              {regions.map((region) => (
                <div
                  key={region.name}
                  className={`region-card ${
                    selectedRegion === region.name ? "active" : ""
                  }`}
                  data-region={region.name}
                  onClick={() => setSelectedRegion(region.name)}
                >
                  <span className="flag">{region.flag}</span>
                  <h3 className="h3 mb-0">{region.name}</h3>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary w-100 next-btn"
              id="nextToFilters"
              onClick={() => onNext(selectedRegion)}
              disabled={!selectedRegion} 
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step1;
