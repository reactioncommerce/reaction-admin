import { useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Meteor } from "meteor/meteor";
import i18next from "i18next";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { useSnackbar } from "notistack";

// GraphQL Queries / Mutations
import ArchiveProductsMutation from "../graphql/mutations/archiveProducts";
import ArchiveProductVariantsMutation from "../graphql/mutations/archiveProductVariants";
import CloneProductsMutation from "../graphql/mutations/cloneProducts";
import CloneProductVariantsMutation from "../graphql/mutations/cloneProductVariants";
import CreateProductVariantMutation from "../graphql/mutations/createProductVariant";
import ProductQuery from "../graphql/queries/product";
import PublishProductsToCatalogMutation from "../graphql/mutations/publishProductsToCatalog";
import UpdateProductMutation from "../graphql/mutations/updateProduct";
import UpdateProductVariantMutation from "../graphql/mutations/updateProductVariant";
import UpdateProductVariantPricesMutation from "../graphql/mutations/updateProductVariantPrices";

/**
 * Restore an archived product
 * @param {Object} product Product object
 * @returns {undefined} No return
 */
export function handleProductRestore(product) {
  Meteor.call("products/updateProductField", product._id, "isDeleted", false);
}

/**
 * @method useProduct
 * @summary useProduct hook
 * @param {Object} args input arguments
 * @param {String} args.productId Product Id to load product data for
 * @param {String} args.variantId Variant Id to load product data for
 * @param {String} args.optionId Option Id to load product data for
 * @returns {Object} Result containing the product and other helpers for managing that product
 */
