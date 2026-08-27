import { render, screen } from "@testing-library/react";
import EmptyState from "../../src/components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState title="No notes yet" description="Create your first note." />,
    );

    expect(screen.getByText("No notes yet")).toBeInTheDocument();
    expect(screen.getByText("Create your first note.")).toBeInTheDocument();
  });

  it("renders the icon when provided", () => {
    render(
      <EmptyState
        title="No notes"
        icon={<span data-testid="icon">Icon</span>}
      />,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders the action when provided", () => {
    render(
      <EmptyState title="No notes" action={<button>Create note</button>} />,
    );

    expect(
      screen.getByRole("button", { name: "Create note" }),
    ).toBeInTheDocument();
  });

  it("does not crash when description and action are omitted", () => {
    render(<EmptyState title="No notes" />);
    expect(screen.getByText("No notes")).toBeInTheDocument();
  });
});
