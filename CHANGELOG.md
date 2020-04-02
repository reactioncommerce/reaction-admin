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
