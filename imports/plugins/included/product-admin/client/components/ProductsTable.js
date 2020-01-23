import React, { useState, useMemo, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import i18next from "i18next";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import decodeOpaqueId from "/imports/utils/decodeOpaqueId.js";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { Card, CardHeader, CardContent, Grid, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import productsQuery from "../graphql/queries/products";
import publishProductsToCatalog from "../graphql/mutations/publishProductsToCatalog";
import archiveProducts from "../graphql/mutations/archiveProducts";
import updateProduct from "../graphql/mutations/updateProduct";
import cloneProducts from "../graphql/mutations/cloneProducts";
import StatusIconCell from "./DataTable/StatusIconCell";
import PublishedStatusCell from "./DataTable/PublishedStatusCell";
import FilterByFileCard from "./FilterByFileCard";

const useStyles = makeStyles({
  card: {
    overflow: "visible"
  }
});

/**
 * @summary Main products view
 * @name ProductsTable
 * @returns {React.Component} A React component
 */
function ProductsTable() {
  const apolloClient = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [files, setFiles] = useState([]);
  const [filterByProductIds, setFilterByProductIds] = useState(null);
  const [isFilterByFileVisible, setFilterByFileVisible] = useState(false);
  const [isFiltered, setFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [shopId] = useCurrentShopId();
  const [tableData, setTableData] = useState([]);

  const onDrop = (accepted) => {
    if (accepted.length === 0) return;
    setFiles(accepted);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    disablePreview: true,
    disableClick: true
  });


  const importFiles = (newFiles) => {
    let productIds = [];

    newFiles.map((file) => {
      const output = [];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        const parse = require("csv-parse");

        parse(reader.result, {
          trim: true,
          // eslint-disable-next-line camelcase
          skip_empty_lines: true
        })
          .on("readable", function () {
            let record;
            // eslint-disable-next-line no-cond-assign
            while (record = this.read()) {
              output.push(record);
            }
          })
          .on("end", () => {
            output.map((outputarray) => {
              productIds = productIds.concat(outputarray);
              return;
            });
            setFilterByProductIds(productIds);
            setFilterByFileVisible(false);
            setFiltered(true);
          });
      };
      return;
    });
  };

  const handleDelete = (deletedFilename) => {
    const newFiles = files.filter((file) => file.name !== deletedFilename);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setFiltered(false);
      setFilterByProductIds(null);
    } else if (isFiltered) {
      importFiles(newFiles);
    }
  };

  // Create and memoize the column data
  const columns = useMemo(() => [
    {
      Header: "Title",
      accessor: "title"
    },
    {
      Header: "Product ID",
      accessor: (row) => {
        const { id: productId } = decodeOpaqueId(row._id);
        return productId;
      },
      id: "_id"
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
    setIsLoading(true);
    if (!shopId) {
      return;
    }

    const { data } = await apolloClient.query({
      query: productsQuery,
      variables: {
        shopIds: [shopId],
        productIds: filterByProductIds,
        query: globalFilter,
        first: pageSize,
        limit: (pageIndex + 1) * pageSize,
        offset: pageIndex * pageSize
      },
      fetchPolicy: "network-only"
    });

    // Update the state with the fetched data as an array of objects and the calculated page count
    setTableData(data.products.nodes);
    setPageCount(Math.ceil(data.products.totalCount / pageSize));

    setIsLoading(false);
  }, [apolloClient, filterByProductIds, shopId]);

  // Row click callback
  const onRowClick = useCallback(async ({ row }) => {
    let variantId = "";
    const { id: productId } = decodeOpaqueId(row.original._id);
    // check for variant existence
    if (row.original.variants && row.original.variants.length) {
      ({ id: variantId } = decodeOpaqueId(row.original.variants[0]._id));
    }

    history.push(`/products/${productId}/${variantId}`);
  }, [history]);

  const onRowSelect = useCallback(async ({ selectedRows: rows }) => {
    setSelectedRows(rows || []);
  }, []);

  const labels = useMemo(() => ({
    globalFilterPlaceholder: "Filter products"
  }), []);

  const dataTableProps = useDataTable({
    columns,
    data: tableData,
    labels,
    pageCount,
    onFetchData,
    onRowClick,
    onRowSelect,
    getRowId: (row) => row._id
  });

  const { state: { pageIndex, pageSize, globalFilter } } = dataTableProps;

  const refetch = useCallback(
    async () => {
      setIsLoading(true);

      const { data } = await apolloClient.query({
        query: productsQuery,
        variables: {
          shopIds: [shopId],
          productIds: filterByProductIds,
          query: globalFilter,
          first: pageSize,
          limit: (pageIndex + 1) * pageSize,
          offset: pageIndex * pageSize
        },
        fetchPolicy: "network-only"
      });

      // Update the state with the fetched data as an array of objects and the calculated page count
      setTableData(data.products.nodes);
      setPageCount(Math.ceil(data.products.totalCount / pageSize));
      setIsLoading(false);
    },
    [apolloClient, filterByProductIds, globalFilter, pageIndex, pageSize, shopId],
  );

  // Create options for the built-in ActionMenu in the DataTable
  const options = useMemo(() => [{
    label: "Filter by file",
    onClick: () => {
      setFilterByFileVisible(true);
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

      refetch();
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

      refetch();
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

      refetch();
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

      refetch();
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


      refetch();
      enqueueSnackbar(
        i18next.t("admin.productTable.bulkActions.archiveSuccess", { count: data.archiveProducts.products.length }),
        { variant: "success" }
      );
    }
  }], [apolloClient, enqueueSnackbar, refetch, selectedRows, shopId]);

  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <FilterByFileCard
        isFilterByFileVisible={isFilterByFileVisible}
        files={files}
        getInputProps={getInputProps}
        getRootProps={getRootProps}
        importFiles={importFiles}
        handleDelete={handleDelete}
        setFilterByFileVisible={setFilterByFileVisible}
      />
      <Grid item sm={12}>
        <Card className={classes.card}>
          <CardHeader title={i18next.t("admin.products")} />
          <CardContent>
            <DataTable
              {...dataTableProps}
              actionMenuProps={{ options }}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </Grid >
    </Grid >
  );
}

export default ProductsTable;
