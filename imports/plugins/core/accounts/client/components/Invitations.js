import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useApolloClient } from "@apollo/react-hooks";
import i18next from "i18next";
import { Card, CardContent, makeStyles } from "@material-ui/core";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import { getAccountAvatar } from "/imports/plugins/core/accounts/client/helpers/helpers";
import invitationsQuery from "../graphql/queries/invitations";

const useStyles = makeStyles(() => ({
  card: {
    marginTop: "1rem"
  }
}));

/**
 * @summary Main invitations view
 * @name Invitations
 * @returns {React.Component} A React component
 */
function Invitations({ shopId }) {
  const apolloClient = useApolloClient();

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
      Header: i18next.t("admin.invitationsTable.header.email"),
      accessor: (row) => row.email,
      id: "email"
    }, {
      Header: i18next.t("admin.invitationsTable.header.invitedBy"),
      accessor: (row) => row.invitedBy.emailRecords[0].address,
      id: "invitedBy"
    }, {
      Header: i18next.t("admin.invitationsTable.header.shop"),
      accessor: (row) => row.shop?.name,
      id: "shop"
    }, {
      Header: i18next.t("admin.invitationsTable.header.groups"),
      accessor: (row) => row.groups.reduce((allGroups, group) => `${allGroups}, ${group.name}`, "").substring(2),
      id: "groups"
    }
  ], []);

  const onFetchData = useCallback(async ({ pageIndex, pageSize }) => {
    // Wait for shop id to be available before fetching products.
    setIsLoading(true);

    const { data } = await apolloClient.query({
      query: invitationsQuery,
      variables: {
        shopIds: shopId ? [shopId] : [],
        first: pageSize,
        limit: (pageIndex + 1) * pageSize,
        offset: pageIndex * pageSize
      },
      fetchPolicy: "network-only"
    });

    // Update the state with the fetched data as an array of objects and the calculated page count
    setTableData(data.invitations.nodes);
    setPageCount(Math.ceil(data.invitations.totalCount / pageSize));

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

Invitations.propTypes = {
  shopId: PropTypes.string
};

export default Invitations;
