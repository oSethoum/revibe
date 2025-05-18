import { useEffect, useState } from "react";
import { Box, Button, Group, Modal, TextInput, Title } from "@mantine/core";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Prisma, type Product } from "@/lib/types/prisma";
import DataTable from "@/components/DataTable";
import api from "@/lib/api/admin";
import { useDebouncedState } from "@mantine/hooks";
import ImagesViewer from "@/components/ImageViewer";

export default function ProductsPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState<Prisma.ProductFindManyArgs>({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useDebouncedState("", 200);

  const updateQuery = (search: string, page: number) => {
    setQuery({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });
  };

  const productsQuery = useQuery({
    queryKey: ["products", query],
    queryFn: async () => api.query("product", query),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    updateQuery(search, 1);
  }, [search]);

  return (
    <Box>
      <Box className="text-xl font-semibold">{t("products")}</Box>
      <Box className="my-4 flex gap-2">
        <TextInput
          className="grow"
          placeholder={t("search")}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
      </Box>

      <DataTable
        columns={[
          {
            title: t("id"),
            accessor: "id",
          },
          {
            title: t("name"),
            accessor: "name",
          },
          {
            title: t("description"),
            accessor: "description",
          },
          {
            title: t("price"),
            accessor: "price",
          },
          {
            title: t("discount"),
            accessor: "discount",
          },
          {
            title: t("stock"),
            accessor: "stock",
          },
          {
            title: t("category"),
            accessor: "category",
            render: (record) => {
              return <>{record.category?.name}</>;
            },
          },
          {
            title: t("seller"),
            accessor: "seller",
          },
          {
            title: t("shop"),
            accessor: "shop",
            render: (record) => {
              return <>{record.seller?.shop}</>;
            },
          },
          {
            title: t("images"),
            accessor: "images",
            render: (record) => {
              return (
                <Box>
                  <ImagesViewer
                    images={record.images}
                    thumbnail={{ width: 35 }}
                  />
                </Box>
              );
            },
          },
        ]}
        records={productsQuery.data?.data || []}
        // pagination
        page={page}
        onPageChange={(page) => {
          updateQuery(search, page);
          setPage(page);
        }}
        // default things
        stickyHeader
        striped
        storageKey="admin-products"
        withColumnBorders
        withRowBorders
        withTableBorder
        withRowNumber
      />
    </Box>
  );
}
