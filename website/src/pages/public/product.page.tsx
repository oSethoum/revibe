import api from "@/lib/api/admin";
import { Box } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export default function PublicProductsPage() {
  const [params] = useSearchParams();

  const productsQuery = useQuery({
    queryKey: ["products", params.get("search")],
    queryFn: async () =>
      api.query("product", {
        where: {
          name: {
            contains: params.get("search") || "",
            mode: "insensitive",
          },
        },
      }),
  });

  return <Box></Box>;
}
