import React, { useState } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { i18next, Reaction } from "/client/api";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import DotsHorizontalIcon from "mdi-material-ui/DotsHorizontal";
import ConfirmDialog from "@reactioncommerce/catalyst/ConfirmDialog";
import { makeStyles, Box } from "@material-ui/core";
import useProduct from "../hooks/useProduct";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  breadcrumbs: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2)
  },
  breadcrumbIcon: {
    fontSize: 14,
    marginRight: 7
  },
  breadcrumbLink: {
    fontSize: "14px",
    fontFamily: theme.typography.fontFamily,
    color: "#3c3c3c",
    border: 0,
    textDecoration: "underline",
    marginRight: 7
  },
  statusbar: {
    display: "flex",
    alignItems: "center"
  }
}));

/**
 * Header component for various product admin forms
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function ProductHeader() {
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState();
  const {
    onArchiveProduct,
    onRestoreProduct,
    onCloneProduct,
    onToggleProductVisibility,
    product,
    variant,
    option
  } = useProduct();

  if (!product) {
    return null;
  }

  const hasCloneProductPermission = Reaction.hasPermission(["reaction:legacy:products/clone"], Reaction.getUserId(), Reaction.getShopId());
  const hasArchiveProductPermission = Reaction.hasPermission(["reaction:legacy:products/archive"], Reaction.getUserId(), Reaction.getShopId());

  // Archive menu item
  let archiveMenuItem = (
    <ConfirmDialog
      title={i18next.t("admin.productTable.bulkActions.archiveTitle")}
      message={i18next.t("productDetailEdit.archiveThisProduct")}
      onConfirm={() => {
        let redirectUrl;

        if (option) {
          redirectUrl = `/products/${product._id}/${variant._id}`;
        } else if (variant) {
          redirectUrl = `/products/${product._id}`;
        } else {
          redirectUrl = "/products";
        }

        onArchiveProduct(product, redirectUrl);
      }}
    >
      {({ openDialog }) => (
        <MenuItem onClick={openDialog}>{i18next.t("admin.productTable.bulkActions.archive")}</MenuItem>
      )}
    </ConfirmDialog>
  );

  if (product.isDeleted) {
    archiveMenuItem = (
      <ConfirmDialog
        title={i18next.t("admin.productTable.bulkActions.restoreTitle")}
        message={i18next.t("productDetailEdit.restoreThisProduct")}
        onConfirm={() => {
          onRestoreProduct(product);
          setMenuAnchorEl(null);
        }}
      >
        {({ openDialog }) => (
          <MenuItem onClick={openDialog}>{i18next.t("admin.productTable.bulkActions.restore")}</MenuItem>
        )}
      </ConfirmDialog>
    );
  }

  return (
    <div className={classes.root}>
      <Box display="flex" alignItems="center">
        <Box flex="1">
          <Link className={classes.breadcrumbLink} to={`/products/${product._id}`}>
            <Typography variant="h2">
              <Helmet title={product.title} />
              {product.title || "Untitled Product"}
              {(product.isDeleted) && `(${i18next.t("app.archived")})`}
            </Typography>
          </Link>
        </Box>
        <IconButton
          onClick={(event) => {
            setMenuAnchorEl(event.currentTarget);
          }}
        >
          <DotsHorizontalIcon />
        </IconButton>
      </Box>

      <div className={classes.statusbar}>
        <Typography>
          {product.isVisible ? "Visible" : "Hidden"}
          {product.isDeleted ? i18next.t("app.archived") : null}
        </Typography>

        <Menu
          id="bulk-actions-menu"
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              onToggleProductVisibility(product);
              setMenuAnchorEl(null);
            }}
          >
            {product.isVisible ?
              i18next.t("admin.productTable.bulkActions.makeHidden") :
              i18next.t("admin.productTable.bulkActions.makeVisible")
            }
          </MenuItem>
          {hasCloneProductPermission &&
            <MenuItem
              onClick={() => {
                onCloneProduct(product._id);
                setMenuAnchorEl(null);
              }}
            >
              {i18next.t("admin.productTable.bulkActions.duplicate")}
            </MenuItem>
          }
          {hasArchiveProductPermission &&
            archiveMenuItem
          }
        </Menu>
      </div>
    </div>
  );
}

export default ProductHeader;
