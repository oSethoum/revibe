import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Textarea,
  TextInput,
} from "@mantine/core";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Prisma, type Product } from "@/lib/types/prisma";
import DataTable from "@/components/DataTable";
import api from "@/lib/api/admin";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { toSlug } from "@/lib/utils/slug";
import { enqueueSnackbar } from "notistack";
import ImagesViewer from "@/components/ImageViewer";
import { userStore } from "@/lib/store/user-store";
import type { ModalState } from "@/lib/types/helper";

export default function ProductsPage() {
  const { t } = useTranslation();
  const mutateState = useDisclosure();

  const [query, setQuery] = useState<Prisma.ProductFindManyArgs>({
    include: {
      category: true,
    },
    take: 10,
    skip: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useDebouncedState("", 200);
  const [mutateMode, setMutateMode] = useState<"create" | "update" | "delete">(
    "create"
  );
  const [product, setProduct] = useState<Product>();

  const updateQuery = (search: string, page: number) => {
    setQuery({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      include: {
        category: true,
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
        <Button
          onClick={() => {
            setMutateMode("create");
            mutateState[1].open();
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
              setProduct(record);
              setMutateMode("update");
              mutateState[1].open();
            },
          },
          {
            title: t("delete"),
            color: "red",
            onClick: () => {
              setProduct(record);
              setMutateMode("delete");
              mutateState[1].open();
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
            title: t("category"),
            accessor: "category",
            render: (record) => {
              return <Box>{record.category?.name}</Box>;
            },
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

      <Mutate
        mode={mutateMode}
        state={mutateState}
        onSuccess={productsQuery.refetch}
        product={product}
      />
    </Box>
  );
}

const Mutate = ({
  state,
  onSuccess,
  mode = "create",
  product,
}: {
  state: ModalState;
  onSuccess: () => void;
  product?: Product;
  mode?: "create" | "update" | "delete";
}) => {
  const { t } = useTranslation();
  const { user } = userStore();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      if (mode != "delete") {
        return api.query("category", {});
      } else {
        return null;
      }
    },
  });

  const schema = z.object({
    name: z.string().min(3),
    images: z.string().min(3),
    categoryId: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    discount: z.number(),
    attributes: z.nullable(z.string()),
  });

  const form = useForm<z.input<typeof schema> & { slug: string }>({
    initialValues: {
      name: "",
      slug: "",
      images: "",
      description: "",
      price: 0,
      stock: 1,
      categoryId: "",
      discount: 0,
      attributes: "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (mode == "update") {
      product?.attributes;
      if (product) {
        form.setValues({
          ...product,
          images: product.images.join(","),
          categoryId: product.categoryId!,
          attributes: product.attributes,
        });
      }
    }
  }, [state[0]]);

  const mutation = useMutation({
    mutationFn: async () => {
      const slug = toSlug(form.values.name);

      console.log({
        ...form.values,
        slug,
      });

      if (mode == "create") {
        return api.create("product", {
          data: {
            name: form.values.name,
            slug,
            description: form.values.description,
            price: form.values.price,
            stock: form.values.stock,
            images: form.values.images.trim().split(","),
            discount: form.values.discount,
            attributes: form.values.attributes,
            categoryId: form.values.categoryId,
            sellerId: user?.seller?.id!,
          },
        });
      } else if (mode == "update") {
        return api.update("product", {
          where: {
            id: product?.id,
          },
          data: {
            name: form.values.name,
            slug,
            description: form.values.description,
            price: form.values.price,
            stock: form.values.stock,
            images: form.values.images.trim().split(","),
            discount: form.values.discount,
            attributes: form.values.attributes,
            categoryId: form.values.categoryId,
            sellerId: user?.seller?.id!,
          },
        });
      } else {
        return api.delete("product", {
          where: {
            id: product?.id,
          },
        });
      }
    },
  });

  return (
    <Modal
      title={t(mode)}
      opened={state[0]}
      onClose={state[1].close}
      transitionProps={{
        onExited: form.reset,
      }}
    >
      {mode == "delete" ? (
        <Box>{t("delete_question")}</Box>
      ) : (
        <Box className="flex flex-col gap-1">
          {" "}
          <TextInput
            data-autofocus
            label={t("name")}
            placeholder={t("name")}
            required
            {...form.getInputProps("name")}
          />
          <Textarea
            label={t("description")}
            placeholder={t("description")}
            required
            {...form.getInputProps("description")}
          />
          <Textarea
            label={t("images")}
            placeholder={"image1,image2,image3..."}
            required
            {...form.getInputProps("images")}
          />
          <SimpleGrid cols={{ lg: 3 }} spacing="sm">
            <NumberInput
              label={t("price")}
              placeholder={t("price")}
              required
              {...form.getInputProps("price")}
            />
            <NumberInput
              label={t("discount")}
              placeholder={t("discount")}
              required
              {...form.getInputProps("discount")}
            />
            <NumberInput
              label={t("stock")}
              placeholder={t("stock")}
              required
              {...form.getInputProps("stock")}
            />
          </SimpleGrid>
          <Select
            label={t("category")}
            placeholder={t("category")}
            required
            searchable
            data={categoriesQuery.data?.data?.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            {...form.getInputProps("categoryId")}
          />
          <Textarea
            label={t("attributes")}
            placeholder={"color:green,red,purple;size:sm,lg..."}
            {...form.getInputProps("attributes")}
          />
        </Box>
      )}

      <Box className="flex gap-2 justify-end mt-4">
        <Button variant="default" onClick={state[1].close}>
          {t("cancel")}
        </Button>
        <Button
          color={mode == "delete" ? "red" : "orange"}
          onClick={async () => {
            const response = await mutation.mutateAsync();
            if (response.ok) {
              enqueueSnackbar(t("success"), { variant: "success" });
              onSuccess?.();
              state[1].close();
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
