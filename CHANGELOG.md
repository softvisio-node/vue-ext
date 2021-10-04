# Changelog

### 6.0.0-alpha.1 (2021-10-04)

Breaking changes:

-   feat!: strict camel case

Migration:

### 6.0.0-alpha.0 (2021-10-04)

Breaking changes:

-   feat!: strict camel case

Migration:

### 5.1.1 (2021-09-30)

Fixes:

-   fix: deps

### 5.1.0 (2021-09-30)

Features:

-   feat: webpack migration

Fixes:

-   fix: vue config ext settings moved to the vue ext

### 5.0.0 (2021-09-24)

Fixes:

-   fix: meta property

Migration:

-   Result meta property.

### 5.0.0-alpha.0 (2021-09-24)

Breaking changes:

-   feat!: result meta property

Migration:

-   Result meta property.

### 4.5.1 (2021-09-22)

Fixes:

-   fix: boolean props

### 4.5.0 (2021-09-21)

Features:

-   feat: notifications unread api

Fixes:

-   fix: extjs boolean attrs binding

### 4.4.0 (2021-09-19)

Features:

-   feat: api profile delete sessions
-   feat: notifications

### 4.3.1 (2021-09-17)

Fixes:

-   fix: notifications on be default
-   fix: store init

### 4.3.0 (2021-09-17)

Features:

-   feat: drop user sessions

Fixes:

-   fix: viewport init

### 4.2.0 (2021-09-17)

Features:

-   feat: auto signout dialog

Fixes:

-   fix: app init failure dialog emits close event
-   fix: close menu on signout

### 4.1.0 (2021-09-13)

Features:

-   feat: auth form updated
-   feat: menu changePassword
-   feat: notifications panel
-   feat: reload on auth change
-   feat: titlebar component

Fixes:

-   fix: mount noCache option renamed to cache
-   fix: mount viewport to the Ext.Viewport

### 4.0.2 (2021-09-11)

Fixes:

-   fix: deps

### 4.0.1 (2021-09-11)

Fixes:

-   fix: deps

### 4.0.0 (2021-09-11)

Breaking changes:

-   feat!: :ext-resources alias replaced with #ext
-   refactor!: app

Migration:

-   Replace `:softvisio` with `#vue`.
-   Replace `:ext` with `#ext`.
-   Replace `:ewc` with `#ewc`.
-   Replace `:ext-resources` with `#ext`.
-   Replace `:ewc-resources` with `#ewc`.
-   Add `#vue` import to the `package.json`.
-   Update `main.js`.
-   Update `vue.config.js` and `babel.config.js`.
-   Replace `noCache` option in the `$mount` call with the `cache`.
-   Update app title to the new `title/titlebar component`.
-   Update npm scripts in the `package.json`.
-   Update boolean attributes binding. For static attributes use `:hidden="true"`.
-   Remove `VUE_APP_PUSH_TOPIC` from config.

### 4.0.0-alpha.1 (2021-09-11)

Breaking changes:

-   feat!: :softvisio alias replaced with #vue

### 4.0.0-alpha.0 (2021-09-11)

Breaking changes:

-   feat!: :softvisio alias replaced with #softvisio
-   feat!: webpack : aliases renamed to #

Features:

-   feat: configs exports added

### 3.3.1 (2021-09-11)

Fixes:

-   fix: package imports

### 3.3.0 (2021-09-09)

Features:

-   feat: babel.config.cjs

### 3.2.0 (2021-09-06)

Features:

-   feat: menu sheep profile property

### 3.1.0 (2021-09-05)

Features:

-   feat: createApp global properties

Fixes:

-   fix: pdfjs imports

### 3.0.0 (2021-09-04)

No significant changes since the previous release

### 3.0.0-rc.11 (2021-08-01)

Changed:

-   viewport auth refactored

### 3.0.0-rc.10 (2021-07-31)

Changed:

-   profile ui updated

### 3.0.0-rc.9 (2021-07-31)

Changed:

-   charts themes mapping added

### 3.0.0-rc.8 (2021-07-30)

Changed:

-   typo fixed

### 3.0.0-rc.7 (2021-07-30)

Changed:

-   change password moved to profile

### 3.0.0-rc.6 (2021-07-30)

Changed:

-   theme registry refactored

### 3.0.0-rc.5 (2021-07-30)

Changed:

-   charts DownloadServerUrl disabled
-   extjs components renamed to cjs
-   charts override as cjs

### 3.0.0-rc.4 (2021-07-30)

Changed:

-   theme registry updated
-   charts component added

### 3.0.0-rc.3 (2021-07-29)

Changed:

-   charts registry hooks fixed

### 3.0.0-rc.2 (2021-07-29)

Changed:

-   charts registry added

### 3.0.0-rc.1 (2021-07-29)

Changed:

-   :ext-charts alias updated

### 3.0.0-rc.0 (2021-07-29)

Changed:

-   release candidate

