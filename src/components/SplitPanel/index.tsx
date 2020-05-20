import React from "react";
import { Tree } from "../Tree";
import Box from "@material-ui/core/Box";

export const SplitPanel = () => (
  <Box display="flex" height="100%">
    <Box width={400} overflow="hidden">
      <Tree />
    </Box>
    <Box flexGrow={1} height="100%">
      1
    </Box>
  </Box>
);
