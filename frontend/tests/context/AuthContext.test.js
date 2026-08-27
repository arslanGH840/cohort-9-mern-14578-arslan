import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";
import axiosInstance from "../../src/api/axiosInstance";

function TestConsumer() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "authenticated" : "not-authenticated"}
      </div>
      <div data-testid="username">{user?.username || "none"}</div>
      <button onClick={() => login({ username: "testuser" }, "fake-token")}>
        Log In
      </button>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("starts unauthenticated when no token is stored", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "not-authenticated",
      );
    });
  });

  it("restores a session when a valid token exists in localStorage", async () => {
    localStorage.setItem("token", "existing-token");
    axiosInstance.get.mockResolvedValue({
      data: { data: { user: { username: "restoreduser" } } },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-status")).toHaveTextContent(
        "authenticated",
      );
    });
    expect(screen.getByTestId("username")).toHaveTextContent("restoreduser");
  });

  it("clears the session when the stored token is invalid", async () => {
    localStorage.setItem("token", "bad-token");
    axiosInstance.get.mockRejectedValue(new Error("Invalid token"));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not-authenticated",
    );
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("updates state and localStorage when login is called", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => screen.getByText("Log In"));
    await user.click(screen.getByText("Log In"));

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "authenticated",
    );
    expect(localStorage.getItem("token")).toBe("fake-token");
  });

  it("clears state and localStorage when logout is called", async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => screen.getByText("Log In"));
    await user.click(screen.getByText("Log In"));
    await user.click(screen.getByText("Log Out"));

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "not-authenticated",
    );
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("ignores a stale /auth/me success response if the token was superseded mid-request", async () => {
    localStorage.setItem("token", "old-token");

    let resolveRequest;
    axiosInstance.get.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    localStorage.setItem("token", "new-token");

    resolveRequest({
      data: { data: { user: { username: "stale-user" } } },
    });

    await waitFor(() => {
      expect(screen.queryByText("stale-user")).not.toBeInTheDocument();
    });

    // isLoading intentionally stays true here — the component is waiting
    // for the newer session flow that superseded this one to complete.
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("does not clear the newer token if a stale request fails after being superseded", async () => {
    localStorage.setItem("token", "old-token");

    let rejectRequest;
    axiosInstance.get.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject;
        }),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    localStorage.setItem("token", "new-token");

    rejectRequest(new Error("Unauthorized"));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("new-token");
    });
  });

  it("throws a clear error when useAuth is called outside an AuthProvider", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function BrokenConsumer() {
      useAuth();
      return null;
    }

    expect(() => render(<BrokenConsumer />)).toThrow(
      "useAuth must be used within an AuthProvider",
    );

    consoleError.mockRestore();
  });
});
