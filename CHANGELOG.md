# v3.0.0-beta.13

Reaction v3.0.0-beta.13 adds minor features or bug fixes and contains no breaking changes since v3.0.0-beta.12.

## Chore

 - chore: fix linting on OrderAppBar ([#354](https://github.com/reactioncommerce/reaction-admin/pull/354))
 - chore: fix linting ([#354](https://github.com/reactioncommerce/reaction-admin/pull/354))
 - chore: remove unused reactionLayout and Templates Meteor pub ([#354](https://github.com/reactioncommerce/reaction-admin/pull/354))
 - chore: clean up unused Blaze email template code ([#354](https://github.com/reactioncommerce/reaction-admin/pull/354))
 - chore: implement GraphQL-based email template table and edit form ([#354](https://github.com/reactioncommerce/reaction-admin/pull/354))
 - chore: hopefully finally fix linting ([#350](https://github.com/reactioncommerce/reaction-admin/pull/350))
 - chore: silence no-multi-comp eslint rule ([#350](https://github.com/reactioncommerce/reaction-admin/pull/350))
 - chore: fix linting ([#350](https://github.com/reactioncommerce/reaction-admin/pull/350))
 - chore: remove unused Emails and Jobs publications, collections and schemas ([#350](https://github.com/reactioncommerce/reaction-admin/pull/350))
 - chore: update production image Node version ([#344](https://github.com/reactioncommerce/reaction-admin/pull/344))

## Feature

 - feat: use emailJobs GraphQL query to get emails ([#350](https://github.com/reactioncommerce/reaction-admin/pull/350))

## Fixes

 - fix: pass shopId to generateSitemaps ([#353](https://github.com/reactioncommerce/reaction-admin/pull/353))
 - fix: use pricing instead of price in products query ([#352](https://github.com/reactioncommerce/reaction-admin/pull/352))
 - fix: enable admin UI access for invited staff members ([#351](https://github.com/reactioncommerce/reaction-admin/pull/351))
 - fix: add currentShopId to printable order back button link ([#349](https://github.com/reactioncommerce/reaction-admin/pull/349))
 - fix: add currentShopId prefix to print invoice link ([#349](https://github.com/reactioncommerce/reaction-admin/pull/349))
 - fix: prevent race condition between i18next and shop loading ([#341](https://github.com/reactioncommerce/reaction-admin/pull/341))
 - fix: allow empty strings in shopURL ([#339](https://github.com/reactioncommerce/reaction-admin/pull/339))
 - fix: fix linting issues ([#347](https://github.com/reactioncommerce/reaction-admin/pull/347))
 - fix: refetch product on price change or variant update ([#347](https://github.com/reactioncommerce/reaction-admin/pull/347))
 - fix: removing extra space ([#347](https://github.com/reactioncommerce/reaction-admin/pull/347))
 - fix: refetching product after update of product to register publishable changes ([#347](https://github.com/reactioncommerce/reaction-admin/pull/347))
 - update base Docker image ([#344](https://github.com/reactioncommerce/reaction-admin/pull/344))
 - update package-lock and fix linting ([#344](https://github.com/reactioncommerce/reaction-admin/pull/344))
 - update React to 16.14.0 ([#344](https://github.com/reactioncommerce/reaction-admin/pull/344))
 - add hot-module-replacement ([#344](https://github.com/reactioncommerce/reaction-admin/pull/344))
 - update to Meteor 2.0 ([#344](https://github.com/reactioncommerce/reaction-admin/pull/344))

## Contributors

 Special thanks to Loan Laux for contributing to the release!

# v3.0.0-beta.12

Reaction v3.0.0-beta.12 adds minor features or bug fixes and contains no breaking changes since v3.0.0-beta.11.

## Fixes

 - (fix): Make title in product form required in validation to prevent error in storefront ([#340](https://github.com/reactioncommerce/reaction-admin/pull/#340))
 - (fix): Tags not rendering without manual refresh ([#338](https://github.com/reactioncommerce/reaction-admin/pull/#338))
 - (fix) Linting error ([#338](https://github.com/reactioncommerce/reaction-admin/pull/#338))
 - (fix) Refetch product only on initial render of component ([#338](https://github.com/reactioncommerce/reaction-admin/pull/#338))
 - (fix) Refetch product only on initial render or update of component ([#338](https://github.com/reactioncommerce/reaction-admin/pull/#338))
 - (fix) Refresh product data prior to mapping tags ([#338](https://github.com/reactioncommerce/reaction-admin/pull/#338))
 - (fix) order detail page link ([#337](https://github.com/reactioncommerce/reaction-admin/pull/#337))
 - (fix) include shopId in order detail view URL ([#337](https://github.com/reactioncommerce/reaction-admin/pull/#337))

## Chores

- (chore): adding git hooks for commit-msg ([#346](https://github.com/reactioncommerce/reaction-admin/pull/#346))

## Contributors

 Special thanks to Loan Laux for contributing to the release!

# v3.0.0-beta.11

This is the 11th beta release of the Reaction Admin project that is designed to work with our new Reaction API.

## Features

- feat: Add NPR currency definition ([#332](https://github.com/reactioncommerce/reaction-admin/pull/332))
- feat: Allow the Invitations table to show invitations for all shops ([#331](https://github.com/reactioncommerce/reaction-admin/pull/331))
- feat: Add shouldShowSidebarLink to registerOperatorRoute ([#329](https://github.com/reactioncommerce/reaction-admin/pull/329))

## Fixes

- fix: Correct "processing changes" translation name ([#333](https://github.com/reactioncommerce/reaction-admin/pull/333))
- fix: import missing function ([#315](https://github.com/reactioncommerce/reaction-admin/pull/315))
- fix: make compareAtPrice optional in form schema ([#322](https://github.com/reactioncommerce/reaction-admin/pull/322))
- fix: hide sidebar on new-shop page ([#327](https://github.com/reactioncommerce/reaction-admin/pull/327))
- fix: shop selector blank on page load ([#328](https://github.com/reactioncommerce/reaction-admin/pull/328))

## Chores

- chore: don't use querystring arg for shop type ([#326](https://github.com/reactioncommerce/reaction-admin/pull/326))

## Contributors

Thanks to @Manizuca, @dineshdb, @loan-laux and @CristianCucunuba for contributing to this release! 🎉

# v3.0.0-beta.10

This is the 10th beta release of the Reaction Admin project that is designed to work with our new Reaction API.

### Features

- feat: Add global shop selector for multi-shop usage ([#297](https://github.com/reactioncommerce/reaction-admin/pull/297))

### Chores

- chore: update to Meteor 1.11.1 ([#323](https://github.com/reactioncommerce/reaction-admin/pull/323))
- chore: remove dead code ([#317](https://github.com/reactioncommerce/reaction-admin/pull/317))

## Contributors

Thanks to @loan-laux for contributing to this release! 🎉

# v3.0.0-beta.9

This is the ninth beta release of the Reaction Admin project that is designed to work with our new Reaction API.

### Features

- feat: Enable mock TLS termination on calls to Hydra ([#302](https://github.com/reactioncommerce/reaction-admin/pull/302))

### Fixes

- fix: Update defaultParcelSize only when it exists ([#295](https://github.com/reactioncommerce/reaction-admin/pull/295))
- fix: Reaction.hasPermission method shopId ([#298](https://github.com/reactioncommerce/reaction-admin/pull/298))

## Contributors

Thanks to @manizuca and @mikoscz for contributing to this release! 🎉

# v3.0.0-beta.8

This is the eighth beta release of the Reaction Admin project that is designed to work with our new Reaction API.

### Features

- feat: Added GraphQL-powered accounts page ([#276](https://github.com/reactioncommerce/reaction-admin/pull/276))

### Fixes

- fix: Set empty tax fields to null ([#258](https://github.com/reactioncommerce/reaction-admin/pull/258))

## Contributors

Thanks to @loan-laux and @derBretti for contributing to this release! 🎉

# v3.0.0-beta.7

This is the seventh beta release of the Reaction Admin project that is designed to work with our new Reaction API.

### Refactors

- refactor: de-meteorize discount codes view ([#255](http://github.com/reactioncommerce/reaction-admin/pull/255))

### Fixes

- fix: navigation tree not showing up ([#278](http://github.com/reactioncommerce/reaction-admin/pull/278))
- fix: use network-only fetchPolicy for tag table ([#254](http://github.com/reactioncommerce/reaction-admin/pull/254))

## Contributors

Thanks to @loan-laux for contributing to this release! 🎉

# v3.0.0-beta.6

This is the sixth beta release of the Reaction Admin project that is designed to work with our new Reaction API.

### Features

- feat: Add full GQL support to product editor ([#188](http://github.com/reactioncommerce/reaction-admin/pull/188))
- feat: Add layout for primary/detail view ([#233](http://github.com/reactioncommerce/reaction-admin/pull/233))

### Refactors

- refactor: localization settings form ([#242](http://github.com/reactioncommerce/reaction-admin/pull/242))
- refactor: shop settings forms to use GraphQL ([#206](http://github.com/reactioncommerce/reaction-admin/pull/206))

### Fixes

- fix: Product media fixes ([#247](http://github.com/reactioncommerce/reaction-admin/pull/247))
- fix: list accepted CSV mime types ([#197](http://github.com/reactioncommerce/reaction-admin/pull/197))
- fix: correctly set and render prices for variants and options in product ([#246](http://github.com/reactioncommerce/reaction-admin/pull/246))
- fix: Product editor fixes ([#240](http://github.com/reactioncommerce/reaction-admin/pull/240))
- fix: setting views various issues reported in #238 ([#239](http://github.com/reactioncommerce/reaction-admin/pull/239))
- fix: correctly display total order amount ([#217](http://github.com/reactioncommerce/reaction-admin/pull/217))

# v3.0.0-beta.5

This is the fifth beta release of the Reaction Admin project that is designed to work with our new Reaction API.

### Fixes

- fix: remove `canInviteToGroup` helper on the client ([#214](https://github.com/reactioncommerce/reaction-admin/pull/214))

# v3.0.0-beta.4

This is the fourth beta release of the Reaction Admin project that is designed to work with our new Reaction API.

*Reaction releases will no longer be coordinated across all projects - we'll release each project, independently, as needed. This means version numbers will no longer be in sync. The newest versions of each project will work together. This change has two exceptions: we will release all projects in coordination for a `beta` release, and all projects in coordination for the official `v3.0.0` release.*

### Fixes

- fix: wait for Hydra before trying to create client ([#208](https://github.com/reactioncommerce/reaction-admin/pull/208))
- fix: wait for mongo replica set ([#205](https://github.com/reactioncommerce/reaction-admin/pull/205))
- fix: startup delay to make sure api is running ([#204](https://github.com/reactioncommerce/reaction-admin/pull/204))

# v3.0.0-beta.3

This is the third beta release of the Reaction Admin project that is designed to work with our new Reaction API.

*Reaction releases will no longer be coordinated across all projects - we'll release each project, independently, as needed. This means version numbers will no longer be in sync. The newest versions of each project will work together. This change has two exceptions: we will release all projects in coordination for a `beta` release, and all projects in coordination for the official `v3.0.0` release.*

### Features

- feat: product table improvements [(#195](https://github.com/reactioncommerce/reaction-admin/pull/195))

### Refactors

- refactor: remove alanning:roles and related user roles code [(#193](https://github.com/reactioncommerce/reaction-admin/pull/193))

# v3.0.0-beta.2

This is the second beta release of the Reaction Admin project that is designed to work with our new Reaction API.

*Reaction releases will no longer be coordinated across all projects - we'll release each project, independently, as needed. This means version numbers will no longer be in sync. The newest versions of each project will work together. This change has two exceptions: we will release all projects in coordination for a `beta` release, and all projects in coordination for the official `v3.0.0` release.*

### Features

- feat: use new Catalyst data table in products view an#182d update orders view ([#182](https://github.com/reactioncommerce/reaction-admin/pull/182))
- feat: point to /graphql instead of /graphql-beta [#1(90](https://github.com/reactioncommerce/reaction-admin/pull/190))

### Chores

- chore: reconfigure docker-compose networks ([#194](https://github.com/reactioncommerce/reaction-admin/pull/194))

### Fixes

- fix: show product not found in products table ([#167](https://github.com/reactioncommerce/reaction-admin/pull/167))

### Refactors

- refactor: get `permissions` from groups, not user object ([#187](https://github.com/reactioncommerce/reaction-admin/pull/187))

### Docs

- docs: update links to use trunk branch of docs ([#189](https://github.com/reactioncommerce/reaction-admin/pull/189))

# v3.0.0-beta

This is the beta release of the Reaction Admin project that is designed to work with our new Reaction API.

*Reaction releases will no longer be coordinated across all projects - we'll release each project, independently, as needed. This means version numbers will no longer be in sync. The newest versions of each project will work together. This change has two exceptions: we will release all projects in coordination for a `beta` release, and all projects in coordination for the official `v3.0.0` release.*

### Features

- feat: add product page title ([#175](https://github.com/reactioncommerce/reaction-admin/pull/175))

### Chores

- chore: move packages collection and fix most pages ([#166](https://github.com/reactioncommerce/reaction-admin/pull/166))

### Fixes

- ix: use updateProductVariantPrices mutation to save variant price ([#172](https://github.com/reactioncommerce/reaction-admin/pull/172))
- fix: Allow variant fields to be updated on page refresh ([#174](https://github.com/reactioncommerce/reaction-admin/pull/174))
- fix: prop types errors ([#180](https://github.com/reactioncommerce/reaction-admin/pull/180))

### Refactors

- refactor: use OAuth flows for login, reg, logout, change password ([#171](https://github.com/reactioncommerce/reaction-admin/pull/171))

# v3.0.0-alpha

### Features

- Add account shop creation ([#5](https://github.com/reactioncommerce/reaction-admin/pull/5))
- Remove `/operator` prefix from all routes ([#6](https://github.com/reactioncommerce/reaction-admin/pull/6))
- Change server to port `4080` (from port `4040`) [(#31](https://github.com/reactioncommerce/reaction-admin/pull/31))
- Use `Notistack` to display user notifications [(#76](https://github.com/reactioncommerce/reaction-admin/pull/76))
- Remove OAuth/identity plugin [(#82](https://github.com/reactioncommerce/reaction-admin/pull/82))
- Update to Meteor 1.8.1 [(#87](https://github.com/reactioncommerce/reaction-admin/pull/87))
- Move client config to `.env` [(#92](https://github.com/reactioncommerce/reaction-admin/pull/92))
- Updated UI for all tax settings [#(127](https://github.com/reactioncommerce/reaction-admin/pull/127))


### Chores

- Add missing dependency for `subscriptions-transport-ws` [(#32](https://github.com/reactioncommerce/reaction-admin/pull/32))
- Use published image for docker-compose [#(131](https://github.com/reactioncommerce/reaction-admin/pull/131))


### Fixes

- Fix query missing `$` in front of `shopId` ([#83](https://github.com/reactioncommerce/reaction-admin/pull/83))
- Fix `reactioncommerce/admin` Docker image that is built and pushed to DockerHub when this is merged to trunk ([#86](https://github.com/reactioncommerce/reaction-admin/pull/86))
- Resolves some reaction-admin bugs such as: creating products and updating them works well now, publishing products, tag page, and navigation ([#89](https://github.com/reactioncommerce/reaction-admin/pull/89))
- Resolve port conflict `9229` with core reaction ([#90](https://github.com/reactioncommerce/reaction-admin/pull/90))
- Make bin/setup always run from the desired path ([#129](https://github.com/reactioncommerce/reaction-admin/pull/129))


### Refactors

- Merge the two routers into one simpler router ([#3](https://github.com/reactioncommerce/reaction-admin/pull/3))
- Add `shopId` to `defaultNavitgationTree` code to match updates to API ([#45](https://github.com/reactioncommerce/reaction-admin/pull/45))
- Remove old navigation and `tagnav` plugins ([#75](https://github.com/reactioncommerce/reaction-admin/pull/75))
- Remove UI to set Stripe API settings ([#88](https://github.com/reactioncommerce/reaction-admin/pull/88))
