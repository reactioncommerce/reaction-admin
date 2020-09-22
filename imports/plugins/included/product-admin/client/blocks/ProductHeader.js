import React, { useState } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import DotsHorizontalIcon from "mdi-material-ui/DotsHorizontal";
import ConfirmDialog from "@reactioncommerce/catalyst/ConfirmDialog";
import { makeStyles, Box, Divider } from "@material-ui/core";
import { i18next, Reaction } from "/client/api";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import useProduct from "../hooks/useProduct";
import getPDPUrl from "../utils/getPDPUrl";

const useStyles = makeStyles((theme) => ({
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
    marginRight: 7
  }
}));

/**
 * Header component for various product admin forms
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function ProductHeader({ shouldDisplayStatus }) {
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState();
  const {
    onArchiveProduct,
    onCreateVariant,
    onRestoreProduct,
    onCloneProduct,
    onToggleProductVisibility,
    product,
    variant,
    option
  } = useProduct();
  const [shopId] = useCurrentShopId();

  if (!product) {
    return null;
  }

  const hasCloneProductPermission = Reaction.hasPermission(["reaction:legacy:products/clone"], Reaction.getUserId(), shopId);
  const hasArchiveProductPermission = Reaction.hasPermission(["reaction:legacy:products/archive"], Reaction.getUserId(), shopId);

  // Archive menu item
  let archiveMenuItem = (
    <ConfirmDialog
      title={i18next.t("admin.productTable.bulkActions.archiveTitle")}
      message={i18next.t("productDetailEdit.archiveThisProduct")}
      onConfirm={() => {
        let redirectUrl;

        if (option || variant) {
          redirectUrl = getPDPUrl({
            productId: product._id,
            variantId: variant._id,
            shopId
          });
        } else {
          redirectUrl = `${shopId}/products`;
        }

        onArchiveProduct(product._id, redirectUrl);
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
          onRestoreProduct(product._id);
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
    <>
      <Box
        display="flex"
        alignItems="center"
      >
        <Box
          display="flex"
          flexDirection="column"
          flex="1"
        >
          <Link className={classes.breadcrumbLink} to={getPDPUrl({ productId: product._id, shopId })}>
            <Typography variant="h2">
              <Helmet title={product.title} />
              {product.title || "Untitled Product"}
            </Typography>
          </Link>
          {shouldDisplayStatus &&
            <Box>
              <Typography variant="caption">
                {product.isVisible ? "Visible" : "Hidden"}
                {product.isDeleted ? i18next.t("app.archived") : null}
              </Typography>
            </Box>
          }
        </Box>

        <IconButton
          onClick={(event) => {
            setMenuAnchorEl(event.currentTarget);
          }}
        >
          <DotsHorizontalIcon />
        </IconButton>
      </Box>

      <Menu
        id="bulk-actions-menu"
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={async () => {
            await onCreateVariant({
              parentId: product._id,
              redirectOnCreate: true
            });
            setMenuAnchorEl(null);
          }}
        >
          {i18next.t("variantList.createVariant")}
        </MenuItem>
        <Divider />
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
    </>
  );
}

ProductHeader.propTypes = {
  shouldDisplayStatus: PropTypes.bool
};

export default ProductHeader;
