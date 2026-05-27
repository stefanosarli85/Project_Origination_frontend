import { Link } from "react-router";

const SignUp = () => {
  return (
    <main className="auth-main">
      <div className="auth-card">
        <h3 className="text-center mb-4">Create Account</h3>

        <form>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" />
          </div>

          <button className="btn btn-primary d-flex align-items-center justify-content-center me-auto ms-auto next-btn w-100">
            Signup
          </button>

          <div className="text-center mt-3">
            Already have account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUp;
