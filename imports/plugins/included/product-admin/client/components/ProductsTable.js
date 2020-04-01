import React, { Fragment, useState, useMemo, useCallback } from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import i18next from "i18next";
import { useHistory } from "react-router-dom";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import Button from "@reactioncommerce/catalyst/Button";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { Card, CardHeader, CardContent, Grid, makeStyles } from "@material-ui/core";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import productsQuery from "../graphql/queries/products";
import publishProductsToCatalog from "../graphql/mutations/publishProductsToCatalog";
import archiveProducts from "../graphql/mutations/archiveProducts";
import updateProduct from "../graphql/mutations/updateProduct";
import cloneProducts from "../graphql/mutations/cloneProducts";
import createProductMutation from "../graphql/mutations/createProduct";
import getPDPUrl from "../utils/getPDPUrl";
import getTranslation from "../utils/getTranslation";
import StatusIconCell from "./DataTable/StatusIconCell";
import MediaCell from "./DataTable/MediaCell";
import PublishedStatusCell from "./DataTable/PublishedStatusCell";
import FilterByFileCard from "./FilterByFileCard";
import TagSelector from "./TagSelector";

const useStyles = makeStyles((theme) => ({
  card: {
    overflow: "visible"
  },
  cardHeader: {
    paddingBottom: 0
  },
  selectedProducts: {
    fontWeight: 400,
    marginLeft: theme.spacing(1)
  }
}));

const CSV_FILE_TYPES = [
  "text/csv",
  "text/plain",
  "text/x-csv",
  "application/vnd.ms-excel",
  "application/csv",
  "application/x-csv",
  "text/comma-separated-values",
  "text/x-comma-separated-values",
  "text/tab-separated-values"
];

/**
 * @summary Main products view
 * @name ProductsTable
 * @returns {React.Component} A React component
 */
