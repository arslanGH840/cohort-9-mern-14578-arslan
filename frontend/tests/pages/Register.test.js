import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Register from "../../src/pages/Register";
import { registerUser } from "../../src/services/authService";

jest.mock("../../src/services/authService");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Register page", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderRegister = () =>
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      await screen.findByText(/username must be at least/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("redirects to /login after successful registration", async () => {
    registerUser.mockResolvedValue({ data: { user: { username: "newuser" } } });

    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/username/i), "newuser");
    await user.type(screen.getByLabelText(/email/i), "newuser@example.com");
    await user.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "SecurePass123",
    );
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows a server error on duplicate registration", async () => {
    registerUser.mockRejectedValue({
      response: {
        data: {
          error: {
            message: "An account with this username or email already exists",
          },
        },
      },
    });

    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/username/i), "taken");
    await user.type(screen.getByLabelText(/email/i), "taken@example.com");
    await user.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "SecurePass123",
    );
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
  });
});
    