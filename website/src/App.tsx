import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import Router from "./pages";

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider theme={{ primaryColor: "orange" }}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider />
        <Router />
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
