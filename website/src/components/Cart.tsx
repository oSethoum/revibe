import { cartStore } from "@/lib/store/cart-store";
import {
  Box,
  Button,
  Drawer,
  Image,
  Indicator,
  Paper,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconShoppingBag, IconShoppingBagX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { count, items, decrementQuantity, incrementQuantity, removeProduct } =
    cartStore();
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure();

  return (
    <Box>
      <Box
        className="hover:bg-gray-200 p-2 rounded-full cursor-pointer relative"
        onClick={open}
      >
        <div className="absolute top-0 right-0 font-semibold text-white text-sm bg-orange-500 px-1.5 rounded-full">
          {count()}
        </div>
        <IconShoppingBag />
      </Box>

      <Drawer
        position="right"
        opened={opened}
        title={t("cart")}
        onClose={close}
      >
        <Box className="flex flex-col h-[91vh]">
          {items.map((item) => (
            <Paper className="flex" p="xs">
              <Image src={item.product.images?.at(0)} />
              <Box className="flex flex-col">
                <p>{item.product.name}</p>
              </Box>
            </Paper>
          ))}
          {count() == 0 && (
            <Box className="flex flex-col items-center mb-5">
              <IconShoppingBagX size={100} className="text-gray-500" />
              <Box>{t("cart_is_empty")}</Box>
            </Box>
          )}
          <Box className="flex flex-col gap-2"></Box>

          <Button disabled fullWidth size="md">
            {t("checkout")}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
