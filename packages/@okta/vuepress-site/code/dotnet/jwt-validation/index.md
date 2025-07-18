---
title: JWT Validation Guide
language: .NET
excerpt: Manually validate Okta JWTs with .NET (C#).
icon: code-dotnet
---

When you use Okta to [get OAuth 2.0 or OpenID Connect tokens for a user](/docs/concepts/oauth-openid/#recommended-flow-by-application-type), the response contains a signed JWT (`id_token` and/or `access_token`).

If you’re writing low-level code that retrieves or uses these tokens, it's important to validate the tokens before you trust them. This guide shows you how to validate tokens manually.

> **Note:** This guide is specific to .NET and C#. If you need general information, read [Validate Access Tokens](/docs/guides/validate-access-tokens/) and [Validate ID Tokens](/docs/guides/validate-id-tokens/) instead.

## Who should use this guide

You don't need to validate tokens manually if:

* You’re using ASP.NET or ASP.NET Core
* You send the tokens to Okta to be validated (this is called [token introspection](https://developer.okta.com/docs/api/openapi/okta-oauth/oauth/tag/CustomAS/#tag/CustomAS/operation/introspectCustomAS))

If you need to validate a token manually, and don't want to make a network call to Okta, this guide helps you validate tokens locally.

### What you need

* Your authorization server URL (see [Composing your base URL](https://developer.okta.com/docs/concepts/auth-servers/))
* A token (JWT string)
* Libraries for retrieving the signing keys and validating the token

This guide uses the official Microsoft OpenID Connect and JWT libraries, but you can adapt it to other key and token parsing libraries.

### Get the signing keys

Okta signs JWTs using [asymmetric encryption (RS256)](https://auth0.com/blog/rs256-vs-hs256-whats-the-difference/), and publishes the public signing keys in a JSON Web Key Set (JWKS) as part of the OAuth 2.0 and OpenID Connect discovery documents. The signing keys are rotated on a regular basis. The first step to verify a signed JWT is to retrieve the current signing keys.

The `OpenIdConnectConfigurationRetriever` class in the [Microsoft.IdentityModel.Protocols.OpenIdConnect](https://www.nuget.org/packages/Microsoft.IdentityModel.Protocols.OpenIdConnect/) package downloads and parses the discovery document to get the key set. You can use it in conjunction with the `ConfigurationManager` class that handles caching the response and refreshing it regularly:

```csharp
// Replace with your authorization server URL:
var issuer = "https://${yourOktaDomain}/oauth2/default";

var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
    issuer + "/.well-known/oauth-authorization-server",
    new OpenIdConnectConfigurationRetriever(),
    new HttpDocumentRetriever());
```

After you instantiate the `configurationManager`, keep it around as a singleton. You only need to set it up once.

### Validate a token

The `JwtSecurityTokenHandler` class in the [System.IdentityModel.Tokens.Jwt](https://www.nuget.org/packages/System.IdentityModel.Tokens.Jwt) package handles the low-level details of validating a JWT.

You can write a method that takes the token, the issuer, and the `configurationManager` that you create. The method is `async` because the `configurationManager` may need to make an HTTP call to get the signing keys (if they aren't already cached):

```csharp
private static async Task<JwtSecurityToken> ValidateToken(
    string token,
    string issuer,
    IConfigurationManager<OpenIdConnectConfiguration> configurationManager,
    CancellationToken ct = default(CancellationToken))
{
    if (string.IsNullOrEmpty(token)) throw new ArgumentNullException(nameof(token));
    if (string.IsNullOrEmpty(issuer)) throw new ArgumentNullException(nameof(issuer));

    var discoveryDocument = await configurationManager.GetConfigurationAsync(ct);
    var signingKeys = discoveryDocument.SigningKeys;

    var validationParameters = new TokenValidationParameters
    {
        RequireExpirationTime = true,
        RequireSignedTokens = true,
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateIssuerSigningKey = true,
        IssuerSigningKeys = signingKeys,
        ValidateLifetime = true,
        // Allow for some drift in server time
        // (a lower value is better; we recommend two minutes or less)
        ClockSkew = TimeSpan.FromMinutes(2),
        // See additional validation for aud below
    };

    try
    {
        var principal = new JwtSecurityTokenHandler()
            .ValidateToken(token, validationParameters, out var rawValidatedToken);

        return (JwtSecurityToken)rawValidatedToken;
    }
    catch (SecurityTokenValidationException)
    {
        // Logging, etc.

        return null;
    }
}
```

To use the method, pass it a token, and the issuer and `configurationManager` that you declared earlier:

```csharp
var accessToken = "eyJh...";

var validatedToken = await ValidateToken(accessToken, issuer, configurationManager);

if (validatedToken == null)
{
    Console.WriteLine("Invalid token");
}
else
{
    // Additional validation...
    Console.WriteLine("Token is valid!");
}
```

This method returns an instance of `JwtSecurityToken` if the token is valid, or `null` if it is invalid. Returning `JwtSecurityToken` makes it possible to retrieve claims from the token later.

Depending on your application, you could change this method to return a boolean, log specific exceptions like `SecurityTokenExpiredException` with a message, or handle validation failures in some other way.

### Additional validation for access tokens

If you are validating access tokens, you should verify that the `aud` (audience) claim equals the audience that is configured for your authorization server in the Admin Console.

For example, if your authorization server audience is set to `MyAwesomeApi`, add this to the validation parameters:

```csharp
ValidateAudience = true,
ValidAudience = "MyAwesomeApi",
```

You also must verify that the `alg` claim matches the expected algorithm that was used to sign the token. You have to perform this check after the `ValidateToken` method returns a validated token:

```csharp
// Validate alg
var validatedToken = await ValidateToken(accessToken, issuer, configurationManager);
var expectedAlg = SecurityAlgorithms.RsaSha256; //Okta uses RS256

if (validatedToken.Header?.Alg == null || validatedToken.Header?.Alg != expectedAlg)
{
    throw new SecurityTokenValidationException("The alg must be RS256.");
}
```

### Additional validation for ID tokens

When validating an ID token, you should verify that the `aud` (Audience) claim equals the Client ID of the current application.

Add this to the validation parameters:

```csharp
ValidateAudience = true,
ValidAudience = "xyz123", // This Application's Client ID
```

You also must verify that the `alg` claim matches the expected algorithm that was used to sign the token. You have to perform this check after the `ValidateToken` method returns a validated token:

```csharp
// Validate alg
var validatedToken = await ValidateToken(idToken, issuer, configurationManager);
var expectedAlg = SecurityAlgorithms.RsaSha256; //Okta uses RS256

if (validatedToken.Header?.Alg == null || validatedToken.Header?.Alg != expectedAlg)
{
    throw new SecurityTokenValidationException("The alg must be RS256.");
}
```

If you specified a nonce during the initial code exchange when your application retrieved the ID token, you should verify that the nonce matches:

```csharp
var validatedToken = await ValidateToken(idToken, issuer, configurationManager);

// Validate nonce
var expectedNonce = "foobar"; // Retrieve this from a saved cookie or other mechanism
var nonceMatches = validatedToken.Payload.TryGetValue("nonce", out var rawNonce)
    && rawNonce.ToString() == expectedNonce;

if (!nonceMatches)
{
    throw new SecurityTokenValidationException("The nonce was invalid.");
}
```

## Decode token claims

The sample `ValidateToken` method above both validates a token and decodes its claims. You can use the returned `JwtSecurityToken` object to inspect the claims in the token.

For example, you can get the `sub` (Subject) claim with the `Subject` property:

```csharp
Console.WriteLine($"Token subject: {validatedToken.Subject}");
```

You can access more claims with the `Payload` property or loop over the entire `Claims` collection:

```csharp
Console.WriteLine("All claims:");

foreach (var claim in validatedToken.Claims)
{
    Console.WriteLine($"{claim.Type}\t{claim.Value}");
}
```

## Conclusion

This guide provides the basic steps required to locally verify an access or ID token signed by Okta. It uses packages from Microsoft for key parsing and token validation, but the general principles should apply to any JWT validation library.
