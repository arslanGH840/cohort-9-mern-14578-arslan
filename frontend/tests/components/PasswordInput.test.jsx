import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "../../src/components/ui/PasswordInput";

describe("PasswordInput", () => {
  it("renders as a password field by default", () => {
    render(<PasswordInput id="password" />);
    expect(document.getElementById("password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("toggles to plain text when the eye icon is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput id="password" />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);

    expect(document.getElementById("password")).toHaveAttribute("type", "text");
  });

  it("toggles back to password type on a second click", async () => {
    const user = userEvent.setup();
    render(<PasswordInput id="password" />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);
    await user.click(toggleButton);

    expect(document.getElementById("password")).toHaveAttribute(
      "type",
      "password",
    );
  });
});
