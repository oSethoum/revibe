import NavLink from "@/components/NavLink";
import { userStore } from "@/lib/store/user-store";
import { AppShell, Group, Burger, Box, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBox,
  IconDashboard,
  IconLogout,
  IconTruck,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet } from "react-router";

export default function AdminLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { t } = useTranslation();

  const { user } = userStore();

  if (!user || user.role != "SELLER") {
    return <Navigate to="/auth/login" />;
  }

  return (
    <AppShell
      className="bg-slate-50"
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
          <Title order={4}>
            <span className="text-orange-400">Revibe</span>{" "}
            <span className="text-sm">Seller</span>
          </Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section grow className="p-2">
          <Box className="flex flex-col ">
            <NavLink
              to="/seller/dashboard"
              label={t("dashboard")}
              icon={<IconDashboard stroke={1} />}
            />
            <NavLink
              to="/seller/products"
              label={t("products")}
              icon={<IconBox stroke={1} />}
            />
            <NavLink
              to="/seller/orders"
              label={t("orders")}
              icon={<IconTruck stroke={1} />}
            />
          </Box>
        </AppShell.Section>
        <AppShell.Section className="p-2">
          <Box
            className="hover:bg-red-500/10 cursor-pointer flex my-0.5 gap-2 p-2 rounded-md text-red-600"
            onClick={() => {}}
          >
            <Box>
              <IconLogout stroke={1} />
            </Box>
            <Box>{t("logout")}</Box>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
