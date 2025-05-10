import { Box, Title } from "@mantine/core";
import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <Box className="bg-gray-100 h-screen">
      <Box className="h-[8vh] border-b border-b-gray-200 bg-white sticky top-0 flex items-center justify-center">
        <Link to="/">
          <Title className="text-orange-500 text-center">Revibe</Title>
        </Link>
      </Box>
      <Outlet />
      <Box />
    </Box>
  );
}
