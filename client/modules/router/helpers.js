import { Template } from "meteor/templating";
import Router from "./main";

/**
 * @method pathFor
 * @memberof BlazeTemplateHelpers
 * @summary template helper to return path
 * @returns {String} username
 */
Template.registerHelper("pathFor", Router.pathFor);

/**
 * @method active
 * @memberof BlazeTemplateHelpers
 * @summary template helper for `Router.isActiveClassName`
 * @returns {String} username
 */
Template.registerHelper("active", Router.isActiveClassName);
