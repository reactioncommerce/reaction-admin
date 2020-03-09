import React, { useState } from "react";
import gql from "graphql-tag";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import { useSnackbar } from "notistack";
import { Button, TextField } from "@reactioncommerce/catalyst";
import { useMutation } from "@apollo/react-hooks";
import {
  Box,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import { Components } from "@reactioncommerce/reaction-components";
import useCurrentShop from "/imports/client/ui/hooks/useCurrentShop.js";

const useStyles = makeStyles((theme) => ({
  cardActions: {
    padding: theme.spacing(2),
    justifyContent: "flex-end"
  }
}));

const shopLogoUrlsSchema = new SimpleSchema({
  "shopLogoUrls": Object,
  "shopLogoUrls.primaryShopLogoUrl": {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  }
});

const validator = shopLogoUrlsSchema.getFormValidator();

const updateShopMutation = gql`
  mutation updateShopMutation($input: UpdateShopInput!) {
    updateShop(input: $input) {
      clientMutationId
      shop {
        _id
        shopLogoUrls {
          primaryShopLogoUrl
        }
      }
    }
  }
`;

/**
 * A React component
 * @returns {React.Node} A React component
 */
export default function ShopLogoUrls() {
  const { isLoading, shop, shopId, refetchShop } = useCurrentShop();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateShop] = useMutation(updateShopMutation);
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdateUrls = async (formData) => {
    const { shopLogoUrls } = formData;

    try {
      await updateShop({
        variables: {
          input: {
            shopId,
            shopLogoUrls
          }
        }
      });
      enqueueSnackbar(i18next.t("admin.settings.saveSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("admin.settings.saveFailed"), { variant: "error" });
    }
  };

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);
      await handleUpdateUrls(shopLogoUrlsSchema.clean(formData));
      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(shopLogoUrlsSchema.clean(formData));
    },
    value: shop
  });

  const handleSubmitForm = (event) => {
    event.preventDefault();
    submitForm();
  };

  const classes = useStyles();

  if (!shop || isLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress variant="indeterminate" color="primary" />
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader
        subheader={i18next.t("shopSettings.shopLogo.description")}
        title={i18next.t("shopSettings.shopLogo.title")}
      />
      <CardContent>
        <TextField
          error={hasErrors(["shopLogoUrls.primaryShopLogoUrl"])}
          fullWidth
          helperText={getFirstErrorMessage(["shopLogoUrls.primaryShopLogoUrl"])}
          label={i18next.t("shopSettings.shopLogo.primaryShopLogoUrlTitle")}
          placeholder={i18next.t("shopSettings.shopLogo.primaryShopLogoUrlDescription")}
          {...getInputProps("shopLogoUrls.primaryShopLogoUrl", muiOptions)}
        />
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          color="primary"
          disabled={isSubmitting || !isDirty}
          variant="contained"
          onClick={handleSubmitForm}
        >
          {i18next.t("app.saveChanges")}
        </Button>
      </CardActions>
      <CardContent>
        <Components.ShopBrandMediaManager afterSetBrandImage={refetchShop} shop={shop} />
      </CardContent>
    </Card>
  );
}

