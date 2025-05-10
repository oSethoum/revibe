import { Box } from "@mantine/core";
import { Link, useLocation } from "react-router";

const NavLink = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: React.ReactNode;
}) => {
  const isActive = useLocation().pathname.startsWith(to);

  return (
    <Box
      component={Link}
      to={to}
      className={`flex my-0.5 gap-2 p-2 rounded-md  ${
        isActive ? "bg-orange-400/30" : "hover:bg-gray-200"
      }`}
    >
      <Box>{icon}</Box>
      <Box className="">{label}</Box>
    </Box>
  );
};

export default NavLink;