function useProduct(args = {}) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    productId: productIdProp,
    variantId: variantIdProp,
    optionId: optionIdProp
  } = args;
  const [newMetaField, setNewMetaField] = useState({ key: "", value: "" });
  const history = useHistory();
  const routeParams = useParams();
  const [updateProduct] = useMutation(UpdateProductMutation);
  const [archiveProducts] = useMutation(ArchiveProductsMutation);
  const [cloneProducts] = useMutation(CloneProductsMutation);
  const [createProductVariant] = useMutation(CreateProductVariantMutation);
  const [updateProductVariant] = useMutation(UpdateProductVariantMutation);
  const [cloneProductVariants] = useMutation(CloneProductVariantsMutation);
  const [archiveProductVariants] = useMutation(ArchiveProductVariantsMutation);
  const [publishProductsToCatalog] = useMutation(PublishProductsToCatalogMutation);
  const [updateProductVariantPrices] = useMutation(UpdateProductVariantPricesMutation);

  const [currentShopId] = useCurrentShopId();

  const productId = routeParams.handle || productIdProp;
  const variantId = routeParams.variantId || variantIdProp;
  const optionId = routeParams.optionId || optionIdProp;
  const shopId = routeParams.shopId || currentShopId;

  const { data: productQueryResult, isLoading, refetch: refetchProduct } = useQuery(ProductQuery, {
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

  const onPublishProduct = useCallback(async ({ productId: productIdLocal = product._id }) => {
    try {
      await publishProductsToCatalog({
        variables: {
          productIds: [productIdLocal]
        }
      });

      // Refetch on success to force a cache update
      refetchProduct();

      enqueueSnackbar(i18next.t("admin.catalogProductPublishSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  }, [product, publishProductsToCatalog, refetchProduct, enqueueSnackbar]);

  const onArchiveProduct = useCallback(async (productLocal, redirectUrl) => {
    try {
      await archiveProducts({ variables: { input: { shopId, productIds: [productLocal] } } });
      enqueueSnackbar(i18next.t("productDetailEdit.archiveProductsSuccess"), { variant: "success" });
      history.push(redirectUrl);
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.archiveProductsFail"), { variant: "success" });
    }
  }, [
    enqueueSnackbar,
    history,
    archiveProducts,
    shopId
  ]);


  const onCloneProduct = useCallback(async (productLocal) => {
    try {
      await cloneProducts({ variables: { input: { shopId, productIds: [productLocal] } } });
      enqueueSnackbar(i18next.t("productDetailEdit.cloneProductSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.cloneProductFail"), { variant: "error" });
    }
  }, [cloneProducts, enqueueSnackbar, shopId]);

  const onCreateVariant = useCallback(async ({
    parentId: parentIdLocal = product._id,
    shopId: shopIdLocal = shopId,
    redirectOnCreate = false
  }) => {
    try {
      const { data } = await createProductVariant({
        variables: {
          input: {
            productId: parentIdLocal,
            shopId: shopIdLocal
          }
        }
      });

      // Optionally redirect to the new variant or option on create
      if (redirectOnCreate) {
        if (data && parentIdLocal === product._id) {
          const newVariantId = data.createProductVariant && data.createProductVariant.variant && data.createProductVariant.variant._id;
          history.push(`/${shopIdLocal}/products/${product._id}/${newVariantId}`);
        } else {
          const newOptionId = data.createProductVariant && data.createProductVariant.variant && data.createProductVariant.variant._id;
          history.push(`/${shopIdLocal}/products/${product._id}/${parentIdLocal}/${newOptionId}`);
        }
      }

      // Refetch product data when we adda new variant
      refetchProduct();

      // Because of the way GraphQL and meteor interact when creating a new variant,
      // we can't immediately redirect a user to the new variant as GraphQL is too quick
      // and the meteor subscription isn't yet updated. Once this page has been updated
      // to use GraphQL for data fetching, add a redirect to the new variant when it's created
      enqueueSnackbar(i18next.t("productDetailEdit.addVariant"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.addVariantFail"), { variant: "error" });
    }
  }, [createProductVariant, enqueueSnackbar, history, product, refetchProduct, shopId]);

  const onToggleProductVisibility = useCallback(async () => {
    try {
      await updateProduct({
        variables: {
          input: {
            productId: product._id,
            shopId,
            product: {
              isVisible: !product.isVisible
            }
          }
        }
      });

      enqueueSnackbar(i18next.t("productDetailEdit.updateProductFieldSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.updateProductFieldFail"), { variant: "error" });
    }
  }, [
    enqueueSnackbar,
    product,
    shopId,
    updateProduct
  ]);

  /**
   * @method onUpdateProduct
   * @param {Object} args
   * @param {Object} args.product Product fields to update
   * @param {Object} [args.productId] Product ID to update. Leave blank for current product.
   * @param {Object} [args.shopId] Shop ID of the product to update. Leave blank for current shop.
   */
  const onUpdateProduct = useCallback(async ({
    product: productLocal,
    productId: productIdLocal = product._id,
    shopId: shopIdLocal = shopId
  }) => {
    try {
      await updateProduct({
        variables: {
          input: {
            productId: productIdLocal,
            shopId: shopIdLocal,
            product: productLocal
          }
        }
      });

      // Refetch on success to force a cache update
      refetchProduct();

      enqueueSnackbar(i18next.t("productDetailEdit.updateProductFieldSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.updateProductFieldFail"), { variant: "error" });
    }
  }, [
    enqueueSnackbar,
    product,
    shopId,
    updateProduct,
    refetchProduct
  ]);

  const handleDeleteProductTag = useCallback(async ({
    tag: tagLocal,
    product: productLocal = product,
    productId: productIdLocal = product._id,
    shopId: shopIdLocal = shopId
  }) => {
    const filteredTagIds = productLocal.tags.nodes
      .filter(({ _id }) => _id !== tagLocal._id)
      .map(({ _id }) => _id);

    try {
      await updateProduct({
        variables: {
          input: {
            productId: productIdLocal,
            shopId: shopIdLocal,
            product: {
              tagIds: filteredTagIds
            }
          }
        }
      });

      enqueueSnackbar(i18next.t("productDetailEdit.removeProductTagSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.removeProductTagFail"), { variant: "error" });
    }
  }, [
    enqueueSnackbar,
    product,
    shopId,
    updateProduct
  ]);


  const onUpdateProductVariant = useCallback(async ({
    variant: variantLocal,
    variantId: variantIdLocal,
    shopId: shopIdLocal = shopId
  }) => {
    try {
      await updateProductVariant({
        variables: {
          input: {
            shopId: shopIdLocal,
            variant: variantLocal,
            variantId: variantIdLocal
          }
        }
      });

      // Refetch on success to force a cache update
      refetchProduct();

      enqueueSnackbar(i18next.t("productVariant.updateVariantSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productVariant.updateVariantFail"), { variant: "error" });
    }
  }, [enqueueSnackbar, shopId, updateProductVariant, refetchProduct]);

  const onUpdateProductVariantPrices = useCallback(async ({
    variantPrices: variantPricesLocal,
    variantId: variantIdLocal,
    shopId: shopIdLocal = shopId
  }) => {
    const { price, compareAtPrice } = variantPricesLocal;
    try {
      await updateProductVariantPrices({
        variables: {
          input: {
            shopId: shopIdLocal,
            prices: {
              price,
              compareAtPrice: compareAtPrice?.amount
            },
            variantId: variantIdLocal
          }
        }
      });

      // Refetch on success to force a cache update
      refetchProduct();

      enqueueSnackbar(i18next.t("productVariant.updateVariantPricesSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productVariant.updateVariantPricesFail"), { variant: "error" });
    }
  }, [enqueueSnackbar, shopId, updateProductVariantPrices, refetchProduct]);

  const onToggleVariantVisibility = useCallback(async ({
    variant: variantLocal,
    shopId: shopIdLocal = shopId
  }) => {
    try {
      await updateProductVariant({
        variables: {
          input: {
            variantId: variantLocal._id,
            shopId: shopIdLocal,
            variant: {
              isVisible: !variantLocal.isVisible
            }
          }
        }
      });

      enqueueSnackbar(i18next.t("productDetailEdit.updateProductFieldSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.updateProductFieldFail"), { variant: "error" });
    }
  }, [enqueueSnackbar, shopId, updateProductVariant]);

  const onCloneProductVariants = useCallback(async ({
    variantIds: variantIdsLocal,
    shopId: shopIdLocal = shopId
  }) => {
    try {
      await cloneProductVariants({
        variables: {
          input: {
            shopId: shopIdLocal,
            variantIds: variantIdsLocal
          }
        }
      });

      // Refetch product data when we adda new variant
      refetchProduct();

      enqueueSnackbar(i18next.t("productDetailEdit.cloneProductSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.cloneProductFail"), { variant: "error" });
    }
  }, [cloneProductVariants, enqueueSnackbar, refetchProduct, shopId]);

  const onArchiveProductVariants = useCallback(async ({
    variantIds: variantIdsLocal,
    shopId: shopIdLocal = shopId,
    redirectOnArchive = false
  }) => {
    try {
      await archiveProductVariants({
        variables: {
          input: {
            shopId: shopIdLocal,
            variantIds: variantIdsLocal
          }
        }
      });

      if (redirectOnArchive) {
        let redirectUrl;

        if (option) {
          redirectUrl = `/${shopIdLocal}/products/${product._id}/${variant._id}`;
        } else {
          redirectUrl = `/${shopIdLocal}/products/${product._id}`;
        }

        history.push(redirectUrl);
      }

      // Refetch product data when we adda new variant
      refetchProduct();

      enqueueSnackbar(i18next.t("productDetailEdit.archiveProductVariantsSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("productDetailEdit.archiveProductVariantsFail"), { variant: "error" });
    }
  }, [archiveProductVariants, enqueueSnackbar, history, option, product, refetchProduct, shopId, variant]);

  // Convert the social metadata to a format better suited for forms
  if (product && Array.isArray(product.socialMetadata)) {
    product.socialMetadata.forEach(({ service, message }) => {
      product[`${service}Msg`] = message;
    });
  }

  return {
    currentVariant: option || variant,
    newMetaField,
    isLoading,
    handleDeleteProductTag,
    onArchiveProduct,
    onArchiveProductVariants,
    onCloneProduct,
    onCloneProductVariants,
    onCreateVariant,
    onPublishProduct,
    onUpdateProduct,
    onUpdateProductVariantPrices,
    option,
    onRestoreProduct: handleProductRestore,
    onToggleProductVisibility,
    onToggleVariantVisibility,
    onUpdateProductVariant,
    product: productQueryResult && productQueryResult.product,
    refetchProduct,
    setNewMetaField,
    shopId,
    variant
  };
}

export default useProduct;
