import React from "react";
import PropTypes from "prop-types";
import { Blocks } from "@reactioncommerce/reaction-components";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  Box,
  Container,
  Divider
} from "@material-ui/core";
import { Switch, Route } from "react-router-dom";
import ProductToolbar from "../components/ProductToolbar";
import ContentViewPrimaryDetailLayout from "/imports/client/ui/layouts/ContentViewPrimaryDetailLayout";

const styles = (theme) => ({
  block: {
    marginBottom: theme.spacing(3)
  },
  sidebar: {
    flex: "1 1 auto",
    maxWidth: 330,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflowY: "auto",
    borderRight: `1px solid ${theme.palette.divider}`
  },
  content: {
    flex: "1 1 auto",
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflowY: "auto",
    paddingTop: theme.spacing(5)
  }
});

/**
 * ProductDetail layout component
 * @param {Object} props Component props
 * @returns {Node} React node
 */
function ProductDetail(props) {
  const { classes, ...blockProps } = props;

  return (
    <ContentViewPrimaryDetailLayout
      AppBarComponent={<ProductToolbar />}
      PrimaryComponent={
        <>
          <Box
            paddingY={4}
            paddingLeft={4}
            paddingRight={2}
          >
            <Blocks region="ProductDetailHeader" blockProps={blockProps} />
          </Box>
          <Divider />
          <Box paddingY={2}>
            <Blocks region="ProductDetailSidebar" blockProps={blockProps} />
          </Box>
        </>
      }
      DetailComponent={
        <Container maxWidth="md">
          <Switch>
            <Route
              path="/:shopId/products/:handle/:variantId/:optionId?"
              render={() => (
                <Blocks region="VariantDetailMain" blockProps={blockProps}>
                  {(blocks) =>
                    blocks.map((block, index) => (
                      <div className={classes.block} key={index}>
                        {block}
                      </div>
                    ))
                  }
                </Blocks>
              )}
            />
            <Route
              path="/:shopId/products/:handle/"
              render={() => (
                <Blocks region="ProductDetailMain" blockProps={blockProps}>
                  {(blocks) =>
                    blocks.map((block, index) => (
                      <div className={classes.block} key={index}>
                        {block}
                      </div>
                    ))
                  }
                </Blocks>
              )}
            />
          </Switch>
        </Container>
      }
    />
  );
}

ProductDetail.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles, { name: "RuiProductDetail" })(ProductDetail);
