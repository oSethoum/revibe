import { useEffect, useState } from "react";
import { Box, Button, Modal, TextInput } from "@mantine/core";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Prisma, type Client } from "@/lib/types/prisma";
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

export default function ClientsPage() {
  const { t } = useTranslation();
  const updateState = useDisclosure();

  const [query, setQuery] = useState<Prisma.UserFindManyArgs>({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useDebouncedState("", 200);
  const [client, setClient] = useState<Client>();

  const updateQuery = (search: string, page: number) => {
    setQuery({
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
          equals: "CLIENT",
        },
      },
      take: 10,
      skip: (page - 1) * 10,
    });
  };

  const clientsQuery = useQuery({
    queryKey: ["client", query],
    queryFn: async () => api.query("user", query),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    updateQuery(search, 1);
  }, [search]);

  return (
    <Box>
      <Box className="text-xl font-semibold">{t("clients")}</Box>
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
              setClient(record);
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
            accessor: "name",
          },
        ]}
        records={clientsQuery.data?.data || []}
        // pagination
        page={page}
        onPageChange={(page) => {
          updateQuery(search, page);
          setPage(page);
        }}
        // default things
        stickyHeader
        striped
        storageKey="admin-clients"
        withColumnBorders
        withRowBorders
        withTableBorder
        withRowNumber
      />

      <Update
        state={updateState}
        client={client}
        onSuccess={clientsQuery.refetch}
      />
    </Box>
  );
}

const Update = (props: {
  client?: Client;
  state: ModalState;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();

  const schema = z.object({
    name: z.string().min(3),
    image: z.string().min(3),
    parentClientId: z.optional(z.string()),
  });

  const form = useForm({
    initialValues: {
      name: "",
      slug: "",
      image: "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (props.client) {
      form.setValues({});
    }
  }, [props.state[0]]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!props.client) {
        return;
      }
      const slug = toSlug(form.values.name);
      return api.update("client", {
        where: {
          id: props.client?.id,
        },
        data: {},
      });
    },
  });

  return (
    <Modal
      title={t("create")}
      opened={props.state[0]}
      onClose={props.state[1].close}
      transitionProps={{
        onExited: form.reset,
      }}
    >
      <TextInput
        data-auto-focus
        label={t("name")}
        placeholder={t("name")}
        required
        {...form.getInputProps("name")}
      />

      <TextInput
        label={t("image")}
        placeholder={t("image")}
        required
        {...form.getInputProps("image")}
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
          {t("create")}
        </Button>
      </Box>
    </Modal>
  );
};
