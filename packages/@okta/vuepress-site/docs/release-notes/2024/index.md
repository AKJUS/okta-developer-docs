---
title: Okta Classic Engine API release notes 2024
---

# Okta Classic Engine API release notes (2024)

## December

### Weekly release 2024.12.1

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Entitlement claims is self-service EA in Preview](#entitlement-claims-is-self-service-ea-in-preview)| January 2, 2025 |
| [Bugs fixed in 2024.12.1](#bugs-fixed-in-2024-12-1)| January 2, 2025 |

#### Entitlement claims is self-service EA in Preview

You can now enrich tokens with app entitlements that produce deeper integrations. After you configure this feature for your app integration, use the [Okta Expression Language in Identity Engine](/docs/reference/okta-expression-language-in-identity-engine/#reference-attributes) to add entitlements at runtime as OpenID Connect claims and SAML assertions. See [Federated claims with entitlements](/docs/guides/federated-claims/main/). <!-- FEDERATED_CLAIM_GENERATION_LAYER https://oktainc.atlassian.net/browse/OKTA-847041 -->

#### Bugs fixed in 2024.12.1

* Several API requests returned incorrect errors if the path parameters `userId` or `schemaId` included UTF8MB4 characters. (OKTA-447370)

* The [List all Devices](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserResources/#tag/UserResources/operation/listUserDevices) for a user endpoint wasn't listed in the [User Resources](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserResources/#tag/UserResources) API reference. (OKTA-639917)

* Updating the label of an OpenID Connect app sometimes resulted in an incorrect label appearing in the System Log events. (OKTA-816204)

* An `Invalid Phone Number` error sometimes appeared during SMS factor enrollment. (OKTA-842270)

### Monthly release 2024.12.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Restrict access to the Admin Console is EA in Preview](#restrict-access-to-the-admin-console-is-ea-in-preview) | December 11, 2024 |
| [New skipping of entitlement sync during import of a user Systems Log event](#new-skipping-of-entitlement-sync-during-import-of-a-user-systems-log-event) | December 11, 2024 |
| [Create dynamic resource sets with conditions is EA in Production](#create-dynamic-resource-sets-with-conditions-is-ea-in-preview) |  November 7, 2024 |
| [System Log event for emails added to the bounced email list](#system-log-event-for-emails-added-to-the-bounced-email-list) | December 11, 2024 |
| [Granular account linking for certain Identity Providers is self-service EA](#granular-account-linking-for-certain-identity-providers-is-self-service-ea) | December 11, 2024 |
| [Request access option removed from the OIN Manager](#request-access-option-removed-from-the-oin-manager) | December 11, 2024 |
| [SCIM documentation link updated in the OIN Wizard](#scim-documentation-link-updated-in-the-oin-wizard) | December 11, 2024 |
| [Use case selection in the OIN Wizard](#use-case-selection-in-the-oin-wizard) | December 11, 2024 |
| [Industry term update in the OIN catalog](#industry-term-update-in-the-oin-catalog) | December 11, 2024 |
| [Developer documentation updates in 2024.12.0](#developer-documentation-updates-in-2024-12-0) | December 11, 2024 |
| [Bug fixed in 2024.12.0](#bug-fixed-in-2024-12-0) | December 11, 2024 |

#### Restrict access to the Admin Console is EA in Preview

By default, users and groups with assigned admin roles have access to the Admin Console app. With this feature, super admins can choose to manually assign the app to delegated admins instead. This is recommended for orgs with admins who don't need access, like business partners, third-party admins, or admins who only use the Okta API. See [Configure administrator settings](https://help.okta.com/okta_help.htm?type=oie&id=administrator-settings) and the corresponding APIs: [Retrieve the Okta Admin Console assignment setting](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OrgSettingAdmin/#tag/OrgSettingAdmin/operation/getAutoAssignAdminAppSetting) and [Update the Okta Admin Console assignment setting](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OrgSettingAdmin/#tag/OrgSettingAdmin/operation/updateAutoAssignAdminAppSetting). <!-- OKTA-717742 ADMIN_APP_AND_ROLE_DECOUPLING -->

#### New skipping of entitlement sync during import of a user Systems Log event

A new System Log event has been added to indicate when an entitlement was skipped while importing a user. <!--OKTA-828548-->

#### Create dynamic resource sets with conditions is EA in Production

Resource set conditions help you limit the scope of a role by excluding an admin's access to certain apps. This gives you more granular control over your custom admin roles and helps meet your org's unique security needs. See [Resource set conditions](https://help.okta.com/okta_help.htm?type=oie&id=resource-set-conditions) and the corresponding [Resource Set Resources](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/RoleCResourceSetResource/) API. <!-- OKTA-746719 DYNAMIC_RESOURCE_SETS -->

#### System Log event for emails added to the bounced email list

A System Log `system.email.bounce.removal` event is now triggered when an API request is made to [remove bounced emails](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/EmailCustomization/#tag/EmailCustomization/operation/bulkRemoveEmailAddressBounces) (`POST /org/email/bounces/remove-list`). This request sends a list of emails to a third-party email service to remove the emails from the bounce list. The event is triggered when the API request is made. The event doesn't indicate when the emails are actually removed by the third-party email service. <!--OKTA-807544 OKTA-754648 -->

#### Granular account linking for certain Identity Providers is self-service EA

When admins link users from SAML and OIDC Identity Providers, they can now exclude specific users and admins. This improves security by allowing admins to configure granular access control scenarios. See **Add an external Identity Provider** for [OpenId Connect](/docs/guides/add-an-external-idp/openidconnect/main/#create-an-identity-provider-in-okta) and [SAML 2.0](/docs/guides/add-an-external-idp/saml2/main/#create-an-identity-provider-in-okta). <!-- EXTENDED_ACCOUNT_LINKING_FILTERS OKTA-831244-->

#### Request access option removed from the OIN Manager

You can no longer request access to your org's OIN Manager account with the **Request Access** button from the OIN Manager access-denied error page. If you need access to your org's OIN Manager, contact your Okta admin to grant you the appropriate permissions. <!--OKTA-840117-->

#### SCIM documentation link updated in the OIN Wizard

The link to learn more about submitting a SCIM 2.0 protocol integration in the OIN Wizard has been updated to [OIN Wizard for SCIM](/docs/guides/submit-oin-app/scim/main/). <!--OKTA-839604-->

#### Use case selection in the OIN Wizard

Independent software vendors (ISVs) can now select the following use case categories when they submit their integration to the Okta Integration Network (OIN):

* Zero Trust
* Identity Verification
* Identity Governance and Administration (IGA)

See [Use case guidelines for the OIN Wizard](/docs/guides/submit-app-prereq/main/#use-case-guidelines). <!--OKTA-694701-->

#### Industry term update in the OIN catalog

The **NGO** industry term has been updated to **Nonprofit Organizations** in the [Okta Integration Network (OIN) catalog](https://www.okta.com/integrations). All published integrations with the **NGO** designation now have the **Nonprofit Organizations** designation.
<!--OKTA-746769-->

#### Developer documentation updates in 2024.12.0

* The [Custom email notifications guide](/docs/guides/custom-email/main/#use-functions-for-email-templates), under **Brand and Customize**, now provides examples of how to use functions for email templates. Email functions allow you to normalize the dynamic output of variables. For example, you can return the substring after the `@` character or convert content from uppercase to lowercase. <!--OKTA-797547-->
* SCIM integrations can no longer be submitted through the OIN Manager. They can only be submitted through the OIN Wizard. See [SCIM in the OIN Wizard](/docs/guides/submit-oin-app/scim/main/). Instructions for submitting a SCIM 2.0 integration have been removed from the [OIN Manager guide](/docs/guides/submit-app/). <!--OKTA-809675-->

#### Bug fixed in 2024.12.0

* A "subDomain: An object with this field already exists" error occurred when an admin tried to create a child org. (OKTA-824438)

## November

### Weekly release 2024.11.2

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bugs fixed in 2024.11.2](#bugs-fixed-in-2024-11-2)| December 4, 2024 |

#### Bugs fixed in 2024.11.2

* Query parameters that were improperly passed to OAuth 2.0 endpoints like `/token` and `/introspect` were sometimes present in the System Log. (OKTA-833878)

* When a request to list app refresh tokens was made, pagination links weren't included in the response header. (OKTA-796989)

* A GET user request for newly created users in the `staged` status sometimes returned incorrect `activated` and `statusChanged` values. (OKTA-827818)

### Monthly release 2024.11.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Create dynamic resource sets with conditions is EA in Preview](#create-dynamic-resource-sets-with-conditions-is-ea-in-preview) | November 7, 2024 |
| [Give access to Okta Support is GA in Production](#give-access-to-okta-support-is-ga-in-production) | November 7, 2024 |
| [Seamless ISV experience for SCIM is GA in Production](#seamless-isv-experience-for-scim-is-ga-in-production) | October 9, 2024 |
| [Test app integrations in the OIN Wizard](#test-app-integrations-in-the-oin-wizard) | November 7, 2024 |
| [Bugs fixed in 2024.11.0](#bugs-fixed-in-2024-11-0)| November 7, 2024 |

#### Create dynamic resource sets with conditions is EA in Preview

Resource set conditions help you limit the scope of a role by excluding an admin's access to certain apps. This gives you more granular control over your custom admin roles and helps meet your org's unique security needs. See [Resource set conditions](https://help.okta.com/okta_help.htm?type=oie&id=resource-set-conditions) and the corresponding [Resource Set Resources](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/RoleCResourceSetResource/) API. <!-- DYNAMIC_RESOURCE_SETS (OKTA-746719) -->

#### Give access to Okta Support is GA in Production

Admins can now control how members of the Okta Support team access their org. To support this, the Admin Console **Account** page provides the following two options:

* **Impersonation Grants for Cases**: Allows the Okta Support team to sign in to your org as a read-only admin to troubleshoot issues.

* **Support User Grants for Self-Assigned Cases**: Allows an Okta Support representative to access your org settings after they’ve opened a case.

Using these settings, admins can select the right level of Support access for their org. See [Give access to Okta Support](https://help.okta.com/okta_help.htm?type=oie&id=settings-support-access) and the corresponding Okta Support Settings API endpoints:

* [List all Okta Support cases](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OrgSettingSupport/#tag/OrgSettingSupport/operation/getOrgOktaSupportSettings)

* [Update an Okta Support case](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OrgSettingSupport/#tag/OrgSettingSupport/operation/updateOktaSupportCase)

You can no longer use the [Extend](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OrgSettingSupport/#tag/OrgSettingSupport/operation/extendOktaSupport), [Grant](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OrgSettingSupport/#tag/OrgSettingSupport/operation/grantOktaSupport), or [Revoke](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OrgSettingSupport/#tag/OrgSettingSupport/operation/revokeOktaSupport) Okta Support access endpoints if you haven't used them between September 1, 2024 and November 1, 2024. These endpoints will be fully deprecated on January 15, 2025. After deprecation, you won’t be able to access them. Use the [Update an Okta Support case](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OrgSettingSupport/#tag/OrgSettingSupport/operation/updateOktaSupportCase) endpoint to approve, revoke, and extend Okta Support access for each support case. <!-- OKTA_SUPPORT_IMPERSONATION_GRANTS (OKTA-822280) -->

#### Seamless ISV experience for SCIM is GA in Production

Okta now provides a seamless ISV experience to optimize the [Okta Integration Network (OIN)](https://www.okta.com/integrations/) submission experience for SCIM integrations. This new experience enables independent software vendors (ISVs) to build and manually test their SCIM integration metadata before submission to the OIN. This reduces the time needed for the OIN team to review and validate that the SCIM integration functions as intended, which shortens the time to publish in the OIN. This experience also incorporates communication processes in Salesforce, enabling improved collaboration internally within Okta teams and externally with ISVs. See [Publish an OIN integration overview](/docs/guides/submit-app-overview/) and [Submit an integration with the OIN Wizard](/docs/guides/submit-oin-app/scim/main/) guide.

#### Test app integrations in the OIN Wizard

You can now test your app integration directly from the **Your OIN Integrations** dashboard. Previously, you had to go through the OIN Wizard submission journey to arrive at the **Test integration** experience page. You can now bypass the **Select protocol**, **Configure your integration**, and **Test your integration** pages for an existing submission, and start generating instances for testing in the **Test integration** page. This saves you time and avoids unnecessary updates to an existing integration submission. See [Navigate directly to test your integration](/docs/guides/submit-oin-app/openidconnect/main/#navigate-directly-to-test-your-integration). <!-- OKTA-804076-->

#### Bugs fixed in 2024.11.0

* The apps API didn't reveal information about SAML encryption configuration. (OKTA-801368)

* Admins who only had the **View applications and their details** and **Run imports** permissions could deactivate apps. (OKTA-798693)

## October

### Weekly release 2024.10.1

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [IP Exempt Zone is self-service EA in Preview](#ip-exempt-zone-is-self-service-ea-in-preview)| October 23, 2024 |
| [OpenID Connect Identity Providers now support group sync](#openid-connect-identity-providers-now-support-group-sync)| October 23, 2024 |
| [Bugs fixed in 2024.10.1](#bugs-fixed-in-2024-10-1)| October 23, 2024 |

#### IP Exempt Zone is self-service EA in Preview

This feature introduces `useAsExemptList` as a read-only Boolean property that distinguishes the new default IP exempt zones from other zones. When you enable this feature and you make a GET `api/v1/zones` request, Okta returns `useAsExemptList` in the response. The value `true` indicates that the zone is an exempt zone. Only system generated exempt zones are available. <!-- DEFAULT_NETWORK_ZONE_IP_EXEMPT_LIST (OKTA-795812) -->

#### OpenID Connect Identity Providers now support group sync

OpenID Connect Identity Providers now support full group sync and adding a user to a group that they don't already belong to. A user who authenticates with an external IdP is added to all available groups when **Full sync of groups** is enabled. The user is added to any groups that they don't already belong to when **Add user to missing groups** is enabled. This allows you to specify certain groups that users should be added to. <!-- GROUP_SYNC_FEATURE_OIDC_IDP_ENABLED (OKTA-817450) -->

#### Bugs fixed in 2024.10.1

* No System Log event occurred when the Interaction Code grant flow failed due to no matching policy on the authorization server. (OKTA-795711)

* User grants weren't returned from the Users API (`/users/{userId}/clients/{clientId}/grants`) after revoking refresh tokens. (OKTA-808977)

* The SAML IdP metadata sometimes returned the variable name as the attribute name. (OKTA-811786)

### Monthly release 2024.10.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [New field for filtering zones](#new-field-for-filtering-zones) | October 9, 2024 |
| [OIDC Identity Provider options](#oidc-identity-provider-options) | October 9, 2024 |
| [Two System Log event types now provide event outcome reasons](#two-system-log-event-types-now-provide-event-outcome-reasons) | October 9, 2024 |
| [Seamless ISV experience for SCIM is GA in Preview](#seamless-isv-experience-for-scim-is-ga-in-preview) | October 9, 2024 |
| [New Okta Secure Identity collection in the OIN catalog](#new-okta-secure-identity-collection-in-the-oin-catalog) | October 9, 2024 |
| [Enhanced Dynamic Network Zones is GA in Production](#enhanced-dynamic-network-zones-is-ga-in-production) | May 15, 2024 |
| [Developer documentation updates in 2024.10.0](#developer-documentation-updates-in-2024-10-0) | October 9, 2024 |
| [Bugs fixed in 2024.10.0](#bugs-fixed-in-2024-10-0)| October 9, 2024 |

#### New field for filtering zones

The `system` field is now available for the `filter` [Network Zones query parameter](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/NetworkZone/#tag/NetworkZone/operation/listNetworkZones!in=query&path=filter&t=request), in addition to the `id` and `usage` fields. The values supported are `true` or `false`.

#### OIDC Identity Provider options

OpenID Connect Identity Providers can now have both the Account Link and JIT policies set to `disabled`.

#### Two System Log event types now provide event outcome reasons

The `Event.Outcome.Reason` field for the `user.authentication.auth_via_IDP` and `user.authentication.auth_via_social` [event types](https://developer.okta.com/docs/reference/api/event-types/) now indicates whether a successful IdP sign-in flow was due to JIT provisioning or account linking. <!-- (OKTA-808605) -->

#### Seamless ISV experience for SCIM is GA in Preview

Okta now provides a seamless ISV experience to optimize the [Okta Integration Network (OIN)](https://www.okta.com/integrations/) submission experience for SCIM integrations. This new experience enables independent software vendors (ISVs) to build and manually test their SCIM integration metadata before submission to the OIN. This reduces the time needed for the OIN team to review and validate that the SCIM integration functions as intended, which shortens the time to publish in the OIN. This experience also incorporates communication processes in Salesforce, enabling improved collaboration internally within Okta teams and externally with ISVs. See [Publish an OIN integration overview](https://developer.okta.com/docs/guides/submit-app-overview/) and [Submit an integration with the OIN Wizard](https://developer.okta.com/docs/guides/submit-oin-app/scim/main/) guide. <!-- SCIM_SUBMISSION -->

#### New Okta Secure Identity collection in the OIN catalog

A new Okta Secure Identity collection is available in the Okta Integration Network (OIN) catalog. This collection identifies integrations that are part of the [Okta Secure Identity commitment](https://www.okta.com/secure-identity-commitment/). See the [OIN catalog](https://www.okta.com/integrations/?category=okta-secure-identity) for a list of integrations assigned to this collection.

#### Enhanced Dynamic Network Zones is GA in Production

Use enhanced dynamic network zones to define IP service categories (proxies, VPNs), locations, and Autonomous System Numbers (ASNs) that are allowed or blocked in a zone. See the [Network Zones API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/NetworkZone/). <!--ENHANCED_DYNAMIC_NETWORK_ZONE (OKTA-727934)-->

#### Developer documentation updates in 2024.10.0

* We have expanded and updated our Terraform documentation to cover deeper topics.

  * An expanded **Manage** section with an article on importing existing resources into Terraform and new resources.

    * [Manage device connection requirements using Terraform](/docs/guides/terraform-configure-device-signin-standards/)
    * [Manage custom domains with Terraform](/docs/guides/terraform-manage-multiple-domains/main/)
    * [Manage branding with Terraform](/docs/guides/terraform-manage-end-user-experience/main/) (updated and expanded)

  * An article on making the Terraform connection as secure as possible.

    * [Control Terraform access to Okta](/docs/guides/terraform-design-access-security/main/)

  * Articles to help save time.

    * [Organize your Terraform configuration](/docs/guides/terraform-organize-configuration/main/)
    * [Terraform syntax tips for automation](/docs/guides/terraform-syntax-tips/)

* Our [SDK documentation](https://developer.okta.com/code/) has been refreshed and updated to reflect our modern SDKs and recommended development paths. See **SDKs** in the menu.

<div class="three-quarter">

![Developer docs top menu bar](/img/homepage/SDKs-menu.png)

</div>

#### Bugs fixed in 2024.10.0

* The `okta.oauthIntegrations.manage` OAuth 2.0 authentication scope wasn’t supported for the create an API service integration endpoint (`POST /integrations/api/v1/api-services`).  (OKTA-735510)
* The SAML IdP `login` property mapping validation was handled incorrectly. (OKTA-812517)

## September

### Weekly release 2024.09.3

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bug fixed in 2024.09.3](#bug-fixed-in-2024-09-3)| October 2, 2024 |

#### Bug fixed in 2024.09.3

Sometimes an "Invalid Phone Number" error was incorrectly returned during SMS factor enrollment. (OKTA-807741)

### Weekly release 2024.09.2

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bug fixed in 2024.09.2](#bug-fixed-in-2024-09-2)| September 25, 2024 |

#### Bug fixed in 2024.09.2

When an admin made a partial update using the Profile Mappings API, both incoming data and existing property mappings were validated instead of only the incoming request. (OKTA-798638)

### Monthly release 2024.09.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Descriptions for Entitlement and Role objects](#descriptions-for-entitlement-and-role-objects) | September 11, 2024 |
| [Enhanced Dynamic Network Zones is GA in Preview](#enhanced-dynamic-network-zones-is-ga-in-preview) | May 15, 2024 |
| [Event hook System Log update](#event-hook-system-log-update) | September 11, 2024 |
| [Okta Personal Settings API is GA in Preview](#okta-personal-settings-api-is-ga-in-preview) | September 11, 2024 |
| [System Log events added for Okta Workflows](#system-log-events-added-for-okta-workflows) | September 11, 2024 |
| [Developer documentation update in 2024.09.0](#developer-documentation-update-in-2024-09-0) | September 11, 2024 |
| [Bugs fixed in 2024.09.0](#bugs-fixed-in-2024-09-0)| September 11, 2024 |

#### Descriptions for Entitlement and Role objects

SCIM 2.0 with entitlements now supports a `description` field for Entitlement and Role objects.
<!--OKTA-741183-->

#### Enhanced Dynamic Network Zones is GA in Preview

Use enhanced dynamic network zones to define IP service categories (proxies, VPNs), locations, and Autonomous System Numbers (ASNs) that are allowed or blocked in a zone. See the [Network Zones API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/NetworkZone/). <!--ENHANCED_DYNAMIC_NETWORK_ZONE OKTA-727934-->

#### Event hook System Log update

The `user.account.unlock_by_admin` event type is now event hook eligible. See [Event types](/docs/reference/api/event-types/). <!--OKTA-802486 OKTA-715243-->

#### Okta Personal Settings API is GA in Preview

The [Okta Personal Settings API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/OktaPersonalSettings/) allows you to manage [Okta Personal](https://www.okta.com/products/okta-personal/workforce/) admin settings.

Okta Personal for Workforce is a free account that helps users separate their work apps from non-work apps. Okta Personal makes it easy for users to switch between their personal and work accounts, and to migrate their personal apps from an existing Okta enterprise tenant. When you enable Okta Personal for Workforce in your org, users receive a notification that encourages them to use Okta Personal for personal apps and Okta enterprise for work apps. See [Okta Personal for Workforce user experience](
https://help.okta.com/okta_help.htm?type=oie&id=csh-personal-user-experience). <!--OKTA-794131-->

#### System Log events added for Okta Workflows

The `workflows.user.flow.move` and `workflows.user.table.move` Okta Workflows events have been added to the System Log to record the changes that occur due to reorganization of folder-level resources. <!--OKTA-669131-->

#### Developer documentation update in 2024.09.0

Our [API documentation](https://developer.okta.com/docs/api/) has a new look and feel that features a more logical navigation which aligns with industry standards. See **API Docs** in the menu.

<div class="three-quarter">

![Developer docs top menu bar](/img/homepage/APIDocs-menu.png)

</div>

API content in the **References** section will be moved after September 30, 2024.

#### Bugs fixed in 2024.09.0

* When creating or updating a profile, user first or last names that contained a dot (`last.name`) triggered malformed field error messages. (OKTA-798884)

* Admins couldn't configure the `okta.myAccount.sessions.manage` scope as a custom scope on custom authorization servers. (OKTA-748880)

* The Custom Token Scopes endpoints (`/api/v1/authorizationServers/{authServerId}/scopes`) for the Authorization Server API didn't support pagination. (OKTA-734223)

* Deleted apps weren't removed from routing rules and were returned by calls to the `/policies` endpoint if the call used `IDP_DISCOVERY` as the `type`. (OKTA-734045)

## August

### Weekly release 2024.08.3

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bugs fixed in 2024.08.3](#bugs-fixed-in-2024-08-3)| August 28, 2024 |

#### Bugs fixed in 2024.08.3

* The API request to update the default provisioning connection (`POST /api/v1/apps/{appId}/connections/default?activate=true`) returned generic error messages when the connection update failed. (OKTA-718570)

* A cache issue caused an error when an admin tried to create routing rules using the Policy API (`POST /api/v1/policies/{policyId}/rules`). (OKTA-712397)

* The `q` request parameter was ignored when used in a GET request to the `/policies` endpoint. (OKTA-748131)

### Weekly release 2024.08.2

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Custom domain and custom email domain System Log events updates](#custom-domain-and-custom-email-domain-system-log-events-updates) | August 21, 2024 |
| [Bugs fixed in 2024.08.2](#bugs-fixed-in-2024-08-2) | August 21, 2024 |

#### Custom domain and custom email domain System Log events updates

In the System Log, the `system.custom_url_domain.verify` and `system.email_domain.verify` events now appear when a verification succeeds or fails. <!--OKTA-790610-->

#### Bugs fixed in 2024.08.2

* When `/api/v1/principal-rate-limits` was called to create or update a principal rate limit for an OAuth app, and a 404 server error was returned, the rate limit was still created or updated. (OKTA-652674)

* The `honorPersistentNameId` parameter default setting for SAML IdPs was set to `false` if it was omitted from IdP API requests. (OKTA-791891)

* Some Group API users experienced inconsistent pagination when the `limit` was higher than 200. (OKTA-795107)

### Weekly release 2024.08.1

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bug fixed in 2024.08.1](#bug-fixed-in-2024-08-1) | August 14, 2024 |

#### Bug fixed in 2024.08.1

Requests to list client secrets (`/api/v1/apps/{appId}/credentials/secrets`) and get a client secret (`/api/v1/apps/{appId}/credentials/secrets/{id}`) didn't fire a System Log event when the client secrets were returned in the response. <!-- OKTA-692600 -->

### Monthly release 2024.08.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Extended support for TLS certificates and private keys for custom domains](#extended-support-for-tls-certificates-and-private-keys-for-custom-domains) | August 7, 2024 |
| [Enforce an email verification when a user's email changes](#enforce-an-email-verification-when-a-user-s-email-changes) | August 7, 2024 |
| [New System Log API property for target object is GA Production](#new-system-log-api-property-for-target-object-is-ga-production) | August 7, 2024 |
| [Request throttling for jwks_uri](#request-throttling-for-jwks-uri) | August 7, 2024 |
| [System Log events updates](#system-log-events-updates) | August 7, 2024 |
| [System Log update for requests made with access tokens](#system-log-update-for-requests-made-with-access-tokens) | August 7, 2024 |
| [Updated Universal Directory System Log events](#updated-universal-directory-system-log-events) | August 7, 2024 |
| [Bugs fixed in 2024.08.0](#bugs-fixed-in-2024-08-0) | August 7, 2024 |

#### Extended support for TLS certificates and private keys for custom domains

Custom domains now support TLS certificates and private keys that are 2048, 3072, and 4096 bits. <!--OKTA-730872-->

#### Enforce an email verification when a user's email changes

Each time that a user attempts to update their email, Okta sends an email to verify that their primary or secondary email address is up to date. <!-- OKTA-755687 -->

#### New System Log API property for target object is GA Production

Certain System Log events now contain a new property called `changeDetails` in the `target` object. When this property is populated, it reflects new, changed, or removed attributes of the target resource that's been modified. See [changeDetails property](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/SystemLog/#tag/SystemLog/operation/listLogEvents!c=200&path=target/changeDetails&t=response). <!-- OKTA-724000-->

#### Request throttling for jwks_uri

Okta has decreased the frequency at which it reloads JWKs from a customer's `jwks_uri`. <!--OKTA-739345-->

#### System Log events updates

The following System Log events are now available:

* application.provision.group_push.deactivate_mapping

* system.agent.register

* security.attack_protection.settings.update

* system.self_service.configuration.update

* user.behavior.profile.reset

* system.identity_sources.bulk_upsert

* system.identity_sources.bulk_delete

* system.import.user_match.confirm

* system.import.schedule

* system.import.user_match.unignore

* system.import.user_match.update

* The application.lifecycle.update event now has the sessionIdleTimeoutMinutes and sessionMaxLifetimeMinutes fields. These fields add more session details to the event.

See [Event types](https://developer.okta.com/docs/reference/api/event-types/). <!-- OKTA-713852, OKTA-753583, OKTA-710604, OKTA-750439, OKTA-753780, OKTA-750879, OKTA-750876, OKTA-751223, OKTA-710489, OKTA-755721, OKTA-752579 -->

#### System Log update for requests made with access tokens

The client ID used to get an access token is now included in all System Logs for requests made with that access token. <!-- OKTA-667713-->

#### Updated Universal Directory System Log events

System Log events are generated when the following endpoints are called:

* POST /api/v1/groups/{id}/owners
* DELETE /api/v1/groups/{id}/owners/{ownerId}

* POST /api/v1/meta/types/user/{id}
* PUT /api/v1/meta/types/user/{id}

* PUT /api/v1/users/{id}/linkedObjects/{property}/{value}
* DELETE /api/v1/users/{id}/linkedObjects/{property} <!-- OKTA-710714-->

#### Bugs fixed in 2024.08.0

* Custom IdP profile attribute updates didn't validate the mandatory `externalName` property. (OKTA-690190)

* System Log events from a token exchange request were missing information about the subject and actor tokens. (OKTA-687172)

## July

### Weekly release 2024.07.1

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [New IP service categories added](#new-ip-service-categories-added) | July 17, 2024 |
| [Bugs fixed in 2024.07.1](#bugs-fixed-in-2024-07-1) | July 17, 2024|

#### New IP service categories added

Additional IP service categories have been added to the enhanced dynamic zones [IP service category list](https://help.okta.com/okta_help.htm?id=ext-about-ednz). <!-- OKTA-747047 -->

#### Bugs fixed in 2024.07.1

* If an API request in Preview contained any malformed syntax within the query string, the request was still processed. (OKTA-748246)

* Authenticators returned by GET requests to the `/idp/myaccount/authenticators` and `/idp/myaccount/authenticators/{authenticatorId}` endpoints had the `enrollable` property set to `true`. (OKTA-718177)

### Monthly release 2024.07.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [OIN Submission Tester copy function update](#oin-submission-tester-copy-function-update) | July 10, 2024 |
| [OIN Wizard guidance updates](#oin-wizard-guidance-updates) | July 10, 2024 |
| [Identity Threat Protection with Okta AI is GA in Production](#identity-threat-protection-with-okta-ai-is-ga-in-production) | April 3, 2024 |
| [Network zone allowlists for SSWS API tokens is GA Preview](#network-zone-allowlists-for-ssws-api-tokens-is-ga-preview) | July 10, 2024 |
| [Network Zones and API token restrictions](#network-zones-and-api-token-restrictions) | July 10, 2024 |
| [Read-only admins can't use the Principal Rate Limits API to update API tokens](#read-only-admins-can-t-use-the-principal-rate-limits-api-to-update-api-tokens) | July 10, 2024 |
| [Event hook limit increased](#event-hook-limit-increased) | July 10, 2024 |
| [Active Directory Bidirectional Group Management API is GA in Production](#active-directory-bidirectional-group-management-api-is-ga-in-production) | July 10, 2024 |

#### OIN Submission Tester copy function update

The copy function in the OIN Submission Tester **Network Traffic** results section now provides the option to copy the request step either as a URL or a cURL command. See [Run tests in the OIN Submission Tester](/docs/guides/submit-oin-app/openidconnect/main/#run-tests).
<!--OKTA-679512-->

#### OIN Wizard guidance updates

A new link to the [Okta Documentation](https://developer.okta.com/docs/guides/submit-oin-app/saml2/main/#properties) has been added to the **SAML properties** section of the OIN Wizard. Okta documentation provides guidance on Okta Expression Language usage in SAML properties with integration variables. See [Dynamic properties with Okta Expression Language](https://developer.okta.com/docs/guides/submit-oin-app/saml2/main/#dynamic-properties-with-okta-expression-language).
<!--OKTA-689994-->

#### Identity Threat Protection with Okta AI is GA in Production

Identity Threat Protection with Okta AI is a powerful risk assessment and response solution that provides post-authentication security to your org. By continuously analyzing risk signals that are native to Okta, risk signals from integrated security partner vendors, and your policy conditions, it safeguards orgs against identity attacks that occur during and outside of a user's session. When Identity Threat Protection discovers a risk, it can immediately end the user's sessions, prompt an MFA challenge, or invoke a workflow to restore your org's security posture. Using intuitive dashboard widgets and reports, you can easily monitor security threats as they happen. See [Identity Thread Protection with Okta AI](https://help.okta.com/okta_help.htm?type=oie&id=ext-itp-overview). See the [Shared Signals Framework (SSF) Receiver](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/SSFReceiver/) and [SSF SET](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/SSFSecurityEventToken/) APIs. <!-- OKTA-683707 ENABLE_USER_RISK_CHANGE_EVALUATIONS -->

#### Network zone allowlists for SSWS API tokens is GA Preview

Admins can now specify a network zone allowlist for each static (SSWS) API token. These allowlists define the IP addresses or network ranges from where Okta API requests using SSWS API tokens can be made. This restricts attackers and malware from stealing SSWS tokens and replaying them outside of the specified IP range to gain unauthorized access. <!-- OKTA-691818 SSWS_IP_HARDENING-->

#### Network Zones and API token restrictions

You can no longer update network zones so they're invalid for use with an API token. This applies only to network zones that are used as restrictions to API tokens. You can update network zones if you first remove them from the API token restriction. These zones can't be deactivated, deleted, blocklisted, or made anything other than an active IP zone. <!-- OKTA-736535-->

#### Read-only admins can't use the Principal Rate Limits API to update API tokens

Read-only admins can no longer use the principal rate limits endpoint (`/api/v1/principal-rate-limits/{principalRateLimitId}`) to update the rate limit for their own API tokens. <!-- OKTA-730827-->

#### Event hook limit increased

The limit on active event hooks per org has been increased from 10 to 25. See [Event hooks](/docs/concepts/event-hooks/). <!-- OKTA-741766 -->

#### Active Directory Bidirectional Group Management API is GA in Production

The [Bidirectional Group Management for Active Directory (AD) (Directories Integration) API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/DirectoriesIntegration) allows you to manage AD groups from within Okta. You can add or remove users from groups based on their identity and access requirements. This ensures that changes made to user access in Okta are reflected in AD. When you use Okta Access Certifications to revoke a user's membership to an AD group, the removal is reflected in AD.

Okta can only manage group memberships for users and groups imported into Okta using the AD integration. It isn't possible to manage users and groups that weren't imported through AD integration or are outside the organizational unit's scope for the integration using this feature. <!--AD_BIDIRECTIONAL_GROUP_MANAGEMENT OKTA-734564, OKTA-747631-->

## June

### Weekly release 2024.06.2

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bugs fixed in 2024.06.2](#bugs-fixed-in-2024-06-2)  | July 2, 2024 |

#### Bugs fixed in 2024.06.2

* The List all IdP key credentials API response always included a "next" link header, even if there were no more pages left to return. (OKTA-718352)

* An app created by an API call with an existing `clientId` in the request payload didn't match the way an app was created in the UI. This resulted in the wrong app rate limit displayed in the rate limit dashboard. (OKTA-736117)

* The [oauth2/introspect](https://developer.okta.com/docs/api/openapi/okta-oauth/oauth/tag/CustomAS/#tag/CustomAS/operation/introspectCustomAS) endpoint hit rate limits without logging it in the System Log. (OKTA-744604)

* The number of group members returned from the `/api/v1/groups/{group_id}/users` API call was inconsistent with the database query count of the same group. (OKTA-7747426)

### Weekly release 2024.06.1

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bugs fixed in 2024.06.1](#bugs-fixed-in-2024-06-1)  | June 20, 2024 |

#### Bugs fixed in 2024.06.1

* An error occurred during the device code flow using an external Identity Provider and an inline token hook. (OKTA-733713)

* The `security.breached_credential.detected` System Log event had a typo. (OKTA-736552)

### Monthly release 2024.06.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Active Directory Bidirectional Group Management API is GA in Preview](#active-directory-bidirectional-group-management-api-is-ga-in-preview) | June 5, 2024 |
| [Seamless ISV experience with integrated testing is GA in Production](#seamless-isv-experience-with-integrated-testing-is-ga-in-production) | June 5, 2024 |
| [Your OIN Integrations instruction updates](#your-oin-integrations-instruction-updates) | June 5, 2024 |
| [SCIM 2.0 endpoint call update for user ResourceType requirements](#scim-2-0-endpoint-call-update-for-user-resourcetype-requirements) | June 5, 2024 |
| [Increase to Inline Hooks](#increase-to-inline-hooks) | June 5, 2024 |
| [New attribute to manage SAML app session lifetimes is GA in Preview](#new-attribute-to-manage-saml-app-session-lifetimes-is-ga-in-preview) | June 5, 2024 |
| [Protected actions in the Admin Console is GA in Preview](#protected-actions-in-the-admin-console-is-ga-in-preview) | June 5, 2024 |
| [Developer documentation update in 2024.06.0](#developer-documentation-update-in-2024-06-0) | June 5, 2024 |
| [Bug fixed in 2024.06.0](#bug-fixed-in-2024-06-0) | June 5, 2024 |

#### Active Directory Bidirectional Group Management API is GA in Preview

The [Bidirectional Group Management for Active Directory (AD) API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/DirectoriesIntegration) allows you to manage AD groups from within Okta. You can add or remove users from groups based on their identity and access requirements. This ensures that changes made to user access in Okta are reflected in AD. When you use Okta Access Certifications to revoke a user's membership to an AD group, the removal is reflected in AD.

Okta can only manage group memberships for users and groups imported into Okta using the AD integration. It isn't possible to manage users and groups that weren't imported through AD integration or are outside the organizational unit's scope for the integration using this feature. <!--AD_BIDIRECTIONAL_GROUP_MANAGEMENT OKTA-734564-->

#### Seamless ISV experience with integrated testing is GA in Production

Okta now provides a seamless ISV experience to optimize the [Okta Integration Network (OIN)](https://www.okta.com/integrations/) submission experience for SAML and OIDC integrations. This new experience enables independent software vendors (ISVs) to build and automatically test their integration metadata before submission. This reduces the time needed for the OIN team to review and validate that the integration functions as intended, which shortens the time to publish in the OIN. This experience also incorporates communication processes in Salesforce, enabling improved collaboration internally within Okta teams and externally with ISVs. See [Publish an OIN integration](/docs/guides/submit-app-overview/) overview and [Submit an SSO integration with the OIN Wizard](/docs/guides/submit-oin-app/openidconnect/main/) guide. <!--OKTA_OIN_SUBMISSION_TESTER OKTA-686228 -->

#### Your OIN Integrations instruction updates

The instructions on how to submit your OIN integration have been updated on the **Your OIN Integrations** page of the Admin Console in Okta Integrator Free Plan orgs. <!--OKTA-734095-->

#### SCIM 2.0 endpoint call update for user ResourceType requirements

When using [SCIM 2.0 with Entitlements](/docs/guides/scim-with-entitlements/main/), Okta no longer requires a user `ResourceType` value when no custom `schemaExtensions` are used. This applies only to SCIM 2.0 apps enabled for governance with Okta Identity Governance leveraging the `/ResourceTypes` endpoint. <!--OKTA-729238-->

#### Increase to Inline Hooks

The maximum number of inline hooks an org can create is now 100. The previous maximum was 50. See [Inline hook setup](/docs/concepts/inline-hooks/#inline-hook-setup). <!-- OKTA-732758 -->

#### New attribute to manage SAML app session lifetimes is GA in Preview

The `SessionNotOnOrAfter` parameter is an optional SAML parameter that enables the IdP to control the session at the SP. Add `SessionNotOnOrAfter` as an attribute in the SAML assertion to control the session lifetimes of SP apps using the Okta IdP. <!--OKTA-690479-->

#### Protected actions in the Admin Console is GA in Preview

The protected actions feature provides an additional layer of security to your org. It prompts admins for authentication when they perform critical tasks in the Admin Console and helps ensure that only authorized admins can perform these tasks. Super admins can configure the authentication interval for their org. See [Protected actions in the Admin Console](https://help.okta.com/okta_help.htm?type=oie&id=ext-protected-actions). <!-- PRIVILEGED_ACTIONS OKTA-683167 -->

#### Developer documentation update in 2024.06.0

* The [Customize domain and email address guide](/docs/guides/custom-url-domain/main/#caveats) now says that network zones are incompatible with Okta-managed TLS certificates. (OKTA-730633)

#### Bug fixed in 2024.06.0

* The `forceAuthn` parameter was ignored for org2org apps using the SAML sign-in mode and AMR claims mapping. (OKTA-711957)

## May

### Weekly release 2024.05.1

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Enhanced Dynamic Network Zones is self-service EA](#enhanced-dynamic-network-zones-is-self-service-ea) | May 15, 2024 |
| [Bug fixed in 2024.05.1](#bug-fixed-in-2024-05-1)  | May 15, 2024 |

#### Enhanced Dynamic Network Zones is self-service EA

Use Enhanced Dynamic Network Zones to define IP service categories (proxies, VPNs), locations, and Autonomous System Numbers (ASNs) that are allowed or blocked in a zone. See [Network Zones API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/NetworkZone/). <!--ENHANCED_DYNAMIC_NETWORK_ZONE OKTA-727934-->

#### Bug fixed in 2024.05.1

<!---Removing as part of OKTA-734890: * If an API request contained any malformed syntax within the query string, the request was still processed. (OKTA-728810) --->

* Sometimes the SAML assertion lifetime couldn't be unset when the SAML Assertion Lifetime API feature was enabled. (OKTA-728316)

### Monthly release 2024.05.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Seamless ISV experience with integrated testing is GA in Preview](#seamless-isv-experience-with-integrated-testing-is-ga-in-preview) | May 8, 2024 |
| [PUT requests for an API token network condition is self-service EA](#put-requests-for-an-api-token-network-condition-is-self-service-ea) | May 8, 2024 |
| [Permissions for custom admins to manage agents is GA in Production](#permissions-for-custom-admins-to-manage-agents-is-ga-in-production) | May 8, 2024 |
| [New System Log API property for target object is GA Preview](#new-system-log-api-property-for-target-object-is-ga-preview) | May 8, 2024 |
| [Bugs fixed in 2024.05.0](#bugs-fixed-in-2024-05-0) | May 8, 2024 |

#### Seamless ISV experience with integrated testing is GA in Preview

Okta now provides a seamless ISV experience to optimize the [Okta Integration Network (OIN)](https://www.okta.com/integrations/) submission experience for SAML and OIDC integrations. This new experience enables independent software vendors (ISVs) to build and automatically test their integration metadata before submission. This reduces the time needed for the OIN team to review and validate that the integration functions as intended, which shortens the time to publish in the OIN. This experience also incorporates communication processes in Salesforce, enabling improved collaboration internally within Okta teams and externally with ISVs. See [Publish an OIN integration](/docs/guides/submit-app-overview/) overview and [Submit an SSO integration with the OIN Wizard](/docs/guides/submit-oin-app/openidconnect/main/) guide. <!-- OKTA-686228 -->

#### PUT requests for an API token network condition is self-service EA

You can now make PUT requests to the `/api-tokens/{apiTokenId}` endpoint to update the network condition of an API token. <!-- OKTA-704387 -->

#### Permissions for custom admins to manage agents is GA in Production

Custom admins can now view, register, and manage agents. See [Permission types](https://developer.okta.com/docs/api/openapi/okta-management/guides/roles/#permissions). <!-- OKTA-706310 -->

#### New System Log API property for target object is GA Preview

Certain System Log events now contain a new property called `changeDetails` in the `target` object. When this property is populated, it reflects new, changed, or removed attributes of the target resource that's been modified. See [changeDetails property](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/SystemLog/#tag/SystemLog/operation/listLogEvents!c=200&path=target/changeDetails&t=response). <!-- OKTA-724000 -->

#### Bugs fixed in 2024.05.0

* When a large number of users were linked to an Identity Provider, requests to the `/idps/{IdP_ID}/users` endpoint timed out. (OKTA-710934)

* POST requests to the `/sessions/me/lifecycle/refresh` endpoint didn't return a `sid` cookie. (OKTA-716839)

* If a [login pattern](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Schema/#tag/Schema/operation/getUserSchema!c=200&path=definitions/base/properties/login&t=response) failed validation when making a request with the Schemas API, the call dropped the pattern and continued the request. (OKTA-723332)

* The Apps API accepted `0` as a value for the `samlAssertionLifetimeSeconds` parameter. (OKTA-723982)

## April

### Weekly release 2024.04.3

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bugs fixed in 2024.04.3](#bugs-fixed-in-2024-04-3)  | May 01, 2024 |

#### Bugs fixed in 2024.04.3

* GET policy rules (`/v1/policies/{policyId}/rules`) and GET a policy rule  (`/v1/policies/{policyId}/rules/{ruleId}`) requests returned a rule with a null value for the `created` property. (OKTA-542919)

* The Factors API didn't correctly return all `profile.keys` parameters for Okta Verify enrollments. (OKTA-694655)

* Apps API users were able to add duplicate SAML `attributeStatements` when they created or updated a custom SAML 2.0 app. (OKTA-706474)

* GET calls to `/iam/roles` sometimes didn't return link headers. (OKTA-712212)

* When the **First name** and **Last name** values in a user's profile contained dots, they were clickable in emails. (OKTA-712504)

* The `/introspect` endpoint response was incorrect for an access token returned by the On-Behalf-Of Token Exchange flow. (OKTA-712602)

### Monthly release 2024.04.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Customize Okta to use the telecommunications provider of your choice is GA in Production](#customize-okta-to-use-the-telecommunications-provider-of-your-choice-is-ga-in-production) | March 7, 2024 |
| [Permissions for custom admins to manage agents is GA in Preview](#permissions-for-custom-admins-to-manage-agents-is-ga-in-preview)  | April 3, 2024 |
| [Enhanced app API contracts is GA in Production](#enhanced-app-api-contracts-is-ga-in-production) | April 3, 2024 |
| [Content Security Policy for custom domains is GA in Production](#content-security-policy-for-custom-domains-is-ga-in-production) | January 31, 2024 |
| [Developer documentation update in 2024.04.0](#developer-documentation-update-in-2024-04-0) | April 3, 2024 |
| [Bug fixed in 2024.04.0](#bug-fixed-in-2024-04-0) | April 3, 2024 |

#### Customize Okta to use the telecommunications provider of your choice is GA in Production

While Okta provides out of the box telephony functionality, many customers need the ability to integrate their existing telecommunications provider with Okta to deliver SMS and Voice messages.

The Telephony Inline Hook allows customers to generate one-time passcodes within Okta and then use their existing telecommunications provider to deliver the messages for MFA enrollment/verification, password reset, and account unlock using SMS or Voice. This allows customers to use their existing telephony solution within Okta, due to the time they've already invested in their existing telephony solution, the need to use a specific regional provider, or simply the desire to maintain flexibility. See [Connect to an external telephony service provider](https://help.okta.com/okta_help.htm?id=ext-telephony-inline-hook). <!-- OKTA-700233 INLINE_HOOKS_ASYNC_TELEPHONY_PROVIDER -->

#### Permissions for custom admins to manage agents is GA in Preview

Custom admins can now view, register, and manage agents. See [Permission types](https://developer.okta.com/docs/api/openapi/okta-management/guides/roles/#permissions). <!-- OKTA-706310 ALLOW_CUSTOM_ADMIN_TO_MANAGE_REGISTER_AGENTS -->

#### Enhanced app API contracts is GA in Production

Okta has API documentation on creating instances of custom apps. Yet, it doesn't fully describe the app metadata required for features such as SSO and provisioning for apps installed from the Okta Integration Network (OIN). In an effort to improve the API for apps in the OIN, new app metadata contracts have been added to the Okta management API. Operators and developers can programmatically create instances of popular OIN apps in their ecosystem and set up the provisioning connection.

See [OIN app request payloads in the Applications API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Application/) and the [Set up an app provisioning connection](/docs/guides/app-provisioning-connection/main/) guide. <!-- OKTA-663482 PROVISIONING_API_EXTENSION -->

#### Content Security Policy for custom domains is GA in Production

The Content Security Policy (CSP) feature lets admins control which URLs may be linked to from customized sign-in and error pages in orgs that use custom domains. Admins add trusted URLs to Okta that link to items such as images and add these links to the code in their sign-in and error pages. This feature enhances security by enabling admins to allow only approved content to appear and prevent the introduction of potentially malicious code to these pages. See [Content Security Policy (CSP) for your custom domain](/docs/guides/custom-widget/main/#content-security-policy-csp-for-your-custom-domain). <!-- OKTA-600774 FF CONTENT_SECURITY_POLICY_FOR_CUSTOMIZABLE_SIGN_IN_AND_ERROR_PAGES -->

#### Developer documentation update in 2024.04.0

The [OIN QA SCIM test plan](/docs/guides/scim-provisioning-integration-test/main/#run-through-oin-qa-tests) file was updated. The following test cases were modified: C9319, C9320, C9321, C9360, and C9361. <!-- OKTA-704429 --> <!-- OKTA-710941 -->

#### Bug fixed in 2024.04.0

Users were able to unselect a saved SSO protocol for an integration submission in the OIN Wizard. (OKTA-710638)

## March

### Weekly release 2024.03.2

| Change | Expected in Preview Orgs |
| ------ | ------------------------ |
| [Bugs fixed in 2024.03.2](#bugs-fixed-in-2024-03-2) | March 27, 2024 |

#### Bugs fixed in 2024.03.2

* An admin was able to make a GET Policy request (`/authorizationServers/{authorizationServerId}/policies/{policyId}`) to an authorization server with no policies, using a policy ID from another authorization server with policies, and get that policy information returned. (OKTA-684225)

* Client rate limiting configurations for the `/login/login.htm` endpoint were displayed incorrectly in the Rate Limit dashboard and were in an inconsistent state for some orgs. (OKTA-699914)

* Okta sometimes incorrectly returned an Invalid Phone Number error during SMS factor enrollment. (OKTA-705078)

* After an admin deleted a user, an internal server error sometimes occurred when the admin then made a LIST IdP users request (`api/v1/idps/{idpId}/users`). (OKTA-708102)

### Weekly release 2024.03.1

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Bug fixed in 2024.03.1](#bug-fixed-in-2024-03-1) | March 13, 2024 |

#### Bug fixed in 2024.03.1

One-time passcodes (OTPs) that were sent using a telephony inline hook weren't subject to rate limits. (OKTA-704319)

### Monthly release 2024.03.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Permission conditions for profile attributes is GA in Production](#permission-conditions-for-profile-attributes-is-ga-in-production) | March 7, 2024 |
| [Content Security Policy for custom domains is GA in Preview](#content-security-policy-for-custom-domains-is-ga-in-preview)           | March 7, 2024 |
| [New mappings property for Policy API is EA in Preview](#new-mappings-property-for-policy-api-is-ea-in-preview)                       | March 7, 2024 |
| [AAL values for Login.gov IdP](#aal-values-for-logingov-idp)                                                                          | March 7, 2024 |
| [Externally signed org AS access tokens](#externally-signed-org-as-access-tokens)                                                     | March 7, 2024 |
| [Support case management for admins is GA in Preview](#support-case-management-for-admins-is-ga-in-preview)                           | March 7, 2024 |
| [Realms for Workforce](#realms-for-workforce)                                                                                         | March 7, 2024 |
| [Enhanced app API contracts](#enhanced-app-api-contracts)                                                                             | March 7, 2024 |
| [Bugs fixed in 2024.03.0](#bugs-fixed-in-2024-03-0) | March 6, 2024 |

#### Permission conditions for profile attributes is GA in Production

You can now apply conditions to the **View users and their details** and **Edit users' profile attributes** custom admin role permissions. Permission conditions help you limit the scope of a role by including or excluding admins' access to individual profile attributes. This gives you more granular control over your custom admin roles and helps meet your org's unique security needs. See [Permission conditions](https://help.okta.com/okta_help.htm?type=oie&id=ext-permission-conditions). <!-- OKTA-586185 -->

#### Content Security Policy for custom domains is GA in Preview

The Content Security Policy (CSP) feature lets admins control which URLs may be linked to from customized sign-in and error pages in orgs that use custom domains. Admins add trusted URLs to Okta that link to items such as images and add these links to the code in their sign-in and error pages. This feature enhances security by enabling admins to allow only approved content to appear and prevent the introduction of potentially malicious code to these pages. See [Content Security Policy (CSP) for your custom domain](/docs/guides/custom-widget/main/#content-security-policy-csp-for-your-custom-domain). <!-- OKTA-600774 FF CONTENT_SECURITY_POLICY_FOR_CUSTOMIZABLE_SIGN_IN_AND_ERROR_PAGES -->

#### New mappings property for Policy API is EA in Preview

A new `mappings` property is available for the `links` object in  `GET /api/v1/policies/{policyId}` and `GET /api/v1/policies?type={type}` responses. This property displays links to policy mappings. See [Policy API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/getPolicy!c=200&path=0/_links/mappings&t=response). <!-- OKTA-637310 -->

#### AAL values for Login.gov IdP

The [Login.gov IdP configuration](/docs/guides/add-logingov-idp/main/#create-an-identity-provider-in-okta) has been updated to include all allowed AAL values. <!-- OKTA-673125 -->

#### Externally signed org AS access tokens

Access tokens returned from the org authorization server are now signed using the externally published signing key. These access tokens must still be treated as opaque strings and not be validated or consumed by any application other than Okta. <!-- OKTA-694170 -->

#### Support case management for admins is GA in Preview

Super admins can now assign the **View, create, and manage Okta support cases** permission and Support Cases resource to a custom admin role. This allows delegated admins to manage the support cases that they've opened. See [About role permissions](https://help.okta.com/okta_help.htm?type=oie&id=csh-about-role-permissions). <!-- OKTA-700229 -->

#### Realms for Workforce

Realms allows you to unlock greater flexibility in managing and delegating management of your distinct user populations within a single Okta org. See the [Realms](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Realm) and [Realm Assignments](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/RealmAssignment) APIs. <!-- OKTA-702163 -->

#### Enhanced app API contracts

Okta has API documentation on creating instances of custom apps. Yet, it doesn't fully describe the app metadata required for features such as SSO and provisioning for apps installed from the Okta Integration Network (OIN). In an effort to improve the API for apps in the OIN, new app metadata contracts have been added to the Okta management API. Operators and developers can programmatically create instances of popular OIN apps in their ecosystem and set up the provisioning connection. See [Set up an app provisioning connection](/docs/guides/app-provisioning-connection/main/). <!-- OKTA-703567 -->


#### Bugs fixed in 2024.03.0

* Okta required a `sharedSecret` length of 16 characters when enrolling a Google Authenticator using the Factors API. Okta now accepts `sharedSecret` lengths between 16 and 32 characters. (OKTA-654920)

* Some group claims failed if Okta Expression Language was used. (OKTA-660870)

* An inline hook secured by an OAuth 2.0 token that had no expiry value returned an HTTP 400 Bad Request error. (OKTA-702184)

## February

### Weekly release 2024.02.2

| Change | Expected in Preview Orgs |
| ------ | ------------------------ |
| [Bugs fixed in 2024.02.2](#bugs-fixed-in-2024-02-2) | February 22, 2024 |

#### Bugs fixed in 2024.02.2

<!-- * The number of unsuccessful calls to the `/api/v1/authn` endpoint sometimes exceeded the threshold set in the password policy settings. (OKTA-698017) Removed for 2024.02.2 as per doc action-->

* Okta sometimes incorrectly returned an Invalid Phone Number error during SMS factor enrollment. (OKTA-683026)

* Sometimes, an OAuth 2.0-secured inline hook that contained a custom domain authorization server in the token URL returned a null pointer exception error, instead of an appropriate error. (OKTA-656265)

* User passwords could be updated to match the answer to the recovery question. (OKTA-654993)

### Weekly release 2024.02.1

| Change | Expected in Preview Orgs |
| ------ | ------------------------ |
| [HTTP header filter](#http-header-filter) | February 22, 2024 |
| [Bug fixed in 2024.02.1](#bug-fixed-in-2024-02-1) | February 14, 2024 |

#### HTTP header filter

To improve the security of your org, Okta now filters and encodes any illegal unicode characters for outgoing HTTP headers. <!-- OKTA-694896 -->

#### Bug fixed in 2024.02.1

The List all enrolled Factors endpoint (`GET /api/v1/users/{userId}/factors`) returned an incorrectly prefixed ID for SMS factors with a PENDING ACTIVATION status. (OKTA-690496)

### Monthly release 2024.02.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [Assign admin roles to an app](#assign-admin-roles-to-an-app)| June 14, 2023 |
| [DPoP support for Okta management APIs is GA in Production](#dpop-support-for-okta-management-apis-is-ga-in-production) | December 13, 2023 |
| [New attribute to manage SAML app session lifetimes is EA in Preview](#new-attribute-to-manage-saml-app-session-lifetimes-is-ea-in-preview) | February 7, 2024 |
| [New function for email templates is EA in Preview](#new-function-for-email-templates-is-ea-in-preview) | February 7, 2024 |
| [POST requests now allowed to the logout endpoint](#post-requests-now-allowed-to-the-logout-endpoint) | February 7, 2024 |
| [Seamless ISV experience is GA in Production](#seamless-isv-experience-is-ga-in-production) | January 10, 2024 |
| [Developer documentation update in 2024.02.0](#developer-documentation-update-in-2024-02-0) | February 7, 2024 |
| [Bugs fixed in 2024.02.0](#bugs-fixed-in-2024-02-0) | February 7, 2024 |

#### Assign admin roles to an app

Orgs can now assign admin roles to their custom API Service Integrations. Apps with assigned admin roles are constrained to the permissions and resources that are included in the role assignment. This helps ensure that apps only have access to the resources that are needed to perform their tasks and improves orgs' overall security. See [Work with the admin component](https://help.okta.com/okta_help.htm?type=oie&id=ext-work-with-admin). <!-- OKTA-659638 CLIENT_AS_PRINCIPAL -->

#### DPoP support for Okta management APIs is GA in Production

You can now use OAuth 2.0 Demonstrating Proof-of-Possession (DPoP) access tokens to access Okta management APIs. See [Configure OAuth 2.0 Demonstrating Proof-of-Possession](/docs/guides/dpop/oktaresourceserver/main/). <!-- OKTA-673922 OKTA_RESOURCE_SERVER_DPOP_SUPPORT-->

#### New attribute to manage SAML app session lifetimes is EA in Preview

The `samlAssertionLifetimeSeconds` parameter is an optional SAML parameter that allows the IdP to control the session at the SP. This parameter allows users to add `samlAssertionLifetimeSeconds` as an attribute in the SAML assertion to control the session lifetimes of SP apps using the Okta IdP. See the [Settings table](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Application/#tag/Application/operation/createApplication!path=6/settings/signOn/samlAssertionLifetimeSeconds&t=request) in the **Add custom SAML application** section. <!-- OKTA-690479 SAML_ASSERTION_LIFETIME_SECONDS_ON_APPS_API -->

#### New function for email templates is EA in Preview

You can now use the `getTimeDiffHoursNow` function in each of the available email notification templates. If you want to add more locales when customizing email templates, you need to use this function instead of the `formatTimeDiffHoursNowInUserLocale` function. The new function returns only the time value in the specified unit. See [Enable additional locales](/docs/guides/custom-email/main/#enable-additional-locales). <!-- OKTA-683897 -->

#### POST requests now allowed to the logout endpoint

You can now access the `/oauth2/{id}/v1/logout` and `/oauth2/v1/logout` endpoints with a POST request. See [POST logout](https://developer.okta.com/docs/api/openapi/okta-oauth/oauth/tag/OrgAS/#tag/OrgAS/operation/logoutWithPost). <!-- OKTA-649530 -->

#### Seamless ISV experience is GA in Production

Okta now provides a seamless ISV experience to optimize the [Okta Integration Network (OIN)](https://www.okta.com/integrations/) submission experience for SAML and OIDC integrations. This new experience enables independent software vendors (ISVs) to build and manually test their integration metadata before submission. This reduces the time needed for the OIN team to review and validate that the integration functions as intended, which shortens the time to publish in the OIN. This experience also incorporates communication processes in Salesforce, enabling improved collaboration internally within Okta teams and externally with ISVs. See [Publish an OIN integration](https://developer.okta.com/docs/guides/submit-app-overview/) overview and [Submit an SSO integration with the OIN Wizard](https://developer.okta.com/docs/guides/submit-oin-app/) guide. <!-- OKTA-663167 APP_MANIFESTS -->

#### Developer documentation update in 2024.02.0

* Instructions for [testing Okta REST APIs with Postman](/docs/reference/rest/) have been updated to provide OAuth 2.0 authentication set up and use. OAuth 2.0 is recommended to access Okta management APIs instead of the proprietary SSWS API token to ensure enhanced security.

  These instructions are now under **References** > **Test APIs with Postman**.

* The [Self-service registration](/docs/guides/oie-embedded-sdk-use-case-self-reg/) guide is now easier to read and quicker to complete. All flow diagrams have been updated so they are easier to follow, and configuration instructions now match the current Admin Console.

#### Bugs fixed in 2024.02.0

* Some `call` Factor enrollments were left in a pending activation state after enrollment or reset. (OKTA-649508)

* When users signed in with an external Identity Provider and the multiple matching users error occurred, they were redirected to the sign-in page instead of the error page. (OKTA-658717)

## January

### Weekly release 2024.01.2

| Change | Expected in Preview Orgs |
| ------ | ------------------------ |
| [Content Security Policy for custom domains is EA in Preview](#content-security-policy-for-custom-domains-is-ea-in-preview)| January 31, 2024 |
| [IP restrictions on tokens](#ip-restrictions-on-tokens)| January 31, 2024 |
| [Bugs fixed in 2024.01.2](#bugs-fixed-in-2024-01-2) | January 31, 2024 |

#### Content Security Policy for custom domains is EA in Preview

The Content Security Policy (CSP) feature lets admins control which URLs may be linked to from customized sign-in and error pages in orgs that use custom domains. Admins add trusted URLs to Okta that link to items such as images and add these links to the code in their sign-in and error pages. This feature enhances security by enabling admins to allow only approved content to appear and prevent the introduction of potentially malicious code to these pages. See [Content Security Policy (CSP) for your custom domain](/docs/guides/custom-widget/main/#content-security-policy-csp-for-your-custom-domain). <!-- OKTA-600774 FF CONTENT_SECURITY_POLICY_FOR_CUSTOMIZABLE_SIGN_IN_AND_ERROR_PAGES -->

#### IP restrictions on tokens

Admins can specify allowlisted and blocklisted network zones for static, Single Sign-On Web System (SSWS) API tokens. This strengthens org security by letting them control where calls to Okta APIs can originate from. It also restricts attackers and malware from stealing SSWS tokens or replaying them outside of their IP range to gain unauthorized access. <!-- OKTA-689850 -->

#### Bugs fixed in 2024.01.2

* POST requests to the `/sessions/me/lifecycle/refresh` endpoint didn't return an updated session cookie. (OKTA-665452)

* System Log events for the access token, ID token, and user SSO grants didn't include `externalSessionId`. (OKTA-664370)

* System Log events for access token and ID token grants didn't include user attributes. (OKTA-674218)

### Monthly release 2024.01.0

| Change | Expected in Preview Orgs |
|--------|--------------------------|
| [DPoP support for Okta management APIs is GA in Preview](#dpop-support-for-okta-management-apis-is-ga-in-preview) | December 13, 2023 |
| [Read-only permission for admin role assignments is GA in Production](#read-only-permission-for-admin-role-assignments-is-ga-in-production) | November 8, 2023 |
| [Seamless ISV experience is GA in Preview](#seamless-isv-experience-is-ga-in-preview) | January 10, 2024 |
| [System Log events for IdP keystore operations](#system-log-events-for-idp-keystore-operations) | January 10, 2024 |
| [Updated RADIUS authentication prompts](#updated-radius-authentication-prompts) | January 10, 2024 |

#### DPoP support for Okta management APIs is GA in Preview

You can now use OAuth 2.0 Demonstrating Proof-of-Possession (DPoP) access tokens to access Okta management APIs.
See [Configure OAuth 2.0 Demonstrating Proof-of-Possession](/docs/guides/dpop/oktaresourceserver/main/). <!-- OKTA-673922 OKTA_RESOURCE_SERVER_DPOP_SUPPORT-->

#### Read-only permission for admin role assignments is GA in Production

Super admins can now assign the **View roles, resources, and admin assignments** permission to their delegated admins. This permission gives admins a read-only view of the admin roles, resource sets, and admin assignments in the org. See [About role permission](https://help.okta.com/okta_help.htm?type=oie&id=csh-about-role-permissions). <!-- OKTA-640563 IAM_READ_RESOURCES -->

#### Seamless ISV experience is GA in Preview

Okta now provides a seamless ISV experience to optimize the [Okta Integration Network (OIN)](https://www.okta.com/integrations/) submission experience for SAML and OIDC integrations. This new experience enables independent software vendors (ISVs) to build and manually test their integration metadata before submission. This reduces the time needed for the OIN team to review and validate that the integration functions as intended, which shortens the time to publish in the OIN.

This experience also incorporates communication processes in Salesforce, enabling improved collaboration internally within Okta teams and externally with ISVs. See [Publish an OIN integration](/docs/guides/submit-app-overview/) overview and [Submit an SSO integration with the OIN Wizard](/docs/guides/submit-oin-app/) guide. <!-- OKTA-663167  APP_MANIFESTS -->

#### System Log events for IdP keystore operations

New System Log events are generated for IdP keystore operations:

```bash
system.idp.key.create
system.idp.key.update
system.idp.key.delete
```
<!-- OKTA-680513 -->

#### Updated RADIUS authentication prompts

RADIUS authentication prompts are updated to be clearer.
<!-- OKTA-678869 -->
