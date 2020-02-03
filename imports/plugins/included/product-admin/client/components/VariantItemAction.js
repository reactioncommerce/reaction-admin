import React from "react";
import PropTypes from "prop-types";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { useState } from "react";
import { Reaction } from "/client/api";
import ConfirmDialog from "@reactioncommerce/catalyst/ConfirmDialog";
import i18next from "i18next";
import DotsHorizontalIcon from "mdi-material-ui/DotsHorizontal";

/**
 *
 * @param {*} props
 */
function VariantItemAction(props) {
  const [menuAnchorEl, setMenuAnchorEl] = useState();
  const isOpen = Boolean(menuAnchorEl);

  const {
    onArchiveProduct,
    onToggleVariantVisibility,
    onCloneProduct,
    onRestoreProduct,
    product,
    variant,
    option
  } = props;

  const currentVariant = option || variant;

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  const hasCloneProductPermission = Reaction.hasPermission(["reaction:legacy:products/clone"], Reaction.getUserId(), Reaction.getShopId());
  const hasArchiveProductPermission = Reaction.hasPermission(["reaction:legacy:products/archive"], Reaction.getUserId(), Reaction.getShopId());


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

        onArchiveProduct(currentVariant, redirectUrl);
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
          onRestoreProduct(currentVariant);
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
      <IconButton
        onClick={(event) => {
          // show menu
          setMenuAnchorEl(event.currentTarget);
        }}
      >
        <DotsHorizontalIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorEl}
        keepMounted
        open={isOpen}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            onToggleVariantVisibility(currentVariant);
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

VariantItemAction.propTypes = {
  product: PropTypes.object
};

export default VariantItemAction;
