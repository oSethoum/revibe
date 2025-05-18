import { Badge } from "@mantine/core";
import { useTranslation } from "react-i18next";

export default function RenderBool({ value }: { value: boolean }) {
  const { t } = useTranslation();
  return (
    <Badge color={value ? "green" : "gray"}>{value ? t("yes") : t("no")}</Badge>
  );
}
