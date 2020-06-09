import React, { useState, useMemo, useCallback } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import i18next from "i18next";
import { Card, CardContent, makeStyles } from "@material-ui/core";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { getAccountAvatar } from "/imports/plugins/core/accounts/client/helpers/helpers";
import customersQuery from "../graphql/queries/customers";

const useStyles = makeStyles(() => ({
  card: {
    marginTop: "1rem"
  }
}));

/**
 * @summary Main customers view
 * @name CustomersTable
 * @returns {React.Component} A React component
 */
function Customers() {
  const apolloClient = useApolloClient();
  const [shopId] = useCurrentShopId();

  // React-Table state
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [tableData, setTableData] = useState([]);

  const classes = useStyles();

  // Create and memoize the column data
  const columns = useMemo(() => [
    {
      Header: "",
      accessor: (account) => getAccountAvatar(account),
      id: "profilePicture"
    }, {
      Header: i18next.t("admin.accountsTable.header.email"),
      accessor: (row) => row.emailRecords[0].address,
      id: "email"
    }, {
      Header: i18next.t("admin.accountsTable.header.name"),
      accessor: "name"
    }
  ], []);

  const onFetchData = useCallback(async ({ pageIndex, pageSize }) => {
    // Wait for shop id to be available before fetching products.
    setIsLoading(true);
    if (!shopId) {
      return;
    }

    const { data } = await apolloClient.query({
      query: customersQuery,
      variables: {
        first: pageSize,
        limit: (pageIndex + 1) * pageSize,
        offset: pageIndex * pageSize
      },
      fetchPolicy: "network-only"
    });

    // Update the state with the fetched data as an array of objects and the calculated page count
    setTableData(data.customers.nodes);
    setPageCount(Math.ceil(data.customers.totalCount / pageSize));

    setIsLoading(false);
  }, [apolloClient, shopId]);

  const dataTableProps = useDataTable({
    columns,
    data: tableData,
    isFilterable: false,
    pageCount,
    onFetchData,
    getRowId: (row) => row._id
  });

  return (
    <Card className={classes.card}>
      <CardContent>
        <DataTable
          {...dataTableProps}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

export default Customers;
