import { Page } from "@/components/Shell";
import { CoLendingStory } from "./CoLendingStory";

export const metadata = {
  title: "Co-Lending Joint Underwriting — Silence Possibilities",
};

export default function Page_() {
  return (
    <Page>
      <CoLendingStory />
    </Page>
  );
}
