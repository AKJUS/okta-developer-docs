Before you integrate authentication into your Angular app, you need to register your app in your Okta org. This provides you with the OpenID Connect client ID for authentication requests from your app. Register your app by creating an app integration through the [Okta Apps API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Application/#tag/Application) or the [Admin Console](/docs/concepts/okta-organizations/#admin-console) with the following steps:

1. To create an app integration for your Angular app, sign in to [your Admin Console](https://login.okta.com).
2. Select **Applications** > **Applications**, and then click **Create App Integration**.
3. In the dialog that appears, select **OIDC - OpenID Connect** as the **Sign-on method**, **Single-Page Application** as the **Application type**, and then click **Next**.
4. Fill in the following new app integration settings, and then click **Save**:

    | Setting                | Value/Description                                    |
    | -------------------    | ---------------------------------------------------  |
    | App integration name   | Specify a unique name for your app.                  |
    | Grant types            | Leave **Authorization Code** selected, and then select **Refresh Token**. Click **Advanced** and select **Interaction Code**.   |
    | Sign-in redirect URIs  | Specify your app URI for the callback redirect from Okta. For example, `http://localhost:4200/login/callback`. |
    | Sign-out redirect URIs | Specify your app sign-out redirect URI. For example: `http://localhost:4200`. Ensure that you add all your deployment URIs.|
    | Trusted Origins > Base URIs | Specify your app base URI for CORS. For example: `http://localhost:4200`. Ensure that you add trusted origins for all base URIs. |
    | Assignments   | Assign users to your app.                                |

    > **Note:** Cross-Origin Resource Sharing (CORS) is automatically enabled for the Trusted Origins base URI that you specified in the Admin Console. You can verify that both **CORS** and **redirect** are enabled for your app by reviewing the **Security** > **API** > **Trusted Origins** page in the Admin Console.

### App integration settings

You need two pieces of information from your org and app integration for your Angular app:

* **Client ID**: From the **General** tab of your app integration, save the generated **Client ID** value.
* **Issuer**: From the **General** tab of your app integration, save the **Okta domain** value. Use your Okta domain value for the [issuer](/docs/guides/oie-embedded-common-download-setup-app/nodejs/main/#issuer) setting, which represents the authorization server. Use `https://{yourOktaDomain}/oauth2/default` as the issuer for your app if you're using the Okta Integrator Free Plan org. See [Issuer configuration](/docs/guides/oie-embedded-common-download-setup-app/nodejs/main/#issuer) if you want to use another Okta custom authorization server.
