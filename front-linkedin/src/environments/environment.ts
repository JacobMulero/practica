// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  LinkedInApi: {
    clientId: '78q86zmiyhs1q0',
    redirectUrl: 'http://localhost:4200/linkedin',
    oauthUrl: 'https://www.linkedin.com/oauth/v2/authorization?response_type=code',
    scope: 'r_liteprofile%20r_emailaddress',
    scope_posts: 'r_liteprofile%20r_emailaddress%20w_member_social',
    state: '123456',
  },

  baseURL: 'http://localhost:3000',
  getUserCredentials: '/getUserCredentials',
  getUserCredentialsIncorrecto: "/getUserCredentialsTokenIncorrecto"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
