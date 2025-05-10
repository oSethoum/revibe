import { Box, Paper, SimpleGrid } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <Box>
      <Box>Dashboard</Box>

      <SimpleGrid cols={4}>
        <Paper p="sm" withBorder shadow="sm">
          <Box className="flex justify-between">
            <Box className="gap-2">
              <Box>{t("total_products")}</Box>
              <Box>{t("total_sales")}</Box>
            </Box>
            <Box>{100}</Box>
          </Box>
        </Paper>
      </SimpleGrid>
    </Box>
  );
}
