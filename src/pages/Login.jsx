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

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://backend.formula-cf-ai.com/auth/login",
        {
          email,
          password,
        }
      );

     console.log("FULL RESPONSE:", JSON.stringify(response. Data)); 

      if (!response.data.success) {
        alert(
          response.data.message ||
            "Invalid email or password"
        );
        return;
      }

      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login successful");

      navigate("/landing");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Login failed"
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
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={3}
        >
          Login
        </Typography>

        <form onSubmit={handleLogin}>
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
            {loading
              ? "Logging In..."
              : "Login"}
          </Button>
        </form>

        <Typography
          textAlign="center"
          mt={2}
        >
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;