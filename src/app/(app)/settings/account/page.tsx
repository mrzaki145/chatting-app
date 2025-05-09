import { AccountForm } from "../_components/account-form";
import ContentSection from "../_components/content-section";

export default function SettingsAccount() {
  return (
    <ContentSection
      title="Account"
      desc="Update your account settings. Set your preferred language and
          timezone."
    >
      <AccountForm />
    </ContentSection>
  );
}
