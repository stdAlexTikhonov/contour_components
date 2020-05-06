import React from "react";
import { render } from "@testing-library/react";
import { ButtonAppBar } from ".";

test("renders learn react link", () => {
  const { getByText } = render(<ButtonAppBar />);
  const linkElement = getByText(/Contour Components/i);
  expect(linkElement).toBeInTheDocument();
});
