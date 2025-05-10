import { useEffect, useState } from "react";
import { Box, Button, Group, Modal, TextInput, Title } from "@mantine/core";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Prisma, type Category } from "@/lib/types/prisma";
import DataTable from "@/components/DataTable";
import api from "@/lib/api/admin";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { toSlug } from "@/lib/utils/slug";
import { enqueueSnackbar } from "notistack";
import ImagesViewer from "@/components/ImageViewer";

type ModalState = readonly [
  boolean,
  {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  }
];

export default function CategoriesPage() {
  const { t } = useTranslation();
  const createState = useDisclosure();
  const updateState = useDisclosure();
  const deleteState = useDisclosure();

  const [query, setQuery] = useState<Prisma.CategoryFindManyArgs>({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useDebouncedState("", 200);
  const [category, setCategory] = useState<Category>();

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

  const categoriesQuery = useQuery({
    queryKey: ["categories", query],
    queryFn: async () => api.query("category", query),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    updateQuery(search, 1);
  }, [search]);

  return (
    <Box>
      <Box className="text-xl font-semibold">{t("categories")}</Box>
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
              setCategory(record);
              updateState[1].open();
            },
          },
          {
            title: t("delete"),
            color: "red",
            onClick: () => {
              setCategory(record);
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
        records={categoriesQuery.data?.data || []}
        // pagination
        page={page}
        onPageChange={(page) => {
          updateQuery(search, page);
          setPage(page);
        }}
        // default things
        stickyHeader
        striped
        storageKey="admin-categories"
        withColumnBorders
        withRowBorders
        withTableBorder
        withRowNumber
      />

      <Create state={createState} onSuccess={categoriesQuery.refetch} />
      <Update
        state={updateState}
        category={category}
        onSuccess={categoriesQuery.refetch}
      />
      <Delete
        state={deleteState}
        category={category}
        onSuccess={categoriesQuery.refetch}
      />
    </Box>
  );
}

const Create = (props: { state: ModalState; onSuccess: () => void }) => {
  const { t } = useTranslation();

  const schema = z.object({
    name: z.string().min(3),
    image: z.string().min(3),
    parentCategoryId: z.optional(z.string()),
  });

  const form = useForm({
    initialValues: {
      name: "",
      slug: "",
      image: "",
    },
    validate: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const slug = toSlug(form.values.name);
      return api.create("category", {
        data: {
          name: form.values.name,
          slug,
          image: form.values.image,
        },
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
            if (response.ok) {
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

const Update = (props: {
  category?: Category;
  state: ModalState;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();

  const schema = z.object({
    name: z.string().min(3),
    image: z.string().min(3),
    parentCategoryId: z.optional(z.string()),
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
    if (props.category) {
      form.setValues({
        name: props.category.name,
        slug: props.category.slug,
        image: props.category.image,
      });
    }
  }, [props.state[0]]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!props.category) {
        return;
      }
      const slug = toSlug(form.values.name);
      return api.update("category", {
        where: {
          id: props.category?.id,
        },
        data: {
          name: form.values.name,
          slug,
          image: form.values.image,
        },
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

const Delete = (props: {
  state: ModalState;
  category?: Category;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!props.category) {
        return;
      }

      return api.delete("category", {
        where: {
          id: props.category?.id,
        },
      });
    },
  });

  return (
    <Modal
      title={t("delete")}
      opened={props.state[0]}
      onClose={props.state[1].close}
    >
      <Box>{t("delete_confirmation")}</Box>

      <Box className="flex gap-2 justify-end">
        <Button
          variant="default"
          onClick={() => {
            props.state[1].close();
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          color="red"
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
