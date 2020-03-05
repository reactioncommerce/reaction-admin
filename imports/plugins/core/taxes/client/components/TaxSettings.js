import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import GeneralTaxSettings from "../containers/GeneralTaxSettings";

/**
 * @summary React component for the main Tax Settings area
 * @returns {Node} React node
 */
export default function TaxSettings() {
  return (
    <Card>
      <CardHeader title="Shop Tax Settings" />
      <CardContent>
        <GeneralTaxSettings />
      </CardContent>
    </Card>
  );
}
