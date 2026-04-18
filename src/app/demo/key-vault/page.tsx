import { Page } from "@/components/Shell";
import { KeyVaultDemo } from "./KeyVaultDemo";

export const metadata = {
  title: "MPC Key Vault Console — Silence Possibilities",
};

export default function Page_() {
  return (
    <Page>
      <KeyVaultDemo />
    </Page>
  );
}
