import React, { useState } from "react";
import gql from "graphql-tag";
import { useSnackbar } from "notistack";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { i18next } from "/client/api";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId.js";

const useStyles = makeStyles((theme) => ({
  topCard: {
    marginBottom: theme.spacing(2)
  }
}));

const getPaymentMethodsQuery = gql`
  query getPaymentMethods($shopId: ID!) {
    paymentMethods(shopId: $shopId) {
      displayName
      isEnabled
      name
    }
  }
`;

const enablePaymentMethodForShopMutation = gql`
  mutation enablePaymentMethodForShopMutation($isEnabled: Boolean!, $paymentMethodName: String!, $shopId: ID!) {
    enablePaymentMethodForShop(input: {
      isEnabled: $isEnabled,
      paymentMethodName: $paymentMethodName,
      shopId: $shopId
    }) {
      paymentMethods {
        name
      }
    }
  }
`;

/**
 * @summary Renders payment settings page
 * @return {React.Node} React node
 */
export default function PaymentSettings() {
  const classes = useStyles();
  const [shopId] = useCurrentShopId();
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [getPaymentMethods, {
    called,
    data,
    refetch: refetchPaymentMethods
  }] = useLazyQuery(getPaymentMethodsQuery);
  const [enablePaymentMethodForShop] = useMutation(enablePaymentMethodForShopMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      refetchPaymentMethods();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("changesNotSaved"), { variant: "warning" });
    }
  });

  if (shopId && !called) {
    getPaymentMethods({
      variables: {
        shopId
      }
    });
  }

  return (
    <div>
      <Card className={classes.topCard}>
        <CardHeader
          title={i18next.t("shopSettings.paymentMethods")}
        />
        <CardContent>
          {data && data.paymentMethods.map((paymentMethod) => (
            <div key={paymentMethod.name}>
              {paymentMethod.displayName}
              <Button
                disabled={isSubmitting}
                onClick={() => {
                  setIsSubmitting(true);
                  enablePaymentMethodForShop({
                    variables: {
                      isEnabled: !paymentMethod.isEnabled,
                      paymentMethodName: paymentMethod.name,
                      shopId
                    }
                  });
                }}
              >
                {paymentMethod.isEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
