import {
  Anchor,
  Text,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api/auth";
import { userStore } from "@/lib/store/user-store";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = userStore();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.Login(form.values);
      if (response.ok) {
        setUser(response.data?.user!);
        if (response.data?.user.role == "ADMIN") {
          navigate("/admin/dashboard");
        } else if (response.data?.user.role == "SELLER") {
          navigate("/seller/dashboard");
        } else {
          navigate("/");
        }
      }
    },
  });

  return (
    <Container size={520} my={40}>
      <Title ta="center">Sign in</Title>

      <Text className="text-center">
        Do not have an account yet?{" "}
        <Anchor component={Link} to="/auth/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(() => {
            mutation.mutateAsync();
          })}
        >
          <TextInput
            name="email"
            label={t("email")}
            placeholder="you@mantine.dev"
            required
            radius="md"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            name="password"
            label={t("password")}
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            {...form.getInputProps("password")}
          />

          <Group justify="space-between" mt="lg">
            <Checkbox
              name="remember-me"
              label={t("remember_me")}
              {...form.getInputProps("rememberMe", { type: "checkbox" })}
            />
            <Anchor component="button" size="sm">
              {t("forgot_password")}
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" radius="md">
            {t("sign_in")}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
