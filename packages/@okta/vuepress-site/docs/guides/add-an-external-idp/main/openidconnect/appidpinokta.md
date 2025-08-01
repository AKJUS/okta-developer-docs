* **Name**: Enter a name for the IdP configuration.
* **Scopes**: Leave the defaults. These scopes are included when Okta makes an OpenID Connect request to the IdP.
    > **Note:** By default, Okta requires the `email` attribute for a user. The `email` scope is required to create and link the user to the Okta Universal Directory.
* **Client ID**: Paste the app ID or client ID that you obtained when you configured the IdP in the previous section.
* **Authentication type**: Leave the default of **Client secret** or select **Public key/private key** to automatically generate a public and private key pair. The public key is available for download when you click **Finish**.
* **Client Secret**: If you're using **Client secret** as the **Authentication type**, paste the secret that you obtained in the previous section.
* **Authorize requests**: Select **Enable signed requests** to send request parameters to the OpenID provider as an encoded JWT instead of passing the parameters in the URL.
* **Application context**: To send the app name (`app_name`) and app ID (`app_instance_id`) to the IdP, select the **Send Okta application context** checkbox. Okta sends the `app_instance_id` and `app_name` parameters to the IdP. The IdP response to Okta contains the same information as claims in the ID token. Use application context to help external IdPs make more informed, context-aware authentication decisions.

  Example with appropriate claims in the ID token:

  ```JSON
    {
        "aud": "aud",
        "auth_time": "auth_time",
        "email": "email",
        "exp": "exp",
        "family_name": "family_name",
        "given_name": "given_name",
        "iat": "iat",
        "iss": "iss",
        "nonce": "nonce",
        "sub": "sub",
        "app_instance_id": "app_instance_id",
        "app_name": "app_name"
    }
    ```

* **Algorithm**: Select the algorithm to use for the signed requests from the dropdown list. If you're using the **Public key/private key** option, you must specify a signing algorithm, for example: **RSA256**.

    > **Note:** The **Algorithm** is used to sign the authorize requests and to generate bearer assertions when you use a private/public key pair for `/token` endpoint authentication.

In the **Endpoints** section:

Add the following endpoint URLs for the OpenID Connect IdP that you're configuring. You can obtain the appropriate endpoints and the required scopes in the well-known configuration document for the IdP (for example, `https://{theIdPdomain}/.well-known/openid-configuration`).

* **Issuer**: The identifier of the OpenID Connect provider. For example, `https://{theIdPdomain}/`.
* **Authorization endpoint**: The URL of the IdP's OAuth 2.0 authorization endpoint. For example: `https://{theIdPdomain}/oauth2/v1/authorize`
* **Token endpoint**: The URL of the IdP's token endpoint for obtaining access and ID tokens. For example: `https://{theIdPdomain}/oauth2/v1/token`
* **JWKS endpoint**: The URL of the IdP's JSON Web Key Set document. This document contains signing keys that are used to validate the signatures from the provider. For example: `https://{theIdPdomain}/oauth2/v1/keys`
* **Userinfo endpoint (optional)**: The endpoint for getting identity information about the user. For example: `https://{theIdPdomain}/oauth2/v1/userinfo`.

> **Note:** Okta requires an access token returned from the IdP if you add the `/userinfo` endpoint URL.

In the optional **Authentication Settings** section:

* **IdP Username**: This is the expression (written in Okta Expression Language) that is used to convert an IdP attribute to the app user's `username`. This IdP username is used for matching an app user to an Okta user.

    For example, the value `idpuser.email` means that it takes the email attribute passed by the IdP and maps it to the Okta app user's `username` property.

    You can enter an expression to reformat the value, if desired. For example, if the social username is `john.doe@mycompany.com`, then you could specify the replacement of `mycompany` with `endpointA.mycompany` to make the transformed username `john.doe@endpointA.mycompany.com`. See [Okta Expression Language](/docs/reference/okta-expression-language/).

* **Filter > Only allow usernames that match defined RegEx Pattern**: Select this option to only authenticate users with transformed usernames that match a regular expression pattern in the text field that appears. This filters the IdP username to prevent the IdP from authenticating unintended users. Users are only authenticated if the transformed username matches the regular expression pattern.

    > **Note:** When you use Okta for B2B or multi-tenancy use cases, select this checkbox. This helps you scope a subset of users in the org and enforce identifier constraints, such as email suffixes.

    For example, you could restrict an IdP for use only with users who have `@company.com` as their email address using the following expression: `^[A-Za-z0-9._%+-]+@company\.com`.

* **Account Link Policy** > **Enable automatic linking**: Select this option for Okta to automatically link the user's IdP account with a matching Okta account. See [Account link](#account-link).

    If the automatic linking policy is selected, and any validated OIDC JWT is provided, Okta searches the Universal Directory for a user's profile to link. The user profile is found when the **IdP username** value (email) passed by the IdP matches the **Match against** value (username). If there's a match, then the user is linked by mapping the required, static `sub` claim provided in the JWT to that user.

    After an account is linked, any validated JWT token with the same `sub` claim (which is mapped to the `idp.externalId` in the IdP profile) is automatically mapped to the same user. This happens regardless of the content of claims in the JWT. Also, the matching happens even if the values for **IdP username** and **Match against** no longer result in a match.

* **Auto-link filters**: If the automatic linking policy is selected, you can configure linking to users in specific groups, exclude linking to specific users, and exclude linking to admin users. <ApiLifecycle access="ea" />

    * **Include specific groups**: Include users in these groups for account linking.

    * **Exclude specific users**: Exclude these specific users from account linking.

    * **Exclude admins**: Exclude users who are assigned admin roles or have admin privileges from account linking.
