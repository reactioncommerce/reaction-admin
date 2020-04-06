import React, { useState, useMemo, useCallback } from "react";
import i18next from "i18next";
import { useSnackbar } from "notistack";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import { useApolloClient } from "@apollo/react-hooks";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { Box, Card, CardHeader, CardContent, makeStyles } from "@material-ui/core";
import discountCodesQuery from "../graphql/queries/discountCodes";

const useStyles = makeStyles({
  card: {
    overflow: "visible",
  },
});

/**
 * @name DiscountCodesTable 
 * @returns {React.Component} A React component
 */
function  DiscountCodesTable() {
  const apolloClient = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [shopId] = useCurrentShopId();

  // Create and memoize the column data
  const columns = useMemo(
    () => [
      {
        Header: i18next.t("admin.discountsTable.headers.code"),
        accessor: "code",
      },
      {
        Header: i18next.t("admin.discountsTable.headers.discount"),
        accessor: "discount",
      },
    ],
    []
  );

  const onFetchData = useCallback(
    async ({ globalFilter, pageIndex, pageSize, filtersByKey }) => {
      // Wait for shop id to be available before fetching orders.
      setIsLoading(true);
      if (!shopId) {
        return;
      }

      const { data, error } = await apolloClient.query({
        query: discountCodesQuery,
        variables: {
          shopId: shopId,
          first: pageSize,
          offset: pageIndex * pageSize,
          filters: {
            searchField: globalFilter,
          },
        },
        fetchPolicy: "network-only",
      });

      if (error && error.length) {
        enqueueSnackbar(i18next.t("admin.table.error", { variant: "error" }));
        return;
      }

      // Update the state with the fetched data as an array of objects and the calculated page count
      setTableData(data.discountCodes.nodes);
      setPageCount(Math.ceil(data.discountCodes.totalCount / pageSize));

      setIsLoading(false);
    },
    [apolloClient, enqueueSnackbar, shopId]
  );

  // Row click callback
  const onRowClick = useCallback(
    console.log("onRowClick")
  );

  const labels = useMemo(
    () => ({
      globalFilterPlaceholder: i18next.t("admin.table.filter.globalFilter")
    }),
    []
  );

  const dataTableProps = useDataTable({
    columns,
    data: tableData,
    labels,
    pageCount,
    onFetchData,
    onRowClick,
    getRowId: (row) => row._id,
  });

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.discounts.title", "Discount Codes")} />
      <CardContent>
        <DataTable {...dataTableProps} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}

export default  DiscountCodesTable;
