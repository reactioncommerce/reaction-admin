import React, { useCallback, useState } from "react";
import { i18next } from "/client/api";
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  IconButton
} from "@material-ui/core";
import PlusIcon from "mdi-material-ui/Plus";
import Chip from "@reactioncommerce/catalyst/Chip";
import useProduct from "../hooks/useProduct";
import TagSelectorDialog from "../components/TagSelector/TagSelectorDialog";

/**
 * Tag form block component
 * @param {Object} props Component props
 * @returns {React.Component} React component
 */
function ProductTagForm() {
  const {
    handleDeleteProductTag,
    product,
    refetchProduct
  } = useProduct();
  const [isTagDialogOpen, setTagDialogOpen] = useState(false);

  let content;

  const onDeleteTag = useCallback((tag) => {
    handleDeleteProductTag({ tag });
  }, [handleDeleteProductTag]);

  if (product && Array.isArray(product.tags.nodes)) {
    content = product.tags.nodes.map((tag) => (
      <Box
        key={tag._id}
      >
        <Chip
          color="primary"
          label={tag.name}
          onDelete={() => onDeleteTag(tag)}
          style={{ marginRight: "4px" }}
        />
      </Box>
    ));
  }

  return (
    <Card style={{ overflow: "visible" }}>
      <CardHeader
        action={
          <IconButton onClick={() => setTagDialogOpen(true)} title="Add tags">
            <PlusIcon />
          </IconButton>
        }
        title={i18next.t("productDetail.tags")}
      />
      <CardContent>
        <Box display="flex">
          {content}
        </Box>
      </CardContent>
      {product &&
        <TagSelectorDialog
          isOpen={isTagDialogOpen}
          onSuccess={() => refetchProduct()}
          onClose={() => setTagDialogOpen(false)}
          productIds={[product._id]}
          shopId={product.shop._id}
        />
      }
    </Card>
  );
}

export default ProductTagForm;