### 3.0.0-beta.16 (2021-07-29)

Changed:

-   :ext-charts alias added

### 3.0.0-beta.15 (2021-07-22)

Changed:

-   docs added

### 3.0.0-beta.14 (2021-07-21)

Changed:

-   env.getBoolValue removed

### 3.0.0-beta.13 (2021-07-07)

Changed:

-   app settings feature removed

### 3.0.0-beta.12 (2021-06-18)

Changed:

-   vue.$app events;

### 3.0.0-beta.11 (2021-06-17)

Changed:

-   result .reason renamed to .statusText;
-   moved to github;
-   deps updated;
-   froala v4;

Removed:

-   lint config removed;

Fixed:

-   minor code improvements;
-   api classes return result parser updated;

### 3.0.0-beta.10 (2021-05-29)

Changed:

-   peer deps updated;

### 3.0.0-beta.9 (2021-05-23)

Changed:

-   typo;

### 3.0.0-beta.8 (2021-05-22)

Changed:

-   api client signout event added;

### 3.0.0-beta.7 (2021-05-22)

Changed:

-   session watch for server-side sigout;

### 3.0.0-beta.6 (2021-05-22)

Changed:

-   froala patch;
-   lint script removed;

### 3.0.0-beta.5 (2021-05-13)

Changed:

-   env mode accessors added;
-   utls/env moved to env;

### 3.0.0-beta.4 (2021-05-11)

Changed:

-   :ext-resources alias restored;

### 3.0.0-beta.3 (2021-05-11)

Changed:

-   :ext-resources alias removed;

### 3.0.0-beta.2 (2021-05-11)

Changed:

-   imports updated;

### 3.0.0-beta.1 (2021-05-11)

Changed:

-   deps updated;

### 3.0.0-beta.0 (2021-05-09)

Changed:

-   imports updated;

### 3.0.0-alpha.4 (2021-05-02)

Changed:

-   deps updated;
-   duplicated setMultiColumnSort removed;
-   ext grid attrs fixed;

### 3.0.0-alpha.3 (2021-04-28)

Changed:

-   webpack aliases updated;

### 3.0.0-alpha.2 (2021-04-28)

Changed:

-   require replaced with import;

### 3.0.0-alpha.1 (2021-04-28)

Changed:

-   ext aliases updated;

### 3.0.0-alpha.0 (2021-04-28)

Changed:

-   ported to webpack 5;
-   store index updated;

### 2.3.3 (2021-04-16)

Changed:

-   ported to modules;

### 2.3.2 (2021-04-06)

Changed:

-   settings deferRender false;

### 2.3.1 (2021-04-04)

Changed:

-   tab views titles updated;

### 2.3.0 (2021-04-04)

Changed:

-   props boolean updated to strings true / false;

### 2.2.3 (2021-04-04)

Changed:

-   vertical tab props added;

### 2.2.2 (2021-04-02)

Changed:

-   settings updated;

### 2.2.1 (2021-04-01)

Changed:

-   menu slots added;

### 2.2.0 (2021-04-01)

Changed:

-   user profile tab panel;

### 2.1.0 (2021-04-01)

Changed:

-   app settings dialog updated;

### 2.0.2 (2021-03-25)

Changed:

-   linted;

### 2.0.1 (2021-03-14)

Changed:

-   getEnvBool -> env.getBool;

### 2.0.0 (2021-03-03)

Changed:

-   deps updated;

### 2.0.0-rc.1 (2021-03-02)

Changed:

-   runtime vue compiler options disabled;

### 2.0.0-rc.0 (2021-03-01)

Changed:

-   froala fix;

### 2.0.0-beta.16 (2021-02-22)

Changed:

-   smtp settings updated;

### 2.0.0-beta.15 (2021-02-22)

Changed:

-   smtp hostname;

### 2.0.0-beta.14 (2021-02-21)

Changed:

-   froala;

### 2.0.0-beta.13 (2021-02-20)

Changed:

-   froala editor;

### 2.0.0-beta.12 (2021-02-18)

Changed:

-   use defineAsyncComponent;
-   app init refactored;
-   dialogs updated;
-   workaround for issue with floated dialogs;
-   mount main views to viewport by default;

### 2.0.0-beta.11 (2021-02-16)

Changed:

-   mount plugin refactored;

### 2.0.0-beta.10 (2021-02-15)

Changed:

-   mount plugin refactored;
-   addVue method removed;

### 2.0.0-beta.9 (2021-02-13)

Changed:

-   mount plugin refactored;
-   vuex store init process refactored;

### 2.0.0-beta.8 (2021-02-13)

Changed:

-   vuex store init process refactored;

### 2.0.0-beta.7 (2021-02-13)

Changed:

-   vuex store init process refactored;

### 2.0.0-beta.6 (2021-02-13)

Changed:

-   vue3 plugins;

### 2.0.0-beta.5 (2021-02-12)

Changed:

-   utils resolution updated;

