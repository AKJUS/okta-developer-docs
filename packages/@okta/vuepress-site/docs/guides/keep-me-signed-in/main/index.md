---
title: Configure Keep Me Signed In (KMSI)
excerpt: How to configure pre-authentication and post-authentication KMSI and customize KMSI UI components
layout: Guides
---

<ApiLifecycle access="ie" />

This guide describes how to use the [Policies API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/) to configure the Keep Me Signed In (KMSI) feature. It also describes how to use the [Brands API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/CustomPages/#tag/CustomPages/operation/replaceCustomizedSignInPage) to customize the KMSI sign-in prompts.

> **Note:** This document is only for Okta Identity Engine. See [Identify your Okta solution](https://help.okta.com/okta_help.htm?type=oie&id=ext-oie-version) to determine your Okta version.

---

#### What you need

* [Okta Integrator Free Plan org](https://developer.okta.com/signup)
* [Groups created](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Group/) in your org
* [Custom URL domain](/docs/guides/custom-url-domain/main/) for customization work

---

## About Keep me signed in (KMSI)

Keep me signed in (KMSI) is a usability feature that reduces sign-in friction on remembered devices. Users who select **Keep me signed in** are exempt from subsequent MFA prompts until their MFA lifetime expires or their browser cookies are cleared. Enable the feature only if you accept the security risks of MFA exemptions, and encourage your users to only select KMSI on trusted devices.

You can configure the feature so that the KMSI prompt is displayed before or after users authenticate:

* In standard authentication flows, users go directly to an app or your org's sign-in page and enter their credentials. Configure pre-authentication KMSI if you want to display the prompt on the Sign-In Widget when they enter their credentials. Configure post-authentication KMSI if you want them to see the prompt after their authentication is complete.
* In delegated authentication flows, users bypass the Sign-In Widget and sign in with an identity provider. Configure post-authentication KMSI for these users, so that the KMSI option appears after they authenticate and are redirected back to Okta.
* Customize the post-authentication prompt text for your users.

### User experience

In a pre-authentication KMSI flow, users select **Keep me signed in** when they enter their username in the Sign-In Widget. Then they provide MFA to complete their authentication.

In a post-authentication KMSI flow, users who go to your org's sign-in page may be redirected to an identity provider before they can select **Keep me signed in**. After authenticating, these users select **Stay signed in** when they're redirected back to Okta.

In either case, users who select **Keep me signed in** are remembered on their device for the duration set in your authentication policy.

They can manually reset the KMSI prompt and clear all sessions in their account settings menu by doing the following:

- In the End-User Dashboard, go to **Settings**.
- Under **End All Sessions**, click **Sign out**. The next time the user accesses your org, the **Keep me signed** in option appears.

## Configure pre-authentication KMSI

Pre-authentication KMSI is enabled in the Organization Security settings of the Admin Console. Once enabled, it's available to all users in your org.

It uses the [MFA lifetime](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/replacePolicyRule!path=4/actions/signon/session&t=request) from your [global session policy](/docs/guides/configure-signon-policy/main/#global-session-policies). You also need to update the [authentication policy](/docs/guides/configure-signon-policy/main/#authentication-policies) for all apps where you want to allow KMSI.

If you want to configure pre-authentication KMSI using the Admin Console, see [Keep me signed in](https://help.okta.com/okta_help.htm?type=oie&id=ext-stay-signed-in).

### Enable the feature

1. In the Admin Console, go to **Security** > **General**.
1. In the **Organization Security** section, click **Edit**.
1. Enable the setting to **Show option to stay signed in before users sign in**.
1. Click **Save**.

### Create a global session policy

You can use the Polices API to create a policy or update an existing one. See [Create a policy](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/createPolicy).

To create a policy, send a POST request to the `/api/v1/policies` endpoint. Include the following:

* Set the value of the `activate` query parameter to `true`.
* Provide a value for `name`.
* Set the value of `type` to `OKTA_SIGN_ON`.
* Set `people.groups.include` to the value of a group in your org.

```bash
curl --location 'https://{yourOktaDomain}/api/v1/policies?activate=true' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--header 'Authorization: SSWS ••••••' \
--data '{
  "description": "Sets the MFA lifetime",
  "name": "KMSI",
  "priority": 2,
  "status": "ACTIVE",
  "system": true,
  "type": "OKTA_SIGN_ON",
  "conditions": {
    "people": {
        "groups": {
            "include": [
                "{groupId}"
                ]
            }
        }
    }
}'
```

### Create a global session policy rule

Create a rule with two conditions:

* Require multifactor authentication (MFA).
* Prompt users for MFA after its lifetime expires for the device cookie.

To create a policy rule, send a POST request to the `/api/v1/policies/{policyId}/rules` endpoint. See [Create a policy rule](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/createPolicyRule).

Include the following:

* Set the value of `policyId` to that of the policy you created in [Create a global session policy](#create-a-global-session-policy).
* Provide a value for `id`.
* Set the value of `type` to `SIGN_ON`.
* In the `singon` object, set the following values:
  * `access`: `ALLOW`
  * `factorPromptMode`: `DEVICE`
  * `requireFactor`: `true`
  * `primaryFactor`: `PASSWORD_IDP_ANY_FACTOR`

> **Note:** If you set the `maxSessionLifetimeMinutes` value using the API, you can't exceed that maximum in the Admin Console. Setting a value over the API maximum results in an error.

```bash
--data '{
"type": "SIGN_ON",
"status": "ACTIVE",
"name": "KMSI modify policy",
"conditions": {
"network": {
"connection": "ANYWHERE",
"include": []
},
"authContext": {
"authType": "ANY"
}
},
"actions": {
    "signon": {
        "access": "ALLOW",
        "factorLifetime": "200",
        "factorPromptMode": "DEVICE",
        "primaryFactor": "PASSWORD_IDP_ANY_FACTOR",
        "requireFactor": true
}
}
}
'
```

### Create an authentication policy rule

Create an authentication policy rule for every app where you want to allow KMSI. See [Create a policy rule](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/createPolicyRule).

Add two conditions:

* Require two factor types.
* Prompt users for authentication when an Okta global session doesn't exist.

Send a POST request to the `/api/v1/policies/{policyId}/rules` endpoint. Include the following:

* Include the `policyId` of the authentication policy.
* Provide a value for `id`.
* Set the value of `type` to `ACCESS_POLICY`.
* In the `appSignOn` object, set the following values:
  * `factorMode`: `2FA`
  * `reauthenticateIn`: `PT43800H`

See [Create a global session policy rule](#create-a-global-session-policy-rule).

## Configure post-authentication KMSI

Post-authentication KMSI is set at the app level in an authentication policy, so you can configure it on a per-app basis. First, you need to modify your default global session policy so that your intended KMSI duration is observed.

### Modify your global session policy

You can use the Polices API to update the rules of your default global session policy. See [Replace a policy rule](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/replacePolicyRule).

In a PUT request to the `/api/v1/policies/{policyId}/rules/{ruleId}` endpoint, include the following:

* Set the value of `policyId` to that of your default global session policy. See [List all policies](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/listPolicies).
* Set the value of `ruleId` to that of the default rule of your global session policy.
* Set the value of `type` to `SIGN_ON`.
* In the `signon` object, set the following values:
  * `access`: `ALLOW`
  * `requireFactor`: `false`
  * `primaryFactor`: `PASSWORD_IDP_ANY_FACTOR`
* In the `session` object, set the following:
  * `maxSessionLifetimeMinutes`: `0`
  * `maxSessionIdleMinutes`: `120`
  * `userPersistentCookie`: `false`

```bash
"actions": {
  "signon": {
    "access": "ALLOW",
    "requireFactor": false,
    "primaryFactor": "PASSWORD_IDP_ANY_FACTOR",
    "session": {
      "usePersistentCookie": false,
      "maxSessionIdleMinutes": 120,
      "maxSessionLifetimeMinutes": 0
    }
  }
},
```

### Update an authentication policy for post-authentication KMSI

In a PUT request to the `/api/v1/policies/{policyId}/rules/{ruleId}` endpoint, include the following:

* In the `appSignOn` object, set `access` to `ALLOW`.
  * In the `keepMeSignedIn` object, set the following:
    * `postAuth` to `ALLOWED`
    * `postAuthPromptFrequency` to `PT168H` (Java ChronoUnit `enum` for 7 days).
  * In the `verificationMethod` object, set the following:
    * Set `type` to `ASSURANCE`.
    * Set the `constraints` object to those that your org requires. See [constraints](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/replacePolicyRule!path=0/actions/appSignOn/verificationMethod/0/constraints&t=request).
    * Set `factorMode` to `2FA`.
    * Set `reauthenticateIn` to `PT168H` (Java ChronoUnit `enum` for 7 days).

```bash
"actions": {
  "appSignOn": {
      "access": "ALLOW"
    },
      "keepMeSignedIn": {
        "postAuth": "ALLOWED",
        "postAuthPromptFrequency": "PT168H"
    },
      "verificationMethod": {
            "contraints": [],
            "factorMode": "2FA",
            "reauthenticateIn": "PT168H",
            "type": "ASSURANCE"
    },
  }
```

See [Replace a policy rule](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/replacePolicyRule).

## Customize post-authentication sign-in prompts

For each [brand](/docs/concepts/brands/) in your org (by `brandId`), you can customize the post-authentication prompt text, including the following:

* Title
* Subtitle
* Accept button
* Reject button

In a PUT request to the `/api/v1/brands/{brandId}/pages/sign-in/customized` endpoint, include the following in a `postAuthKeepMeSignedInPrompt` object:

* `title`: `Stay signed in?`
* `subtitle`: `Make your selection below`
* `acceptButtonText`: `Accept`
* `rejectButtonText`: `Reject`

```bash
"postAuthKeepMeSignedInPrompt": {
  "title": "Stay signed in, my friend?",
  "subtitle": "Make your selection below",
  "acceptButtonText": "Test accept",
  "rejectButtonText": "Test reject"
}
```

## Reset KMSI in your org

You can reset KMSI for an individual user and clear all of their sessions.

> **Note:** All remembered factors for the user are forgotten. The user is prompted for multifactor authentication (MFA) and KMSI when they next log in.

In a DELETE request to the `/api/v1/users/{userId}/sessions` endpoint, include the `userId` of the individual user:

```bash
curl -i -X DELETE \
  'https://subdomain.okta.com/api/v1/users/{userId}/sessions?oauthTokens=false' \
  -H 'Authorization: YOUR_API_KEY_HERE'
  ```

You can also reset KMSI in the Admin Console:

1. In the Admin Console, go to **Directory** > **People**.
1. Select the user.
1. In the **More Actions** menu, select **Clear User Sessions**.
1. Click **Clear Sessions & Revoke Tokens**.

The next time the user accesses your org, the **Keep me signed in** option appears.
