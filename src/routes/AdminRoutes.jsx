import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from ".";

const AdminPage = lazy(() => import("../modules/Admin/Admin.Container"));

const NotFoundPage = lazy(() => import("../modules/Error/NotFound.Container"));

const AdminRoutes = () => {
  return (
    <Suspense
      fallback={
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoadingButton
            loading
            variant="outlined"
            sx={{ border: "0 !important" }}
          />
        </Box>
      }
    >
      <Routes>
        <Route path={routes.admin.dashboard} element={<AdminPage />} />

        <Route path={"*"} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
