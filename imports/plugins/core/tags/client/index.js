import React from "react";
import { registerOperatorRoute } from "/imports/client/ui";
import TagIcon from "mdi-material-ui/Tag";

export { default as DataTable } from "./components/TagDataTable";
export { default as TagDataTableColumn } from "./components/TagDataTableColumn";

import TagFormPage from "./pages/TagFormPageWithData";
import TagSettingsPage from "./pages/TagSettingsPageWithData";

registerOperatorRoute({
  path: "/tags/create",
  MainComponent: TagFormPage
});

registerOperatorRoute({
  path: "/tags/edit/:tagId",
  MainComponent: TagFormPage
});

registerOperatorRoute({
  group: "navigation",
  path: "/tags",
  priority: 30,
  MainComponent: TagSettingsPage,
  // eslint-disable-next-line react/display-name, react/no-multi-comp
  SidebarIconComponent: (props) => <TagIcon {...props} />,
  sidebarI18nLabel: "admin.tags.tags"
});