function ProductsTable() {
  const apolloClient = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [shopId] = useCurrentShopId();
  const [createProduct, { error: createProductError }] = useMutation(createProductMutation);

  // React-Table state
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);

  // Filter by file state
  const [files, setFiles] = useState([]);
  const [isFilterByFileVisible, setFilterByFileVisible] = useState(false);
  const [isFiltered, setFiltered] = useState(false);

  // Tag selector state
  const [isTagSelectorVisible, setTagSelectorVisibility] = useState(false);

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
      Header: i18next.t("admin.productTable.header.product"),
      accessor: "title"
    },
    {
      Header: i18next.t("admin.productTable.header.id"),
      accessor: (row) => {
        const { id: productId } = decodeOpaqueId(row._id);
        return productId;
      },
      id: "_id"
    },
    {
      Header: i18next.t("admin.productTable.header.price"),
      accessor: "price.range"
    },
    {
      Header: i18next.t("admin.productTable.header.published"),
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <PublishedStatusCell row={row} />
    },
    {
      Header: i18next.t("admin.productTable.header.visible"),
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <StatusIconCell row={row} />,
      id: "isVisible"
    }
  ], []);


  const onFetchData = useCallback(async ({ globalFilter, manualFilters, pageIndex, pageSize }) => {
    // Wait for shop id to be available before fetching products.
    setIsLoading(true);
    if (!shopId) {
      return;
    }

    const filterByProductIds = {};
    if (manualFilters.length) {
      filterByProductIds.productIds = manualFilters[0].value.map((id) => encodeOpaqueId("reaction/product", id));
      // Reset uploaded files
      setFiles([]);
    }

    const { data } = await apolloClient.query({
      query: productsQuery,
      variables: {
        shopIds: [shopId],
        ...filterByProductIds,
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
  }, [apolloClient, shopId]);

  // Row click callback
  const onRowClick = useCallback(async ({ row }) => {
    const href = getPDPUrl(row.original._id);
    history.push(href);
  }, [history]);

  const onRowSelect = useCallback(async ({ selectedRows: rows }) => {
    setSelectedRows(rows || []);
  }, []);

  const labels = useMemo(() => ({
    globalFilterPlaceholder: i18next.t("admin.productTable.filters.placeholder")
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

  const { refetch, setManualFilters } = dataTableProps;

  const onDrop = (accepted) => {
    if (accepted.length === 0) return;
    setFiles(accepted);
  };

  const handleCreateProduct = async () => {
    const { data } = await createProduct({ variables: { input: { shopId } } });

    if (data) {
      const { createProduct: { product } } = data;
      history.push(`/products/${product._id}`);
    }

    if (createProductError) {
      enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
    }
  };

  // Filter by file event handlers
  const { getRootProps, getInputProps } = useDropzone({
    accept: CSV_FILE_TYPES,
    disableClick: true,
    disablePreview: true,
    multiple: false,
    onDrop
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

            setManualFilters(file.name, productIds);
            setFilterByFileVisible(false);
            setFiltered(true);
          });
      };
      return;
    });
  };

  const handleDeleteUploadedFile = (deletedFilename) => {
    const newFiles = files.filter((file) => file.name !== deletedFilename);
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setFiltered(false);
    } else if (isFiltered) {
      importFiles(newFiles);
    }
  };

  // Create options for the built-in ActionMenu in the DataTable
  const options = useMemo(() => [{
    label: i18next.t("admin.productTable.bulkActions.filterByFile"),
    onClick: () => {
      if (isTagSelectorVisible) setTagSelectorVisibility(false);
      setFilterByFileVisible(true);
    }
  }, {
    label: i18next.t("admin.productTable.bulkActions.addRemoveTags"),
    isDisabled: selectedRows.length === 0,
    onClick: () => {
      if (isFilterByFileVisible) setFilterByFileVisible(false);
      setTagSelectorVisibility(true);
    }
  },
  {
    label: i18next.t("admin.productTable.bulkActions.publish"),
    confirmTitle: getTranslation("admin.productTable.bulkActions.publishTitle", { count: selectedRows.length }),
    confirmMessage: getTranslation("admin.productTable.bulkActions.publishMessage", { count: selectedRows.length }),
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
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
      enqueueSnackbar(getTranslation(
        "admin.productTable.bulkActions.published",
        { count: data.publishProductsToCatalog.length }
      ));
    }
  }, {
    label: i18next.t("admin.productTable.bulkActions.makeVisible"),
    confirmTitle: getTranslation("admin.productTable.bulkActions.makeVisibleTitle", { count: selectedRows.length }),
    confirmMessage: getTranslation("admin.productTable.bulkActions.makeVisibleMessage", { count: selectedRows.length }),
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
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
      enqueueSnackbar(getTranslation(
        "admin.productTable.bulkActions.makeVisibleSuccess",
        { count: successes.length }
      ));
    }
  }, {
    label: i18next.t("admin.productTable.bulkActions.makeHidden"),
    confirmTitle: getTranslation("admin.productTable.bulkActions.makeHiddenTitle", { count: selectedRows.length }),
    confirmMessage: getTranslation("admin.productTable.bulkActions.makeHiddenMessage", { count: selectedRows.length }),
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
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
      enqueueSnackbar(getTranslation(
        "admin.productTable.bulkActions.makeHiddenSuccess",
        { count: successes.length }
      ));
    }
  }, {
    label: i18next.t("admin.productTable.bulkActions.duplicate"),
    confirmTitle: getTranslation("admin.productTable.bulkActions.duplicateTitle", { count: selectedRows.length }),
    confirmMessage: getTranslation("admin.productTable.bulkActions.duplicateMessage", { count: selectedRows.length }),
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
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
      enqueueSnackbar(getTranslation(
        "admin.productTable.bulkActions.duplicateSuccess",
        { count: data.cloneProducts.products.length }
      ));
    }
  }, {
    label: i18next.t("admin.productTable.bulkActions.archive"),
    confirmTitle: getTranslation("admin.productTable.bulkActions.archiveTitle", { count: selectedRows.length }),
    confirmMessage: getTranslation("admin.productTable.bulkActions.archiveMessage", { count: selectedRows.length }),
    isDisabled: selectedRows.length === 0,
    onClick: async () => {
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
      enqueueSnackbar(getTranslation(
        "admin.productTable.bulkActions.archiveSuccess",
        { count: data.archiveProducts.products.length }
      ));
    }
  }], [apolloClient, enqueueSnackbar, isFilterByFileVisible, isTagSelectorVisible, refetch, selectedRows, shopId]);

  const classes = useStyles();
  const selectedProducts = selectedRows.length ? `${selectedRows.length} selected` : "";
  const cardTitle = (
    <Fragment>
      {i18next.t("admin.products")}<span className={classes.selectedProducts}>{selectedProducts}</span>
    </Fragment>
  );

  return (
    <Grid container spacing={3}>
      <FilterByFileCard
        isFilterByFileVisible={isFilterByFileVisible}
        files={files}
        getInputProps={getInputProps}
        getRootProps={getRootProps}
        importFiles={importFiles}
        handleDelete={handleDeleteUploadedFile}
        setFilterByFileVisible={setFilterByFileVisible}
      />
      <TagSelector
        isVisible={isTagSelectorVisible}
        setVisibility={setTagSelectorVisibility}
        selectedProductIds={selectedRows}
        shopId={shopId}
      />
      { (!isTagSelectorVisible && !isFilterByFileVisible) &&
        <Grid item sm={12}>
          <Button color="primary" variant="contained" onClick={handleCreateProduct}>
            {i18next.t("admin.createProduct") || "Create product"}
          </Button>
        </Grid>
      }
      <Grid item sm={12}>
        <Card className={classes.card}>
          <CardHeader classes={{ root: classes.cardHeader }} title={cardTitle} />
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
