import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { useAuth } from "../../src/context/AuthContext";

jest.mock("../../src/context/AuthContext");

function renderWithRoute(initialAuthState) {
  useAuth.mockReturnValue(initialAuthState);

  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows a loading state while auth status is being determined", () => {
    renderWithRoute({ isAuthenticated: false, isLoading: true });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    renderWithRoute({ isAuthenticated: false, isLoading: false });

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders the protected content when authenticated", () => {
    renderWithRoute({ isAuthenticated: true, isLoading: false });

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
 