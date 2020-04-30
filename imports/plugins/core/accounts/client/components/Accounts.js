import React, { Fragment, useState } from "react";
import i18next from "i18next";
import Divider from "@material-ui/core/Divider";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import GroupCards from "./GroupCards";

/**
 * @summary Main accounts view
 * @name Accounts
 * @returns {React.Component} A React component
 */
function Accounts() {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Fragment>
      <Tabs value={currentTab} onChange={(e, value) => setCurrentTab(value)}>
        <Tab label={i18next.t("admin.accounts.tabs.staff")} />
        <Tab label={i18next.t("admin.accounts.tabs.customers")} />
        <Tab label={i18next.t("admin.accounts.tabs.invites")} />
      </Tabs>

      <Divider />

      {currentTab === 0 &&
        <GroupCards />
      }

      {currentTab === 1 &&
        <h1>Customers</h1>
      }

      {currentTab === 2 &&
        <h1>Invites</h1>
      }
    </Fragment>
  );
}

export default Accounts;
