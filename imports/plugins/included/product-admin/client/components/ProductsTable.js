import React, { useState, useMemo, useCallback } from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import i18next from "i18next";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import Button from "@reactioncommerce/catalyst/Button";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { Card, CardHeader, CardContent, Grid, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import productsQuery from "../graphql/queries/products";
import publishProductsToCatalog from "../graphql/mutations/publishProductsToCatalog";
import archiveProducts from "../graphql/mutations/archiveProducts";
import updateProduct from "../graphql/mutations/updateProduct";
import cloneProducts from "../graphql/mutations/cloneProducts";
import createProductMutation from "../graphql/mutations/createProduct";
import getPDPUrl from "../utils/getPDPUrl";
import StatusIconCell from "./DataTable/StatusIconCell";
import MediaCell from "./DataTable/MediaCell";
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
  const [createProduct, { error: createProductError }] = useMutation(createProductMutation);
  const [files, setFiles] = useState([]);
  const [filterByProductIds, setFilterByProductIds] = useState(null);
  const [isFilterByFileVisible, setFilterByFileVisible] = useState(false);
  const [isFiltered, setFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [shopId] = useCurrentShopId();
  const [tableData, setTableData] = useState([]);

  // Create and memoize the column data
  const columns = useMemo(() => [
    {
      Header: "",
      accessor: "original.media[0].URLs.thumbnail",
      cellProps: () => ({
        style: {
          paddingLeft: 0,
          paddingRight: 0
        }
      }),
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <MediaCell row={row} />
    },
    {
      Header: "Product",
      accessor: "title"
    },
    {
      Header: "ID",
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
        productIds: filterByProductIds && filterByProductIds.map((id) => encodeOpaqueId("reaction/product", id)),
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
    const href = getPDPUrl(row.original);
    history.push(href);
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

  const { refetch, setFilter } = dataTableProps;

  const onDrop = (accepted) => {
    if (accepted.length === 0) return;
    setFiles(accepted);
  };

  const handleCreateProduct = async () => {
    const { data } = await createProduct({ variables: { input: { shopId } } });

    if (data) {
      const { createProduct: { product } } = data;
      const { id: decodedProductId } = decodeOpaqueId(product._id);
      history.push(`/products/${decodedProductId}`);
    }

    if (createProductError) {
      enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
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
            // setFilter("filterByFile", file.name);
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
        <Button color="primary" variant="contained" onClick={handleCreateProduct}>
          {i18next.t("admin.createProduct") || "Create product"}
        </Button>
      </Grid>
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
