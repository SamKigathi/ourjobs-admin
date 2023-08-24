import { AuthPage, ThemedTitleV2 } from "@refinedev/mui";
import { AppIcon } from "../../components/app-icon";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={
        <ThemedTitleV2
          collapsed={false}
          text="Our Jobs"
          icon={<AppIcon />}
        />
      }
      formProps={{
        defaultValues: { email: "admin@admin.com", password: "password" },
      }}
    />
  );
};
