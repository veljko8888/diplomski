/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  sso_api_username: '4bnjfalv1h7d1pbgde56nl132b',
  sso_api_pwd: 'erlusfcb3ivi8bg797ihrdspfruoqrpssh51ot6m9f3c3b9hbjs',

  loginURL: 'https://sso.mgoconnect.org/login?client_id=4bnjfalv1h7d1pbgde56nl132b&response_type=code&scope=openid+profile&redirect_uri=http://localhost:4300/pages/dashboard/',

  redirectURL: 'http://localhost:4300/pages/dashboard/',

  cognitoTokenURL: 'https://sso.mgoconnect.org/oauth2/token',

  logout: 'https://sso.mgoconnect.org/logout?' +
          'client_id=4bnjfalv1h7d1pbgde56nl132b&' +
          'logout_uri=http://localhost:4300/'
};

export const apiUrl = 'https://api.mgoconnect.org/jpv2'; 
