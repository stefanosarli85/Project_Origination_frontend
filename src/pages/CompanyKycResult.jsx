import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";

const CompanyKycResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const kycResult = location.state;

  if (!kycResult) {
    return (
      <div className="container py-5">
        <h3>No KYC result found.</h3>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/kyc-company")}
        >
          Back
        </button>
      </div>
    );
  }

  const isClean =
    kycResult.entities?.length === 0 &&
    kycResult.evidences?.length === 0;

  useEffect(() => {
    if (isClean) {
      toast.success(
        "KYC Check Completed Successfully. No matches found."
      );
    } else {
      toast.warning(
        "Potential match found. Please review the details below."
      );
    }
  }, []);

  return (
    <div className="container py-5">
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Summary */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Company KYC Summary</h4>
          </div>

          <div className="card-body">
            <table className="table table-bordered">
              <tbody>
  <tr>
    <th>Status</th>
    <td>
      {isClean ? (
        <span className="badge bg-success">CLEAN</span>
      ) : (
        <span className="badge bg-danger">FLAGGED</span>
      )}
    </td>
  </tr>

  <tr>
    <th>ID</th>
    <td>{kycResult.id}</td>
  </tr>

  <tr>
    <th>State</th>
    <td>{kycResult.state}</td>
  </tr>

  <tr>
    <th>Screening Type</th>
    <td>{kycResult.type}</td>
  </tr>

  <tr>
    <th>Company Name</th>
    <td>{kycResult.query?.name}</td>
  </tr>
  <tr>
  <th>Entity Type</th>
  <td>{kycResult.query?.entityType}</td>
</tr>

<tr>
  <th>Created On</th>
  <td>
    {new Date(
      kycResult.creationTimestamp * 1000
    ).toLocaleString()}
  </td>
</tr>

<tr>
  <th>Last Updated</th>
  <td>
    {new Date(
      kycResult.lastUpdateTimestamp * 1000
    ).toLocaleString()}
  </td>
</tr>
</tbody>
            </table>
          </div>
        </div>

        {/* Entities */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Entities</h4>
          </div>

          <div className="card-body">
            {kycResult.entities?.length > 0 ? (
              <table className="table table-bordered">
               <thead>
  <tr>
    <th>ID</th>
    <th>Company Name</th>
    <th>Entity Type</th>
    <th>Gender</th>
    <th>Nationalities</th>
    <th>Codes</th>
    <th>Birth Dates</th>
    <th>Death Dates</th>
    <th>Last Update</th>
    <th>Locations</th>
<th>Organization Details</th>
<th>Recaps</th>
<th>Legal Enforcement Update</th>
  </tr>
</thead>

<tbody>
  {kycResult.entities.map((entity) => (
    <tr key={entity.id}>
      <td>{entity.id}</td>

      <td>{entity.names?.[0]?.full_name || "-"}</td>

      <td>{entity.entity_type || "-"}</td>

      <td>{entity.gender || "-"}</td>

      <td>
        {entity.nationalities?.length
          ? entity.nationalities.join(", ")
          : "-"}
      </td>

      <td>
        {entity.codes?.length
          ? entity.codes.join(", ")
          : "-"}
      </td>

      <td>
        {entity.birth_dates?.length
          ? entity.birth_dates.join(", ")
          : "-"}
      </td>

      <td>
        {entity.death_dates?.length
          ? entity.death_dates.join(", ")
          : "-"}
      </td>

      <td>
        {entity.last_update?.entity || "-"}
      </td>
      <td>
  {entity.locations?.length
    ? JSON.stringify(entity.locations)
    : "-"}
</td>

<td>
  {entity.organization_details?.length
    ? JSON.stringify(entity.organization_details)
    : "-"}
</td>

<td>
  {entity.recaps?.length
    ? JSON.stringify(entity.recaps)
    : "-"}
</td>

<td>
  {entity.last_update?.legal_enforcement || "-"}
</td>
    </tr>
  ))}
</tbody>
              </table>
            ) : (
              <div className="alert alert-success mb-0">
                No entities found
              </div>
            )}
          </div>
        </div>

        {/* Evidences */}
        <div className="card mb-4">
          <div className="card-header">
            <h4>Evidences</h4>
          </div>

          <div className="card-body">
            {kycResult.evidences?.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>List Description</th>
                    <th>Publication Date</th>
                    <th>Subject</th>
                    <th>Offence</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {kycResult.evidences.flatMap(
                    (evidence, index) =>
                      evidence.rationales?.map(
                        (rationale, i) => (
                          <tr key={`${index}-${i}`}>
                            <td>
                              {evidence.list_description?.join(
                                ", "
                              )}
                            </td>

                            <td>
                              {evidence.publication_date}
                            </td>

                            <td>
                              {rationale.subject}
                            </td>

                            <td>
                              {rationale.offence || "-"}
                            </td>

                            <td>
                              {rationale.status}
                            </td>
                          </tr>
                        )
                      )
                  )}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-success mb-0">
                No evidences found
              </div>
            )}
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CompanyKycResult;