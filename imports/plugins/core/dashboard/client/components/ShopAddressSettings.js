import React, { Fragment, useState } from "react";
import i18next from "i18next";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Typography
} from "@material-ui/core";
import useShopSettings from "../hooks/useShopSettings";
import ShopAddressForm from "./ShopAddressForm";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  textField: {
    minWidth: 350
  },
  saveButton: {
    textAlign: "right"
  }
}));

/**
 * Shop address settings form block component
 * @returns {Node} React node
 */
function ShopAddressSettings() {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const { loading, shop: { addressBook } } = useShopSettings();
  let readOnlyMode = false;
  let address = null;

  if (loading) return <span>Loading</span>;

  // If an address has been set, render in read only mode
  if (addressBook && addressBook[0]) {
    ([address] = addressBook);
    if (!editMode) {
      readOnlyMode = true;
    }
  }

  const handleOnEdit = () => {
    setEditMode(true);
  };

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.settings.address.label")} />
      <CardContent>
        {
          (readOnlyMode)
            ?
            <Fragment>
              <Typography> {address.company}</Typography>
              <Typography> {address.address1}</Typography>
              <Typography> {address.address2}</Typography>
              <Typography> {`${address.city}, ${address.region} ${address.postal}`}</Typography>
              <Typography> {address.country}</Typography>
              <Typography> {address.phone}</Typography>
            </Fragment>
            :
            <ShopAddressForm setEditMode={setEditMode} />
        }
        {!editMode &&
        <Box textAlign="right">
          <Button
            color="primary"
            variant="contained"
            onClick={handleOnEdit}
          >
            Edit
          </Button>
        </Box>
        }
      </CardContent>
    </Card>
  );
}

export default ShopAddressSettings;
