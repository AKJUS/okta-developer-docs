Before you can begin this flow, you must collect the SAML assertion from the Identity Provider and make sure that it’s Base64-encoded. You can then use the assertion in the API call to the [authorization server's](/docs/concepts/auth-servers/#custom-authorization-server) `/token` endpoint.

> **Note:** The example request in the next section displays a direct [OIDC & OAuth 2.0 API](https://developer.okta.com/docs/api/openapi/okta-oauth/guides/overview/) call. You don't usually need to make direct calls when you use an Okta authentication SDK that supports the SAML 2.0 Assertion flow.

### Request example

If you’re using the org authorization server, then your request would look something like this:

```bash
curl --location --request POST 'https://{yourOktaDomain}/oauth2/v1/token' \
--header 'Accept: application/json' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic MG9hb....' \
--data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:saml2-bearer' \
--data-urlencode 'scope=openid offline_access' \
--data-urlencode 'assertion=<Base64-encoded assertion>'
```

> **Note:** The call to your authorization server's `/token` endpoint requires authentication. In this case, it’s a Basic Authentication digest of the client ID and secret. You made note of these when you [set up your app](#set-up-your-app). See [Client Authentication Methods](https://developer.okta.com/docs/api/openapi/okta-oauth/guides/client-auth/#client-authentication-methods).

Note the parameters that are being passed:

- `grant_type`: The value is `urn:ietf:params:oauth:grant-type:saml2-bearer`
- `assertion`: A single SAML 2.0 assertion that is Base64-encoded
- `scope`: The values are `openid` and `offline_access`. The `openid` scope is required. Include `offline_access` if you want a refresh token included. You can also request other scopes. See the **Create Scopes** section of the [Create an authorization server guide](/docs/guides/customize-authz-server/main/#create-scopes).

### Response example

> **Note:** The tokens are truncated for brevity.

```JSON
{
    "token_type": "Bearer",
    "expires_in": 3600,
    "access_token": "eyJraWQiOiJ3UHdvd.....gkJktHWp4YeLBGRxInAP2n4OpK6g1LmtNsEZw",
    "scope": "offline_access openid",
    "refresh_token": "rHXv2mvdmkfp3MwqYjNzrhyuvlVGZF2WgKsYXfTq3Mk",
    "id_token": "eyJraWQ.....h7BYbgCzQ"
}
```