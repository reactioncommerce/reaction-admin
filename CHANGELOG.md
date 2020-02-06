# v3.0.0

This is the v3.0.0 (beta) release of `reaction-admin`, designed to work with v3.0.0 of the Reaction API. This project is a fork of the 2.x version of Reaction, updated to remove any `api` related features from this project and make this strictly an Admin UI that connects to the [Reaction API](https://github.com/reactioncommerce/reaction).

## Features

- feat: product table improvements [#195](https://github.com/reactioncommerce/reaction-admin/pull/195)
- feat: use new Catalyst data table in products view an#182d update orders view [#182](https://github.com/reactioncommerce/reaction-admin/pull/182)
- feat: point to /graphql instead of /graphql-beta [#190](https://github.com/reactioncommerce/reaction-admin/pull/190)
- feat: add product page title [#175](https://github.com/reactioncommerce/reaction-admin/pull/175)
- feat: Add account shop creation [#5](https://github.com/reactioncommerce/reaction-admin/pull/5)
- feat: Remove `/operator` prefix from all routes [#6](https://github.com/reactioncommerce/reaction-admin/pull/6)
- feat: Change server to port `4080` (from port `4040`) [#31](https://github.com/reactioncommerce/reaction-admin/pull/31)
- feat: Use `Notistack` to display user notifications [#76](https://github.com/reactioncommerce/reaction-admin/pull/76)
- feat: Remove OAuth/identity plugin [#82](https://github.com/reactioncommerce/reaction-admin/pull/82)
- feat: Update to Meteor 1.8.1 [#87](https://github.com/reactioncommerce/reaction-admin/pull/87)
- feat: Move client config to `.env` [#92](https://github.com/reactioncommerce/reaction-admin/pull/92)
- feat: Updated UI for all tax settings [#127](https://github.com/reactioncommerce/reaction-admin/pull/127)

## Fixes

- fix: show product not found in products table [#167](https://github.com/reactioncommerce/reaction-admin/pull/167)
- fix: use updateProductVariantPrices mutation to save variant price [#172](https://github.com/reactioncommerce/reaction-admin/pull/172)
- fix: Allow variant fields to be updated on page refresh [#174](https://github.com/reactioncommerce/reaction-admin/pull/174)
- fix: prop types errors [#180](https://github.com/reactioncommerce/reaction-admin/pull/180)
- fix: query missing `$` in front of `shopId` [#83](https://github.com/reactioncommerce/reaction-admin/pull/83)
- fix: `reactioncommerce/admin` Docker image that is built and pushed to DockerHub when this is merged to trunk [#86](https://github.com/reactioncommerce/reaction-admin/pull/86)
- fix: Resolves some reaction-admin bugs such as: creating products and updating them works well now, publishing products, tag page, and navigation [#89](https://github.com/reactioncommerce/reaction-admin/pull/89)
- fix: Resolve port conflict `9229` with core reaction [#90](https://github.com/reactioncommerce/reaction-admin/pull/90)
- fix: Make bin/setup always run from the desired path [#129](https://github.com/reactioncommerce/reaction-admin/pull/129)

## Refactors

- refactor: remove alanning:roles and related user roles code [#193](https://github.com/reactioncommerce/reaction-admin/pull/193)
- refactor: get `permissions` from groups, not user object [#187](https://github.com/reactioncommerce/reaction-admin/pull/187)
- refactor: use OAuth flows for login, reg, logout, change password [#171](https://github.com/reactioncommerce/reaction-admin/pull/171)
- refactor: Merge the two routers into one simpler router [#3](https://github.com/reactioncommerce/reaction-admin/pull/3)
- refactor: Add `shopId` to `defaultNavitgationTree` code to match updates to API [#45](https://github.com/reactioncommerce/reaction-admin/pull/45)
- refactor: Remove old navigation and `tagnav` plugins [#75](https://github.com/reactioncommerce/reaction-admin/pull/75)
- refactor: Remove UI to set Stripe API settings [#88](https://github.com/reactioncommerce/reaction-admin/pull/88)

## Chores

- chore: reconfigure docker-compose networks [#194](https://github.com/reactioncommerce/reaction-admin/pull/194)
- chore: move packages collection and fix most pages [#166](https://github.com/reactioncommerce/reaction-admin/pull/166)
- chore: Add missing dependency for `subscriptions-transport-ws` [#32](https://github.com/reactioncommerce/reaction-admin/pull/32)
- chore: Use published image for docker-compose [#131](https://github.com/reactioncommerce/reaction-admin/pull/131)

## Docs

- docs: update links to use trunk branch of docs [#189](https://github.com/reactioncommerce/reaction-admin/pull/189)

*These changes were originally tested and released in our alpha and beta releases*

- [v3.0.0-beta.3](https://github.com/reactioncommerce/reaction-admin/releases/tag/v3.0.0-beta.3)
- [v3.0.0-beta.2](https://github.com/reactioncommerce/reaction-admin/releases/tag/v3.0.0-beta.2)
- [v3.0.0-beta](https://github.com/reactioncommerce/reaction-admin/releases/tag/v3.0.0-beta)
- [v3.0.0-alpha](https://github.com/reactioncommerce/reaction-admin/releases/tag/v3.0.0-alpha)

*The following Reaction projects are being released one time in coordination as v3.0.0*

- [Reaction API](https://github.com/reactioncommerce/reaction)
- [Reaction Hydra](https://github.com/reactioncommerce/reaction-hydra)
- [Reaction Identity](https://github.com/reactioncommerce/reaction-identity)
- [Reaction Admin (beta)](https://github.com/reactioncommerce/reaction-admin)
- [Example Storefront](https://github.com/reactioncommerce/example-storefront)
- [Reaction Development Platform](https://github.com/reactioncommerce/reaction-development-platform)

*After this release, Reaction releases will no longer be coordinated across all projects - we'll release each project independently, as needed. This means version numbers will no longer be in sync. The newest versions of each project will work together.*
