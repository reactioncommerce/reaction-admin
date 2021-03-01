import React, { useState, useMemo, useCallback } from "react";
import i18next from "i18next";
import { useSnackbar } from "notistack";
import { DataTable, useDataTable } from "@reactioncommerce/catalyst";
import { Card, CardContent, makeStyles } from "@material-ui/core";
import { useApolloClient } from "@apollo/react-hooks";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import emailTemplatesQuery from "../graphql/queries/emailTemplates";
import EmailTemplateForm from "./EmailTemplateForm";

const useStyles = makeStyles({
  card: {
    overflow: "visible"
  }
});

/**
 * @name EmailTemplateTable
 * @returns {React.Component} A React component
 */
function EmailTemplateTable() {
  const apolloClient = useApolloClient();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState(null);
  const [shopId] = useCurrentShopId();

  // Create and memoize the column data
  const columns = useMemo(
    () => [
      {
        Header: i18next.t("templateGrid.columns.title"),
        accessor: "title"
      },
      {
        Header: i18next.t("templateGrid.columns.subject"),
        accessor: "subject"
      },
      {
        Header: i18next.t("templateGrid.columns.language"),
        accessor: "language"
      }
    ],
    []
  );

  const onFetchData = useCallback(
    async ({ pageIndex, pageSize }) => {
      // Wait for shop id to be available before fetching orders.
      setIsLoading(true);
      if (!shopId) {
        return;
      }

      const { data, error } = await apolloClient.query({
        query: emailTemplatesQuery,
        variables: {
          shopId,
          first: pageSize,
          offset: pageIndex * pageSize
        },
        fetchPolicy: "network-only"
      });

      if (error && error.length) {
        enqueueSnackbar(i18next.t("admin.table.error", { variant: "error" }));
        return;
      }

      // Update the state with the fetched data as an array of objects and the calculated page count
      setTableData(data.emailTemplates.nodes);
      setPageCount(Math.ceil(data.emailTemplates.totalCount / pageSize));

      setIsLoading(false);
    },
    [apolloClient, enqueueSnackbar, shopId]
  );

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const handleOnCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Row click callback
  const onRowClick = useCallback((data) => {
    setSelectedEmailTemplate(data.row.original);
    openDialog();
  }, []);

  const dataTableProps = useDataTable({
    columns,
    data: tableData,
    isFilterable: false,
    pageCount,
    onFetchData,
    onRowClick,
    getRowId: (row) => row._id
  });

  const { refetch } = dataTableProps;

  const classes = useStyles();

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <DataTable {...dataTableProps} isLoading={isLoading} />
        </CardContent>
      </Card>
      <EmailTemplateForm
        emailTemplate={selectedEmailTemplate}
        isOpen={isDialogOpen}
        onCloseDialog={handleOnCloseDialog}
        shopId={shopId}
        refetch={refetch}
      />
    </>
  );
}

export default EmailTemplateTable;
