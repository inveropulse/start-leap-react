import { PropsWithChildren } from "react";
import TanstackProvider from "./TanstackProvider";
import AxiosClientProvider from "./AxiosClientProvider";

export default function WithProviders(props: PropsWithChildren) {
  return (
    <TanstackProvider>
      <AxiosClientProvider>{props.children}</AxiosClientProvider>
    </TanstackProvider>
  );
}
