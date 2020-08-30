import React from "react";
import i18next from "i18next";
import { Switch, Route } from "react-router-dom";
import {
  Container
} from "@material-ui/core";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar";
import ContentViewPrimaryDetailLayout from "/imports/client/ui/layouts/ContentViewPrimaryDetailLayout";
import useOperatorRoutes from "/imports/client/ui/hooks/useOperatorRoutes";
import SettingsList from "./SettingsList";

/**
 * @name SettingsDashboard
 * @returns {React.component} a functional React component
 */
export default function SettingsDashboard() {
  const settingsRoutes = useOperatorRoutes({ groups: ["settings"] });
  return (
    <ContentViewPrimaryDetailLayout
      AppBarComponent={
        <PrimaryAppBar title={i18next.t("admin.settings.settingsLabel")} />
      }
      PrimaryComponent={
        <SettingsList />
      }
      DetailComponent={
        <Container maxWidth="md">
          <Switch>
            {
              settingsRoutes.map((settingRoute) => (
                <Route
                  key={settingRoute.path}
                  component={settingRoute.MainComponent}
                  path={settingRoute.path}
                />
              ))
            }
          </Switch>
        </Container>
      }
    />
  );
}
