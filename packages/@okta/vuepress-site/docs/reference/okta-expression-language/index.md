---
title: Okta Expression Language overview guide
meta:
  - name: description
    content: Learn more about the features and syntax of Okta Expression Language, which you can use throughout the administrator UI and API.
---

# Okta Expression Language overview

This document details the features and syntax of the Okta Expression Language (EL). You can use this language throughout the Admin Console and API for Okta Classic Engine and Okta Identity Engine.

> **Note:** Use the features and syntax of the [Okta Expression Language in Identity Engine](/docs/reference/okta-expression-language-in-identity-engine/) if you're using EL for the following features:
>
> * [Authentication policies](/docs/guides/configure-signon-policy/main/) of the Identity Engine
> * [Access Certification campaigns](https://help.okta.com/okta_help.htm?id=ext-el-eg) with Okta Identity Governance
> * [Entitlement Management policies](https://help.okta.com/okta_help.htm?id=csh-create-policy) for Okta Identity Governance

Okta Expression Language is based on [SpEL](https://docs.spring.io/spring-framework/reference/core/expressions.html) and uses a subset of the functionalities offered by SpEL.

Expressions can reference, transform, and combine attributes before storing them on a user profile or passing them to an app for authentication or provisioning. For example, you might use a custom expression to create a username by stripping `@company.com` from an email address. Or, you might combine the `firstName` and `lastName` attributes into a single `displayName` attribute.

> **Note:** In this reference, `$placeholder` denotes a value that you need to replace with an appropriate variable. For example, in `user.$attribute`, `$attribute` can be replaced with `firstName`, `lastName`, `email`, and other valid values.

## Reference user attributes

When you create an Okta expression, you can reference any attribute that lives on an Okta user profile or app user profile.

> **Note:** When you refer to custom profile attributes that differ only by case, name collisions occur. This includes naming custom profile attributes the same as base profile attributes, for example, `firstName` and `FirstName`.

### Okta user profile

Every user has an Okta user profile. The user profile is the central source of truth for the core attributes of a user. To reference a user profile attribute, specify `user.` and the attribute variable name. For a list of core user profile attributes, see the [`profile` parameter properties](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/getUser!c=200&path=profile&t=response).

| Syntax            | Definitions                                                                   | Examples                                                       |
| --------          | ----------                                                                    | ------------                                                   |
| `user.$attribute` | `user` reference to the Okta user<br>`$attribute` the attribute variable name | user.firstName<br>user.lastName<br>user.login<br>user.email |

> **Note:** You can also access the user ID for each user with the following expression: `user.getInternalProperty("id")`.

### Application user profile

In addition to an Okta user profile, all users have a separate app user profile for each of their apps. Application user profiles store app-specific information about users, such as the app `userName` or user `role`.

To reference a profile attribute of an app user, specify the app variable and the attribute variable in the user profile of the app. In specifying the app, you can either name the specific app you're referencing or use an implicit reference to an in-context app.

> **Note:** The app reference is usually the `name` of the app, as distinct from the `label` (display name). See [Application properties](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Application/#tag/Application/operation/listApplications). If your org configures multiple instances of the same app, a randomly assigned suffix differentiates the names of the subsequent instances, for example: `zendesk_9ao1g13`. The name of any specific app instance in the Profile Editor appears in lighter text beneath the label of the app.

| Syntax                | Definitions                                                                                | Examples                                                              |
| --------              | ----------                                                                                 | ------------                                                          |
| `$app.$attribute`     | `$app` explicit reference to specific app instance<br>`$attribute` the attribute variable name for the app instance's user profile               | zendesk.firstName<br>active_directory.managerUpn<br>google_apps.email |
| `appuser.$attribute`  | `appuser` implicit reference to in-context app<br>`$attribute` the attribute variable name | appuser.firstName                                                     |

> **Note:** Explicit references to apps aren't supported for OAuth 2.0/OIDC custom claims. See [Expressions for OAuth 2.0/OIDC custom claims](/docs/reference/okta-expression-language/#expressions-for-oauth-2-0-oidc-custom-claims).

### IdP user profile

In addition to an Okta user profile, some users have separate IdP user profiles for their external Identity Provider. These IdP user profiles are used to store IdP-specific information about a user. You can use this data in an EL expression to transform an external user's username into the equivalent Okta username.

To reference an IdP user profile attribute, specify the IdP variable and the corresponding attribute variable for the IdP user profile of that Identity Provider. This profile is only available when specifying the username transform used to generate an Okta username for the IdP user.

| Syntax                 | Definitions                                                                                  | Examples          |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------      |
| `idpuser.$attribute`   | `idpuser` implicit reference to in-context IdP<br>`$attribute` the attribute variable name   | idpuser.firstName |

> **Note:** In the Universal Directory, the base Okta user profile has about 30 attributes. You can add any number of custom attributes. All app user profiles have a username attribute and possibly others depending on the app. To find a full list of Okta user and app user attributes and their variable names, in the Admin Console go to **People** > **Profile Editor**. If you're not using Universal Directory, contact your support or professional services team.

## Reference app and organization properties

In addition to referencing user attributes, you can also reference app properties and the properties of your org. To reference a particular attribute, specify the appropriate binding and the attribute variable name. The binding for an app is its name with `_app` appended. The app name can be found as described in the [profile attributes of an app user](#app-user-profile).

### Application properties

| Syntax            | Definitions                                                                                     | Examples                                               |
| ------            | ----------                                                                                      | ------------                                           |
| `$app.$attribute` | `$app` explicit reference to specific app instance<br>`$attribute` the attribute variable name  | office365_app.domain<br>zendesk_app.companySubDomain |
| `app.$attribute`  | `app` implicit reference to in-context app instance<br>`$attribute` the attribute variable name | app.domain<br>app.companySubDomain                     |

> **Note:** Explicit references to apps aren't supported for custom OAuth 2.0/OIDC claims.

### Organization properties

| Syntax           | Definitions                                                             | Examples     |
| --------         | ----------                                                              | ------------ |
| `org.$attribute` | `org` reference to Okta org<br>`$attribute` the attribute variable name | org.name<br>org.subDomain   |

## Reference session properties

In addition to referencing user, app, and organization properties, you can also reference user session properties. Session properties allow you to configure Okta to pass dynamic authentication context to SAML apps through the assertion using custom SAML attributes. The app can then use that information to limit access to certain app-specific behaviors and calculate the risk profile for the signed-in user.

### Session properties

| Syntax            | Definitions                                                 | Evaluation example                                     |
| ----------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| `session.amr`     | `session` reference to a user's session<br> `amr` the attribute name that's resolvable to an array of [Authentication Method References](https://tools.ietf.org/html/rfc8176) | `["pwd"]`&mdash;password used by the user for authentication<br>`["mfa", "pwd", "kba"]`&mdash;password and MFA Security Question used by the user for authentication<br>`["mfa", "mca", "pwd", "sms"]`&mdash;password and MFA SMS used by the user for authentication |

## Functions

Okta offers various functions to manipulate attributes or properties to generate a desired output. You can combine and nest functions inside a single expression.

### String functions

| Function                 | Input parameter signature                                     | Return type | Example                                                                                                       | Output         |
| --------                 | -------------------------                                     | ----------- | -------                                                                                                       | ------         |
| `String.append`          | (String str, String suffix)                                   | String      | `String.append("This is", " a test")`                                                                         | This is a test |
| `String.join`            | (String separator, String... strings)                         | String      | `String.join(",", "This", "is", "a", "test")`                                                                 | This,is,a,test |
|                          |                                                               |             | `String.join("", "This", "is", "a", "test")`                                                                  | Thisisatest    |
| `String.len`             | (String input)                                                | Integer     | `String.len("This")`                                                                                          | 4              |
| `String.removeSpaces`    | (String input)                                                | String      | `String.removeSpaces("This is a test")`                                                                       | Thisisatest    |
| `String.replace`         | (String input, String match, String replacement)              | String      | `String.replace("This is a test", "is", "at")`                                                                | That at a test |
| `String.replaceFirst`    | (String input, String match, String replacement)              | String      | `String.replaceFirst("This is a test", "is", "at")`                                                           | That is a test |
| `String.startsWith`      | (String input, String starts)                                        | Boolean     | `String.startsWith("Kiss", "K")`                                                                              | true           |
| `String.stringContains`  | (String input, String searchString)                           | Boolean     | `String.stringContains("This is a test", "test")`                                                             | true           |
|                          |                                                               |             | `String.stringContains("This is a test", "doesn'tExist")`                                                     | false          |
| `String.stringSwitch`    | (String input, String defaultString, String... keyValuePairs) | String      | `String.stringSwitch("This is a test", "default", "key1", "value1")`                                          | default        |
|                          |                                                               |             | `String.stringSwitch("This is a test", "default", "test", "value1")`                                          | value1         |
|                          |                                                               |             | `String.stringSwitch("First match wins", "default", "absent", "value1", "wins", "value2", "match", "value3")` | value2         |
|                          |                                                               |             | `String.stringSwitch("Substrings count", "default", "ring", "value1")`                                        | value1         |
| `String.substring`      | (String input, int startIndex, int endIndex)                  | String      | `String.substring("This is a test", 2, 9)`                                                                    | is is a        |
| `String.substringAfter`  | (String input, String searchString)                           | String      | `String.substringAfter("abc@okta.com", "@")`                                                                  | okta.com       |
| `String.substringBefore` | (String input, String searchString)                           | String      | `String.substringBefore("abc@okta.com", "@")`                                                                 | abc            |
| `String.toUpperCase`     | (String input)                                                | String      | `String.toUpperCase("This")`                                                                                  | THIS           |
| `String.toLowerCase`     | (String input)                                                | String      | `String.toLowerCase("ThiS")`                                                                                  | this           |

The following <ApiLifecycle access="deprecated" /> functions perform some of the same tasks as the ones in the previous table.

| Function                          | Example                             | Input         | Output    |
| --------                          | ---------                           | -------       | --------  |
| `toUpperCase(string)`             | `toUpperCase(source.firstName)`     | Alexander     | ALEXANDER |
| `toLowerCase(string)`             | `toLowerCase(source.firstName)`     | AlexANDER     | alexander |
| `substringBefore(string, string)` | `substringBefore(user.email, '@')`  | <alex@okta.com> | alex      |
| `substringAfter(string, string)`  | `substringAfter(user.email, '@')`   | <alex@okta.com> | okta.com  |
| `substring(string, int, int)`     | `substring(source.firstName, 1, 4)` | Alexander     | lex       |

### Array functions

| Function                         | Return type                         | Example                                             | Output             |
| --------                         | ---------                           | ---------                                           | --------           |
| `Arrays.add(array, value)`       | Array                               | `Arrays.add(user.arrayAttribute, 40)`               | `{10, 20, 30, 40}` |
| `Arrays.remove(array, value)`    | Array                               | `Arrays.remove(user.arrayAttribute, 20)`            | `{10, 30}`         |
| `Arrays.clear(array)`            | Array                               | `Arrays.clear(user.arrayAttribute)`                 | `{ }`              |
| `Arrays.get(array, position)`    | -                                   | `Arrays.get({0, 1, 2}, 0)`                          | 0                  |
| `Arrays.flatten(list of values)` | Array                               | `Arrays.flatten(10, {20, 30}, 40)` <br>  `Arrays.flatten('10, 20, 30, 40')`               | `{10, 20, 30, 40}` |
| `Arrays.contains(array, value)`  | Boolean                             | `Arrays.contains({10, 20, 30}, 10)`                 | true               |
|                                  |                                     | `Arrays.contains({10, 20, 30}, 50)`                 | false              |
| `Arrays.size(array)`             | Integer                             | `Arrays.size({10, 20, 30})`                         | 3                  |
|                                  |                                     | `Arrays.size(NULL)`                                 | 0                  |
| `Arrays.isEmpty(array)`          | Boolean                             | `Arrays.isEmpty({10, 20})`                          | false              |
|                                  |                                     | `Arrays.isEmpty(NULL)`                              | true              |
| `Arrays.toCsvString(array)`      | String                              | `Arrays.toCsvString({"This", "is", " a ", "test"})` | This,is, a ,test   |

> **Note:** You can use comma-separated values (CSV) as an input parameter for all `Arrays*` functions. These values are converted into arrays.

### Conversion functions

#### Data conversion functions

| Function                | Return type | Example              | Input                  | Output   |
| --------                | ---------   | ---------            | -------                | -------- |
| `Convert.toInt(string)` | Integer     | `Convert.toInt(val)` | `String val = '1234'`  | 1234     |
| `Convert.toInt(double)` | Integer     | `Convert.toInt(val)` | `Double val = 123.4`   | 123      |
|                         |             |                      | `Double val = 123.6`   | 124      |
| `Convert.toNum(string)` | Double      | `Convert.toNum(val)` | `String val = '3.141'` | 3.141    |

> **Note:** The `Convert.toInt(double)` function rounds the passed numeric value either up or down to the nearest integer. Be sure to consider integer-type range limitations when converting from a number to an integer with this function.

> **Note:**  When using [group rule expressions](#expressions-in-group-rules), the following expression isn't allowed, even if the user profile has a custom integer attribute called `yearJoined`: `Convert.toInt("2018") == user.yearJoined`

#### Country code conversion functions

These functions convert between ISO 3166-1 2-character country codes (Alpha 2), 3-character country codes (Alpha 3), numeric country codes, and full ISO country names.

| Function                           | Return type | Example                           | Output |
| ---                                | ---         | ---                               | ---    |
| `Iso3166Convert.toAlpha2(string)`  | String      | `Iso3166Convert.toAlpha2("IND")`  | IN     |
| `Iso3166Convert.toAlpha3(string)`  | String      | `Iso3166Convert.toAlpha3("840")`  | USA    |
| `Iso3166Convert.toNumeric(string)` | String      | `Iso3166Convert.toNumeric("USA")` | 840    |
| `Iso3166Convert.toName(string)`    | String      | `Iso3166Convert.toName("IN")`     | India  |

> **Note:** All these functions take ISO 3166-1 2-character country codes (Alpha 2), 3-character country codes (Alpha 3), and numeric country codes as input. The function determines the input type and returns the output in the format specified by the function name.

See the [ISO 3166-1 online lookup tool](https://www.iso.org/obp/ui/#search/code/).

### Group functions

Group functions return either an array of groups or **True** or **False**.

| Function                        | Return type | Example                                                         |
| ---------                       | ----------- | -------                                                         |
| `getFilteredGroups`             | Array       | `getFilteredGroups({"00gml2xHE3RYRx7cM0g3"}, "group.name", 40)` |
| `isMemberOfGroupName`           | Boolean     | `isMemberOfGroupName("group1")`                                 |
| `isMemberOfGroup`               | Boolean     | `isMemberOfGroup("groupId")`                                    |
| `isMemberOfAnyGroup`            | Boolean     | `isMemberOfAnyGroup("groupId1", "groupId2", "groupId3")`        |
| `isMemberOfGroupNameStartsWith` | Boolean     | `isMemberOfGroupNameStartsWith("San Fr")`                       |
| `isMemberOfGroupNameContains`   | Boolean     | `isMemberOfGroupNameContains("admin")`                          |
| `isMemberOfGroupNameRegex`      | Boolean     | `isMemberOfGroupNameRegex("/.*admin.*")`                        |
| `user.getGroups`                | Array       | See [Get groups for users](#get-groups-for-users)               |

> **Note:** When EL group functions (such as `isMemberOfGroup` or `isMemberOfGroupName`) are used for app assignments, the profile attributes of the app user aren't updated or reapplied when the user's group membership changes. Okta only updates app user profile attributes when an app is assigned to a user or when mappings are applied.

For more information on using group functions for dynamic and static allowlists, see [Customize tokens returned from Okta](/docs/guides/customize-tokens-returned-from-okta/).

#### Get groups for users

Use the `user.getGroups` function to get information about a user's groups, such as group rules and group claims. While other group functions use **Group attribute statements**, this function uses the **Profile attribute statements** because the function is based on the user.

> **Note:** This function was previously only available for a limited set of features on Okta Identity Engine, but has been expanded to all features that allow Expression Language.

These group functions take in a list of search criteria as input. Each search criterion is a key-value pair:<br>
**Key:** Specifies the matching property. Currently supported keys are: `group.id`, `group.source.id`, `group.type`, and `group.profile.name`.<br>
**Value:** Specifies a list of matching values.

* The `group.id`, `group.source.id`, and `group.type` keys can match values that are exact.
* The `group.profile.name` key supports the operators `EXACT` and `STARTS_WITH` to identify exact matches or matches that include the value. If no operator is specified, the expression uses `STARTS_WITH`. You can't use these operators with `group.id`, `group.source.id`, or `group.type`.
* The `group.source.id` key supports when you need to disambiguate between groups that have the same group name. For example, if you're searching for app groups that start with "Admin" from a given app instance then you can use `group.source.id` to filter multiple groups across the different app group sources.

The `user.getGroups` function supports the `.![name]` collection projection for the legacy configuration of group claims. [Collection projections](https://docs.spring.io/spring-framework/reference/core/expressions/language-ref/collection-projection.html) enable you to use a subexpression (`.![$attr]`) that transforms a collection (like an array) into a new collection. It applies the expression to each element in the array and returns a new collection without modifying the original collection.

> **Note:** For the following expression examples, assume that the user is a member of the following groups:

| Group ID                 | Group name               | Group type            | Group source ID |
| --------                 | -----------              | -----------           | ----------- |
| 00gak46y5hydV6NdM0g4     | Everyone                 | BUILT_IN              | 0oazmqPIbHiVJBG4C0g3 |
| 00g1emaKYZTWRYYRRTSK     | West Coast Users         | OKTA_GROUP            | 0a81509410bdf807f680 |
| 00garwpuyxHaWOkdV0g4     | West Coast Admins        | OKTA_GROUP            | 0a03d062d3918fd34742 |
| 00gjitX9HqABSoqTB0g3     | Engineering Users        | APP_GROUP             | 0aae4be2456eb62f7c3d |
| 00gnftmgQxC2L19j6I9c     | Engineering Users        | APP_GROUP             | 0a61c8dacb58b3c0716e |

| Function                 | Return type | Example                                                                                                         | Output explanation                                                                        | Example Output |
| ---------------          | ----------- | -------                                                                                                         | -----                                                                           | ---- |
| `user.getGroups`         | Array       | `user.getGroups({'group.id': {'00gjitX9HqABSoqTB0g3'}}, {'group.profile.name': 'West Coast.*'})`                | A list of groups with group ID `00gjitX9HqABSoqTB0g3` and a group name that starts with `West Coast`                                                                | {} |
|                          |             | `user.getGroups({'group.type': {'OKTA_GROUP'}}, {'group.profile.name': {'Everyone', 'West Coast Admins'}})`     | A list of groups that are of the type `OKTA_GROUP` and the group name starts with `Everyone` or `West Coast Admins` | A list of user groups that contains groups with ID `00garwpuyxHaWOkdV0g4`  |
|                          |             | `user.getGroups({'group.profile.name': 'East Coast.*'})`                                                        | A list of groups that start with the name `East Coast` | {}                                                                              |
|                          |             | `user.getGroups({'group.type': {'OKTA_GROUP', 'APP_GROUP'}})`                                                   | A list of groups that are of the type `OKTA_GROUP` or `APP_GROUP` | A list of user groups that contains groups with IDs `00g1emaKYZTWRYYRRTSK`, `00garwpuyxHaWOkdV0g4`, `00gjitX9HqABSoqTB0g3`, and `00gnftmgQxC2L19j6I9c`  |
|                          |             | `user.getGroups({'group.source.id': '0aae4be2456eb62f7c3d'} , {'group.profile.name': {'Engineering Users'}} )` | A filtered list of user groups that contains groups that start with the name `Engineering Users` and that has the source ID `0aae4be2456eb62f7c3d` | A list of user groups that contains groups with ID `00gjitX9HqABSoqTB0g3` |
| `user.getGroups` with `.![name]` collection projection | Array |`user.getGroups({\"group.profile.name\": \"Everyone\",\"operator\": \"STARTS_WITH\"}).![name]` | A list of group names | A list of groups that have a group profile name that starts with `Everyone` |

#### Group-claims only functions

> **Note:** These functions are for the legacy configuration of claims. Okta recommends that you use the `user.getGroups` function with collection projections instead. See [Collection projections](/docs/reference/okta-expression-language-in-identity-engine/#collection-projections) and [Federated claims with entitlements](/docs/guides/federated-claims/main/).

The following functions are designed to work only with group claims. You can't use these functions with property mappings.

| Function                        | Return type | Example                                                         |
| ---------                       | ----------- | -------                                                         |
| `Groups.contains`               | Array       | `Groups.contains(app_type/app_instance_id, pattern, limit)`            |
| `Groups.startsWith`             | Array       | `Groups.startsWith(app_type/app_instance_id, pattern, limit)`          |
| `Groups.endsWith`               | Array       | `Groups.endsWith(app_type/app_instance_id, pattern, limit)`            |

> **Important:** When you use `Groups.startsWith`, `Groups.endsWith`, or `Groups.contains`, the `pattern` argument is matched and populated on the `name` attribute rather than the group's email (for example, when using a Google Workspace). If you're targeting groups that may have duplicate group names (such as Google groups), use the `getFilteredGroups` group function or the `user.getGroups` function with collection projections instead.
>
>Example: `getFilteredGroups({"00gml2xHE3RYRx7cM0g3"}, "group.name", 40) )` (See the parameter examples section of [Use group functions for static group allowlists](/docs/guides/customize-tokens-static/main/#use-group-functions-for-static-group-allowlists).)
>
>Example: `user.getGroups({\"group.profile.name\": \"Everyone\",\"operator\": \"STARTS_WITH\"}).![name]` (See [Get groups for users](#get-groups-for-users).)
>

### Linked object function

Use this function to retrieve the user identified with the specified `primary` relationship. You can then access the properties of that user.

`user.getLinkedObject($primaryName)`:

* Parameter: (String primaryName)
* Return type: User
* Example: `user.getLinkedObject("manager").lastName`
* Example result: `Gates`

### Time functions

Time functions take their input in the form of strings. Inputting empty strings might result in unexpected behavior. Consider checking for empty strings before using these functions.

| Function                    | Input parameter signature          | Return type      | Example                                                                                                            | output                                                                                                  |
| :-----------                | :--------------------------        | :--------------- | :-----                                                                                                             | :---                                                                                                    |
| `Time.now`                  | (String timeZoneId, String format) | String           | `Time.now()`                                                                                                       | 2015-07-31T17:18:37.979Z (Current time, UTC format)                                                     |
|                             |                                    |                  | `Time.now("EST")`                                                                                                  | 2015-07-31T13:30:49.964-04:00 (Specified time zone)                                                     |
|                             |                                    |                  | `Time.now("EST", "YYYY-MM-dd HH:mm:ss")`                                                                           | 2015-07-31 13:36:48 (Specified time zone and format, military time)                                     |
| `Time.fromWindowsToIso8601` | (String time)                      | String           | Windows timestamp time as a string (Windows/LDAP timestamp doc)                                                    | The time expressed in ISO 8601 format (specifically the RFC 3339 subset of the ISO standard) |
| `Time.fromUnixToIso8601`    | (String time)                      | String           | Unix timestamp time as a string (Unix timestamp reference)                                                         | The time expressed in ISO 8601 format (specifically the RFC 3339 subset of the ISO standard). |
| `Time.fromStringToIso8601`  | (String time, String format)       | String           | Timestamp time in a human-readable yet machine-parseable arbitrary format (as defined by the [Joda time pattern](https://www.joda.org/joda-time/key_format.html)) | The time expressed in ISO 8601 format (specifically the RFC 3339 subset of the ISO standard) |
| `Time.fromIso8601ToWindows` | (String time)                      | String           | ISO 8601 timestamp time as a string                                                                                | The time expressed in Windows timestamp format                                              |
| `Time.fromIso8601ToUnix`    | (String time)                      | String           | ISO 8601 timestamp time as a string                                                                                | The time expressed in Unix timestamp format                                                  |
| `Time.fromIso8601ToString`  | (String time, String format)       | String           | ISO 8601 timestamp time converted to format using the same [Joda time pattern](https://www.joda.org/joda-time/key_format.html) semantics as fromStringToIso8601     | The time expressed in Joda timestamp format                                                          |

> **Note**: Both input parameters are optional for the Time.now function. The time zone ID supports both new and old style formats, listed previously. The third example for the Time.now function shows how to specify the military time format.

Okta supports the use of the time zone IDs and aliases listed in [the Time zone codes table](#appendix-time-zone-codes).

### Manager/assistant functions

| Function                                                           | Description                                                                         | Example                                                       |
| ---------                                                          | -----------                                                                         | -------                                                       |
| `getManagerUser(managerSource).$attribute`                         | Gets the manager's Okta user attribute values                                       | `getManagerUser("active_directory").firstName`                |
| `getManagerAppUser(managerSource, attributeSource).$attribute`     | Gets the manager's app user attribute values for the app user of any app instance.   | `getManagerAppUser("active_directory", "google").firstName`   |
| `getAssistantUser(assistantSource).$attribute`                     | Gets the assistant's Okta user attribute values.                                    | `getAssistantUser("active_directory").firstName`              |
| `getAssistantAppUser(assistantSource, attributeSource).$attribute` | Gets the assistant's app user attribute values for the app user of any app instance. | `getAssistantAppUser("active_directory", "google").firstName` |

These functions take the following parameters:

* `managerSource`: String representing the app name where the manager relationship is defined. The only currently supported value is `"active_directory"`.
* `assistantSource`: String representing the app name where the assistant relationship is defined. The only currently supported value is `"active_directory"`.
* `attributeSource`: String representing the specific app instance to query for user attributes, for example `"google"`. This is often the same as `managerSource` or `assistantSource` when dealing with a single Active Directory instance.

> **Note:**
>
> * Calling either of the `getManagerUser()` or `getManagerAppUser()` functions doesn't trigger a user profile update after the manager is changed.
> * These functions aren't supported for user profiles sourced from multiple Active Directory instances.
> * These functions aren't supported for user profile attributes from multiple app instances.
>

### Directory and Workday functions

| Function              | Description                                                                                                                                 |
| --------              | ---------                                                                                                                                   |
| `hasDirectoryUser()`  | Checks whether the user has an Active Directory (AD) assignment and returns `true` if the user has a single AD assignment or `false` if the user has either zero or multiple AD assignments  |
| `hasWorkdayUser()`    | Checks whether the user has a Workday assignment and returns a Boolean                                                                      |
| `findDirectoryUser()` | Finds the Active Directory App user object and returns that object or null if the user has more than one or no Active Directory assignments |
| `findWorkdayUser()`   | Finds the Workday App user object and returns that object or null if the user has more than one or no Workday assignments                   |

Use the previous functions together to check if a user has an Active Directory or Workday assignment, and if so, return a corresponding attribute. See the following 'Popular expressions' table for some examples.

## Constants and operators

| Common Actions                                                                              | Example                                     |
| ----------------                                                                            | --------                                    |
| Refer to a `String` constant                                                                | `'Hello world'`                             |
| Refer to an `Integer` constant                                                              | `1234`                                      |
| Refer to a `Number` constant                                                                | `3.141`                                     |
| Refer to a `Boolean` constant                                                               | `true`                                      |
| Refer to an `Array` element                                                                 | `{1, 2, 3}[0]` or `user.arrayProperty[0]`   |
| Concatenate two strings                                                                     | `user.firstName + user.lastName`            |
| Concatenate two strings with space                                                          | `user.firstName + " " + user.lastName`      |
| Ternary operator example:<br>If the group code is 123, assign the value of Sales, else assign Other | `user.groupCode == 123 ? 'Sales' : 'Other'` |
| [Elvis operator](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html#expressions-operator-elvis) (`?:`): <br> Ternary operator that provides a default value if an expression evaluates to null or an empty string; if `Groups.startsWith("OKTA", "TEST", 100)` evaluates to null, returns `{}` (empty list) | `Groups.startsWith("OKTA", "TEST", 100) ?: {}` |

## Conditional expressions

You can specify IF/THEN/ELSE statements with the Okta EL. The primary use of these expressions is profile mappings and group rules. Group rules don't usually specify an ELSE component.

The format for conditional expressions is:
<p><code>[Condition] ? [Value if TRUE] : [Value if FALSE]</code></p>

<br>There are several rules for specifying the condition:

* Expressions must have valid syntax.
* Expressions must evaluate to a Boolean.
* Expressions can't contain an assignment operator, such as `=`.
* User attributes used in expressions can contain only available user or app user attributes.

<br>The following functions are supported in these conditions:

* Any Okta Expression Language function
* The `AND` operator
* The `OR` operator
* The `!` operator to designate NOT
* Standard relational operators including <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, and <code>&gt;=</code>.
* The `matches` operator to evaluate a string against a regular expression (Regex)  <ApiLifecycle access="deprecated" />

> **Note:** Use the double equals sign `==` to check for equality and `!=` for inequality.

The following functions aren't supported in these conditions:

* Conversion
* Array
* Time

### Conditional samples

For these samples, assume that the *user* has the following attributes in Okta.

| Attribute       | Type    |
| ---------       | ----    |
| firstName       | String  |
| lastName        | String  |
| middleInitial   | String  |
| fullName        | String  |
| honorificPrefix | String  |
| email1          | String  |
| email2          | String  |
| additionalEmail | Boolean |
| city            | String  |
| salary          | Int     |
| isContractor    | Boolean |

#### Profile mapping samples

The following samples are valid conditional expressions that apply to profile mapping. The attribute `courtesyTitle` is from another system being mapped to Okta.

If the middle initial isn't empty, include it as part of the full name, using just the first character and appending a period.<br>
`firstName + " " + (String.len(middleInitial) == 0 ? "" : (String.substring(middleInitial, 0, 1) + ". ")) + lastName`

Include the honorific prefix in front of the full name, or use the courtesy title instead if it exists. If both are absent, don't use any title.<br>
`(courtesyTitle != "" ? (courtesyTitle + " ") : honorificPrefix != "" ? (honorificPrefix + " ") : "") + firstName + " " + (String.len(middleInitial) == 0 ? "" : (String.substring(middleInitial, 0, 1) + ". ")) + lastName`

#### Group rules samples

The following samples are valid conditional expressions. The actions in these cases are group assignments.

| IF (implicit) | Condition                                       | Assign to this group name if Condition is TRUE |
| ---           | ---                                             | ---                                            |
| IF            | String.stringContains(user.department, "Sales") | Sales                                          |
| IF            | user.city == "San Francisco"                    | sfo                                            |
| IF            | user.salary >= 1000000                          | expensiveEmployee                              |
| IF            | !user.isContractor                              | fullTimeEmployees                              |
| IF            | user.salary > 1000000 AND !user.isContractor    | expensiveFullTimeEmployees                     |
| IF            | user.department matches "California-[a-zA-Z]+-Sales"            | californiaSalesTeams                            |
| IF            | user.primaryPhone matches "(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}"            | allValidPhoneNumberTypes     |
| IF            | user.title matches '(?i)engineer'            |   allEngineers                        |

#### Check for null and blank attributes

To catch user attributes that are null or blank, use the following valid conditional expression:<br>
`user.employeeNumber != "" AND user.employeeNumber != null ? user.employeeNumber : user.nonEmployeeNumber`

If a profile attribute has never been populated, catch it with the following expression:<br>
`user.employeeNumber == null`

If a profile attribute was populated in the past but the content is removed, it's no longer `null` but an empty string. To catch these empty strings, use the following expression:<br>
`user.employeeNumber == ""`

## Popular expressions

Sample user data:

* Firstname = Winston
* Lastname = Churchill
* Email = <winston.churchill@gmail.com>
* Login = <winston.churchill@gmail.com>

| Value to obtain                                                    | Expression                                                                                                                                               | Example output          | Explanation                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------                                                         | ----                                                                                                                                                     | -----                   | ---------------                                                                                                                                                                                                                                                                                                                                                                                        |
| Firstname                                                          | `user.firstName`                                                                                                                                         | Winston                 | Obtain the value of the users' Firstname attribute.                                                                                                                                                                                                                                                                                                                                                        |
| Firstname + Lastname                                               | `user.firstName + user.lastName`                                                                                                                         | WinstonChurchill        | Obtain the Firstname and Lastname values and append each together.                                                                                                                                                                                                                                                                                                                                         |
| Firstname + Lastname with Separator                                | `user.firstName + "." + user.lastName`                                                                                                                   | Winston.Churchill       | Obtain Firstname value, append a "." character. Obtain and append the Lastname value.                                                                                                                                                                                                                                                                                                                  |
| First initial + Lastname                                           | `substring(user.firstName, 0, 1) + user.lastName`                                                                                                        | WChurchill              | Obtain Firstname value. From the result, retrieve characters greater than position 0 through position 1, including position 1. Obtain and append the Lastname value.                                                                                                                                                                                                                                          |
| First initial + Lastname with Limit                                | `substring(user.firstName, 0, 1) + substring(user.lastName, 0, 6)`                                                                                       | WChurch                 | Obtain Firstname value. From the result, retrieve 1 character starting at the beginning of the string. Obtain Last name value. From the result, retrieve characters greater than position 0 through position 6, including position 6.                                                                                                                                                                              |
| Lower Case First Initial + Lower Case Last name with Separator      | `toLowerCase(substring( user.firstName, 0, 1)) + "." + toLowerCase(user.lastName)`                                                                       | w.churchhill            | Obtain Firstname value. From the result, retrieve characters greater than position 0 through position 1, including position 1. Convert the result to lowercase. Append a "." character. Obtain the Lastname value. Convert to lowercase and append.                                                                                                                                                               |
| Email Domain + Email Prefix with Separator                         | `toUpperCase(substringBefore( substringAfter(user.email, "@"), ".")) + "\" + substringBefore( user.email, "@")`                                          | GMAIL\winston.churchill | Obtain Email value. From the result, parse everything after the "@ character". From the result, parse everything before the "." character. Convert to uppercase. Append a backslash "\" character. Obtain the email value again. From the result, parse for everything before the "@" character.                                                                                                                   |
| Email Domain + Lowercase First Initial and Lastname with Separator | `toUpperCase(substringBefore( substringAfter(user.email, "@"), ".")) + "\" + toLowerCase(substring( user.firstName, 0, 1)) + toLowerCase(user.lastName)` | GMAIL\wchurchill        | Obtain Email value. From the result, parse everything after the "@ character". From the result, parse everything before the "." character. Convert to uppercase. Append a backslash "\" character. Obtain the Firstname value. From the result, retrieve characters greater than position 0 through position 1, including position 1. Convert it to lowercase. Obtain the Lastname value and convert it to lowercase. |
| Static Domain + Email Prefix with Separator                        | `"XDOMAIN\" + toLowerCase(substring( user.firstName, 0, 1)) + toLowerCase(user.lastName)`                                                                | XDOMAIN\wchurchill      | Add the `XDOMAIN` string. Append a backslash "\" character. Obtain the Firstname value. From the result, retrieve characters greater than position 0 through position 1, including position 1. Convert it to lowercase. Obtain the Lastname value. Convert it to lowercase.                                                                                                                                       |
| Workday ID                                                         | `hasWorkdayUser() ? findWorkdayUser().employeeID : null`                                                                                                 | 123456                  | Check if the user has a Workday assignment, and if so, return their Workday employee ID.                                                                                                                                                                                                                                                                                                                   |
| Active Directory UPN                                               | `hasDirectoryUser() ? findDirectoryUser().managerUpn : null`                                                                                             | <bob@okta.com>            | Check if the user has an Active Directory assignment, and if so, return their Active Directory manager UPN.                                                                                                                                                                                                                                                                                                |

## Expressions for OAuth 2.0/OIDC custom claims

Okta provides a few expressions that you can only use with OAuth 2.0/OIDC custom claims.

> **Note:** These expressions don't work for SAML 2.0 apps.

* See [Create claims](/docs/guides/customize-authz-server/main/#create-claims).
* See [Include app-specific information in a custom claim](/docs/guides/customize-tokens-returned-from-okta/main/#include-app-specific-information-in-a-custom-claim).

| Syntax           | Definitions                                                             | Examples     |
| --------         | ----------                                                              | ------------ |
| `app.$attribute` | `app` refers to the name of the OIDC app.<br>`$attribute` refers to the attribute variable name. | app.id<br>app.clientId<br>app.profile |
| `access.scope` | `access` refers to the access token that requests the scopes.<br>`scope` refers to the array of granted scopes. | access.scope |

### Samples for OAuth 2.0/OIDC

#### App attributes samples

To include an app profile label, use the following expression:<br>
`app.profile.label`

See [Include app-specific information in a custom claim](/docs/guides/customize-tokens-returned-from-okta/main/#include-app-specific-information-in-a-custom-claim).

#### access.scope samples

In [API Access Management](/docs/concepts/api-access-management/) custom authorization servers, you can name a claim `scope`. Then, you can use the expression `access.scope` to return an array of granted scope strings.

To include a granted scope array and convert it to a space-delimited string, use the following expression:<br>
`String.replace(Arrays.toCsvString(access.scope),","," ")`

## Expressions in group rules

Group rule conditions only allow `String`, `Arrays`, and `user` expressions.

For example, given the user profile has a base string attribute called `email`, and assuming the user profile has a custom Boolean attribute called `hasBadge` and a custom string attribute called `favoriteColor`, the following expressions are allowed in group rule conditions:

* `user.hasBadge`
* `String.stringContains(user.email, "@example.com")`
* `Arrays.contains(user.favoriteColors, "blue")`

The following [expression using a data conversion function](#data-conversion-functions) isn't allowed in group rule conditions, even if the user profile has a custom integer
attribute called `yearJoined`: `Convert.toInt("2018") == user.yearJoined`.

## Appendix: Time zone codes

Okta supports the use of the following time zone codes:

| Standard offset       | Canonical ID                   | Aliases                                                                           |
| --------------------: | :-----------------             | ---------                                                                         |
| -12:00                | Etc/GMT+12                     |                                                                                   |
| -11:00                | Etc/GMT+11                     |                                                                                   |
| -11:00                | Pacific/Apia                   |                                                                                   |
| -11:00                | Pacific/Midway                 |                                                                                   |
| -11:00                | Pacific/Niue                   |                                                                                   |
| -11:00                | Pacific/Pago_Pago              | Pacific/Samoa, US/Samoa                                                           |
| -10:00                | America/Adak                   | America/Atka, US/Aleutian                                                         |
| -10:00                | Etc/GMT+10                     |                                                                                   |
| -10:00                | HST                            |                                                                                   |
| -10:00                | Pacific/Fakaofo                |                                                                                   |
| -10:00                | Pacific/Honolulu               | US/Hawaii                                                                         |
| -10:00                | Pacific/Johnston               |                                                                                   |
| -10:00                | Pacific/Rarotonga              |                                                                                   |
| -10:00                | Pacific/Tahiti                 |                                                                                   |
| -09:30                | Pacific/Marquesas              |                                                                                   |
| -09:00                | America/Anchorage              | US/Alaska                                                                         |
| -09:00                | America/Juneau                 |                                                                                   |
| -09:00                | America/Nome                   |                                                                                   |
| -09:00                | America/Yakutat                |                                                                                   |
| -09:00                | Etc/GMT+9                      |                                                                                   |
| -09:00                | Pacific/Gambier                |                                                                                   |
| -08:00                | America/Dawson                 |                                                                                   |
| -08:00                | America/Los_Angeles            | US/Pacific, US/Pacific-New                                                        |
| -08:00                | America/Santa_Isabel           |                                                                                   |
| -08:00                | America/Tijuana                | America/Ensenada, Mexico/BajaNorte                                                |
| -08:00                | America/Vancouver              | Canada/Pacific                                                                    |
| -08:00                | America/Whitehorse             | Canada/Yukon                                                                      |
| -08:00                | Etc/GMT+8                      |                                                                                   |
| -08:00                | PST8PDT                        |                                                                                   |
| -08:00                | Pacific/Pitcairn               |                                                                                   |
| -07:00                | America/Boise                  |                                                                                   |
| -07:00                | America/Cambridge_Bay          |                                                                                   |
| -07:00                | America/Chihuahua              |                                                                                   |
| -07:00                | America/Dawson_Creek           |                                                                                   |
| -07:00                | America/Denver                 | America/Shiprock, Navajo, US/Mountain                                             |
| -07:00                | America/Edmonton               | Canada/Mountain                                                                   |
| -07:00                | America/Hermosillo             |                                                                                   |
| -07:00                | America/Inuvik                 |                                                                                   |
| -07:00                | America/Mazatlan               | Mexico/BajaSur                                                                    |
| -07:00                | America/Ojinaga                |                                                                                   |
| -07:00                | America/Phoenix                | US/Arizona                                                                        |
| -07:00                | America/Yellowknife            |                                                                                   |
| -07:00                | Etc/GMT+7                      |                                                                                   |
| -07:00                | MST                            |                                                                                   |
| -07:00                | MST7MDT                        |                                                                                   |
| -06:00                | America/Bahia_Banderas         |                                                                                   |
| -06:00                | America/Belize                 |                                                                                   |
| -06:00                | America/Cancun                 |                                                                                   |
| -06:00                | America/Chicago                | US/Central                                                                        |
| -06:00                | America/Costa_Rica             |                                                                                   |
| -06:00                | America/El_Salvador            |                                                                                   |
| -06:00                | America/Guatemala              |                                                                                   |
| -06:00                | America/Indiana/Knox           | America/Knox_IN, US/Indiana-Starke                                                |
| -06:00                | America/Indiana/Tell_City      |                                                                                   |
| -06:00                | America/Managua                |                                                                                   |
| -06:00                | America/Matamoros              |                                                                                   |
| -06:00                | America/Menominee              |                                                                                   |
| -06:00                | America/Merida                 |                                                                                   |
| -06:00                | America/Mexico_City            | Mexico/General                                                                    |
| -06:00                | America/Monterrey              |                                                                                   |
| -06:00                | America/North_Dakota/Center    |                                                                                   |
| -06:00                | America/North_Dakota/New_Salem |                                                                                   |
| -06:00                | America/Rainy_River            |                                                                                   |
| -06:00                | America/Rankin_Inlet           |                                                                                   |
| -06:00                | America/Regina                 | Canada/East-Saskatchewan, Canada/Saskatchewan                                     |
| -06:00                | America/Swift_Current          |                                                                                   |
| -06:00                | America/Tegucigalpa            |                                                                                   |
| -06:00                | America/Winnipeg               | Canada/Central                                                                    |
| -06:00                | CST6CDT                        |                                                                                   |
| -06:00                | Etc/GMT+6                      |                                                                                   |
| -06:00                | Pacific/Easter                 | Chile/EasterIsland                                                                |
| -06:00                | Pacific/Galapagos              |                                                                                   |
| -05:00                | America/Atikokan               | America/Coral_Harbour                                                             |
| -05:00                | America/Bogota                 |                                                                                   |
| -05:00                | America/Cayman                 |                                                                                   |
| -05:00                | America/Detroit                | US/Michigan                                                                       |
| -05:00                | America/Grand_Turk             |                                                                                   |
| -05:00                | America/Guayaquil              |                                                                                   |
| -05:00                | America/Havana                 | Cuba                                                                              |
| -05:00                | America/Indiana/Indianapolis   | America/Fort_Wayne, America/Indianapolis US/East-Indiana                          |
| -05:00                | America/Indiana/Marengo        |                                                                                   |
| -05:00                | America/Indiana/Petersburg     |                                                                                   |
| -05:00                | America/Indiana/Vevay          |                                                                                   |
| -05:00                | America/Indiana/Vincennes      |                                                                                   |
| -05:00                | America/Indiana/Winamac        |                                                                                   |
| -05:00                | America/Iqaluit                |                                                                                   |
| -05:00                | America/Jamaica                | Jamaica                                                                           |
| -05:00                | America/Kentucky/Louisville    | America/Louisville                                                                |
| -05:00                | America/Kentucky/Monticello    |                                                                                   |
| -05:00                | America/Lima                   |                                                                                   |
| -05:00                | America/Montreal               |                                                                                   |
| -05:00                | America/Nassau                 |                                                                                   |
| -05:00                | America/New_York               | US/Eastern                                                                        |
| -05:00                | America/Nipigon                |                                                                                   |
| -05:00                | America/Panama                 |                                                                                   |
| -05:00                | America/Pangnirtung            |                                                                                   |
| -05:00                | America/Port-au-Prince         |                                                                                   |
| -05:00                | America/Resolute               |                                                                                   |
| -05:00                | America/Thunder_Bay            |                                                                                   |
| -05:00                | America/Toronto                | Canada/Eastern                                                                    |
| -05:00                | EST                            |                                                                                   |
| -05:00                | EST5EDT                        |                                                                                   |
| -05:00                | Etc/GMT+5                      |                                                                                   |
| -04:30                | America/Caracas                |                                                                                   |
| -04:00                | America/Anguilla               |                                                                                   |
| -04:00                | America/Antigua                |                                                                                   |
| -03:00                | America/Argentina/San_Luis     |                                                                                   |
| -04:00                | America/Aruba                  |                                                                                   |
| -04:00                | America/Asuncion               |                                                                                   |
| -04:00                | America/Barbados               |                                                                                   |
| -04:00                | America/Blanc-Sablon           |                                                                                   |
| -04:00                | America/Boa_Vista              |                                                                                   |
| -04:00                | America/Campo_Grande           |                                                                                   |
| -04:00                | America/Cuiaba                 |                                                                                   |
| -04:00                | America/Curacao                |                                                                                   |
| -04:00                | America/Dominica               |                                                                                   |
| -04:00                | America/Eirunepe               |                                                                                   |
| -04:00                | America/Glace_Bay              |                                                                                   |
| -04:00                | America/Goose_Bay              |                                                                                   |
| -04:00                | America/Grenada                |                                                                                   |
| -04:00                | America/Guadeloupe             | America/Marigot, America/St_Barthelemy                                            |
| -04:00                | America/Guyana                 |                                                                                   |
| -04:00                | America/Halifax                | Canada/Atlantic                                                                   |
| -04:00                | America/La_Paz                 |                                                                                   |
| -04:00                | America/Manaus                 | Brazil/West                                                                       |
| -04:00                | America/Martinique             |                                                                                   |
| -04:00                | America/Moncton                |                                                                                   |
| -04:00                | America/Montserrat             |                                                                                   |
| -04:00                | America/Port_of_Spain          |                                                                                   |
| -04:00                | America/Porto_Velho            |                                                                                   |
| -04:00                | America/Puerto_Rico            |                                                                                   |
| -04:00                | America/Rio_Branco             | America/Porto_Acre, Brazil/Acre                                                   |
| -04:00                | America/Santiago               | Chile/Continental                                                                 |
| -04:00                | America/Santo_Domingo          |                                                                                   |
| -04:00                | America/St_Kitts               |                                                                                   |
| -04:00                | America/St_Lucia               |                                                                                   |
| -04:00                | America/St_Thomas              | America/Virgin                                                                    |
| -04:00                | America/St_Vincent             |                                                                                   |
| -04:00                | America/Thule                  |                                                                                   |
| -04:00                | America/Tortola                |                                                                                   |
| -04:00                | Antarctica/Palmer              |                                                                                   |
| -04:00                | Atlantic/Bermuda               |                                                                                   |
| -04:00                | Atlantic/Stanley               |                                                                                   |
| -04:00                | Etc/GMT+4                      |                                                                                   |
| -03:30                | America/St_Johns               | Canada/Newfoundland                                                               |
| -03:00                | America/Araguaina              |                                                                                   |
| -03:00                | America/Argentina/Buenos_Aires | America/Buenos_Aires                                                              |
| -03:00                | America/Argentina/Catamarca    | America/Argentina/ComodRivadavia, America/Catamarca                               |
| -03:00                | America/Argentina/Cordoba      | America/Cordoba, America/Rosario                                                  |
| -03:00                | America/Argentina/Jujuy        | America/Jujuy                                                                     |
| -03:00                | America/Argentina/La_Rioja     |                                                                                   |
| -03:00                | America/Argentina/Mendoza      | America/Mendoza                                                                   |
| -03:00                | America/Argentina/Rio_Gallegos |                                                                                   |
| -03:00                | America/Argentina/Salta        |                                                                                   |
| -03:00                | America/Argentina/San_Juan     |                                                                                   |
| -03:00                | America/Argentina/Tucuman      |                                                                                   |
| -03:00                | America/Argentina/Ushuaia      |                                                                                   |
| -03:00                | America/Bahia                  |                                                                                   |
| -03:00                | America/Belem                  |                                                                                   |
| -03:00                | America/Cayenne                |                                                                                   |
| -03:00                | America/Fortaleza              |                                                                                   |
| -03:00                | America/Godthab                |                                                                                   |
| -03:00                | America/Maceio                 |                                                                                   |
| -03:00                | America/Miquelon               |                                                                                   |
| -03:00                | America/Montevideo             |                                                                                   |
| -03:00                | America/Paramaribo             |                                                                                   |
| -03:00                | America/Recife                 |                                                                                   |
| -03:00                | America/Santarem               |                                                                                   |
| -03:00                | America/Sao_Paulo              | Brazil/East                                                                       |
| -03:00                | Antarctica/Rothera             |                                                                                   |
| -03:00                | Etc/GMT+3                      |                                                                                   |
| -02:00                | America/Noronha                | Brazil/DeNoronha                                                                  |
| -02:00                | Atlantic/South_Georgia         |                                                                                   |
| -02:00                | Etc/GMT+2                      |                                                                                   |
| -01:00                | America/Scoresbysund           |                                                                                   |
| -01:00                | Atlantic/Azores                |                                                                                   |
| -01:00                | Atlantic/Cape_Verde            |                                                                                   |
| -01:00                | Etc/GMT+1                      |                                                                                   |
| +00:00                | Africa/Abidjan                 |                                                                                   |
| +00:00                | Africa/Accra                   |                                                                                   |
| +00:00                | Africa/Bamako                  | Africa/Timbuktu                                                                   |
| +00:00                | Africa/Banjul                  |                                                                                   |
| +00:00                | Africa/Bissau                  |                                                                                   |
| +00:00                | Africa/Casablanca              |                                                                                   |
| +00:00                | Africa/Conakry                 |                                                                                   |
| +00:00                | Africa/Dakar                   |                                                                                   |
| +00:00                | Africa/El_Aaiun                |                                                                                   |
| +00:00                | Africa/Freetown                |                                                                                   |
| +00:00                | Africa/Lome                    |                                                                                   |
| +00:00                | Africa/Monrovia                |                                                                                   |
| +00:00                | Africa/Nouakchott              |                                                                                   |
| +00:00                | Africa/Ouagadougou             |                                                                                   |
| +00:00                | Africa/Sao_Tome                |                                                                                   |
| +00:00                | America/Danmarkshavn           |                                                                                   |
| +00:00                | Atlantic/Canary                |                                                                                   |
| +00:00                | Atlantic/Faroe                 | Atlantic/Faeroe                                                                   |
| +00:00                | Atlantic/Madeira               |                                                                                   |
| +00:00                | Atlantic/Reykjavik             | Iceland                                                                           |
| +00:00                | Atlantic/St_Helena             |                                                                                   |
| +00:00                | Etc/GMT                        | Etc/GMT+0, Etc/GMT-0, Etc/GMT0, Etc/Greenwich, GMT, GMT+0, GMT-0, GMT0, Greenwich |
| +00:00                | Etc/UCT                        | UCT                                                                               |
| +00:00                | Etc/UTC                        | Etc/Universal, Etc/Zulu, Universal, Zulu                                          |
| +00:00                | Europe/Dublin                  | Eire                                                                              |
| +00:00                | Europe/Lisbon                  | Portugal                                                                          |
| +00:00                | Europe/London                  | Europe/Belfast, Europe/Guernsey, Europe/Isle_of_Man, Europe/Jersey, GB, GB-Eire   |
| +00:00                | UTC                            |                                                                                   |
| +00:00                | WET                            |                                                                                   |
| +01:00                | Africa/Algiers                 |                                                                                   |
| +01:00                | Africa/Bangui                  |                                                                                   |
| +01:00                | Africa/Brazzaville             |                                                                                   |
| +01:00                | Africa/Ceuta                   |                                                                                   |
| +01:00                | Africa/Douala                  |                                                                                   |
| +01:00                | Africa/Kinshasa                |                                                                                   |
| +01:00                | Africa/Lagos                   |                                                                                   |
| +01:00                | Africa/Libreville              |                                                                                   |
| +01:00                | Africa/Luanda                  |                                                                                   |
| +01:00                | Africa/Malabo                  |                                                                                   |
| +01:00                | Africa/Ndjamena                |                                                                                   |
| +01:00                | Africa/Niamey                  |                                                                                   |
| +01:00                | Africa/Porto-Novo              |                                                                                   |
| +01:00                | Africa/Tunis                   |                                                                                   |
| +01:00                | Africa/Windhoek                |                                                                                   |
| +01:00                | CET                            |                                                                                   |
| +01:00                | Etc/GMT-1                      |                                                                                   |
| +01:00                | Europe/Amsterdam               |                                                                                   |
| +01:00                | Europe/Andorra                 |                                                                                   |
| +01:00                | Europe/Belgrade                | Europe/Ljubljana, Europe/Podgorica, Europe/Sarajevo, Europe/Skopje, Europe/Zagreb |
| +01:00                | Europe/Berlin                  |                                                                                   |
| +01:00                | Europe/Brussels                |                                                                                   |
| +01:00                | Europe/Budapest                |                                                                                   |
| +01:00                | Europe/Copenhagen              |                                                                                   |
| +01:00                | Europe/Gibraltar               |                                                                                   |
| +01:00                | Europe/Luxembourg              |                                                                                   |
| +01:00                | Europe/Madrid                  |                                                                                   |
| +01:00                | Europe/Malta                   |                                                                                   |
| +01:00                | Europe/Monaco                  |                                                                                   |
| +01:00                | Europe/Oslo                    | Arctic/Longyearbyen, Atlantic/Jan_Mayen                                           |
| +01:00                | Europe/Paris                   |                                                                                   |
| +01:00                | Europe/Prague                  | Europe/Bratislava                                                                 |
| +01:00                | Europe/Rome                    | Europe/San_Marino, Europe/Vatican                                                 |
| +01:00                | Europe/Stockholm               |                                                                                   |
| +01:00                | Europe/Tirane                  |                                                                                   |
| +01:00                | Europe/Vaduz                   |                                                                                   |
| +01:00                | Europe/Vienna                  |                                                                                   |
| +01:00                | Europe/Warsaw                  | Poland                                                                            |
| +01:00                | Europe/Zurich                  |                                                                                   |
| +01:00                | MET                            |                                                                                   |
| +02:00                | Africa/Blantyre                |                                                                                   |
| +02:00                | Africa/Bujumbura               |                                                                                   |
| +02:00                | Africa/Cairo                   | Egypt                                                                             |
| +02:00                | Africa/Gaborone                |                                                                                   |
| +02:00                | Africa/Harare                  |                                                                                   |
| +02:00                | Africa/Johannesburg            |                                                                                   |
| +02:00                | Africa/Kigali                  |                                                                                   |
| +02:00                | Africa/Lubumbashi              |                                                                                   |
| +02:00                | Africa/Lusaka                  |                                                                                   |
| +02:00                | Africa/Maputo                  |                                                                                   |
| +02:00                | Africa/Maseru                  |                                                                                   |
| +02:00                | Africa/Mbabane                 |                                                                                   |
| +02:00                | Africa/Tripoli                 | Libya                                                                             |
| +02:00                | Asia/Amman                     |                                                                                   |
| +02:00                | Asia/Beirut                    |                                                                                   |
| +02:00                | Asia/Damascus                  |                                                                                   |
| +02:00                | Asia/Gaza                      |                                                                                   |
| +02:00                | Asia/Jerusalem                 | Asia/Tel_Aviv, Israel                                                             |
| +02:00                | Asia/Nicosia                   | Europe/Nicosia                                                                    |
| +02:00                | EET                            |                                                                                   |
| +02:00                | Etc/GMT-2                      |                                                                                   |
| +02:00                | Europe/Athens                  |                                                                                   |
| +02:00                | Europe/Bucharest               |                                                                                   |
| +02:00                | Europe/Chisinau                | Europe/Tiraspol                                                                   |
| +02:00                | Europe/Helsinki                | Europe/Mariehamn                                                                  |
| +02:00                | Europe/Istanbul                | Asia/Istanbul, Turkey                                                             |
| +02:00                | Europe/Kaliningrad             |                                                                                   |
| +02:00                | Europe/Kiev                    |                                                                                   |
| +02:00                | Europe/Minsk                   |                                                                                   |
| +02:00                | Europe/Riga                    |                                                                                   |
| +02:00                | Europe/Simferopol              |                                                                                   |
| +02:00                | Europe/Sofia                   |                                                                                   |
| +02:00                | Europe/Tallinn                 |                                                                                   |
| +02:00                | Europe/Uzhgorod                |                                                                                   |
| +02:00                | Europe/Vilnius                 |                                                                                   |
| +02:00                | Europe/Zaporozhye              |                                                                                   |
| +03:00                | Africa/Addis_Ababa             |                                                                                   |
| +03:00                | Africa/Asmara                  | Africa/Asmera                                                                     |
| +03:00                | Africa/Dar_es_Salaam           |                                                                                   |
| +03:00                | Africa/Djibouti                |                                                                                   |
| +03:00                | Africa/Kampala                 |                                                                                   |
| +03:00                | Africa/Khartoum                |                                                                                   |
| +03:00                | Africa/Mogadishu               |                                                                                   |
| +03:00                | Africa/Nairobi                 |                                                                                   |
| +03:00                | Antarctica/Syowa               |                                                                                   |
| +03:00                | Asia/Aden                      |                                                                                   |
| +03:00                | Asia/Baghdad                   |                                                                                   |
| +03:00                | Asia/Bahrain                   |                                                                                   |
| +03:00                | Asia/Kuwait                    |                                                                                   |
| +03:00                | Asia/Qatar                     |                                                                                   |
| +03:00                | Asia/Riyadh                    |                                                                                   |
| +03:00                | Etc/GMT-3                      |                                                                                   |
| +03:00                | Europe/Moscow                  | W-SU                                                                              |
| +03:00                | Europe/Samara                  |                                                                                   |
| +03:00                | Europe/Volgograd               |                                                                                   |
| +03:00                | Indian/Antananarivo            |                                                                                   |
| +03:00                | Indian/Comoro                  |                                                                                   |
| +03:00                | Indian/Mayotte                 |                                                                                   |
| +03:30                | Asia/Tehran                    | Iran                                                                              |
| +04:00                | Asia/Baku                      |                                                                                   |
| +04:00                | Asia/Dubai                     |                                                                                   |
| +04:00                | Asia/Muscat                    |                                                                                   |
| +04:00                | Asia/Tbilisi                   |                                                                                   |
| +04:00                | Asia/Yerevan                   |                                                                                   |
| +04:00                | Etc/GMT-4                      |                                                                                   |
| +04:00                | Indian/Mahe                    |                                                                                   |
| +04:00                | Indian/Mauritius               |                                                                                   |
| +04:00                | Indian/Reunion                 |                                                                                   |
| +04:30                | Asia/Kabul                     |                                                                                   |
| +05:00                | Antarctica/Mawson              |                                                                                   |
| +05:00                | Asia/Aqtau                     |                                                                                   |
| +05:00                | Asia/Aqtobe                    |                                                                                   |
| +05:00                | Asia/Ashgabat                  | Asia/Ashkhabad                                                                    |
| +05:00                | Asia/Dushanbe                  |                                                                                   |
| +05:00                | Asia/Karachi                   |                                                                                   |
| +05:00                | Asia/Oral                      |                                                                                   |
| +05:00                | Asia/Samarkand                 |                                                                                   |
| +05:00                | Asia/Tashkent                  |                                                                                   |
| +05:00                | Asia/Yekaterinburg             |                                                                                   |
| +05:00                | Etc/GMT-5                      |                                                                                   |
| +05:00                | Indian/Kerguelen               |                                                                                   |
| +05:00                | Indian/Maldives                |                                                                                   |
| +05:30                | Asia/Colombo                   |                                                                                   |
| +05:30                | Asia/Kolkata                   | Asia/Calcutta                                                                     |
| +05:45                | Asia/Kathmandu                 | Asia/Katmandu                                                                     |
| +06:00                | Antarctica/Vostok              |                                                                                   |
| +06:00                | Asia/Almaty                    |                                                                                   |
| +06:00                | Asia/Bishkek                   |                                                                                   |
| +06:00                | Asia/Dhaka                     | Asia/Dacca                                                                        |
| +06:00                | Asia/Novokuznetsk              |                                                                                   |
| +06:00                | Asia/Novosibirsk               |                                                                                   |
| +06:00                | Asia/Omsk                      |                                                                                   |
| +06:00                | Asia/Qyzylorda                 |                                                                                   |
| +06:00                | Asia/Thimphu                   | Asia/Thimbu                                                                       |
| +06:00                | Etc/GMT-6                      |                                                                                   |
| +06:00                | Indian/Chagos                  |                                                                                   |
| +06:30                | Asia/Rangoon                   |                                                                                   |
| +06:30                | Indian/Cocos                   |                                                                                   |
| +07:00                | Antarctica/Davis               |                                                                                   |
| +07:00                | Asia/Bangkok                   |                                                                                   |
| +07:00                | Asia/Ho_Chi_Minh               | Asia/Saigon                                                                       |
| +07:00                | Asia/Hovd                      |                                                                                   |
| +07:00                | Asia/Jakarta                   |                                                                                   |
| +07:00                | Asia/Krasnoyarsk               |                                                                                   |
| +07:00                | Asia/Phnom_Penh                |                                                                                   |
| +07:00                | Asia/Pontianak                 |                                                                                   |
| +07:00                | Asia/Vientiane                 |                                                                                   |
| +07:00                | Etc/GMT-7                      |                                                                                   |
| +07:00                | Indian/Christmas               |                                                                                   |
| +08:00                | Antarctica/Casey               |                                                                                   |
| +08:00                | Asia/Brunei                    |                                                                                   |
| +08:00                | Asia/Choibalsan                |                                                                                   |
| +08:00                | Asia/Chongqing                 | Asia/Chungking                                                                    |
| +08:00                | Asia/Harbin                    |                                                                                   |
| +08:00                | Asia/Hong_Kong                 | Hongkong                                                                          |
| +08:00                | Asia/Irkutsk                   |                                                                                   |
| +08:00                | Asia/Kashgar                   |                                                                                   |
| +08:00                | Asia/Kuala_Lumpur              |                                                                                   |
| +08:00                | Asia/Kuching                   |                                                                                   |
| +08:00                | Asia/Macau                     | Asia/Macao                                                                        |
| +08:00                | Asia/Makassar                  | Asia/Ujung_Pandang                                                                |
| +08:00                | Asia/Manila                    |                                                                                   |
| +08:00                | Asia/Shanghai                  | PRC                                                                               |
| +08:00                | Asia/Singapore                 | Singapore                                                                         |
| +08:00                | Asia/Taipei                    | ROC                                                                               |
| +08:00                | Asia/Ulaanbaatar               | Asia/Ulan_Bator                                                                   |
| +08:00                | Asia/Urumqi                    |                                                                                   |
| +08:00                | Australia/Perth                | Australia/West                                                                    |
| +08:00                | Etc/GMT-8                      |                                                                                   |
| +08:45                | Australia/Eucla                |                                                                                   |
| +09:00                | Asia/Dili                      |                                                                                   |
| +09:00                | Asia/Jayapura                  |                                                                                   |
| +09:00                | Asia/Pyongyang                 |                                                                                   |
| +09:00                | Asia/Seoul                     | ROK                                                                               |
| +09:00                | Asia/Tokyo                     | Japan                                                                             |
| +09:00                | Asia/Yakutsk                   |                                                                                   |
| +09:00                | Etc/GMT-9                      |                                                                                   |
| +09:00                | Pacific/Palau                  |                                                                                   |
| +09:30                | Australia/Adelaide             | Australia/South                                                                   |
| +09:30                | Australia/Broken_Hill          | Australia/Yancowinna                                                              |
| +09:30                | Australia/Darwin               | Australia/North                                                                   |
| +10:00                | Antarctica/DumontDUrville      |                                                                                   |
| +10:00                | Asia/Sakhalin                  |                                                                                   |
| +10:00                | Asia/Vladivostok               |                                                                                   |
| +10:00                | Australia/Brisbane             | Australia/Queensland                                                              |
| +10:00                | Australia/Currie               |                                                                                   |
| +10:00                | Australia/Hobart               | Australia/Tasmania                                                                |
| +10:00                | Australia/Lindeman             |                                                                                   |
| +10:00                | Australia/Melbourne            | Australia/Victoria                                                                |
| +10:00                | Australia/Sydney               | Australia/ACT, Australia/Canberra, Australia/NSW                                  |
| +10:00                | Etc/GMT-10                     |                                                                                   |
| +10:00                | Pacific/Chuuk                  | Pacific/Truk, Pacific/Yap                                                         |
| +10:00                | Pacific/Guam                   |                                                                                   |
| +10:00                | Pacific/Port_Moresby           |                                                                                   |
| +10:00                | Pacific/Saipan                 |                                                                                   |
| +10:30                | Australia/Lord_Howe            | Australia/LHI                                                                     |
| +11:00                | Antarctica/Macquarie           |                                                                                   |
| +11:00                | Asia/Anadyr                    |                                                                                   |
| +11:00                | Asia/Kamchatka                 |                                                                                   |
| +11:00                | Asia/Magadan                   |                                                                                   |
| +11:00                | Etc/GMT-11                     |                                                                                   |
| +11:00                | Pacific/Efate                  |                                                                                   |
| +11:00                | Pacific/Guadalcanal            |                                                                                   |
| +11:00                | Pacific/Kosrae                 |                                                                                   |
| +11:00                | Pacific/Noumea                 |                                                                                   |
| +11:00                | Pacific/Pohnpei                | Pacific/Ponape                                                                    |
| +11:30                | Pacific/Norfolk                |                                                                                   |
| +12:00                | Antarctica/McMurdo             | Antarctica/South_Pole                                                             |
| +12:00                | Etc/GMT-12                     |                                                                                   |
| +12:00                | Pacific/Auckland               | NZ                                                                                |
| +12:00                | Pacific/Fiji                   |                                                                                   |
| +12:00                | Pacific/Funafuti               |                                                                                   |
| +12:00                | Pacific/Kwajalein              | Kwajalein                                                                         |
| +12:00                | Pacific/Majuro                 |                                                                                   |
| +12:00                | Pacific/Nauru                  |                                                                                   |
| +12:00                | Pacific/Tarawa                 |                                                                                   |
| +12:00                | Pacific/Wake                   |                                                                                   |
| +12:00                | Pacific/Wallis                 |                                                                                   |
| +12:45                | Pacific/Chatham                | NZ-CHAT                                                                           |
| +13:00                | Etc/GMT-13                     |                                                                                   |
| +13:00                | Pacific/Enderbury              |                                                                                   |
| +13:00                | Pacific/Tongatapu              |                                                                                   |
| +14:00                | Etc/GMT-14                     |                                                                                   |
| +14:00                | Pacific/Kiritimati             |                                                                                   |
