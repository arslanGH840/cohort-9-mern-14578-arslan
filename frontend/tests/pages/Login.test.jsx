import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/pages/Login";
import { useAuth } from "../../src/context/AuthContext";
import { loginUser } from "../../src/services/authService";

jest.mock("../../src/context/AuthContext");
jest.mock("../../src/services/authService");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Login page", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ login: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderLogin = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      await screen.findByText(/username is required/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it("calls loginUser with entered credentials on valid submit", async () => {
    loginUser.mockResolvedValue({
      data: { user: { username: "demo_user" }, token: "fake-token" },
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/username/i), "demo_user");
    await user.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "Demo@12345",
    );
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        username: "demo_user",
        password: "Demo@12345",
      });
    });
  });

  it("shows a server error message when login fails", async () => {
    loginUser.mockRejectedValue({
      response: {
        data: { error: { message: "Invalid username or password" } },
      },
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/username/i), "demo_user");
    await user.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "WrongPassword",
    );
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      await screen.findByText(/invalid username or password/i),
    ).toBeInTheDocument();
  });
});
