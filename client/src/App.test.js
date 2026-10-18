
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

function renderApp() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("FreshCart Learning Hub App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders the application without crashing", () => {
    renderApp();

    expect(document.body).toBeInTheDocument();
  });

  test("renders the FreshCart branding", () => {
    renderApp();

    expect(
      screen.getAllByText(/FreshCart Learning Hub/i).length
    ).toBeGreaterThan(0);
  });

  test("renders the home page heading", () => {
    renderApp();

    expect(
      screen.getByRole("heading", {
        name: /Learn\.\s*Grow\.\s*Succeed\./i,
      })
    ).toBeInTheDocument();
  });
});
