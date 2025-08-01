---
title: Protect your API endpoints
excerpt: Configure your Okta org and your server-side application to secure your API endpoints.
language: PHP
integration: back-end
icon: code-php
layout: Guides
meta:
  - name: robots
    content: noindex, nofollow
---

> **Info**: This topic was archived on February 9 2024 and is no longer updated. PHP is no longer a supported language at Okta.

Add a layer of authorization to your web services with [Okta API Access Management](/docs/concepts/api-access-management/).

---

**Learning outcomes**

* Configure a web API to use Okta.
* Define which endpoints require authorization and which don't.
* Enable Cross-Origin Resource Sharing (CORS) for the API.
* Test that the API is secure.

**What you need**

* An [Okta Integrator Free Plan org](https://developer.okta.com/signup/)
* [Postman](https://www.getpostman.com/apps) to test the API
* A recent version of [PHP](https://www.php.net/) and [composer](https://getcomposer.org/) installed.

**Sample code**

[PHP API Quickstart](https://github.com/okta-samples/okta-php-api-quickstart)

> **Note**: Several standalone tools can send requests to APIs and allow you to inspect the responses. Our documentation uses **Postman** and offers [Postman Collections](/docs/reference/postman-collections/) to test its APIs more efficiently with a GUI. It also includes HTTP requests as text for those who prefer to use a terminal utility such as [cURL](https://curl.se/download.html).

---

## Overview

Applications accessing your web APIs require the same level of [authentication and authorization](https://www.okta.com/identity-101/authentication-vs-authorization/) as users accessing your web applications. However, the sign-in flow should be silent and require no human user interaction. Use Okta to grant the correct level of access to your APIs on your behalf.

Use this quickstart to learn how to perform these tasks:

1. [Check that API Access Management is enabled](#check-that-api-access-management-is-enabled)
1. [Create and configure a new web API to use Okta](#create-and-configure-a-new-web-api-to-use-okta)
1. [Configure different levels of access for different endpoints](#configure-different-levels-of-access-for-different-endpoints)
1. [Enable CORS for your API](#enable-cors-for-your-api)
1. [Test that your API is secure](#test-that-your-api-is-secure)

> **Tip**: You need your Okta org domain to follow this tutorial. It looks like `integrator-123456.okta.com`. See [Find your Okta domain](/docs/guides/find-your-domain/). Where you see `${yourOktaDomain}` in this guide, replace it with your Okta domain.

## Check that API Access Management is enabled

[API Access Management (API AM)](/docs/concepts/api-access-management/) is the feature in your org that allows Okta to secure your APIs. When enabled, API AM allows you to create an authorization server that establishes a security boundary for your APIs. All new developer orgs have API AM enabled by default, but it's optional for production orgs. Check that it's enabled in your org as follows:

1. Open the Admin Console for your org.
   1. [Sign in to your Okta organization](https://developer.okta.com/login) with your administrator account.
   [[style="list-style-type:lower-alpha"]]
   1. Click **Admin** in the upper-right corner of the page.
1. Go to **Security** > **API** to view the API AM area.

If no **Authorization Servers** tab exists, API AM isn't enabled in your org. Contact your support team to enable this feature in your org or create a new [Okta Integrator Free Plan org](https://developer.okta.com/signup/).

### Note your authorization server name and audience

This tutorial uses the **default** custom authorization server to secure your API. Make a note of its **name** and **audience** value to configure your API:

1. From the API AM area in the Admin Console, select the **Authorization Servers** tab.
1. Go to the entry for the **default** server and make a note of two values.
   * **Audience**: Found under audience. It should be `api://default`.
   * **Authorization Server Name**: Found under name. It should be `default`.

Moving on, where you see `${yourAudience}` and `${yourAuthServerName}` in this guide, replace them with your audience and authorization server name.

> **Note**: You can either create a custom authorization server or use the default to protect your APIs. In either case, you need an appropriate licence to use them in production.

## Create and configure a new web API to use Okta

Now that you have an authorization server and have noted how to identify it, perform these tasks:

1. [Create an API project](#create-an-api-project)
1. [Add the required packages to your project](#add-the-required-packages-to-your-project)
1. [Configure your API to use Okta](#configure-your-api-to-use-okta)
1. [Create two endpoints to secure](#create-two-endpoints-to-secure)

### Create an API project

1. Open a terminal and create a directory `test-api` for your project.
1. Open the new directory and create a simple starter structure for your project:

   * public > index.php
   * .env

Use the [sample code](https://github.com/okta-samples/okta-php-api-quickstart) to follow along.

### Add the required packages to your project

This quickstart uses several packages to build the API and consume access tokens from Okta. Install each of them with [Composer](https://getcomposer.org):

1. The PHP dotenv library loads values from the `.env` config file automatically.

   ```shell
   composer require vlucas/phpdotenv
   ```

1. The Firebase JWT library encodes and decodes tokens for and from Okta.

   ```shell
   composer require firebase/php-jwt
   ```

1. The Guzzle HTTP client library fetches Okta's JWT signing keys.

   ```shell
   composer require guzzlehttp/guzzle
   ```

1. The phpfastcache library caches the JWT signing keys to speed up access token validation.

   ```shell
   composer require phpfastcache/phpfastcache
   ```

### Configure your API to use Okta

Earlier you [noted your authorization server name and audience](#note-your-authorization-server-name-and-audience). Add these and your Okta domain to your API's configuration.

Add the following properties to `.env`, replacing the placeholders with your own values.

```properties
OKTA_OAUTH2_ISSUER=${yourOktaDomain}/oauth2/${yourAuthServerName}
OKTA_AUDIENCE=${yourAudience}
```

## Create two endpoints to secure

Create two endpoints in your project that cover two different use cases:

* `api/whoami`&mdash;a protected endpoint (access-restricted API)
* `api/hello`&mdash;an endpoint that anonymous users can access (unsecured API)

1. Open the **public** > **index.php** file.
1. Add the following code to load the environment variables, set up a basic router, and create placeholders for the two endpoints:

   ```php
   <?php
   require_once(__DIR__ . '/../vendor/autoload.php');

   $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
   $dotenv->load();

   if (!hasValidAccessToken()) {
      header("HTTP/1.1 401 Unauthorized");
      echo "Unauthorized";
      die();
   }

   $path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
   switch ($path) {

      case '/api/whoami':
         whoami();
         break;

      case '/api/hello':
         hello();
         break;
   }

   ?>
   ```

1. Add the code for the route handlers.

   ```php
   function hello()
   {
      echo "Hello World";
   }

   function whoami()
   {
      echo "You are a super developer";
   }
   ```

## Configure different levels of access for different endpoints

In many APIs, all endpoints require authorization. There may be a mix of protected and unprotected endpoints in others. These examples show you how to assign protected and unprotected access to an endpoint.

### Require authorization for all endpoints

You can use a middleware function to protect any endpoint so only authenticated users can access it.

1. Add a function `hasValidAccessToken()` in `index.php` to check if a request has a valid access token:

   ```php
   function hasValidAccessToken()
   {
      // Require an access token is sent in the HTTP Authorization header
      if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
         return false;
      }

      $accessToken = explode(' ', $_SERVER['HTTP_AUTHORIZATION'])[1];

      $keys = getJWKS();

      try {
         $decoded = \Firebase\JWT\JWT::decode($accessToken, $keys);
      } catch (\Exception $e) {
         echo $e->getMessage() . "\n";
         return false;
      }

      // Check the audience and issuer claims
      if ($decoded->iss != $_ENV['OKTA_OAUTH2_ISSUER'])
         return false;

      if ($decoded->aud != $_ENV['OKTA_AUDIENCE'])
         return false;

      return $decoded;
   }
   ```

1. `hasValidAccessToken()` relies on another function `getJWKS()` to fetch and cache the JWT signing keys from Okta before decoding the access tokens. Add the code for `getJWKS()` to `index.php`:

   ```php
   function getJWKS()
   {
      $httpClient = new \GuzzleHttp\Client();
      $httpFactory = new \GuzzleHttp\Psr7\HttpFactory();
      $cacheItemPool = \Phpfastcache\CacheManager::getInstance('files');

      $jwksUri = $_ENV['OKTA_OAUTH2_ISSUER'] . '/v1/keys';

      $keySet = new \Firebase\JWT\CachedKeySet(
         $jwksUri,
         $httpClient,
         $httpFactory,
         $cacheItemPool,
         300,  // $expiresAfter int seconds to set the JWKS to expire
         true  // $rateLimit    true to enable rate limit of 10 RPS on lookup of invalid keys
      );

      return $keySet;
   }
   ```

1. Add the following code to `index.php` to require any request to have a valid access token in the header. Insert this code above the `switch` statement:

   ```php
   if (!hasValidAccessToken()) {
      header("HTTP/1.1 401 Unauthorized");
      echo "Unauthorized";
      die();
   }
   ```

### Allow anonymous access for specific routes

Configure access on a per-route basis to allow a mix of protected and anonymous endpoints.

1. Remove the call to `hasValidAccessToken()` for all endpoints from `index.php`.

1. Add the call into the particular endpoints that require authentication, for example:

   ```php
   function whoami() {
      $token = hasValidAccessToken();

      if(!$token) {
         header("HTTP/1.1 401 Unauthorized");
         echo "Unauthorized";
         die();
      }

      header("Content-type: application/json");
      echo "You are a super developer";
   }
   ```

### Enable CORS for your API

Enable [Cross-Origin Resource Sharing  (CORS)](https://fetch.spec.whatwg.org/#http-cors-protocol) only if the API is being called from an application or API hosted on a different domain. For example, if your API is hosted on `api.example.com` while your application is accessing it from `example.com`, you must enable CORS.

If you're using a PHP framework like [Laravel](https://laravel.com/docs/9.x/routing#cors) or [Symfony](https://symfony.com/doc/current/frontend/encore/dev-server.html#cors-issues), check the documentation for how to enable CORS in the framework. For this quickstart, you can send back the required HTTP headers by adding the following code above the `switch` statement in `index.php`:

```php
header('Access-Control-Allow-Origin: *');
```

## Test that your API is secure

You can now test if your endpoint security works as intended. To do this, you will:

1. [Create an API services integration to represent another machine or service attempting to make requests to the API](#create-an-api-services-integration)
1. [Create a custom scope for the authorization server to assign to the API integration](#create-a-custom-scope-for-the-api)
1. [Run the API](#run-your-api)
1. Use [Postman](https://www.getpostman.com/apps) to
   1. [Request an access token for the API](#request-an-access-token-for-the-api)
   [[style="list-style-type:lower-alpha"]]
   1. [Query both the `\hello` and `\whoami` endpoints](#query-the-hello-and-whoami-endpoints)

### Create an API Services integration

When another machine or service (rather than users) consumes an API, it uses the [Client Credentials flow](https://developer.okta.com/docs/guides/implement-grant-type/clientcreds/main/) to identify itself and request an access token. Create an API services integration that has this flow enabled.

1. Open the Admin Console for your org.
1. Go to **Applications** > **Applications** to view the current app integrations.
1. Click **Create App Integration**.
1. Select **API Services** as the **Sign-in method**, and click **Next**.
1. Enter an integration name, and click **Save**.

The configuration page for the new API services integration appears. Make a note of two values that you use to request your access token:

* **Client ID**: Found on the **General** tab in the Client Credentials section.
* **Client Secret**: Found on the **General** tab in the Client Credentials section.

Moving on, where you see `${yourClientId}` and `${yourClientSecret}` in this guide, replace them with your client ID and client secret.

### Create a custom scope for the API

Scope is a way to limit an application's access to your API. An access token must include a list of the scopes an app integration can perform. Create a custom scope - effectively, "you can query both endpoints" - for the API.

1. Go to **Security** > **API** to view the API AM area.
1. Select the **Authorization Servers** tab.
1. Go to the entry for the **default** server and click its name.
1. Select the **Scopes** tab and click **Add Scope**.
1. Enter a name for the scope. For example, "AccessAll".
1. Click **Create**.
1. Ensure that the table contains the new scope.

### Run Your API

Now, start your server to get your API running.

```bash
php -S 127.0.0.1:8080 -t public
```

Leave your API running locally (or deployed if desired) and proceed to the next step.

### Test with Postman

Start Postman if it's not open already. First, you request an access token from Okta and then check your APIs are protected correctly.

#### Request an access token for the API

Make an HTTP POST request to [/token](https://developer.okta.com/docs/api/openapi/okta-oauth/oauth/tag/CustomAS/#tag/CustomAS/operation/tokenCustomAS) using the client ID and secret you noted earlier.

1. Select **+** in the Postman workbench to open a new request tab.
1. Select **GET** and change it to **POST**.
1. Enter `https://${yourOktaDomain}/oauth2/${yourAuthServerName}/v1/token` for the **URL**.
1. In the **Params** tab, create two key-value pairs:
   1. **Key**: `grant_type`, **Value**: `client_credentials`
   [[style="list-style-type:lower-alpha"]]
   1. **Key**: `scope`, **Value**: `${yourCustomScope}`
1. Select the **Authorization** tab, and then select Basic Auth for **type**.
1. Enter `${yourClientId}` for **Username** and `${yourClientSecret}` for **Password**.
1. Select the **Headers** tab and add two new headers:
   1. **Name**: Cache-Control, **Value**: no-cache
   [[style="list-style-type:lower-alpha"]]
   1. **Name**: Content-Type, **Value**: application/x-www-form-urlencoded
1. Click **Send** to receive an access token.

   <div class="full border">

   ![A screenshot of Postman making a call to /token and receiving an access token](/img/authorization/postman-get-access-token.png)

   </div>

1. Copy the value returned in the `access_token` object field and use it for testing your API in the next section.

#### Query the hello and whoami endpoints

Now you can test your secured API endpoints. First, test the `\whoami` endpoint, which requires authorization:

1. Select **+** in the Postman workbench to open a new request tab.
1. Enter `https://localhost:8080/api/whoami` for **URL**.
1. Select the **Authorization** tab, and then select Bearer Token for **type**.
1. Enter the token you received earlier for **Token**.
1. Click **Send**.
1. Ensure that you received a `200 OK` response.
1. Select the **Authorization** tab, and then select No Auth for **type**.
1. Ensure that you received a `401 Unauthorized` response.

Now test the hello endpoint which doesn't require authorization:

1. Select **+** in the Postman workbench to open a new request tab.
1. Enter `https://localhost:8080/api/hello` for **URL**.
1. Select the **Authorization** tab, and then select Bearer Token for **type**.
1. Enter the token you received earlier for **Token**.
1. Click **Send**.
1. Ensure that you received a `200 OK` response.
1. Select the **Authorization** tab, and then select No Auth for **type**.
1. Ensure that you still receive a `200 OK` response.

## Next steps

Learn more about concepts introduced in this guide:

* [API Access Management](/docs/concepts/api-access-management/)
* [Authorization servers](/docs/concepts/auth-servers/)
* [oAuth 2.0 Credit Credentials flow](/docs/guides/implement-grant-type/clientcreds/main/)
* [Test the Okta REST APIs using Postman](/docs/reference/rest/)
* Define your own custom OAuth 2.0 [scopes](/docs/guides/customize-authz-server/main/#create-scopes), [claims](/docs/guides/customize-authz-server/main/#create-claims), and [access policies](/docs/guides/customize-authz-server/main/#create-access-policies) to support authorization for your APIs.
* [Customize tokens returned from Okta from custom claims](/docs/guides/customize-tokens-returned-from-okta/main/)

Related blog posts

* [Authentication Patterns for PHP Microservices](https://developer.okta.com/blog/2022/01/05/auth-patterns-php-microservices)
* [Protecting a Laravel API with JWT](https://developer.okta.com/blog/2020/11/04/protecting-a-laravel-api-with-jwt)
* [Validating Okta Access Tokens in PHP using AWS API Gateway and Lambda Authorizers](https://developer.okta.com/blog/2020/10/05/validating-okta-access-tokens-php-aws-api-gateway-lambda)
