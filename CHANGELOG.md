# v3.0.0-alpha


### Features

- Add account shop creation ([#5](https://github.com/reactioncommerce/reaction-admin/pull/5))
- Remove `/operator` prefix from all routes ([#6](https://github.com/reactioncommerce/reaction-admin/pull/6))
- Change server to port `4080` (from port `4040`) ([#31](https://github.com/reactioncommerce/reaction-admin/pull/31))
- Use `Notistack` to display user notifications ([#76](https://github.com/reactioncommerce/reaction-admin/pull/76))
- Remove OAuth/identity plugin ([#82](https://github.com/reactioncommerce/reaction-admin/pull/82))
- Update to Meteor 1.8.1 ([#87](https://github.com/reactioncommerce/reaction-admin/pull/87))
- Move client config to `.env` ([#92](https://github.com/reactioncommerce/reaction-admin/pull/92))
- Updated UI for all tax settings ([#127](https://github.com/reactioncommerce/reaction-admin/pull/127))


### Chores

- Add missing dependency for `subscriptions-transport-ws` ([#32](https://github.com/reactioncommerce/reaction-admin/pull/32))
- Use published image for docker-compose ([#131](https://github.com/reactioncommerce/reaction-admin/pull/131))


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
