---
title: Device Context Overview
---

<div class="oie-embedded-sdk">

<ApiLifecycle access="ie" /><br>

Enable a new device rule for your org's app sign-in policy.

---
#### Learning outcomes

* Send a unique device ID to the Okta servers with a custom HTTP request header.
* Understand how device context enables Adaptive Multifactor Authentication (AMFA).

#### What you need

* <StackSnippet snippet="whatyouneedsdk" />
* <StackSnippet snippet="whatyouneedorg" />

#### Sample code

<StackSnippet snippet="samplecode" />

---

## Overview

Server-side web apps can use the `X-Device-Token` custom HTTP request header to send a user's device ID to an Okta org. The ID must meet the following criteria:

* Length of 32 characters or less
* Identifies the specific user device
* Unique across all devices

For server-side apps using an embedded SDK, developers must create the ID and assign it to the `X-Device-Token` header. The ID informs two features within an org that flag "a request is coming to the org from a new device":

* [Device Context](https://help.okta.com/okta_help.htm?type=oie&id=ext-devcontext-main)
* [Behavior Detection](https://help.okta.com/okta_help.htm?type=oie&id=ext-about-behavior-detection)

Administrators can write app sign-in policy rules for sign-in requests from a new device using the **new device behavior**. The following diagram shows this flow:

<div class="full">

![A flow diagram showing how the new device behavior works](/img/advanced-use-cases/device-context-new-behavior-flow.png)

</div>

> **Note:** Find your org's definition of **New Device** in your Admin Console under **Security** > **Behavior Detection**.

## Update your app to send an X-Device-Token header

<StackSnippet snippet="integrationsteps" />

## Adaptive Multifactor Authentication example

Apps with an Adaptive Multifactor Authentication (AMFA) policy prompt users for a different number of authentication factors based on several criteria:

* Location: Where are they signing in from?
* New device: Are they signing in from a managed or known device?
* Network: Are they signing in from a safe network?
* Travel: Are they signing in from a new location?
* What groups does the user belong to?
* Are they signing in through SSO?

For example, a user signing in to your website from a new device or new country may signal a risky situation. Requiring more authenticators&mdash;email, phone SMS, or biometrics&mdash;gives extra identity assurance in these circumstances.

In this example, you implement a simple AMFA policy requiring two authentication factors from new devices and only one factor from known devices. The following diagram illustrates this flow:

<div class="full">

![Flow diagram showing how adaptive multifactor authentication works for new devices](/img/advanced-use-cases/device-context-adaptive-mfa-flow.png)

</div>

Follow these steps to enable this AMFA policy in your app:

1. Update your app to send the `X-Device-Token` header to your org.
2. Update or create a new global session policy to require a second authentication factor for sign-in requests from new devices.
3. Update or create an app sign-in policy for your app to require and identify a second authentication factor for new devices.

> **Note**: For testing purposes, create policies rather than adding AMFA rules to your existing policies.

### Create a new global session policy for AMFA

1. Open the **Admin Console** for your org.
2. Choose **Security** > **Global Session Policy** to show the available global session policies.
3. Click **Add Policy**.
4. Set a **Policy Name**. Example: New device AMFA Policy
5. Set **Assign to Groups** to your target user groups. Example: Test Users
6. Click **Create Policy and Add Rule** to save the new policy.

After creating the policy, the **Add Rule** dialog appears.

1. Set a **Rule Name**. Example: New device AMFA Rule
2. Set **Behavior is** to **New Device**. This is where the `X-Device-Token` header is selected.
3. Set **Establish the user session with** to **A password**.
4. Set **Multifactor authentication (MFA) is** to **Required**.
5. Set **Establish the user session with** to **A password**.
6. Verify that **Users will be prompted for MFA** is set to **At every sign-in**.
7. Click **Create Rule** to create the rule.

These rules declare the following:

* That every user starts the sign-in process with a password.
* That if "New device" is true, a second authentication factor is required, and users are prompted as such for each sign-in process.

> **Note**: See [Add a global session policy rule](https://help.okta.com/okta_help.htm?type=oie&id=ext-add-okta-sign-on-policy-rule) to learn how the different MFA settings interact.

### Create an app sign-in policy for AMFA

Create an app sign-in policy for your app. It must contain two rules that state the following:

1. By default, users authenticate with a username and password only.
2. If the user is using a new device, require a second authentication factor.

First, create the policy.

1. Open the **Admin Console** for your org.
2. Choose **Security** > **Authentication policies** > **App sign-in policies** to show the available app sign-in policies.
3. Click **Create policy**.
4. Set a **Policy Name**. Example: AMFA test policy
5. Click **Save**.

Set the catch-all rule to require only the username and password by default.

1. Locate the **Catch-all Rule** for the new policy and select **Actions** > **Edit**.
2. Set **Access is** to **Allowed after successful authentication**, if it isn't already.
3. Set **User must authenticate with** to **Password**.
4. Click **Save**.

Add a rule that requires an additional authenticator when signing in from a new device.

1. Click **Add rule** on the **Rules** tab for your new policy.
2. Set a **Rule Name**; for example, "Second factor for new device."
3. Set **The following custom expression is true** to `security.behaviors.contains("New Device")`.
4. Verify that **User must authenticate with** is set to **Password + Another factor**.
5. Verify that the box under **Additional factor types** contains at least one other factor type. Example: email or Okta Verify
6. Click **Save**.
7. Select the **Applications** tab for your newly created policy and click **Add App**.
8. Find your app in the list and click **Add** next to it.
9. Click **Close**.
10. Verify the **Applications** tab of the new policy lists the new app.

> **Note**: For more about the expression used in step 3, see the [Okta Expression Reference Guide](/docs/reference/okta-expression-language-in-identity-engine/#security-context).

## See also

<StackSnippet snippet="relatedusecases" />

</div>
