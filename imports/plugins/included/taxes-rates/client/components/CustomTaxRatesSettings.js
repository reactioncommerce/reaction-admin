import React, { useState } from "react";
import i18next from "i18next";
import ReactTable from "react-table";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core";
import { Components } from "@reactioncommerce/reaction-components";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import useCustomTaxRates from "../hooks/useCustomTaxRates.js";
import useTaxCodes from "../hooks/useTaxCodes.js";
import CustomTaxRateForm from "./CustomTaxRateForm.js";

const useStyles = makeStyles((theme) => ({
  createButton: {
    marginBottom: theme.spacing(3)
  },
  row: {
    cursor: "pointer"
  }
}));

const cellWithDefaultText = ({ value }) => ((value && value.length) ? value : i18next.t("admin.taxGrid.any"));

const DEFAULT_PAGE_SIZE = 20;

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
  const [selectedPageSize, setSelectedPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { isLoadingTaxCodes, taxCodes } = useTaxCodes(shopId);
  const {
    fetchTaxRates,
    isLoadingTaxRates,
    refetchTaxRates,
    taxRates,
    totalTaxRatesCount
  } = useCustomTaxRates(shopId);

  if (!shopId || isLoadingTaxCodes) {
    return <Components.Loading />;
  }

  const columns = [{
    accessor: "rate",
    Header: i18next.t("admin.taxGrid.rate")
  }, {
    accessor: "country",
    Cell: cellWithDefaultText,
    Header: i18next.t("admin.taxGrid.country")
  }, {
    accessor: "region",
    Cell: cellWithDefaultText,
    Header: i18next.t("admin.taxGrid.region")
  }, {
    accessor: "postal",
    Cell: cellWithDefaultText,
    Header: i18next.t("admin.taxGrid.postal")
  }, {
    accessor: "taxCode",
    Cell: cellWithDefaultText,
    Header: i18next.t("admin.taxGrid.taxCode")
  }];

  const handleDialogClose = () => {
    setIsCreating(false);
    setEditDoc(null);
  };

  return (
    <div>
      <Card>
        <CardHeader title="Custom Tax Rates" />
        <CardContent>
          <Button className={classes.createButton} color="primary" variant="contained" onClick={() => { setIsCreating(true); }}>
            {i18next.t("admin.taxGrid.newTaxRateButton")}
          </Button>
          <ReactTable
            className="-striped -highlight"
            columns={columns}
            data={taxRates}
            defaultPageSize={DEFAULT_PAGE_SIZE}
            getTdProps={(state, rowInfo) => {
              const tdProps = {};

              if (rowInfo && rowInfo.original) {
                tdProps.onClick = () => {
                  setIsCreating(false);
                  setEditDoc(rowInfo.original);
                };
              }

              return tdProps;
            }}
            getTrProps={() => ({ className: classes.row })}
            loading={isLoadingTaxRates}
            manual // informs React Table that you'll be handling sorting and pagination server-side
            onFetchData={(state) => {
              setSelectedPageSize(state.pageSize);
              fetchTaxRates({
                first: state.pageSize,
                offset: state.page * state.pageSize
              });
            }}
            pages={Math.ceil(totalTaxRatesCount / selectedPageSize)}
          />
        </CardContent>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={!!(isCreating || editDoc)}
        onClose={handleDialogClose}
      >
        <DialogContent>
          <CustomTaxRateForm
            doc={editDoc}
            onSuccess={() => {
              handleDialogClose();
              refetchTaxRates();
            }}
            shopId={shopId}
            taxCodes={taxCodes}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
