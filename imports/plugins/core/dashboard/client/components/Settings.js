import React, { Fragment } from "react";
import { Blocks, Components } from "@reactioncommerce/reaction-components";
import i18next from "i18next";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar/PrimaryAppBar";
import ChevronRight from "mdi-material-ui/ChevronRight";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    display: "flex",
    alignItems: "center"
  },
  breadcrumb: {
    marginRight: theme.spacing(1)
  },
  chevron: {
    marginRight: theme.spacing(1)
  }

}));

/**
 * @name ShopSettings
 * @returns {React.component} a functional React component
 */
export default function ShopSettings() {
  const [currentShopId] = useCurrentShopId();
  const classes = useStyles();
  const history = useHistory();

  const title = (
    <div className={classes.breadcrumbsContainer}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={(event) => {
        event.preventDefault();
        history.push("/shop-settings");
      }}
      >
        <span className={classes.breadcrumb}>
          {i18next.t("admin.settings.settings")}
        </span>
      </a>
      <ChevronRight className={classes.chevron} />
      <span>
        {i18next.t("admin.settings.shopSettingsLabel")}
      </span>
    </div>
  );


  if (!currentShopId) return <Components.Loading />;

  return (
    <Fragment>
      <PrimaryAppBar title={title} />
      {currentShopId &&
        <Blocks region="ShopSettings" blockProps={{ shopId: currentShopId }}/>
      }
    </Fragment>
  );
}
