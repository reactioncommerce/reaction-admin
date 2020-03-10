import { useCallback, useMemo } from "react";
import gql from "graphql-tag";
import { useParams } from "react-router-dom";
import i18next from "i18next";
import { useMutation, useQuery } from "@apollo/react-hooks";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { useSnackbar } from "notistack";
import getInventoryInfo from "./getInventoryInfo";

const productQuery = gql`
  query product($productId: ID!, $shopId: ID!) {
    product(productId: $productId, shopId: $shopId) {
      _id
      variants {
        _id
        options {
          _id
        }
      }
    }
  }
`;

const updateSimpleInventoryMutation = gql`
  mutation updateSimpleInventoryMutation($input: UpdateSimpleInventoryInput!) {
    updateSimpleInventory(input: $input) {
      inventoryInfo {
        canBackorder
        inventoryInStock
        inventoryReserved
        isEnabled
        lowInventoryWarningThreshold
      }
    }
  }
`;

const recalculateReservedSimpleInventoryMutation = gql`
  mutation recalculateReservedSimpleInventoryMutation($input: RecalculateReservedSimpleInventoryInput!) {
    recalculateReservedSimpleInventory(input: $input) {
      inventoryInfo {
        canBackorder
        inventoryInStock
        inventoryReserved
        isEnabled
        lowInventoryWarningThreshold
      }
    }
  }
`;

const defaultInventoryInfo = {
  canBackorder: false,
  inventoryInStock: 0,
  inventoryReserved: 0,
  isEnabled: false,
  lowInventoryWarningThreshold: 0
};

/**
 * @method useVariantInventory
 * @summary useVariantInventory hook
 * @param {Object} args input arguments
 * @param {String} args.productId Product Id to load product data for
 * @param {String} args.variantId Variant Id to load product data for
 * @param {String} args.optionId Option Id to load product data for
 * @returns {Object} Result containing the variant inventory info
 */
function useVariantInventory(args = {}) {
  const {
    productId: productIdProp,
    variantId: variantIdProp,
    optionId: optionIdProp
  } = args;

  const { enqueueSnackbar } = useSnackbar();
  const routeParams = useParams();
  const [currentShopId] = useCurrentShopId();

  const productId = routeParams.handle || productIdProp;
  const variantId = routeParams.variantId || variantIdProp;
  const optionId = routeParams.optionId || optionIdProp;
  const shopId = routeParams.shopId || currentShopId;
  const productVariantId = optionId || variantId;
  const getInventoryInfoVariables = {
    productConfiguration: {
      productId,
      productVariantId
    },
    shopId
  };

  const [updateVariantInventoryInfo] = useMutation(updateSimpleInventoryMutation);
  const [recalculateReservedSimpleInventory] = useMutation(recalculateReservedSimpleInventoryMutation);

  const onUpdateVariantInventoryInfo = useCallback(async ({
    inventoryInput,
    productId: productIdLocal = productId,
    productVariantId: productVariantIdLocal = productVariantId,
    productVariantId: shopIdLocal = shopId
  }) => {
    try {
      await updateVariantInventoryInfo({
        variables: {
          input: {
            ...inventoryInput,
            productConfiguration: {
              productId: productIdLocal,
              productVariantId: productVariantIdLocal
            },
            shopId: shopIdLocal
          }
        },
        refetchQueries: [{
          query: getInventoryInfo,
          variables: getInventoryInfoVariables
        }],
        awaitRefetchQueries: true
      });
      enqueueSnackbar(i18next.t("productDetailEdit.updateProductFieldSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.removeProductTagFail"), { variant: "error" });
    }
  }, [enqueueSnackbar, getInventoryInfoVariables, productId, productVariantId, shopId, updateVariantInventoryInfo]);

  const onRecalculateReservedSimpleInventory = useCallback(async ({
    productId: productIdLocal = productId,
    productVariantId: productVariantIdLocal = productVariantId,
    productVariantId: shopIdLocal = shopId
  }) => {
    try {
      await recalculateReservedSimpleInventory({
        variables: {
          input: {
            productConfiguration: {
              productId: productIdLocal,
              productVariantId: productVariantIdLocal
            },
            shopId: shopIdLocal
          }
        }
      });

      enqueueSnackbar(i18next.t("productDetailEdit.updateProductFieldSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.removeProductTagFail"), { variant: "error" });
    }
  }, [enqueueSnackbar, productId, productVariantId, recalculateReservedSimpleInventory, shopId]);

  const { data: inventoryQueryResult, isLoading: isLoadingInventory, refetch: refetchInventory } = useQuery(getInventoryInfo, {
    variables: getInventoryInfoVariables,
    skip: !shopId
  });

  const { data: productQueryResult, isLoading: isLoadingProduct, refetch: refetchProduct } = useQuery(productQuery, {
    variables: {
      productId,
      shopId
    },
    skip: !shopId
  });

  const { product } = productQueryResult || {};

  let variant;
  let option;

  if (product && variantId) {
    variant = product.variants.find(({ _id }) => _id === variantId);
  }

  if (product && variantId && optionId) {
    option = variant.options.find(({ _id }) => _id === optionId);
  }

  const currentVariant = option || variant;
  const hasChildVariants = currentVariant && Array.isArray(currentVariant.options) && currentVariant.options.length;

  const inventoryInfo = useMemo(() => ({
    ...defaultInventoryInfo,
    ...(inventoryQueryResult && inventoryQueryResult.simpleInventory)
  }), [inventoryQueryResult]);

  return {
    currentVariant,
    hasChildVariants,
    isLoading: isLoadingInventory || isLoadingProduct,
    inventoryInfo,
    onRecalculateReservedSimpleInventory,
    onUpdateVariantInventoryInfo,
    option,
    product,
    refetch: () => {
      refetchInventory();
      refetchProduct();
    },
    variant
  };
}

export default useVariantInventory;