### 2.0.0-beta.4 (2021-02-12)

Changed:

-   util renamed to utils;

### 2.0.0-beta.3 (2021-02-11)

Changed:

-   migrated to vue v3;

### 2.0.0-beta.2 (2021-02-11)

Changed:

-   migrated to vue v3;
-   deps updated;

### 2.0.0-beta.1 (2021-02-09)

Changed:

-   use getEnvBool function;

### 2.0.0-beta.0 (2021-02-09)

Changed:

-   softvisio/vue update to v2;

### 1.1.0 (2021-02-01)

-   settings dialog props added

### 1.0.3 (2021-01-31)

-   package-lock disabled

### 1.0.2 (2021-01-31)

-   deps updated

### 1.0.1 (2021-01-31)

-   deps updated

### 1.0.0 (2021-01-31)

-   deps updated

### 0.48.2 (2021-01-27)

-   deps updated

### 0.48.1 (2021-01-27)

-   deps updated

### 0.48.0 (2021-01-26)

-   migrated to node v15

### 0.47.2 (2021-01-25)

-   menu avatar align removed

### 0.47.1 (2021-01-22)

-   linted

### 0.47.0 (2021-01-21)

-   system theme integrated

### 0.46.0 (2021-01-06)

-   api token align center

### 0.45.0 (2021-01-05)

-   user model fields updated

### 0.44.0 (2021-01-02)

-   token permissions

### 0.43.0 (2020-12-24)

-   app permissions

### 0.42.0 (2020-12-19)

-   default stores refactored

### 0.41.0 (2020-12-17)

-   default stores refactored

### 0.40.0 (2020-12-14)

-   main store updated

### 0.39.0 (2020-12-13)

-   export default from reverted
-   re-export store

### 0.38.0 (2020-12-12)

-   vuew store refactored

### 0.37.0 (2020-12-04)

-   menu sheet refactored

### 0.36.0 (2020-12-01)

-   ext store refactored

### 0.35.0 (2020-11-30)

-   vuex store refactored

### 0.34.0 (2020-11-29)

-   settings panel
-   theme store refactored
-   profile panel

### 0.33.0 (2020-11-27)

-   .$ext property renamed to .ext
-   code cleanup

### 0.32.0 (2020-11-27)

-   profile component

### 0.31.0 (2020-11-25)

-   components moved

### 0.30.0 (2020-11-23)

-   api call log

### 0.29.1 (2020-11-16)

-   linted

### 0.29.0 (2020-11-09)

-   qtips enabled

### 0.28.2 (2020-11-08)

-   gmaps loader typo fixed

### 0.28.1 (2020-10-23)

-   trash icon changed

### 0.28.0 (2020-10-23)

-   google maps loaded

### 0.27.1 (2020-10-22)

-   npm 7 reverted to 6
-   deps updated

### 0.27.0 (2020-10-15)

-   webpack aliases from ext resources created

### 0.26.3 (2020-10-15)

-   linted

### 0.26.2 (2020-09-19)

-   css linted

### 0.26.1 (2020-09-18)

-   pdfjs import updated

### 0.26.0 (2020-09-11)

-   conditional store modules config

### 0.25.1 (2020-09-05)

-   settings smtp tooltip updated

### 0.25.0 (2020-08-28)

-   settings dialog default size updated

### 0.24.1 (2020-08-19)

-   menu sheet props

### 0.24.0 (2020-08-19)

-   menu sheet props

### 0.23.0 (2020-08-19)

-   users store

### 0.22.0 (2020-08-19)

-   api tokens

### 0.21.0 (2020-08-19)

-   loader.gif moved to assets

### 0.20.1 (2020-08-07)

-   .eslintrc.yaml removed

### 0.20.0 (2020-08-06)

-   electron updates

### 0.19.2 (2020-08-03)

-   npm-shrinkwrap.json version updated

### 0.19.1 (2020-08-03)

-   shrinkwrap added

### 0.19.0 (2020-07-30)

-   session store action changePassword renamed to setPassword

### 0.18.2 (2020-07-24)

-   npm git links changed to git+https

### 0.18.1 (2020-07-22)

-   reset password form adopted for mobile

### 0.18.0 (2020-07-22)

-   settings smtp from field added

### 0.17.0 (2020-07-21)

-   session signin statuses added

### 0.16.2 (2020-07-21)

-   double pdf rendering bug fixed

### 0.16.1 (2020-07-18)

-   require syntax fixed

### 0.16.0 (2020-07-17)

-   userName -> username

### 0.15.5 (2020-07-17)

-   softvisio-ext.git#master -> #latest

### 0.15.4 (2020-07-17)

-   lint patterns updated

### 0.15.3 (2020-07-16)

-   user profile disabled in menu

### 0.15.2 (2020-07-12)

-   changelog format updated

### 0.15.1 (2020-07-12)

-   .eslintrc.yaml updated

### 0.15.0 (2020-07-10)

-   lint config added to package.json
