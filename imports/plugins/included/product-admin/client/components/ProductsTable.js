import React, { useMemo, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import i18next from "i18next";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import { useSnackbar } from "notistack";
import decodeOpaqueId from "/imports/utils/decodeOpaqueId.js";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { Card, CardHeader, CardContent, Checkbox, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import productsQuery from "../graphql/queries/products";
import publishProductsToCatalog from "../graphql/mutations/publishProductsToCatalog";
import archiveProducts from "../graphql/mutations/archiveProducts";
import updateProduct from "../graphql/mutations/updateProduct";
import cloneProducts from "../graphql/mutations/cloneProducts";
import StatusIconCell from "./DataTable/StatusIconCell";
import PublishedStatusCell from "./DataTable/PublishedStatusCell";

const useStyles = makeStyles({
  card: {
    overflow: "visible"
  }
});

/**
 * @name ProductsTable
 * @returns {React.Component} A React component
 */
function ProductsTable() {
  const apolloClient = useApolloClient();
  const [shopId] = useCurrentShopId();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  // Create and memoize the column data
  const columns = useMemo(() => [
    {
      id: "selection",
      headerProps: {},
      cellProps: {
        isClickDisabled: true,
        padding: "checkbox"
      },
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      ),
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => (
        <Checkbox
          // eslint-disable-next-line react/prop-types
          {...row.getToggleRowSelectedProps()}
          // eslint-disable-next-line react/prop-types
          title={`Toggle row selection for ${row.values.fullName}`}
        />
      )
    },
    {
      Header: "Title",
      accessor: "title"
    },
    {
      Header: "Product ID",
      accessor: (row) => {
        const { id: productId } = decodeOpaqueId(row._id);
        return productId;
      }
    },
    {
      Header: "Price",
      accessor: "price.range"
    },
    {
      Header: "Published",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <PublishedStatusCell row={row} />
    },
    {
      Header: "Status",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <StatusIconCell row={row} />,
      id: "isVisible"
    }
  ], []);

  const onFetchData = useCallback(async ({ globalFilter, pageIndex, pageSize }) => {
    // Wait for shop id to be available before fetching products.
    if (!shopId) {
      return {
        data: [],
        pageCount: 0
      };
    }

    // TODO: Add loading and error handling
    const { data } = await apolloClient.query({
      query: productsQuery,
      variables: {
        shopIds: [shopId],
        query: globalFilter,
        first: pageSize,
        offset: pageIndex * pageSize
      }
    });

    // Return the fetched data as an array of objects and the calculated page count
    return {
      data: data.products.nodes,
      pageCount: Math.ceil(data.products.totalCount / pageSize)
    };
  }, [apolloClient, shopId]);

  // Row click callback
  const onRowClick = useCallback(async ({ row }) => {
    let variantId = "";
    const { id: productId } = decodeOpaqueId(row.original._id);
    // check for variant existence
    if (row.original.variants.length) {
      ({ id: variantId } = decodeOpaqueId(row.original.variants[0]._id));
    }

    history.push(`/products/${productId}/${variantId}`);
  }, [history]);

  const onSelectRows = useCallback(async ({ selectedRows }) => {
    console.log("Selected rows", selectedRows);
  }, []);

  const dataTableProps = useDataTable({
    columns,
    getRowID: (row) => row._id,
    onFetchData,
    onRowClick,
    onSelectRows
  });

  const [{ selectedRows }] = dataTableProps.state;

  // Create options for the built-in ActionMenu in the DataTable
  const options = useMemo(() => [{
    label: "Filter by file",
    onClick: () => {
      console.log("Filter by file");
    }
  }, {
    label: "Publish",
    confirmTitle: `Publish ${selectedRows.length} products`,
    confirmMessage: `Are you sure you want to publish ${selectedRows.length} products to your storefront?`,
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
      if (selectedRows.length === 0) return;

      const { data, error } = await apolloClient.mutate({
        mutation: publishProductsToCatalog,
        variables: {
          productIds: selectedRows
        }
      });

      if (error && error.length) {
        enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
        return;
      }

      enqueueSnackbar(
        i18next.t("admin.productTable.bulkActions.published", { count: data.publishProductsToCatalog.length }),
        { variant: "success" }
      );
    }
  }, {
    label: "Make Visible",
    confirmTitle: `Make ${selectedRows.length} products visible`,
    confirmMessage: `Are you sure you want to make ${selectedRows.length} products visible to customers?`,
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
      if (selectedRows.length === 0) return;

      const errors = [];
      const successes = [];
      // TODO: refactor this loop to use a bulk update mutation that needs to be implemented.
      for (const productId of selectedRows) {
        // eslint-disable-next-line no-await-in-loop
        const { data, error } = await apolloClient.mutate({
          mutation: updateProduct,
          variables: {
            input: {
              product: {
                isVisible: true
              },
              productId,
              shopId
            }
          }
        });

        if (error) errors.push(error);
        if (data) successes.push(data);
      }

      if (errors.length) {
        enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
        return;
      }

      enqueueSnackbar(
        i18next.t("admin.productTable.bulkActions.makeVisibleSuccess", { count: successes.length }),
        { variant: "success" }
      );
    }
  }, {
    label: "Make Hidden",
    confirmTitle: `Make ${selectedRows.length} products hidden`,
    confirmMessage: `Are you sure you want to make ${selectedRows.length} products hidden from customers?`,
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
      if (selectedRows.length === 0) return;

      const errors = [];
      const successes = [];
      // TODO: refactor this loop to use a bulk update mutation that needs to be implemented.
      for (const productId of selectedRows) {
        // eslint-disable-next-line no-await-in-loop
        const { data, error } = await apolloClient.mutate({
          mutation: updateProduct,
          variables: {
            input: {
              product: {
                isVisible: false
              },
              productId,
              shopId
            }
          }
        });

        if (error && error.length) errors.push(error);
        if (data) successes.push(data);
      }

      if (errors.length) {
        enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
        return;
      }

      enqueueSnackbar(
        i18next.t("admin.productTable.bulkActions.makeHiddenSuccess", { count: successes.length }),
        { variant: "success" }
      );
    }
  }, {
    label: "Duplicate",
    confirmTitle: `Duplicate ${selectedRows.length} products`,
    confirmMessage: `Are you sure you want to duplicate ${selectedRows.length} products?`,
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
      if (selectedRows.length === 0) return;

      const { data, error } = await apolloClient.mutate({
        mutation: cloneProducts,
        variables: {
          input: {
            productIds: selectedRows,
            shopId
          }
        }
      });

      if (error && error.length) {
        enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
        return;
      }

      enqueueSnackbar(
        i18next.t("admin.productTable.bulkActions.duplicateSuccess", { count: data.cloneProducts.products.length }),
        { variant: "success" }
      );
    }
  }, {
    label: "Archive",
    confirmTitle: `Archive ${selectedRows.length} products`,
    confirmMessage: `Are you sure you want to archive ${selectedRows.length} products? This will hide them from both admins and customers.`,
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
      if (selectedRows.length === 0) return;

      const { data, error } = await apolloClient.mutate({
        mutation: archiveProducts,
        variables: {
          input: {
            productIds: selectedRows,
            shopId
          }
        }
      });

      if (error && error.length) {
        enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
        return;
      }

      enqueueSnackbar(
        i18next.t("admin.productTable.bulkActions.archiveSuccess", { count: data.archiveProducts.products.length }),
        { variant: "success" }
      );
    }
  }], [apolloClient, enqueueSnackbar, selectedRows, shopId]);

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.products")} />
      <CardContent>
        <DataTable
          {...dataTableProps}
          actionMenuProps={{ options }}
          placeholder={"Filter products"}
          isFilterable
        />
      </CardContent>
    </Card>
  );
}

export default ProductsTable;
