import React, { useState } from "react";
import PropTypes from "prop-types";
import { Divider, IconButton, Menu, MenuItem } from "@material-ui/core";
import { Reaction } from "/client/api";
import ConfirmDialog from "@reactioncommerce/catalyst/ConfirmDialog";
import i18next from "i18next";
import DotsHorizontalIcon from "mdi-material-ui/DotsHorizontal";

/**
 * Variant actions
 * @param {Object} props Component props
 * @returns {React.Element} A dropdown menu for variants an options
 */
function VariantItemAction(props) {
  const [menuAnchorEl, setMenuAnchorEl] = useState();
  const isOpen = Boolean(menuAnchorEl);

  const {
    onArchiveProductVariants,
    onCloneProductVariants,
    onCreateVariant,
    onToggleVariantVisibility,
    option,
    variant
  } = props;

  const currentVariant = option || variant;

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  const hasCloneProductPermission = Reaction.hasPermission(["reaction:legacy:products/clone"], Reaction.getUserId(), Reaction.getShopId());
  const hasArchiveProductPermission = Reaction.hasPermission(["reaction:legacy:products/archive"], Reaction.getUserId(), Reaction.getShopId());

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
        {!option && [
          <MenuItem
            key="create-variant"
            onClick={async () => {
              await onCreateVariant({
                parentId: variant._id,
                redirectOnCreate: true
              });
              setMenuAnchorEl(null);
            }}
          >
            {i18next.t("variantList.createVariant")}
          </MenuItem>,
          <Divider key="create-variant-divider" />
        ]}
        <MenuItem
          onClick={() => {
            onToggleVariantVisibility({
              variant: currentVariant
            });
            setMenuAnchorEl(null);
          }}
        >
          {currentVariant.isVisible ?
            i18next.t("admin.productTable.bulkActions.makeHidden") :
            i18next.t("admin.productTable.bulkActions.makeVisible")
          }
        </MenuItem>
        {hasCloneProductPermission &&
          <MenuItem
            onClick={() => {
              onCloneProductVariants({
                variantIds: [currentVariant._id]
              });
              setMenuAnchorEl(null);
            }}
          >
            {i18next.t("admin.productTable.bulkActions.duplicate")}
          </MenuItem>
        }
        {hasArchiveProductPermission &&
          <ConfirmDialog
            title={i18next.t("admin.productTable.bulkActions.archiveTitle")}
            message={i18next.t("productDetailEdit.archiveThisProduct")}
            onConfirm={() => {
              onArchiveProductVariants({
                variantIds: [currentVariant._id],
                redirectOnArchive: true
              });
            }}
          >
            {({ openDialog }) => (
              <MenuItem onClick={openDialog}>{i18next.t("admin.productTable.bulkActions.archive")}</MenuItem>
            )}
          </ConfirmDialog>
        }
      </Menu>
    </>
  );
}

VariantItemAction.propTypes = {
  onArchiveProductVariants: PropTypes.func,
  onCloneProductVariants: PropTypes.func,
  onCreateVariant: PropTypes.func,
  onRestoreProduct: PropTypes.func,
  onToggleVariantVisibility: PropTypes.func,
  option: PropTypes.object,
  product: PropTypes.object,
  variant: PropTypes.object
};

export default VariantItemAction;
