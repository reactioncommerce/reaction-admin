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
import OrderDateCell from "./DataTable/OrderDateCell";
import OrderIdCell from "./DataTable/OrderIdCell";
import OrderTotalCell from "./DataTable/OrderTotalCell";

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
      Header: i18next.t("admin.table.headers.id"),
      accessor: "referenceId",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row, cell }) => <OrderIdCell row={row} cell={cell} />
    },
    {
      Header: i18next.t("admin.table.headers.date"),
      accessor: "createdAt",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <OrderDateCell row={row} />
    },
    {
      Header: i18next.t("admin.table.headers.status"),
      accessor: "status",
      Filter: makeDataTableColumnFilter({
        // `title` can be omitted if the Header is a string
        // title: "Order Status",
        options: [
          // { label: "All", value: "" },
          { label: i18next.t("admin.table.orderStatus.coreOrderWorkflow/canceled"), value: "canceled" },
          { label: i18next.t("admin.table.orderStatus.coreOrderWorkflow/completed"), value: "completed" },
          { label: i18next.t("admin.table.orderStatus.new"), value: "new" },
          { label: i18next.t("admin.table.orderStatus.coreOrderWorkflow/processing"), value: "processing" }
        ]
      }),
      show: false
    },
    {
      Header: i18next.t("admin.table.headers.payment"),
      accessor: (row) => row.payments[0].status,
      id: "paymentStatus",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <Fragment>{i18next.t(`admin.table.paymentStatus.${row.values.paymentStatus}`)}</Fragment>,
      Filter: makeDataTableColumnFilter({
        isMulti: true,
        options: [
          { label: i18next.t("admin.table.paymentStatus.completed"), value: "completed" },
          { label: i18next.t("admin.table.paymentStatus.created"), value: "created" }
        ]
      })
    },
    {
      Header: i18next.t("admin.table.headers.fulfillment"),
      accessor: (row) => row.fulfillmentGroups[0].status,
      id: "fulfillmentStatus",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <Fragment>{i18next.t(`admin.table.fulfillmentStatus.${row.values.fulfillmentStatus}`)}</Fragment>,
      Filter: makeDataTableColumnFilter({
        isMulti: true,
        options: [
          { label: i18next.t("admin.table.fulfillmentStatus.coreOrderWorkflow/completed"), value: "completed" },
          { label: i18next.t("admin.table.fulfillmentStatus.new"), value: "new" },
          { label: i18next.t("admin.table.fulfillmentStatus.coreOrderWorkflow/processing"), value: "processing" }
        ]
      })
    },
    {
      Header: i18next.t("admin.table.headers.customer"),
      accessor: "payments[0].billingAddress.fullName"
    },
    {
      accessor: "summary.total.displayAmount",
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Header: () => <Box textAlign="right">{i18next.t("admin.table.headers.total")}</Box>,
      // eslint-disable-next-line react/no-multi-comp,react/display-name,react/prop-types
      Cell: ({ row }) => <OrderTotalCell row={row} />
    },
    {
      Header: i18next.t("admin.table.headers.date"),
      Filter: makeDataTableColumnFilter({
        options: [
          { label: i18next.t("admin.table.filter.today"), value: "today" },
          { label: i18next.t("admin.table.filter.last7"), value: "last7" },
          { label: i18next.t("admin.table.filter.last30"), value: "last30" }
        ]
      }),
      accessor: "createdAt",
      show: false
    }
  ], []);

  const onFetchData = useCallback(async ({ globalFilter, pageIndex, pageSize, filtersByKey }) => {
    // Wait for shop id to be available before fetching orders.
    setIsLoading(true);
    if (!shopId) {
      return;
    }

    if (filtersByKey.createdAt) {
      filtersByKey.createdAt = formatDateRangeFilter(filtersByKey.createdAt);
    }

    const { data, error } = await apolloClient.query({
      query: ordersQuery,
      variables: {
        shopIds: [shopId],
        first: pageSize,
        offset: pageIndex * pageSize,
        filters: {
          searchField: globalFilter,
          ...filtersByKey
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
    "globalFilterPlaceholder": i18next.t("admin.table.filter.globalFilter"),
    "filterChipValue.created": i18next.t("admin.table.fulfillmentStatus.coreOrderWorkflow/created"),
    "filterChipValue.processing": i18next.t("admin.table.fulfillmentStatus.coreOrderWorkflow/processing"),
    "filterChipValue.new": i18next.t("admin.table.fulfillmentStatus.new"),
    "filterChipValue.completed": i18next.t("admin.table.fulfillmentStatus.coreOrderWorkflow/completed"),
    "filterChipValue.canceled": i18next.t("admin.table.fulfillmentStatus.coreOrderWorkflow/canceled"),
    "filterChipValue.today": i18next.t("admin.table.filter.today"),
    "filterChipValue.last7": i18next.t("admin.table.filter.last7"),
    "filterChipValue.last30": i18next.t("admin.table.filter.last30")
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
