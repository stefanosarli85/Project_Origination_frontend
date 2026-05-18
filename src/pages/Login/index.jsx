import { Link } from "react-router";

const Login = () => {
  return (
    <main className="auth-main">
      <div className="auth-card">
        <h3 className="page-title">Login</h3>

        <form>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
            />
          </div>

          <div className="d-flex justify-content-between mb-3">
            <div>
              <input
                type="checkbox"
                className="form-check-input"
                id="remember"
              />
              <label className="form-check-label" for="remember">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button className="btn btn-primary d-flex align-items-center justify-content-center me-auto ms-auto next-btn w-100">
            Login
          </button>

          <div className="text-center mt-3">
            Don't have account? <Link to="/signup">Signup</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
