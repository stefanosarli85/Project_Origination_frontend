import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <main className="auth-main">
      <div className="container-fluid px-lg-5 px-3 py-5">
        <div className="row justify-content-center">
          <div className="col-xl-4 col-lg-4 m-auto">
            <div className="auth-card text-center">
              <h1>404</h1>

              <h3>Page Not Found</h3>

              <p className="card-info-p">
                The page you are looking for doesn't exist.
              </p>

              <Link
                to="/"
                className="btn btn-primary d-flex align-items-center justify-content-center me-auto ms-auto next-btn w-100"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
