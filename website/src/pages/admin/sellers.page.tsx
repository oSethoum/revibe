import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Modal, Switch, TextInput } from "@mantine/core";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Prisma, type Seller } from "@/lib/types/prisma";
import DataTable from "@/components/DataTable";
import api from "@/lib/api/admin";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { toSlug } from "@/lib/utils/slug";
import { enqueueSnackbar } from "notistack";
import ImagesViewer from "@/components/ImageViewer";
import RenderBool from "@/components/RenderBool";

type ModalState = readonly [
  boolean,
  {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  }
];

export default function SellersPage() {
  const { t } = useTranslation();
  const updateState = useDisclosure();

  const [query, setQuery] = useState<Prisma.UserFindManyArgs>({
    include: { seller: true },
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useDebouncedState("", 200);
  const [seller, setSeller] = useState<Seller>();

  const updateQuery = (search: string, page: number) => {
    setQuery({
      include: { seller: true },
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],

        role: {
          equals: "SELLER",
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });
  };

  const sellersQuery = useQuery({
    queryKey: ["seller", query],
    queryFn: async () => api.query("user", query),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    updateQuery(search, 1);
  }, [search]);

  return (
    <Box>
      <Box className="text-xl font-semibold">{t("sellers")}</Box>
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
        actions={(record) => [
          {
            title: t("edit"),
            onClick: () => {
              setSeller(record.seller);
              updateState[1].open();
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
            title: t("email"),
            accessor: "email",
          },
          {
            title: t("shop"),
            accessor: "seller.shop",
            render: (record) => <>{record.seller?.shop}</>,
          },
          {
            title: t("accepted"),
            accessor: "seller.isAccepted",
            render: (record) => (
              <RenderBool value={record.seller?.isAccepted} />
            ),
          },
        ]}
        records={sellersQuery.data?.data || []}
        // pagination
        page={page}
        onPageChange={(page) => {
          updateQuery(search, page);
          setPage(page);
        }}
        // default things
        stickyHeader
        striped
        storageKey="admin-sellers"
        withColumnBorders
        withRowBorders
        withTableBorder
        withRowNumber
      />

      <Update
        state={updateState}
        seller={seller}
        onSuccess={sellersQuery.refetch}
      />
    </Box>
  );
}

const Update = (props: {
  seller?: Seller;
  state: ModalState;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();

  const schema = z.object({
    isAccepted: z.string().min(3),
  });

  const form = useForm({
    initialValues: {
      isAccepted: false,
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (props.seller) {
      form.setValues({
        isAccepted: props.seller?.isAccepted,
      });
    }
  }, [props.state[0]]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!props.seller) {
        return;
      }
      return api.update("seller", {
        where: {
          id: props.seller?.id,
        },
        data: {
          isAccepted: form.values.isAccepted,
        },
      });
    },
  });

  return (
    <Modal
      title={t("update")}
      opened={props.state[0]}
      onClose={props.state[1].close}
      transitionProps={{
        onExited: form.reset,
      }}
    >
      <Checkbox
        data-auto-focus
        label={t("is_accepted")}
        placeholder={t("is_accepted")}
        required
        {...form.getInputProps("isAccepted", { type: "checkbox" })}
      />

      <Box className="flex gap-2 justify-end mt-4">
        <Button variant="default" onClick={props.state[1].close}>
          {t("cancel")}
        </Button>
        <Button
          onClick={async () => {
            const response = await mutation.mutateAsync();
            if (response?.ok) {
              enqueueSnackbar(t("success"), { variant: "success" });
              props.onSuccess();
              props.state[1].close();
            }
          }}
          loading={mutation.isPending}
        >
          {t("confirm")}
        </Button>
      </Box>
    </Modal>
  );
};
