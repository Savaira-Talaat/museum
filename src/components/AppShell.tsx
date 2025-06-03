import { Outlet } from "react-router-dom";
import CustomAppBar from "./CustomAppBar";
import { Box } from "@mui/material";

const AppShell = () => {
  return (
    <>
      <CustomAppBar />
      <Box sx={{ mt: 10, px: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default AppShell;
