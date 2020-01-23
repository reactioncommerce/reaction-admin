import React, { Fragment, useState, useMemo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import i18next from "i18next";
import { useSnackbar } from "notistack";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import { makeDataTableColumnFilter } from "@reactioncommerce/catalyst/DataTableFilter";
import { useApolloClient } from "@apollo/react-hooks";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { Box, Card, CardHeader, CardContent, makeStyles } from "@material-ui/core";
import ordersQuery from "../graphql/queries/orders";
import { formatDateRangeFilter } from "../../client/helpers";
import OrderDateCell from "./OrderDateCell";
import OrderIdCell from "./OrderIdCell";

const useStyles = makeStyles({
  card: {
    overflow: "visible"
  }
});

/**
 * @name OrdersTable
 * @returns {React.Component} A React component
 */
function OrdersTable() {
  const apolloClient = useApolloClient();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [shopId] = useCurrentShopId();

  // Create and memoize the column data
  const columns = useMemo(() => [
    {
      Header: "Order ID",
      accessor: "referenceId",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row, cell }) => <OrderIdCell row={row} cell={cell} />
    },
    {
      Header: "Date",
      accessor: "createdAt",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <OrderDateCell row={row} />
    },
    {
      Header: "Order Status",
      accessor: "status",
      Filter: makeDataTableColumnFilter({
        // `title` can be omitted if the Header is a string
        // title: "Order Status",
        options: [
          // { label: "All", value: "" },
          { label: "Canceled", value: "canceled" },
          { label: "Completed", value: "completed" },
          { label: "New", value: "new" },
          { label: "Processing", value: "processing" }
        ]
      }),
      show: false
    },
    {
      Header: "Payment",
      accessor: "payments[0].status",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <Fragment>{i18next.t(`admin.table.paymentStatus.${row.values["payments[0].status"]}`)}</Fragment>,
      Filter: makeDataTableColumnFilter({
        isMulti: true,
        options: [
          { label: "Completed", value: "completed" },
          { label: "Created", value: "created" }
        ]
      })
    },
    {
      Header: "Fulfillment",
      accessor: "fulfillmentGroups[0].status",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <Fragment>{i18next.t(`admin.table.fulfillmentStatus.${row.values["fulfillmentGroups[0].status"]}`)}</Fragment>,
      Filter: makeDataTableColumnFilter({
        isMulti: true,
        options: [
          { label: "Completed", value: "completed" },
          { label: "New", value: "new" },
          { label: "Processing", value: "processing" }
        ]
      })
    },
    {
      Header: "Customer",
      accessor: "payments[0].billingAddress.fullName"
    },
    {
      accessor: "payments[0].amount.displayAmount",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Header: () => <Box textAlign="right">{i18next.t("admin.table.headers.total")}</Box>,
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ cell }) => <Box textAlign="right">{cell.value}</Box>
    },
    {
      // Hide this column, it's only for filtering
      Header: "Order date",
      Filter: makeDataTableColumnFilter({
        options: [
          { label: "Today", value: "today" },
          { label: "Last 7 days", value: "last7" },
          { label: "Last 30", value: "last30" }
        ]
      }),
      accessor: "createdAt",
      show: false
    }
  ], []);

  const onFetchData = useCallback(async ({ globalFilter, pageIndex, pageSize, filters }) => {
    // Wait for shop id to be available before fetching orders.
    setIsLoading(true);
    if (!shopId) {
      return;
    }

    const queryFilters = {};
    for (const filter of filters) {
      switch (filter.id) {
        case "payments[0].status":
          queryFilters.paymentStatus = filter.value;
          break;

        case "fulfillmentGroups[0].status":
          queryFilters.fulfillmentStatus = filter.value;
          break;
        case "createdAt":
          queryFilters[filter.id] = formatDateRangeFilter(filter.value);
          break;
        default:
          queryFilters[filter.id] = filter.value;
          break;
      }
    }

    const { data, error } = await apolloClient.query({
      query: ordersQuery,
      variables: {
        shopIds: [shopId],
        first: pageSize,
        offset: pageIndex * pageSize,
        filters: {
          searchField: globalFilter,
          ...queryFilters
        }
      },
      fetchPolicy: "network-only"
    });

    if (error && error.length) {
      enqueueSnackbar(i18next.t("admin.table.error", { variant: "error" }));
      return;
    }

    // Update the state with the fetched data as an array of objects and the calculated page count
    setTableData(data.orders.nodes);
    setPageCount(Math.ceil(data.orders.totalCount / pageSize));

    setIsLoading(false);
  }, [apolloClient, enqueueSnackbar, shopId]);

  // Row click callback
  const onRowClick = useCallback(async ({ row }) => {
    history.push(`/orders/${row.values.referenceId}`);
  }, [history]);

  const labels = useMemo(() => ({
    "globalFilterPlaceholder": "Filter orders",
    "filterChipValue.created": "Created",
    "filterChipValue.processing": "Processing",
    "filterChipValue.refunded": "Refunded",
    "filterChipValue.unpaid": "Unpaid",
    "filterChipValue.new": "New",
    "filterChipValue.completed": "Completed",
    "filterChipValue.canceled": "Canceled",
    "filterChipValue.today": "Today",
    "filterChipValue.last7": "Last 7 days",
    "filterChipValue.last30": "Last 30"
  }), []);

  const dataTableProps = useDataTable({
    columns,
    data: tableData,
    labels,
    pageCount,
    onFetchData,
    onRowClick,
    getRowId: (row) => row.referenceId
  });

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.dashboard.ordersTitle", "Orders")} />
      <CardContent>
        <DataTable {...dataTableProps} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}

export default OrdersTable;
