import SimpleSchema from "simpl-schema";
import { registerSchema } from "@reactioncommerce/schemas";

/**
 * @name SocialProvider
 * @memberof Schemas
 * @type {SimpleSchema}
 * @property {String} profilePage optional, Profile Page
 * @property {Boolean} enabled optional, default value: `false`
 */
export const SocialProvider = new SimpleSchema({
  profilePage: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: "Profile Page",
    optional: true
  },
  enabled: {
    type: Boolean,
    label: "Enabled",
    defaultValue: false,
    optional: true
  }
});

registerSchema("SocialProvider", SocialProvider);
