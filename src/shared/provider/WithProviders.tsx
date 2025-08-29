import { PropsWithChildren } from "react";
import TanstackProvider from "./TanstackProvider";

export default function WithProviders(props: PropsWithChildren) {
  return <TanstackProvider>{props.children}</TanstackProvider>;
}
