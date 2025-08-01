---
title: Sign users in to your SPA using redirect and Auth JS
---

The [Okta JavaScript Auth SDK](https://github.com/okta/okta-auth-js) (Auth JS) helps implement many Web Authentication solutions for both the [redirect and embedded models](/docs/concepts/redirect-vs-embedded/). This guide creates a simple redirect authentication solution using Auth JS. Once created, you can drop the solution into just about any front-end or server-side web app.

---

#### Learning outcomes

* Understand how to implement a simple sign-in redirect using Auth JS.
* Understand basic installation and code configurations using Auth JS.

#### What you need

[Okta Integrator Free Plan org](https://developer.okta.com/signup)

---

## About the Okta Auth JavaScript SDK

The Okta Auth JavaScript SDK builds on top of the following:

### Sign-in experiences

These experiences include fully branded embedded authentication, as with [Auth JS fundamentals](/docs/guides/auth-js/) and redirect authentication. Auth JS is used by the Okta [Sign-In Widget](https://github.com/okta/okta-signin-widget), which powers the default Okta sign-in page. Your app initializes the SDK, which automatically redirects you to this authentication page. Okta hosts this page and enforces the policies you configured for your sign-in experience.

Auth JS also powers our other redirect SDKs that provide simple authentication for server-side web apps and single-page JavaScript apps (SPA). See the [Quickstart guides](/docs/guides/quickstart/).

### Auth JS and redirect authentication

In this guide, you don't need to use an Okta-supported server-side or front-end framework for redirect authentication. It's possible to use Auth JS to create a drop-in solution. This solution works with most web apps. It also works whether you're adding a centralized sign-in flow to a new app or retrofitting it to an existing app.

To see examples of Auth JS with other front-end frameworks, go to [Sign in to SPA](/docs/guides/sign-into-spa-redirect/angular/main/).

If you'd like to explore the entire Auth JS SDK, see [Okta Auth JavaScript SDK](https://github.com/okta/okta-auth-js/#readme).

## Create an Okta app integration

An Okta app integration represents your app in your Okta org. The integration configures how your app integrates with Okta services, which include the following:

* Users and groups that have access
* Authentication policies
* Token refresh requirements
* Redirect URLs

The integration includes configuration information required by the app to access Okta.

1. [Sign in to your Okta organization](https://developer.okta.com/login) with your administrator account.
1. Click **Admin** in the upper-right corner of the page.
1. Go to **Applications** > **Applications**.
1. Click **Create App Integration**, and then select a **Sign-in method** of **OIDC - OpenID Connect**.
1. Select an **Application type** of **Single-Page Application**, and then click **Next**.

   > **Note:** If you choose an inappropriate app type, it breaks the sign-in or sign-out flow. It breaks the flow by requiring the verification of a client secret, which public clients don't have.

Once you've selected your app type, continue with the following:

1. Enter an **App integration name**, and then ensure that the **Authorization Code** grant type is selected.
1. Enter the **Sign-in redirect URIs** for local development. For this sample, use `http://localhost:9000`.
1. Enter the **Sign-out redirect URIs** for local development. For this sample, use `http://localhost:9000`.
1. Enter the **Base URIs** for the trusted origin. For this sample, use `http://localhost:9000`. See [Trusted origins](#about-trusted-origins).
1. In the **Assignments** section, define the type of **Controlled access** for your app. Select **Allow everyone in your organization to access**. See [Assign app integrations](https://help.okta.com/okta_help.htm?type=oie&id=ext-lcm-user-app-assign).
1. Clear the **Enable immediate access with Federation Broker Mode** checkbox.
1. Click **Save** to create the app integration. The configuration pane for the integration opens after it's saved. Keep this pane open as you need to copy the **Client ID** and your org domain name when configuring your app.

### About trusted origins

Reduce possible attack vectors by defining trusted origins, which are the websites allowed to access the Okta API for your app integration. Cross-Origin Resource Sharing (CORS) enables JavaScript requests using `XMLHttpRequest` with the Okta session cookie. See [Grant cross-origin access to websites](/docs/guides/enable-cors/main/#grant-cross-origin-access-to-websites).

>**Note:** To reduce risk, only grant access to the Okta API to specific websites (origins) that you both control and trust.

To review or set trusted origins go to **Security** > **API** and select the **Trusted Origins** tab. See [Enable trusted origins](/docs/guides/enable-cors/).

## Create a basic app

To make this sample as versatile as possible, the following starter app redirects to Okta. It signs in as you load it into the browser. In your own apps, you might want to initiate the redirect using a button for sign-in. Or, you might want to initiate the redirect when visiting a certain route that requires authentication (such as an admin page). The key is that you initiate the sign-in flow through the redirect.

Review the following sections to build out the sample app, or see the full sample app code in the [Add a sign-out function](#add-a-sign-out-function) section.

### Create a simple HTML UI

In your app directory, create an HTML file called `index.html`. Add the following markup to this file:

```HTML
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Okta Auth JS - Redirect SPA</title>
</head>

<body>
 <b>Okta Auth JS Simple Redirect App</b>
 <hr />
 <div id="content-jwt"></div>
</body>

</html>
```

The content in the body tags represents a simple app. The `content-jwt` reference displays user information after you add some upcoming JavaScript.

### Install the Auth JS SDK

Include this script in your target HTML page (`index.html`) by including the following after the `<title>` element:

```html
<!-- Latest CDN production Auth JS SDK-->
<script src="https://global.oktacdn.com/okta-auth-js/7.7.0/okta-auth-js.min.js" type="text/javascript"></script>
```

>**Note:** If you're using a package manager, you can also install it through the appropriate command, for example `yarn add @okta/okta-auth-js` or `npm install @okta/okta-auth-js`.

### Add JavaScript to initialize the SDK

In the same `index.html` file, add the following JavaScript code after the Auth JS SDK reference. Update the `baseOktaURL` to your org and the `appClientID` to the client ID from the [Create an Okta app integration](#create-an-okta-app-integration) section.

```html
<script type="text/javascript">

// UPDATE THESE FOR YOUR OKTA TENANT
var baseOktaURL = "https:${yourOKtaDomain}"; //For example, https://integrator-123456.okta.com
var appClientID = "${yourClientID}"; // For example, 0oa73hm5sh9jf6s5e1d6

// Bootstrap the AuthJS Client
const authClient = new OktaAuth({
  // Required Fields for OIDC client
  url: baseOktaURL,
  clientId: appClientID,
  redirectUri: "http://localhost:9000/", //or the redirect URI for your app
  issuer: baseOktaURL , // oidc
  scopes: ['openid', 'profile', 'email']
});

</script>
```

This code initializes the SDK by creating an instance of the `OktaAuth()` object. The object stores all the necessary config information for your auth session and is used to control subsequent steps of the process.

### Get info about the user

Include the following JavaScript within the `<script>` tags and after the code that initializes the SDK:

```JavaScript
if (authClient.isLoginRedirect()) {
  // Parse token from redirect url
  console.log("Parse token from redirect url");
  authClient.token.parseFromUrl()
    .then(data => {
      const { idToken } = data.tokens;
      // Display the Token
      const str1 = document.createElement('p');
      str1.innerHTML = `<b>${idToken.claims.email}</b> (email)<br /><b>${idToken.claims.sub}</b> (sub)<br /><br />Token Response:<br /><code style="word-wrap: break-word;">${JSON.stringify(idToken)}</code><br /><br/>Parsed from JWT<br />Client ID: <b>${authClient.options.clientId}</b><br />Issuer: <b>${authClient.options.issuer}</b>`;
      document.getElementById('content-jwt').appendChild(str1);
    });
} else {
  // Always Redirect to get a "Fresh JWT" - Skipping the Token Manager in this example
  console.log("Attempt to retrieve ID Token from redirect");
  authClient.token.getWithRedirect({
          responseType: ['id_token']
        });
}
```

By default, the SDK returns the JWT with the user's information. The JWT contains the encoded ID and access tokens. The previous JavaScript parses the ID token and prints the data to your web page. See [token.parseFromUrl()](https://github.com/okta/okta-auth-js/#tokenparsefromurloptions) in the Auth JS SDK.

### Add a sign-out function

Include the following function within the `body` tags after the `content-jwt` reference:

```html
 <hr />
 <div id="uxActiveOptions">
  <b>Functions:</b>
  <br /><button onclick="authClient.signOut();">Close Okta Session</button>
</div>
```

This function signs the user out of the Okta session. See [signOut()](https://github.com/okta/okta-auth-js/#signout) in the Auth JS SDK.

After adding the sign-out function, the sample app is ready to test. Your sample app code appears as follows:

```html
<html>
<head>
 <meta charset="utf-8">
 <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <title>Okta Auth JS - Redirect SPA</title>
 <!-- Latest CDN production Auth JS SDK-->
 <script src="https://global.oktacdn.com/okta-auth-js/7.7.0/okta-auth-js.min.js" type="text/javascript"></script>
 <script type="text/javascript">


   // UPDATE THESE FOR YOUR OKTA TENANT
   var baseOktaURL = "https:${yourOKtaDomain}"; //For example, "https://integrator-12345678.okta.com"
   var appClientID = "${yourClientID}"; // For example, 0oa73hm5sh9jf6s5e1d6


   // Bootstrap the AuthJS Client
   const authClient = new OktaAuth({
   // Required Fields for OIDC client
     url: baseOktaURL,
     clientId: appClientID,
     redirectUri: "http://localhost:9000/", //or the redirect URI for your app
     issuer: baseOktaURL , // oidc
     scopes: ['openid', 'profile', 'email']
   });


   if (authClient.isLoginRedirect()) {
       // Parse token from redirect url
       console.log("Parse token from redirect url");
       authClient.token.parseFromUrl()
           .then(data => {
           const { idToken } = data.tokens;
           // Display the Token
           const str1 = document.createElement('p');
           str1.innerHTML = `<b>${idToken.claims.email}</b> (email)<br /><b>${idToken.claims.sub}</b> (sub)<br /><br />Token Response:<br /><code style="word-wrap: break-word;">${JSON.stringify(idToken)}</code><br /><br/>Parsed from JWT<br />Client ID: <b>${authClient.options.clientId}</b><br />Issuer: <b>${authClient.options.issuer}</b>`;
           document.getElementById('content-jwt').appendChild(str1);
       });
   } else {
       // Always Redirect to get a "Fresh JWT" - Skipping the Token Manager in this example
       console.log("Attempt to retrieve ID Token from redirect");
       authClient.token.getWithRedirect({
           responseType: ['id_token']
       });
   }
</script>
</head>


<body>
<b>Okta Auth JS Simple Redirect App</b>
<hr />
<div id="content-jwt"></div>
<hr />
<div id="uxActiveOptions">
<b>Functions:</b>
<br /><button onclick="authClient.signOut();">Close Okta Session</button>
</div>
</body>
</html>
```

## Test your app

You can now run your app by using a local web server. For example, with a macOS, go to your sample app directly and use the Python web server command:

```bash
python3 -m http.server 9000
```

Open a private or incognito browser window and go to `http://localhost:9000` or the port for your local web server. The sample app starts the redirect flow when the page opens, and the Sign-In Widget for your org appears. Sign in with a user assigned to your app, and with a successful authentication, your app's `index.html` page displays the ID token for the signed-in user.

### Troubleshoot your app

If your app isn't functional, ensure that:

* Your org URL is accurate and formatted correctly, including the secure protocol, `https://`.
* Your client ID is accurate from your Okta app integration.
* Your `redirectUri` is accurate or the port number for your local web server is correct.
* You've enabled a trusted origin for `http://localhost:9000`. See [About trusted origins](#about-trusted-origins).
* If your app is bypassing the Okta Sign-In Widget, your user is already signed in. Use a new private or incognito browser window or optionally set the authentication policy for your app to always sign in. That is, the **Re-authentication frequency is** set to **Every sign-in attempt**.

## Enable profile enrollment (self-service registration)

The profile enrollment or self-service registration feature provides a **Sign-up** link on the Sign-In Widget. Your end users use this link to register their user profile and sign in to your app.

By default, self-service registration isn't enabled for all apps. Use the following steps to understand the policy configurations and to make this feature only available to your app. See [Self-Service Registration](https://help.okta.com/okta_help.htm?type=oie&id=ext-about-ssr).

1. Ensure that your app is assigned to the Everyone group:

    * Go to **Applications** > **Applications** and select your app.
    [[style="list-style-type:lower-alpha"]]
    * Click the **Assignments** tab.
    * Click the **Groups** filter.
    * If the Everyone group isn't assigned, add it by clicking **Assign** > **Assign to Groups**, and assigning to the Everyone group.
1. Go to **Security** > **User Profile Policies** and edit the **Default Policy**.
1. Notice in the **Profile Enrollment** section, **Denied** is selected for **Self-service registration** by default. This setting removes the self-registration option for all apps assigned to the default policy.
1. [Test your app](#test-your-app) and note that the **Sign-up** link doesn't appear under the sign-in page.
1. Return to the Admin Console, and then select **Back to all user profile policies** to return to the **Security** > **User Profile Policies** page.
1. Click **Add user profile policy**, and then create a name for the policy (for example, "App self-service registration").
1. Edit the new policy and note that self-service registration is **Allowed** by default.
1. Clear the **Email verification** checkbox for ease of testing and to allow your new user to sign in to the app immediately. Click **Save**.
1. Click **Manage Apps** and then **Add an App to This Policy**. Add or apply your sample app to this new policy.
1. [Test your app](#test-your-app) again and note that the text **Don't have an account? Sign up** link now appears for your app under the Sign-In Widget. Click the link to add a user:
    * Enter a first name, family name, and email address and click **Sign up**.
    [[style="list-style-type:lower-alpha"]]
    * Click **Set up** to add a password. (Click **Set up later** for any other authenticators.)
    You're now logged into the app with the new user's profile.

Based on other policy configurations, the self-service registration flow may be different or include other authenticators. See [Sign-in flows](https://help.okta.com/okta_help.htm?type=oie&id=ext-about-sign-in-flows).

> **Note:** All new users through the self-registration process receive a welcome email. This email activates user access to the apps on your Integrator Free Plan org and demonstrates ownership of the email authenticator. If you complete this process, ensure you're in the same browser window as the app sign-in tab.

## Enable progressive profile enrollment

Progressive profile enrollment builds out a user's profile incrementally during sign-in. The user profile policy is evaluated every time a user signs in. Based on the profile fields you want to add, this data is requested from users before signing in. At least one field must be set as required to enable the progressive profile enrollment feature. If a user's profile already has the requested data, the user signs in directly.

1. Go to **Security** > **User Profile Policies** and click **Add user profile policy**.
1. Create a name for the policy and **Save**.
1. Click edit from the **Actions** column for your new policy.
1. Click **Edit** in the policy and then for **Progressive Profiling**, select the **Enabled** option.

   > **Note:** You can also enable profile enrollment (self-service registration) and progressive profile enrollment with the same policy. Select **Allowed** for the **Self-service registration** option of your user profile policy. New users can then enroll with the enhanced profile enrollment form. Existing users use progressive profile enrollment for any new required fields.

1. Clear the **Email verification** checkbox, for ease of testing.
1. Add the other user profile fields that you want existing users to provide in the **Profile enrollment form**. In this example, add the city field:
    1. Click **Add form input** and select the **City (city)** field. If the field is read only, you must change the attribute permission. See [Create a profile enrollment form](https://help.okta.com/okta_help.htm?type=oie&id=ext-create-prof-enroll-form).
    [[style="list-style-type:lower-alpha"]]
    1. Repeat this step for the number of fields that you want to add. At least one of these fields must be set as **Required**.
1. Click **Manage Apps** and then **Add an App to This Policy**. Add or apply your sample app to this new policy.
1. [Test your app](#test-your-app). Sign in with a user that doesn't have a city added to their profile.
    1. After entering the user's credentials, a new dialog requests the required user profile data. In this scenario, the **City** field. Add a city to this user's profile and fill out any other required or optional fields that you configured. After the user adds the data, they’re signed in as normal.
    [[style="list-style-type:lower-alpha"]]
    1. Sign out of the sample app by clicking **Close Okta Session**.
    1. Sign in again with the same user. With the data already added to the user's profile, the user is signed in directly.

## Add MFA with a mandatory second factor

By default, your Integrator Free Plan org isn't configured for multifactor authentication. Use the following steps to understand the policy configurations and set up this use case. This setup requires an end user to authenticate with a password and a phone authenticator.

1. Go to **Security** > **Authenticators** and ensure that the phone authenticator is available in the **Authenticators** list on the **Setup** tab.

   1. If it isn't listed, click **Add Authenticator**, and then click **Add** in the **Phone** tile.
   [[style="list-style-type:lower-alpha"]]
   1. For **User can verify with**, select **SMS**.
   1. Set **This authenticator can be used for** to **Authentication and recovery**, and click **Add**.

1. Go to **Security** > **Authentication policies**, click **Add a policy**.

1. Add a name for the policy. For example: **Mandatory MFA**.

1. Click **Edit** under the **Actions** dropdown menu.

1. Select **Password / IdP +  Another factor** for **User must authenticate with**. Ensure that the **Possession factor constraints are** doesn't have the **Exclude phone and email authenticators** checkbox selected. Click **Save**.

1. Go to **Applications** > **Applications** and select your app.

1. Click the **Sign On** tab, scroll down to the **User authentication** section, and click **Edit**.

1. Select your new authentication policy, **Mandatory MFA**, from the **Authentication policy** dropdown menu, and click **Save**.

1. Test the new configurations by signing in to your app. If your test user doesn't have a phone number enrolled, the user is prompted for the enrollment during sign-in. Enroll the test user, add the SMS code, and the user is signed-in to your sample app.

After your users have enrolled in the phone authenticator, future sign-in flows require both a password and SMS code to access your app.

## Enable password recovery with email magic link

By default, the Integrator Free Plan org is configured for a self-service password reset. Review the following steps to understand the policy configurations and to enable your sample app users to self-recover their password through an email magic link.

1. Go to **Security** > **Authenticators**. Ensure that the email authenticator is available in the **Authenticators** list on the **Setup** tab, and that it's used for **Recovery**.

   1. If it isn't listed, click **Add Authenticator**, and then click **Add** in the **Email** tile.
   [[style="list-style-type:lower-alpha"]]
   1. Set **This authenticator can be used for** to **Recovery**, and click **Add**.

1. Go to **Security** > **Authenticators** and edit the **Password** authenticator by clicking **Actions** > **Edit**.

1. Scroll to the bottom of the **Default Policy** and edit the **Default Rule**.

1. Ensure that **Password reset** is selected for the **Users can perform self-service** section.

1. Ensure that **Email** is selected for the **Users can initiate recovery with** section.

1. Click **Not required** for the **additional verification is** question, and then click **Update rule**.

1. If you previously set the sign-on policy for your app as Mandatory MFA, go to **Applications** > **Applications** and select your app. Click the **Sign On** tab and scroll down to the **User authentication** section and click **Edit**. From the **Authentication policy** dropdown menu, select **One factor access** and click **Save**.

Test the new configurations by recovering a password for a user of your sample app:

1. Start your app. On the Sign-In Widget, click the **Forgot password?** link.

1. Add the email address for your test user.

1. Click the **Send me an email** link.

1. Check your test user's email inbox and wait for the **Account password reset** email from your Integrator Free Plan org.

   >**Note:** Stay in the same browser window as the app sign-in tab.

1. Click the **Reset Password** link in the body of the email.

1. Create and verify a new password. Click **Reset Password**. Your test user is now signed in to your sample app with a new password.

See [Self-service account recovery](https://help.okta.com/okta_help.htm?type=oie&id=ext-config-sspr).

## Enable passwordless authentication

Enable passwordless authentication for your existing users by configuring your Okta org's authenticator enrollment policy, authentication policy, and global session policy. This example uses the email authenticator to authenticate your users instead of a password. For full details and other passwordless implementation options, see [Set up passwordless sign-in experience](https://help.okta.com/okta_help.htm?type=oie&id=ext-passwordless).

1. Go to **Directory** > **Groups** and click **Add group**. Give the group a name, for example, "Passwordless users", and click **Save**.
1. Select your new group, and click **Assign people** from the **People** tab. Add one or more users to your new group.
1. Go to **Security** > **Authenticators** and edit or ensure that the **Email** authenticator is set to **Authentication and recovery**.
1. Click the **Enrollment** tab, and then click **Add a policy** to add an enrollment policy targeted at your new group. Configure the following fields, and then click **Create Policy**:
    * **Policy name**: Any name for this policy, for example, "Passwordless enrollment"
    * **Assign to Groups**: Your new group, "Passwordless users"
    * **Email** authenticator: Set to required
    * **Password** authenticator: Set to disabled
1. Add a rule name, for example, "Passwordless enrollment rule", and click **Create rule** to complete the enrollment policy setup.
1. Click **Authentication Policies** and assign your sample app to a one-factor authentication policy, if it's not already. In the policy, click **Add rule**, and make the following configurations and then click **Save**:
    * **Rule name**: Any name for this rule, for example, "Passwordless authentication rule"
    * **User's group membership includes**: Your new group, "Passwordless users"
    * **User must authenticate with**: Any one factor type or IdP
1. Click **Global Session Policy** and click **Add policy**. Give the policy a name, for example, "Global Passwordless policy", and assign the policy to your new group, "Passwordless users". Click **Create policy and add rule**.
1. Configure the following fields in the **Add rule** dialog and then click **Create rule**:
    * **Rule name**: Any name for this rule, for example, "Global Passwordless rule"
    * **Establish the session with**: Any factor used to meet the Authentication Policy requirements

Test the new configurations by signing in to your sample app with a user added to your "Passwordless users" group:

1. Start your app. On the Okta sign-in page, add the email address of your test user. Notice that there’s no password field on the page.
1. Add the email address for your test user and click **Next**.
1. Click the **Send me an email** link to receive a verification email.
1. Open the email and use either the verification code or the email link to verify the user. The user is signed in to your sample app without a password.

<!-- ## Use Cases - Review these headings for future content

* Retrofitting
* Centralized login
* Utility application

## Next steps

Explain what Okta doesn't cover, for example, handling routes, authentication per route, and so on. Okta didn't want to build our own SPA framework to show you how to do all this. Just basic sign-in. But point them to the other guides for plenty of examples of handling this.

Sign-out - App vs Okta global session
Sign-in policy
Recovery
Sign-up

Talk about session management, and what happens when the page is refreshed. (To decide: app manages the session or uses the "built-in token manager".-->

## See also

* [Sign in to SPA](/docs/guides/sign-into-spa-redirect/angular/main/)
* [Redirect auth in the sample app](https://developer.okta.com/docs/guides/sampleapp-oie-redirectauth/angular/main/)
* [Auth JS fundamentals](/docs/guides/auth-js/main/)
* [OAuth 2.0 and OpenID Connect overview](/docs/concepts/oauth-openid/)
