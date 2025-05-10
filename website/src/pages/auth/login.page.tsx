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
import { Link } from "react-router";
import { useForm } from "@mantine/form";

export default function LoginPage() {
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
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
        <form>
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
              {...form.getInputProps("rememerMe", { type: "checkbox" })}
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
