import { AppShell, Group, Burger, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBox, IconDashboard } from "@tabler/icons-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router";

export default function ClientLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { t } = useTranslation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Box className="flex flex-col ">
          <NavLink
            to="/admin/dashboard"
            label={t("dashboard")}
            icon={<IconDashboard />}
          />
          <NavLink
            to="/admin/categories"
            label={t("categories")}
            icon={<IconBox />}
          />
        </Box>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

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
      className={`flex gap-2 p-2 border-b border-b-gray-200 hover:bg-gray-200 ${
        isActive ? "bg-gray-200" : ""
      }`}
    >
      {icon}
      {label}
    </Box>
  );
};
