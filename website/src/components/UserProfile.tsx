import { userStore } from "@/lib/store/user-store";
import { Box } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { Link } from "react-router";

export default function UserProfile() {
  const { user } = userStore();

  if (!user) {
    return (
      <Box
        component={Link}
        to="/auth/login"
        className="hover:bg-gray-200 p-2 rounded-full cursor-pointer"
      >
        <IconUser />
      </Box>
    );
  }

  return (
    <Box className="hover:bg-gray-200 p-2 rounded-full cursor-pointer">
      {user.name}
    </Box>
  );
}
