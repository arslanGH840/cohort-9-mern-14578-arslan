import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, LogIn } from "lucide-react";
import { loginSchema } from "../validations/authSchemas";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/ui/PasswordInput";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsSubmitting(true);
    try {
      const result = await loginUser(data);
      login(result.data.user, result.data.token);
      navigate("/");
    } catch (error) {
      setServerError(
        error.response?.data?.error?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-4 font-sans">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-surface-alt flex items-center justify-center mb-4 text-primary">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Welcome back
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Log in to your Vellum account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface p-8 rounded-lg border border-border"
        >
          {serverError && (
            <div className="bg-error-bg text-error text-sm px-4 py-3 rounded-lg mb-5">
              {serverError}
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              Username
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
              <input
                id="username"
                type="text"
                {...register("username")}
                className="w-full border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="text-error text-xs mt-1.5">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary mb-1.5"
            >
              Password
            </label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-error text-xs mt-1.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          <p className="text-sm text-center text-text-secondary mt-6">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
