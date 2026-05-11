import { Check } from "@mui/icons-material";
import { Paper, StepConnector, StepLabel, styled } from "@mui/material";

export const autocompleteStyles = {
  mt: 0,
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#132845",
    },
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#132845",
    },
  },
};

export const CustomPaper = (props) => (
  <Paper
    {...props}
    sx={{
      maxHeight: 300,
      overflow: "hidden",
      "& ul": {
        maxHeight: 300,
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    }}
  />
);
