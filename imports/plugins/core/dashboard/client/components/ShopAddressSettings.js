import React, { Fragment, useState } from "react";
import i18next from "i18next";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography
} from "@material-ui/core";
import useShopSettings from "../hooks/useShopSettings";
import ShopAddressForm from "./ShopAddressForm";

/**
 * Shop address settings form block component
 * @returns {Node} React node
 */
function ShopAddressSettings() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { loading, shop: { addressBook } } = useShopSettings();
  let readOnlyMode = false;
  let isInitialView = false;
  let address = null;

  if (loading) {
    return (
      <Box textAlign="center">
        <CircularProgress variant="indeterminate" color="primary" />
      </Box>
    );
  }

  // If an address has been set, render in read only mode
  if (addressBook && addressBook[0]) {
    ([address] = addressBook);

    if (!isEditMode) readOnlyMode = true;
  } else {
    isInitialView = true;
  }

  const actionButtonText = isInitialView
    ? i18next.t("admin.settings.address.addNewAddress")
    : i18next.t("admin.settings.address.edit");

  const handleOnEdit = () => {
    setIsEditMode(true);
  };

  return (
    <Card>
      <CardHeader title={i18next.t("admin.settings.address.label")} />
      <CardContent>
        {isInitialView &&
          <Typography>
            {i18next.t("admin.settings.address.initialViewText")}
          </Typography>
        }
        {
          (readOnlyMode)
            ?
            <Fragment>
              <Typography> {address.company}</Typography>
              <Typography> {address.fullName}</Typography>
              <Typography> {address.address1}</Typography>
              <Typography> {address.address2}</Typography>
              <Typography> {`${address.city}, ${address.region} ${address.postal}`}</Typography>
              <Typography> {address.country}</Typography>
              <Typography> {address.phone}</Typography>
            </Fragment>
            :
            <ShopAddressForm
              isInitialView={isInitialView}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
            />
        }
        {!isEditMode &&
        <Box textAlign="right">
          <Button
            color="primary"
            variant="contained"
            onClick={handleOnEdit}
          >
            {actionButtonText}
          </Button>
        </Box>
        }
      </CardContent>
    </Card>
  );
}

export default ShopAddressSettings;
