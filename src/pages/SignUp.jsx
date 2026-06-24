import React, { useState } from "react";
import {
Box,
Paper,
TextField,
Typography,
Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
const navigate = useNavigate();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] =
useState("");
const [loading, setLoading] = useState(false);

const handleSignup = async (e) => {
e.preventDefault();
console.log("Signup button clicked");

if (
  !name ||
  !email ||
  !password ||
  !confirmPassword
) {
  alert("Please fill all fields");
  return;
}

if (password !== confirmPassword) {
  alert("Passwords do not match");
  return;
}

try {
  setLoading(true);

  const response = await axios.post(
    "https://backend.formula-cf-ai.com/auth/signup",
    {
      name,
      email,
      password,
    }
  );

  console.log(response.data);

  alert("Signup successful");

  navigate("/login");
} catch (error) {
  console.error(error);

  alert(
    error?.response?.data?.message ||
      "Signup failed"
  );
} finally {
  setLoading(false);
}


};

return (
<Box
sx={{
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "#f5f7fb",
}}
>
<Paper
elevation={4}
sx={{
width: 450,
p: 4,
borderRadius: 3,
}}
> <Typography
  variant="h4"
>
  Welcome - Sign Up
</Typography>

    <form onSubmit={handleSignup}>
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(e.target.value)
        }
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          py: 1.5,
        }}
        disabled={loading}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
    </form>

    <Typography
      textAlign="center"
      mt={2}
    >
      Already have an account?{" "}
      <Link to="/login">
        Login
      </Link>
    </Typography>
  </Paper>
</Box>


);
};

export default SignUp;
