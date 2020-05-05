import React from "react";
import { render } from "@testing-library/react";
import App from ".";

test("renders learn react link", () => {
  const { getByText } = render(<App name={"Alex"} />);
  const linkElement = getByText(/Alex/i);
  expect(linkElement).toBeInTheDocument();
});
