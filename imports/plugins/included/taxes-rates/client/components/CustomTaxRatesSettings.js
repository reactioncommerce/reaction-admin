import React, { useCallback, useMemo, useState } from "react";
import i18next from "i18next";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/styles";
import { Components } from "@reactioncommerce/reaction-components";
import DataTable, { useDataTable } from "@reactioncommerce/catalyst/DataTable";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import useCustomTaxRates from "../hooks/useCustomTaxRates.js";
import useTaxCodes from "../hooks/useTaxCodes.js";
import CustomTaxRateForm from "./CustomTaxRateForm.js";

const useStyles = makeStyles((theme) => ({
  createButton: {
    marginBottom: theme.spacing(3)
  }
}));

/**
 * @summary React component that renders the custom tax rate settings card,
 *   which has a list of all tax rates.
 * @param {Object} props React props
 * @return {React.Node} React node
 */
export default function CustomTaxRatesSettings() {
  const classes = useStyles();
  const [shopId] = useCurrentShopId();
  const [isCreating, setIsCreating] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  // const [selectedPageSize, setSelectedPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { isLoadingTaxCodes, taxCodes } = useTaxCodes(shopId);
  const { fetchTaxRates } = useCustomTaxRates(shopId);

  const CellWithDefaultText = useCallback(({ cell }) => (
    (cell.value && cell.value.length) ? cell.value : i18next.t("admin.taxGrid.any")
  ), []);

  const columns = useMemo(() => ([{
    accessor: "rate",
    Header: () => i18next.t("admin.taxGrid.rate")
  }, {
    accessor: "country",
    Cell: CellWithDefaultText,
    Header: () => i18next.t("admin.taxGrid.country")
  }, {
    accessor: "region",
    Cell: CellWithDefaultText,
    Header: () => i18next.t("admin.taxGrid.region")
  }, {
    accessor: "postal",
    Cell: CellWithDefaultText,
    Header: () => i18next.t("admin.taxGrid.postal")
  }, {
    accessor: "taxCode",
    Cell: CellWithDefaultText,
    Header: () => i18next.t("admin.taxGrid.taxCode")
  }]), [CellWithDefaultText]);

  const handleDialogClose = () => {
    setIsCreating(false);
    setEditDoc(null);
  };

  // Fetch data for the DataTable
  const onFetchData = useCallback(async ({ pageIndex, pageSize }) => {
    const data = await fetchTaxRates({
      first: pageSize,
      offset: pageIndex * pageSize
    });

    // Return the fetched data as an array of objects and the calculated page count
    return {
      data: data.taxRates,
      pageCount: Math.ceil(data.totalTaxRatesCount / pageSize)
    };
  }, [fetchTaxRates]);

  // Row click callback
  const onRowClick = useCallback(async ({ row }) => {
    setIsCreating(false);
    setEditDoc(row.original);
  }, []);

  const dataTableProps = useDataTable({
    columns,
    onFetchData,
    onRowClick,
    getRowID: (row) => row.id
  });

  if (!shopId || isLoadingTaxCodes) {
    return <Components.Loading />;
  }

  return (
    <div>
      <Card>
        <CardHeader title="Custom Tax Rates" />
        <CardContent>
          <Button className={classes.createButton} color="primary" variant="contained" onClick={() => { setIsCreating(true); }}>
            {i18next.t("admin.taxGrid.newTaxRateButton")}
          </Button>
          <DataTable
            {...dataTableProps}
          />
        </CardContent>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={!!(isCreating || editDoc)}
        onClose={handleDialogClose}
      >
        <CustomTaxRateForm
          doc={editDoc}
          onCancel={handleDialogClose}
          onSuccess={() => {
            handleDialogClose();
          }}
          shopId={shopId}
          taxCodes={taxCodes}
        />
      </Dialog>
    </div>
  );
}
