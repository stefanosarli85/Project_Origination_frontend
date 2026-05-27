import { Link } from "react-router";

const ForgotPassword = () => {
  return (
    <main class="auth-main">
      <div class="auth-card">
        <h3 class="text-center mb-0">Forgot Password</h3>

        <p class="text-muted text-center mb-4">
          Enter your email and we will send reset link.
        </p>

        <form>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" />
          </div>

          <button class="btn btn-primary d-flex align-items-center justify-content-center me-auto ms-auto next-btn w-100">
            Send Reset Link
          </button>

          <div class="text-center mt-3">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default ForgotPassword;
