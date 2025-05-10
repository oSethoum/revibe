import {
  Anchor,
  Box,
  Text,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Radio,
  RadioGroup,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { z } from "zod";

export default function RegisterPage() {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
        shopName: z.string().min(3),
        agreeToPrivacy: z.boolean().refine((val) => val === true, {
          message: "You must agree to the terms and conditions",
        }),
        role: z.enum(["CLIENT", "SELLER"]),
      }),
    []
  );

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      agreeToPrivacy: false,
      shopName: "",
      role: "CLIENT",
    },
    validate: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: async () => {},
  });

  return (
    <Container size={520} my={40}>
      <Title mb="sm" ta="center">
        {t("register")}
      </Title>

      <Text className="text-center">
        Do you have an account?{" "}
        <Anchor component={Link} to="/auth/login">
          Login
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={20} mt={30} radius="md">
        <form>
          <Box className="flex flex-col gap-2">
            <TextInput
              name="name"
              className="grow"
              label={t("name")}
              placeholder="enter your name"
              required
              radius="md"
              {...form.getInputProps("name")}
            />

            <TextInput
              label={t("email")}
              name="email"
              placeholder="you@email.com"
              required
              radius="md"
              {...form.getInputProps("email")}
            />

            <RadioGroup
              name="role"
              label={t("role")}
              {...form.getInputProps("role")}
            >
              <div className="flex gap-3 mt-1">
                <Radio label={t("client")} value="CLIENT" />
                <Radio label={t("seller")} value="SELLER" />
              </div>
            </RadioGroup>
            {form.values.role == "SELLER" && (
              <TextInput
                label={t("shop_name")}
                name="shopName"
                required
                placeholder="Your shop name"
                {...form.getInputProps("shopName")}
              />
            )}

            <PasswordInput
              label={t("password")}
              name="password"
              placeholder="Your password"
              required
              radius="md"
              {...form.getInputProps("password")}
            />
            <Group justify="space-between" mt="lg">
              <Checkbox
                name="agreeToPrivacy"
                label="I agree to the terms and conditions"
                {...form.getInputProps("agreeToPrivacy")}
              />
            </Group>
          </Box>
          <Button
            fullWidth
            mt="xl"
            type="submit"
            radius="md"
            loading={mutation.isPending}
          >
            {t("register")}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
