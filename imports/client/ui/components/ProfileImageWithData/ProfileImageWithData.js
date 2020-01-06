import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { withComponents } from "@reactioncommerce/components-context";
import { CustomPropTypes } from "@reactioncommerce/components/utils";
import { i18next } from "/client/api";
import ButtonBase from "@material-ui/core/ButtonBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const getViewer = gql`
  query getViewer {
    viewer {
      name
      primaryEmailAddress
    }
  }
`;

/**
 * @summary ProfileImageWithData React component
 * @param {Object} props React props
 * @return {React.Node} React node
 */
function ProfileImageWithData(props) {
  const {
    components: { ProfileImage },
    logout = () => {}
  } = props;

  const history = useHistory();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const { data, loading } = useQuery(getViewer);
  if (loading || !data || !data.viewer) return null;

  return (
    <Fragment>
      <ButtonBase
        centerRipple
        onClick={(event) => {
          setMenuAnchorEl(event.currentTarget);
        }}
      >
        <ProfileImage viewer={data.viewer} {...props} />
      </ButtonBase>

      <Menu
        id="profile-actions-menu"
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchorEl(null); // close menu
            history.push("/profile");
          }}
        >
          {i18next.t("admin.userAccountDropdown.profileLabel")}
        </MenuItem>
        <MenuItem onClick={logout}>{i18next.t("accountsUI.signOut")}</MenuItem>
      </Menu>
    </Fragment>
  );
}

ProfileImageWithData.propTypes = {
  components: PropTypes.shape({
    ProfileImage: CustomPropTypes.component.isRequired
  }),
  logout: PropTypes.func
};

export default withComponents(ProfileImageWithData);
