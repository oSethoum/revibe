import { useEffect, useState } from "react";
import { Box, Button, TextInput } from "@mantine/core";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Prisma, type Order } from "@/lib/types/prisma";
import DataTable from "@/components/DataTable";
import api from "@/lib/api/admin";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import ImagesViewer from "@/components/ImageViewer";
import { userStore } from "@/lib/store/user-store";

export default function OrdersPage() {
  const { t } = useTranslation();
  const createState = useDisclosure();
  const updateState = useDisclosure();
  const deleteState = useDisclosure();

  const { user } = userStore();

  const [query, setQuery] = useState<Prisma.OrderFindManyArgs>({
    where: {
      product: {
        sellerId: user?.seller?.id,
      },
    },
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useDebouncedState("", 200);
  const [order, setOrder] = useState<Order>();

  const updateQuery = (search: string, page: number) => {
    setQuery({
      where: {
        client: {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        product: {
          name: {
            contains: search,
            mode: "insensitive",
          },
          sellerId: user?.seller?.id,
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });
  };

  const ordersQuery = useQuery({
    queryKey: ["orders", query],
    queryFn: async () => api.query("order", query),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    updateQuery(search, 1);
  }, [search]);

  return (
    <Box>
      <Box className="text-xl font-semibold">{t("orders")}</Box>
      <Box className="my-4 flex gap-2">
        <Button
          onClick={() => {
            createState[1].open();
          }}
        >
          {t("create")}
        </Button>
        <TextInput
          className="grow"
          placeholder={t("search")}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />
      </Box>

      <DataTable
        actions={(record) => [
          {
            title: t("edit"),
            onClick: () => {
              setOrder(record);
              updateState[1].open();
            },
          },
          {
            title: t("delete"),
            color: "red",
            onClick: () => {
              setOrder(record);
              deleteState[1].open();
            },
          },
        ]}
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
            title: t("image"),
            accessor: "image",
            render: (record) => {
              return (
                <Box>
                  <ImagesViewer
                    images={[record.image]}
                    thumbnail={{ width: 35 }}
                  />
                </Box>
              );
            },
          },
        ]}
        records={ordersQuery.data?.data || []}
        // pagination
        page={page}
        onPageChange={(page) => {
          updateQuery(search, page);
          setPage(page);
        }}
        // default things
        stickyHeader
        striped
        storageKey="seller-products"
        withColumnBorders
        withRowBorders
        withTableBorder
        withRowNumber
      />
    </Box>
  );
}
