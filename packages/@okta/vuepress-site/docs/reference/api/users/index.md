---
title: Users
category: management
---

# Users API

Explore the [Okta Public API Collections](https://www.postman.com/okta-eng/workspace/okta-public-api-collections/overview) workspace to get started with the Users API.

<!--<ApiAuthMethodWarning />

## Getting started

Explore the Users API: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9daeb4b935a423c39009)-->

## User operations

The Users API provides operations to manage users in your org. These operations are available at the new [Okta API reference portal](https://developer.okta.com/docs/api/) as part of the [Users API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/).

### Create User

See [Create a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/createUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
<ApiOperation method="post" url="/api/v1/users" />

Creates a new user in your Okta organization with or without credentials

- [Create User without Credentials](#create-user-without-credentials)
- [Create User with Recovery Question](#create-user-with-recovery-question)
- [Create User with Password](#create-user-with-password)
- [Create User with Imported Hashed Password](#create-user-with-imported-hashed-password)
- [Create User with Password Import Inline Hook](#create-user-with-password-import-inline-hook)
- [Create User with Password & Recovery Question](#create-user-with-password-recovery-question)
- [Create User with Authentication Provider](#create-user-with-authentication-provider)
- [Create User in Group](#create-user-in-group)
- [Create User with Non-Default user type](#create-user-with-non-default-user-type)

> **Legal Disclaimer** <br><br>
After a user is added to the Okta directory, they receive an activation email. As part of signing up for this service, you agreed not to use Okta's service/product to spam and/or send unsolicited messages. Please refrain from adding unrelated accounts to the directory as Okta is not responsible for, and disclaims any and all liability associated with, the activation email's content. You, and you alone, bear responsibility for the emails sent to any recipients.

##### Request parameters

| Parameter     | Description                                                                                                                                                                | Param Type   | DataType                                     | Required   | Default |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------      | :----------- | :------------------------------------------- | :--------- | :------ |
| activate      | Executes [activation lifecycle](#activate-user) operation when creating the user                                                                                           | Query        | Boolean                                      | FALSE      | TRUE    |
| provider      | Indicates whether to create a user with a specified authentication provider                                                                                                | Query        | Boolean                                      | FALSE      | FALSE   |
| profile       | Profile properties for user                                                                                                                                                | Body         | [Profile object](#profile-object)            | TRUE       |         |
| credentials   | Credentials for user                                                                                                                                                       | Body         | [Credentials object](#credentials-object)    | FALSE      |         |
| groupIds      | Ids of groups that user will be added to at time of creation                                                                                                   | Body         | Array of Group Ids                           | FALSE      |         |
| nextLogin     | With `activate=true`, if `nextLogin=changePassword`, a user is created, activated, and the password is set to `EXPIRED`, so user must change it the next time they log in. | Query        | String                                       | FALSE      | FALSE   |

##### Response parameters

All responses return the created [User](#user-object).  Activation of a user is an asynchronous operation.  The system performs group reconciliation during activation and assigns the user to all applications via direct or indirect relationships (group memberships).

* The user's `transitioningToStatus` property is `ACTIVE` during activation to indicate that the user hasn't completed the asynchronous operation.
* The user's `status` is `ACTIVE` when the activation process is complete.

The user is emailed a one-time activation token if activated without a password.

>**Note:** If the user is assigned to an application that is configured for provisioning, the activation process triggers downstream provisioning to the application.  It is possible for a user to login before these applications have been successfully provisioned for the user.

| Security Q & A   | Password   | Activate Query Parameter   | User Status     | Login Credential         | Welcome Screen   |
| :--------------: | :--------: | :------------------------: | :-------------: | :----------------------: | :--------------: |
|                  |            | FALSE                      | `STAGED`        |                          |                  |
|                  |            | TRUE                       | `PROVISIONED` or `ACTIVE`   | One-Time Token (Email) or Email  | X                |
| X                |            | FALSE                      | `STAGED`        |                          |                  |
| X                |            | TRUE                       | `PROVISIONED` or `ACTIVE`   | One-Time Token (Email) or Email  | X                |
|                  | X          | FALSE                      | `STAGED`        |                          |                  |
|                  | X          | TRUE                       | `ACTIVE`        | Password                 | X                |
| X                | X          | FALSE                      | `STAGED`        |                          |                  |
| X                | X          | TRUE                       | `ACTIVE`        | Password                 |                  |

Creating users with a `FEDERATION` or `SOCIAL` provider sets the user status to either `ACTIVE` or `STAGED` based on the `activate` query parameter since these two providers don't support a `password` or `recovery_question` credential.

#### Create User with Optional Password enabled

<ApiLifeCycle access="ea" />

When Optional Password is enabled, the user status following user creation can be affected by the enrollment policy. See [Create an authenticator enrollment policy](https://help.okta.com/okta_help.htm?type=oie&id=ext-create-mfa-policy).
Based on the group memberships that are specified when the user is created, a password may or may not be required to make the user's status `ACTIVE`. See [Create user in a group](#create-user-in-group).

If the enrollment policy that applies to the user (as determined by the groups assigned to the user) specifies that the Password authenticator is `required`, then in the case where the user is created without a password, the user is in the `PROVISIONED` state and
a One-Time Token is sent to the user through email.
If the user is created with a password, then their state is set to ACTIVE, and they can immediately sign in using their Password authenticator.

If the enrollment policy that applies to the groups specified for the newly created user indicates that password is `optional` or `disabled`, then the Administrator can't specify a password for the user. Instead, the user status is set to `ACTIVE` and the user may immediately sign in using their Email authenticator. If policy permits, and the user so chooses, they can enroll a password after they sign in.

#### Create User without credentials

Creates a user without a [password](#password-object) or [recovery question & answer](#recovery-question-object)

If appropriate, when the user is activated, an email is sent to the user with an activation token that the user can use to complete the activation process.
This is the default flow for new user registration using the administrator UI.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  }
}' "https://${yourOktaDomain}/api/v1/users?activate=false"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "STAGED",
  "created": "2013-07-02T21:36:25.344Z",
  "activated": null,
  "statusChanged": null,
  "lastLogin": null,
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": null,
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "activate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    }
  }
}
```

#### Create User with recovery question

Creates a user without a [password](#password-object)

When the user is activated, an email is sent to the user with an activation token that can be used to complete the activation process.
This flow is useful if migrating users from an existing user store.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "recovery_question": {
      "question": "Who'\''s a major player in the cowboy scene?",
      "answer": "Annie Oakley"
    }
  }
}' "https://${yourOktaDomain}/api/v1/users?activate=false"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "STAGED",
  "created": "2013-07-02T21:36:25.344Z",
  "activated": null,
  "statusChanged": null,
  "lastLogin": null,
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": null,
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "activate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    }
  }
}
```

#### Create User with password

Creates a user without a [recovery question & answer](#recovery-question-object)

The new user is able to sign in after activation with the assigned password.
This flow is common when developing a custom user registration experience.

> **Important:** Do not generate or send a one-time activation token when activating users with an assigned password.  Users should sign in with their assigned password.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password" : { "value": "tlpWENT2m" }
  }
}' "https://${yourOktaDomain}/api/v1/users?activate=true"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-07-02T21:36:25.344Z",
  "activated": null,
  "statusChanged": null,
  "lastLogin": null,
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "activate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    }
  }
}
```

#### Create User with imported hashed password

Creates a user with a specified [hashed password](#hashed-password-object).

The new user is able to sign in after activation with the specified password.
This flow is common when migrating users from another data store in cases where we want to allow the users to retain their current passwords.

> **Important:** Do not generate or send a one-time activation token when activating users with an imported password.  Users should login with their imported password.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password" : {
      "hash": {
        "algorithm": "BCRYPT",
        "workFactor": 10,
        "salt": "rwh3vH166HCH/NT9XV5FYu",
        "value": "qaMqvAPULkbiQzkTCWo5XDcvzpk8Tna"
      }
    }
  }
}' "https://${yourOktaDomain}/api/v1/users?activate=false"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-07-02T21:36:25.344Z",
  "activated": null,
  "statusChanged": null,
  "lastLogin": null,
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "provider": {
      "type": "IMPORT",
      "name": "IMPORT"
    }
  },
  "_links": {
    "activate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    }
  }
}
```

#### Create User with password import inline hook

Creates a user with a [Password Hook](#password-hook-object) object specifying that a password inline hook should be used to handle password verification.

The password inline hook is triggered to handle verification of the end user's password the first time the user tries to sign in, with Okta calling the password inline hook to check that the password the user supplied is valid. If the password is valid, Okta stores the hash of the password that was provided and can authenticate the user independently from then on. See [Password import inline hook](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/InlineHook/#tag/InlineHook/operation/createPasswordImportInlineHook) for more details.

The new user is able to sign in after activation with the valid password. This flow supports migrating users from another data store in cases where we wish to allow the users to retain their current passwords.

> **Important:** Don't generate or send a one-time activation token when activating users with an password inline hook. Users should sign in with their existing password to be imported using the password import inline hook.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password" : {
      "hook": {
        "type": "default"
      }
    }
  }
}' "https://${yourOktaDomain}/api/v1/users?activate=true"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-07-02T21:36:25.344Z",
  "activated": null,
  "statusChanged": null,
  "lastLogin": null,
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "provider": {
      "type": "IMPORT",
      "name": "IMPORT"
    }
  },
  "_links": {
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    }
  }
}
```

#### Create User with Password & Recovery Question

Creates a new user with a [password](#password-object) and [recovery question & answer](#recovery-question-object)

The new user is able to log in with the assigned password after activation.
This flow is common when developing a custom user-registration experience.

> **Important:** Don't generate or send a one-time activation token when activating users with an assigned password.  Users should login with their assigned password.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password" : { "value": "tlpWENT2m" },
    "recovery_question": {
      "question": "Who'\''s a major player in the cowboy scene?",
      "answer": "Annie Oakley"
    }
  }
}' "https://${yourOktaDomain}/api/v1/users?activate=false"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "STAGED",
  "created": "2013-07-02T21:36:25.344Z",
  "activated": null,
  "statusChanged": null,
  "lastLogin": null,
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "activate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    }
  }
}
```

#### Create User with Authentication Provider

Creates a new passwordless user with a `SOCIAL` or `FEDERATION` [authentication provider](#provider-object) that must be authenticated via a trusted Identity Provider

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "provider": {
      "type": "FEDERATION",
      "name": "FEDERATION"
    }
  }
}' "https://${yourOktaDomain}/api/v1/users?provider=true"
```

##### Response example

```json
{
  "id": "00uijntSwJjSHtDY70g3",
  "status": "ACTIVE",
  "created": "2016-01-19T22:02:08.000Z",
  "activated": "2016-01-19T22:02:08.000Z",
  "statusChanged": "2016-01-19T22:02:08.000Z",
  "lastLogin": null,
  "lastUpdated": "2016-01-19T22:02:08.000Z",
  "passwordChanged": null,
  "profile": {
    "login": "isaac.brock@example.com",
    "firstName": "Isaac",
    "lastName": "Brock",
    "mobilePhone": "555-415-1337",
    "email": "isaac.brock@example.com",
    "secondEmail": null
  },
  "credentials": {
    "provider": {
      "type": "FEDERATION",
      "name": "FEDERATION"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00uijntSwJjSHtDY70g3/lifecycle/reset_password",
      "method": "POST"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00uijntSwJjSHtDY70g3/credentials/change_recovery_question",
      "method": "POST"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00uijntSwJjSHtDY70g3/lifecycle/deactivate",
      "method": "POST"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    }
  }
}
```

#### Create User in Group

Creates a user that is added to the specified groups upon creation

Use this in conjunction with other create operations for a Group Administrator that is scoped to create users only in specified groups.  The request may specify up to 20 group ids.  (This limit applies only when creating a user.  The user may later be added to more groups.)

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "groupIds": [
    "00g1emaKYZTWRYYRRTSK",
    "00garwpuyxHaWOkdV0g4"
  ]
}' "https://${yourOktaDomain}/api/v1/users?activate=false"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "STAGED",
  "created": "2013-07-02T21:36:25.344Z",
  "activated": null,
  "statusChanged": null,
  "lastLogin": null,
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": null,
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "activate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    }
  }
}
```

#### Create User with non-default user type

Creates a user with a specified user type (see [user types](/docs/reference/api/user-types)). The type specification may be included with any of the above Create User operations; this example demonstrates creating a user without credentials.

The user type determines which [schema](/docs/reference/api/schemas) applies to that user. After a user has been created, the user can be assigned a different user type only by an administrator via a full replacement [PUT operation](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserType/#tag/UserType/operation/updateUserType).

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "type": {
    "id": "otyfnjfba4ye7pgjB0g4"
  }
}' "https://${yourOktaDomain}/api/v1/users?activate=false"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "STAGED",
  "created": "2013-07-02T21:36:25.344Z",
  "activated": null,
  "statusChanged": null,
  "lastLogin": null,
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": null,
  "type": {
    "id": "otyfnjfba4ye7pgjB0g4"
  },
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "schema": {
      "href": "https://{yourOktaDomain}/api/v1/meta/schemas/user/oscfnjfba4ye7pgjB0g4"
    },
    "activate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
    },
    "type": {
      "href": "https://{yourOktaDomain}/api/v1/meta/types/user/otyfnjfba4ye7pgjB0g4"
    }
  }
}
```
--->

### Get User

See [Retrieve a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/getUser).

<!--
<ApiOperation method="get" url="/api/v1/users/${userId}" /> <SupportsCors />

Fetches a user from your Okta organization

- [Get Current User](#get-current-user)
- [Get User with ID](#get-user-with-id)
- [Get User with Login](#get-user-with-login)
- [Get User with Login Shortname](#get-user-with-login-shortname)

##### Content-Type header fields

This endpoint supports an optional `okta-response` value for the `Content-Type` header, which can be used for performance optimization. Complex DelAuth configurations may degrade performance when fetching specific parts of the response, and passing this parameter can omit these parts, bypassing the bottleneck.

The `okta-response` header value takes a comma-separated list of omit options (optionally surrounded in quotes), each specifying a part of the response to omit.

| okta-response value       | Description                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| omitCredentials           | Omits the credentials subobject from the response                                                                                        |
| omitCredentialsLinks      | Omits the following HAL links from the response:  Change Password, Change Recovery Question, Forgot Password, Reset Password, Reset Factors, Unlock |
| omitTransitioningToStatus | Omits the `transitioningToStatus` field from the response                                                                                 |

The performance optimization will only be applied when all three parameters are passed.  Unrecognized parameters are ignored.

###### Content-Type header examples

**Header:** `Content-Type: application/json; okta-response=omitCredentials,omitCredentialsLinks`<br>
**Result:** Omits the credentials subobject and credentials links from the response.  Does not apply performance optimization.

**Header:** `Content-Type: application/json; okta-response="omitCredentials,omitCredentialsLinks, omitTransitioningToStatus"`<br>
**Result:** Omits the credentials, credentials links, and `transitioningToStatus` field from the response.  Applies performance optimization.

##### Request parameters

Fetch a user by `id`, `login`, or `login shortname` if the short name is unambiguous.

| Parameter | Description                                                        | Param Type | DataType | Required |
| --------- | ------------------------------------------------------------------ | ---------- | -------- | -------- |
| id        | `id`, `login`, or `login shortname` (as long as it is unambiguous) | URL        | String   | TRUE     |
| expand    | Valid value: `block`. If this parameter is specified, then account block details are included in the `_embedded` attribute. The [embedded object](/docs/reference/api/users/#user-block-object) lists information about how the account is blocked from access. | Query        | String   | FALSE     |

> When fetching a user by `login` or `login shortname`, you should [URL encode](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding) the request parameter to ensure that special characters are escaped properly. Usernames with a `/` or `?`  character can only be fetched by `id` due to URL issues with escaping the `/` and `?` characters.

>**Hint:** you can substitute `me` for the `id` to fetch the current user linked to an API token or session cookie.

>**Note:** Some browsers block third-party cookies by default, which disrupts Okta functionality in certain flows. See [Mitigate the impact of third-party cookie deprecation](https://help.okta.com/okta_help.htm?type=oie&id=ext-third-party-cookies).

##### Response parameters

Fetched [User](#user-object)

An invalid `id` returns a `404 Not Found` status code.

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
    "errorCode": "E0000007",
    "errorSummary": "Not found: Resource not found: missing@example.com (User)",
    "errorLink": "E0000007",
    "errorId": "oaewgzWY_IaSs6G8Cf2TzzIsA",
    "errorCauses": []
}
```
-->

#### Get current User

<!--Fetches the current user linked to an API token or a session cookie-->

See [Retrieve a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/getUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
##### Request example

The following example fetches the current user linked to a session cookie:

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Cookie: ${okta_session_cookie}" \
"https://${yourOktaDomain}/api/v1/users/me"
```

> **Note:** This is typically a CORS request from the browser when the end user has an active Okta session. Therefore, it's possible to retrieve the current user without the `Authorization` header.

##### Request example

The following example fetches the current user linked to an API token:

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/me"
```

> **Note:** This request returns the user linked to the API token that is specified in the `Authorization` header, not the user linked to the active session. Details of the Admin user who granted the API token is returned.

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```
-->

#### Get User with ID

<!--Fetches a specific user when you know the user's `id`-->

See [Retrieve a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/getUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

> **Hint:** If you don't know the user `id`, [list the users](#list-users) to find the correct ID.

<!--
##### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```
-->

#### Get User with login

See [Retrieve a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/getUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--Fetches a specific user when you know the user's `login`

When fetching a user by `login`, [URL encode](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding) the request parameter to ensure that special characters are escaped properly.
Logins with a `/` character can only be fetched by `id` due to URL issues with escaping the `/` character.

##### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/isaac.brock%40example.com"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```
-->

#### Get User with Login Shortname

See [Retrieve a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/getUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
Fetches a specific user when you know the user's `login shortname` and the shortname is unique within the organization

When fetching a user by `login shortname`, [URL encode](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding) the request parameter to ensure that special characters are escaped properly.
Logins with a `/` character can only be fetched by `id` due to URL issues with escaping the `/` character.

##### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/isaac.brock"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```
-->

### List Users

<!--
<ApiOperation method="get" url="/api/v1/users" />

Lists users in your organization with pagination in most cases

A subset of users can be returned that match a supported filter expression or search criteria.

##### Content-Type header fields

This endpoint supports an optional `okta-response` value for the `Content-Type` header, which can be used for performance optimization. Complex DelAuth configurations may degrade performance when fetching specific parts of the response, and passing this parameter can omit these parts, bypassing the bottleneck.

The `okta-response` header value takes a comma-separated list of omit options (optionally surrounded in quotes), each specifying a part of the response to omit.

| okta-response value       | Description                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| omitCredentials           | Omits the credentials subobject from the response                                                                                        |
| omitCredentialsLinks      | Omits the following HAL links from the response:  Change Password, Change Recovery Question, Forgot Password, Reset Password, Reset Factors, Unlock |
| omitTransitioningToStatus | Omits the `transitioningToStatus` field from the response                                                                                 |

The performance optimization will only be applied when all three parameters are passed.  Unrecognized parameters are ignored.

###### Content-Type header examples

**Header:** `Content-Type: application/json; okta-response=omitCredentials,omitCredentialsLinks`<br>
**Result:** Omits the credentials subobject and credentials links from the response.  Does not apply performance optimization.

**Header:** `Content-Type: application/json; okta-response="omitCredentials,omitCredentialsLinks, omitTransitioningToStatus"`<br>
**Result:** Omits the credentials, credentials links, and `transitioningToStatus` field from the response.  Applies performance optimization.

##### Request parameters

The first three parameters in the table below correspond to different ways to list users. For further details and examples on these parameters, see [User query options](/docs/reference/user-query) or the following sections.

- [List Users with Search](#list-users-with-search) (`search`)
- [List Users with a Filter](#list-users-with-a-filter) (`filter`)
- [Find Users](#find-users) (`q`)
- [List All Users](#list-all-users) (no parameters)

| Parameter   | Description                                                                                                                                    | Param Type   | DataType   | Required |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :----------- | :--------- | :------- |
| search      | Searches for users with a supported [filtering](/docs/reference/core-okta-api/#filter) expression for most properties. Okta recommends this option for optimal performance.          | Query        | String     | FALSE    |
| filter      | [Filters](/docs/reference/core-okta-api/#filter) users with a supported expression for a subset of properties. However, Okta recommends using the search parameter.                  | Query        | String     | FALSE    |
| q           | Finds a user that matches `firstName`, `lastName`, and `email` properties. However, Okta recommends the search parameter.                       | Query        | String     | FALSE    |
| limit       | Specifies the number of results returned (maximum 200).                           | Query        | Number     | FALSE    |
| after       | Specifies the pagination cursor for the next page of users.                                                                                     | Query        | String     | FALSE    |
| sortBy      | Specifies field to sort by (for search queries only).                                                                                           | Search query | String     | FALSE    |
| sortOrder   | Specifies sort order asc or desc (for search queries only). Sorting is done in ASCII sort order (that is, by ASCII character value), but isn't case sensitive.                                                                                                                                                    | Search query | String     | FALSE    |

- If you don't specify a value for `limit`, the maximum (200) is used as a default.  If you are using a `q` parameter, the default limit is 10.
- An HTTP 500 status code usually indicates that you have exceeded the request timeout. Retry your request with a smaller limit and [paginate](/docs/reference/core-okta-api/#pagination) the results.
- The `search` parameter delivers optimal performance. Using the `q` or `filter` parameters affect search performance. They may also yield no results, in which case you should try reformatting the request to use `search`.
- Treat the `after` cursor as an opaque value and obtain it through the next link relation. See [Pagination](/docs/reference/core-okta-api/#pagination).

##### Response parameters

Array of [User](#user-object)

##### Known Limitation

Due to an infrastructure limitation, [group administrators](https://help.okta.com/okta_help.htm?id=ext_The_User_Admin_Role), [help desk administrators](https://help.okta.com/okta_help.htm?id=ext_The_Help_Desk_Admin_Role),
and [custom administrators](https://help.okta.com/okta_help.htm?id=csh-cstm-admin-roles) who are only scoped to view and manage users of their assigned groups may experience timeout for the list users endpoints.

#### List Users with search

Searches for users based on the properties specified in the search parameter. This method typically offers the best performance of any [List Users](#list-users) operation other than List All Users.

> **Note:** Results from the Search API are computed from asynchronously indexed and eventually consistent data. The indexing delay is typically less than one second.

Property names in the search parameter are case sensitive, whereas operators (`eq`, `sw`, and so on) and string values are case insensitive. Unlike with [user logins](#okta-login), diacritical marks are significant in search string values: a search for `isaac.brock` finds `Isaac.Brock`, but doesn't find a property whose value is `isáàc.bröck`.

This operation:

- Supports [pagination](/docs/reference/core-okta-api/#pagination).
- Requires [URL encoding](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding).
  For example, `search=profile.department eq "Engineering"` is encoded as `search=profile.department%20eq%20%22Engineering%22`.
  Use an ID lookup for records that you update to ensure your results contain the latest data.
  > **Note:** If you use the special character `"` within a quoted string, it must also be escaped `\` and encoded. For example, `search=profile.lastName eq "bob"smith"` is encoded as `search=profile.lastName%20eq%20%22bob%5C%22smith%22`.
- Searches many properties:
  - Any user profile property, including custom-defined properties
  - The top-level properties `id`, `status`, `created`, `activated`, `statusChanged`, and `lastUpdated`
  - The [user type](/docs/reference/api/user-types) accessed as `type.id`
- Accepts `sortBy` and `sortOrder` parameters.
  - `sortBy` can be any single property, for example `sortBy=profile.lastName`
  - `sortOrder` is optional and defaults to ascending
  - `sortOrder` is ignored if `sortBy` is not present
  - Users with the same value for the `sortBy` property will be ordered by `id`
  - The `ne` (not equal) operator isn't supported, but you can obtain the same result by using `lt ... or ... gt`. For example, to see all users except those that have a status of "STAGED", use `(status lt "STAGED" or status gt "STAGED")`.

| Search Term Example                             | Description                                     |
| :---------------------------------------------- | :---------------------------------------------- |
| `status eq "STAGED"`                            | Users that have a `status` of `STAGED`          |
| `lastUpdated gt "yyyy-MM-dd'T'HH:mm:ss.SSSZ"`   | Users last updated after a specific timestamp   |
| `id eq "00u1ero7vZFVEIYLWPBN"`                  | Users with a specified `id`                     |
| `type.id eq "otyfnjfba4ye7pgjB0g4"`             | Users with a specified user type ID             |
| `profile.department eq "Engineering"`           | Users that have a `department` of `Engineering` |
| `profile.occupation eq "Leader"`                | Users that have an `occupation` of `Leader`     |
| `profile.lastName sw "Smi" `                    | Users whose `lastName` starts with `Smi`        |

##### Search examples

List users with an occupation of `Leader`

    search=profile.occupation eq "Leader"

List users in the department of `Engineering` who were created before `01/01/2014` or have a status of `ACTIVE`.

    search=profile.department eq "Engineering" and (created lt "2014-01-01T00:00:00.000Z" or status eq "ACTIVE")

##### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users?search=profile.mobilePhone+sw+%22555%22+and+status+eq+%22ACTIVE%22"
```

##### Response example

```json
[
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
      "firstName": "Isaac",
      "lastName": "Brock",
      "email": "isaac.brock@example.com",
      "login": "isaac.brock@example.com",
      "mobilePhone": "555-415-1337"
    },
    "credentials": {
      "password": {},
      "recovery_question": {
        "question": "Who's a major player in the cowboy scene?"
      },
      "provider": {
        "type": "OKTA",
        "name": "OKTA"
      }
    },
    "_links": {
      "self": {
        "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
      }
    }
  }
]
```
-->

##### Searching arrays

For more information, see the [`search`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/listUsers!in=query&path=search&t=request) parameter description.

<!--
You can search properties that are arrays. If any element matches the search term, the entire array (object) is returned. For examples, see [Request example for array](#request-example-for-array) and [Response example for array](#response-example-for-array).

- Okta follows the [SCIM Protocol Specification](https://tools.ietf.org/html/rfc7644#section-3.4.2.2) for searching arrays.
- You can search multiple arrays, multiple values in an array, as well as using the standard logical and filtering operators. See [Filter](/docs/reference/core-okta-api/#filter).

##### Request example for array

The following example is for a custom attribute on User, an array of strings named `arrayAttr` that contains values `["arrayAttrVal1", "arrayAttrVal2"...]`.

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users?search=profile.arrayAttr+eq+%22arrayAttrVal1%22"
```

##### Response example for array

```json
[
    {
        "id": "00u19uiKQa0xXkbdGLNR",
        "status": "PROVISIONED",
        "created": "2016-03-15T04:21:51.000Z",
        "activated": "2016-03-15T04:21:52.000Z",
        "statusChanged": "2016-03-15T04:21:52.000Z",
        "lastLogin": null,
        "lastUpdated": "2016-03-17T07:08:15.000Z",
        "passwordChanged": null,
        "profile": {
            "login": "u7@test.com",
            "mobilePhone": null,
            "email": "u7@test.com",
            "secondEmail": "",
            "firstName": "u7",
            "lastName": "u7",
            "boolAttr": true,
            "intAttr": 99,
            "strArray": [
                "strArrayVal1",
                "strArrayVal2"
            ],
            "intArray": [
                5,
                8
            ],
            "numAttr": 8.88,
            "attr1": "attr1ValUpdated3",
            "arrayAttr": [
                "arrayAttrVal1",
                "arrayAttrVal2Updated"
            ],
            "numArray": [
                1.23,
                4.56
            ]
        },
        "credentials": {
            "provider": {
                "type": "OKTA",
                "name": "OKTA"
            }
        },
        "_links": {
            "self": {
                "href": "https://{yourOktaDomain}/api/v1/users/00u19uiKQa0xXkbdGLNR"
            }
        }
    }
]
```
-->

#### List Users with a filter

See [List all Users](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/listUsers) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--Lists all users that match the filter criteria. To ensure optimal performance, Okta recommends using a [search parameter](#list-users-with-search) instead of a filter.

> **Note:** Results from the filter parameter are driven from an eventually consistent datasource. The synchronization lag is typically less than one second.

This operation:

- Requires [URL encoding](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding). For example, `filter=lastUpdated gt "2013-06-01T00:00:00.000Z"` is encoded as `filter=lastUpdated%20gt%20%222013-06-01T00:00:00.000Z%22`.
- Supports the following limited number of properties: `status`, `lastUpdated`, `id`, `profile.login`, `profile.email`, `profile.firstName`, and `profile.lastName`.
- Supports only the equal `eq` operator from the standard Okta API filtering semantics, except in the case of the `lastUpdated` property. This property can also use the inequality operators (`gt`, `ge`, `lt`, and `le`).
- Supports only the logical operators `and` and `or`. The `not` operator isn't supported.
- Is case-sensitive for attribute names and query values, while attribute operators are case-insensitive.

| Filter                                          | Description                                      |
| :---------------------------------------------- | :----------------------------------------------- |
| `status eq "ACTIVE"`                            | Users that have a `status` of `ACTIVE`           |
| `status eq "DEPROVISIONED"`                     | Users that have a `status` of `DEPROVISIONED`    |
| `status eq "LOCKED_OUT"`                        | Users that have a `status` of `LOCKED_OUT`       |
| `status eq "PASSWORD_EXPIRED"`                  | Users that have a `status` of `PASSWORD_EXPIRED` |
| `status eq "PROVISIONED"`                       | Users that have a `status` of `PROVISIONED`      |
| `status eq "RECOVERY"`                          | Users that have a `status` of `RECOVERY`         |
| `status eq "STAGED"`                            | Users that have a `status` of `STAGED`           |
| `status eq "SUSPENDED"`                         | Users that have a `status` of `SUSPENDED`        |
| `lastUpdated lt "yyyy-MM-dd'T'HH:mm:ss.SSSZ"`   | Users last updated before a specific timestamp   |
| `lastUpdated eq "yyyy-MM-dd'T'HH:mm:ss.SSSZ"`   | Users last updated at a specific timestamp       |
| `lastUpdated gt "yyyy-MM-dd'T'HH:mm:ss.SSSZ"`   | Users last updated after a specific timestamp    |
| `id eq "00u1ero7vZFVEIYLWPBN"`                  | Users with a specified `id`                      |
| `profile.login eq "login@example.com"`          | Users with a specified `login`                   |
| `profile.email eq "email@example.com"`          | Users with a specified `email`*                  |
| `profile.firstName eq "John"`                   | Users with a specified `firstName`*              |
| `profile.lastName eq "Smith" `                  | Users with a specified `lastName`*               |

> **Hint:** If filtering by `email`, `lastName`, or `firstName`, it may be easier to use `q` instead of `filter`.

See [Filtering](/docs/reference/core-okta-api/#filter) for more information on the expressions that are used in filtering.

##### Filter examples

List users with status of `LOCKED_OUT`

    filter=status eq "LOCKED_OUT"

List users updated after 06/01/2013 but before 01/01/2014

    filter=lastUpdated gt "2013-06-01T00:00:00.000Z" and lastUpdated lt "2014-01-01T00:00:00.000Z"

List users updated after 06/01/2013 but before 01/01/2014 with a status of `ACTIVE`

    filter=lastUpdated gt "2013-06-01T00:00:00.000Z" and lastUpdated lt "2014-01-01T00:00:00.000Z" and status eq "ACTIVE"

List users updated after 06/01/2013 but with a status of `LOCKED_OUT` or `RECOVERY`

    filter=lastUpdated gt "2013-06-01T00:00:00.000Z" and (status eq "LOCKED_OUT" or status eq "RECOVERY")

##### Request example: status

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users?filter=status+eq+%22ACTIVE%22+or+status+eq+%22RECOVERY%22"
```

##### Response example

```json
[
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
      "firstName": "Eric",
      "lastName": "Judy",
      "email": "eric.judy@example.com",
      "secondEmail": "eric@example.org",
      "login": "eric.judy@example.com",
      "mobilePhone": "555-415-2011"
    },
    "credentials": {
      "password": {},
      "recovery_question": {
        "question": "The stars are projectors?"
      },
      "provider": {
        "type": "OKTA",
        "name": "OKTA"
      }
    },
    "_links": {
      "self": {
        "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
      }
    }
  }
]
```

##### Request example: timestamp

Lists all users that have been updated since a specific timestamp

Use this operation when implementing a background synchronization job and you want to poll for changes.

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users?filter=lastUpdated+gt+%222021-07-01T00:00:00.000Z%22"
```

##### Response example

```json
[
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
      "firstName": "Eric",
      "lastName": "Judy",
      "email": "eric.judy@example.com",
      "secondEmail": "eric@example.org",
      "login": "eric.judy@example.com",
      "mobilePhone": "555-415-2011"
    },
    "credentials": {
      "password": {},
      "recovery_question": {
        "question": "The stars are projectors?"
      },
      "provider": {
        "type": "OKTA",
        "name": "OKTA"
      }
    },
    "_links": {
      "self": {
        "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
      }
    }
  }
]
```
-->

#### Find Users

See [List all Users](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/listUsers) in the new [Okta API reference portal](https://developer.okta.com/docs/api/), specifically with the [`q`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/listUsers!in=query&path=q&t=request) parameter and the [`search`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/listUsers!in=query&path=search&t=request) parameter.

<!--Finds users who match the specified query.  To ensure optimal performance, Okta recommends using a [search parameter](#list-users-with-search) instead.

Use the `q` parameter for a simple lookup of users by name, for example when creating a people picker.
The value of `q` is matched against `firstName`, `lastName`, or `email`.

> **Note:** Results from the query parameter are driven from an eventually consistent datasource. The synchronization lag is typically less than one second.

This operation:

 * Doesn't support pagination.
 * May not deliver optimal performance for large organizations, and is deprecated for such use cases.  Okta recommends using a [search parameter](#list-users-with-search) instead.
 * Performs a `startsWith` match but this is an implementation detail and may change without notice. You don't need to specify `firstName`, `lastName`, or `email`.

##### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users?q=eric&limit=1"
```

##### Response example

```json
[
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
      "firstName": "Eric",
      "lastName": "Judy",
      "email": "eric.judy@example.com",
      "secondEmail": "eric@example.org",
      "login": "eric.judy@example.com",
      "mobilePhone": "555-415-2011"
    },
    "credentials": {
      "password": {},
      "recovery_question": {
        "question": "The stars are projectors?"
      },
      "provider": {
        "type": "OKTA",
        "name": "OKTA"
      }
    },
    "_links": {
      "self": {
        "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
      }
    }
  }
]
```

> **Note:** This omits users that have a status of `DEPROVISIONED`. To return all users, use a [filter query](#list-users-with-a-filter) instead.
-->

#### List all Users

See [List all Users](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/listUsers) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
Returns a list of all users that do not have a status of `DEPROVISIONED`, up to the maximum (200 for most orgs)

Different results are returned depending on specified queries in the request.

##### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users?limit=200"
```

##### Response example

```http
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://${yourOktaDomain}/api/v1/users?limit=200>; rel="self"
Link: <https://${yourOktaDomain}/api/v1/users?after=00ud4tVDDXYVKPXKVLCO&limit=200>; rel="next"

[
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "STAGED",
    "created": "2013-07-02T21:36:25.344Z",
    "activated": null,
    "statusChanged": null,
    "lastLogin": null,
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
      "firstName": "Isaac",
      "lastName": "Brock",
      "email": "isaac.brock@example.com",
      "login": "isaac.brock@example.com",
      "mobilePhone": "555-415-1337"
    },
    "credentials": {
      "provider": {
        "type": "OKTA",
        "name": "OKTA"
      }
    },
    "_links": {
      "self": {
        "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
      }
    }
  },
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "status": "ACTIVE",
    "created": "2013-06-24T16:39:18.000Z",
    "activated": "2013-06-24T16:39:19.000Z",
    "statusChanged": "2013-06-24T16:39:19.000Z",
    "lastLogin": "2013-06-24T17:39:19.000Z",
    "lastUpdated": "2013-07-02T21:36:25.344Z",
    "passwordChanged": "2013-07-02T21:36:25.344Z",
    "profile": {
      "firstName": "Eric",
      "lastName": "Judy",
      "email": "eric.judy@example.com",
      "secondEmail": "eric@example.org",
      "login": "eric.judy@example.com",
      "mobilePhone": "555-415-2011"
    },
    "credentials": {
      "password": {},
      "recovery_question": {
        "question": "The stars are projectors?"
      },
      "provider": {
        "type": "OKTA",
        "name": "OKTA"
      }
    },
    "_links": {
      "self": {
        "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
      }
    }
  }
]
```
-->

### Update User

See [Update a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/updateUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
> **Note:** Use the `POST` method to make a partial update and the `PUT` method to delete unspecified properties.

<ApiOperation method="put" url="/api/v1/users/${userId}" />

Updates a user's profile and/or credentials using strict-update semantics

All profile properties must be specified when updating a user's profile with a `PUT` method. Any property not specified
in the request is deleted.

> **Important:** Don't use `PUT` method for partial updates.

##### Request parameters

| Parameter     | Description                                                          | Param Type   | DataType                                    | Required |
| :------------ | :------------------------------------------------------------------- | :----------- | :------------------------------------------ | :------- |
| userId        | ID of user to update                                                 | URL          | String                                      | TRUE     |
| strict        | If true, validates against minimum age and history password policy   | Query        | String                                      | FALSE    |
| profile       | Updated profile for user                                             | Body         | [Profile object](#profile-object)           | FALSE    |
| credentials   | Update credentials for user                                          | Body         | [Credentials object](#credentials-object)   | FALSE    |

`profile` and `credentials` can be updated independently or together with a single request.

>**Note:** Currently, the user type of a user can only be changed via a full replacement PUT operation. If the request parameters of a partial update include the `type` element from the [User object](#user-object), the value must match the existing type of the user. Only administrators are permitted to change the user type of a user; end users are not allowed to change their own user type.

##### Response parameters

Updated [User](#user-object)
-->

#### Update current User's Profile

See [Update a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/updateUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="post" url="/api/v1/users/me" /> <SupportsCors />

Updates current user's profile with partial update semantics

##### Request parameters

| Parameter     | Description                                                          | Param Type   | DataType                                    | Required |
| :------------ | :------------------------------------------------------------------- | :----------- | :------------------------------------------ | :------- |
| profile       | Updated profile for user                                             | Body         | [Profile object](#profile-object)           | FALSE    |

End user can only update `profile` with this request. Within the profile, if the end user tries to update the primary or the secondary email IDs, verification emails are sent to those email IDs, and the fields are updated only upon verification. To update credentials, use [Update Profile with ID](#update-profile-with-id).

>**Note:** An end user can only update profile properties for which the user has write access. To update user permissions for a schema property,
use [Update a user schema endpoint](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Schema/#tag/Schema/operation/updateUserProfile)

##### Response parameters

Updated [User](#user-object)

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "email": "isaac.brock@update.example.com",
    "mobilePhone": "555-415-1337"
  }
}' "https://${yourOktaDomain}/api/v1/users/me"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2015-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@update.example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```
-->

#### Update Profile with ID

See [Update a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/updateUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}" />

Updates a user's profile or credentials with partial update semantics

> **Important:** Use the `POST` method for partial updates. Unspecified properties are set to null with `PUT`.

##### Request parameters

| Parameter     | Description                                                          | Param Type   | DataType                                    | Required |
| :------------ | :------------------------------------------------------------------- | :----------- | :------------------------------------------ | :------- |
| userId        | ID of user to update                                                 | URL          | String                                      | TRUE     |
| strict        | If true, validates against minimum age and history password policy   | Query        | String                                      | FALSE    |
| profile       | Updated profile for user                                             | Body         | [Profile object](#profile-object)           | FALSE    |
| credentials   | Update credentials for user                                          | Body         | [Credentials object](#credentials-object)   | FALSE    |

`profile` and `credentials` can be updated independently or with a single request.

##### Response parameters

Updated [User](#user-object)

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "profile": {
    "firstName": "Isaac",
    "email": "isaac.brock@update.example.com",
    "mobilePhone": "555-415-1337"
  }
}' "https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2015-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@update.example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```

#### Set password

Sets passwords without validating existing user credentials

This is an administrative operation.  For operations that validate credentials refer to [Reset Password](#reset-password), [Forgot Password](#forgot-password), and [Change Password](#change-password).

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "credentials": {
    "password" : { "value": "uTVM,TPw55" }
  }
}' "https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```

#### Set recovery question and answer

Sets recovery question and answer without validating existing user credentials

This is an administrative operation. For an operation that requires validation, see [Change Recovery Question](#change-recovery-question).

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "credentials": {
    "recovery_question": {
      "question": "How many roads must a man walk down?",
      "answer": "forty two"
    }
  }
}' "https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2013-07-02T21:36:25.344Z",
  "passwordChanged": "2013-07-02T21:36:25.344Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "I have a new recovery question?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```
-->

## Related resources

### Get Assigned App Links

See [List all Assigned Application Links](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserResources/#tag/UserResources/operation/listAppLinks) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
<ApiOperation method="get" url="/api/v1/users/${userId}/appLinks" />

<SupportsCors />

Fetches appLinks for all direct or indirect (via group membership) assigned applications

##### Request parameters

| Parameter | Description  | Param Type | DataType | Required |
| --------- | ------------ | ---------- | -------- | -------- |
| id        | `id`, `login`, or `login shortname` (as long as it is unambiguous) of user | URL        | String   | TRUE     |

##### Response parameters

Array of App Links

##### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/appLinks"
```

##### Response example

```json
[
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "label": "Google Apps Mail",
    "linkUrl": "https://{yourOktaDomain}/home/google/0oa3omz2i9XRNSRIHBZO/50",
    "logoUrl": "https://{yourOktaDomain}/img/logos/google-mail.png",
    "appName": "google",
    "appInstanceId": "0oa3omz2i9XRNSRIHBZO",
    "appAssignmentId": "0ua3omz7weMMMQJERBKY",
    "credentialsSetup": false,
    "hidden": false,
    "sortOrder": 0
  },
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "label": "Google Apps Calendar",
    "linkUrl": "https://{yourOktaDomain}/home/google/0oa3omz2i9XRNSRIHBZO/54",
    "logoUrl": "https://{yourOktaDomain}/img/logos/google-calendar.png",
    "appName": "google",
    "appInstanceId": "0oa3omz2i9XRNSRIHBZO",
    "appAssignmentId": "0ua3omz7weMMMQJERBKY",
    "credentialsSetup": false,
    "hidden": false,
    "sortOrder": 1
  },
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "label": "Box",
    "linkUrl": "https://{yourOktaDomain}/home/boxnet/0oa3ompioiQCSTOYXVBK/72",
    "logoUrl": "https://{yourOktaDomain}/img/logos/box.png",
    "appName": "boxnet",
    "appInstanceId": "0oa3ompioiQCSTOYXVBK",
    "appAssignmentId": "0ua3omx46lYEZLPPRWBO",
    "credentialsSetup": false,
    "hidden": false,
    "sortOrder": 3
  },
  {
    "id": "00ub0oNGTSWTBKOLGLNR",
    "label": "Salesforce.com",
    "linkUrl": "https://{yourOktaDomain}/home/salesforce/0oa12ecnxtBQMKOXJSMF/46",
    "logoUrl": "https://{yourOktaDomain}/img/logos/salesforce_logo.png",
    "appName": "salesforce",
    "appInstanceId": "0oa12ecnxtBQMKOXJSMF",
    "appAssignmentId": "0ua173qgj5VAVOBQMCVB",
    "credentialsSetup": true,
    "hidden": false,
    "sortOrder": 2
  }
]
```
-->

### Get Group Memberships

See [List all Groups](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserResources/#tag/UserResources/operation/listUserGroups) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="get" url="/api/v1/users/${userId}/groups" /> <SupportsCors />

Fetches the groups of which the user is a member

##### Request parameters

| Parameter | Description  | Param Type | DataType | Required |
| --------- | ------------ | ---------- | -------- | -------- |
| id        | `id`, `login`, or `login shortname` (as long as it is unambiguous) of user | URL        | String   | TRUE     |

##### Response parameters

Array of [Groups](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Group/)

##### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/groups"
```

##### Response example

```json
[
  {
    "id": "0gabcd1234",
    "profile": {
      "name": "Cloud App Users",
      "description": "Users can access cloud apps"
    }
  },
  {
    "id": "0gefgh5678",
    "profile": {
      "name": "Internal App Users",
      "description": "Users can access internal apps"
    }
  }
]
```
-->

## Lifecycle operations

Lifecycle operations are non-idempotent operations that initiate a state transition for a user's status. These operations are available at the new [Okta API reference portal](https://developer.okta.com/docs/api/) as part of the [User Lifecycle API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserLifecycle/).

<!--Some operations are asynchronous while others are synchronous. The user's current status limits what operations are allowed.-->

### Activate User

See [Activate a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserLifecycle/#tag/UserLifecycle/operation/activateUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/activate" />

Activates a user

This operation can only be performed on users with a `STAGED` or `DEPROVISIONED` status.  Activation of a user is an asynchronous operation.

- The user's `transitioningToStatus` property has a value of `ACTIVE` during activation to indicate that the user hasn't completed the asynchronous operation.
- The user's status is `ACTIVE` when the activation process is complete.

Users who don't have a password must complete the welcome flow by visiting the activation link to complete the transition to `ACTIVE` status.

> **Note:** If you want to send a branded User Activation email, change the subdomain of your request to the custom domain that's associated with the brand. For example, change `subdomain.okta.com` to `custom.domain.one`. See [Multibrand and custom domains](/docs/concepts/brands/#multibrand-and-custom-domains).

> **Note:** If you have Optional Password enabled, visiting the activation link is optional for users who aren't required to enroll a password. See [Create user with Optional Password enabled](#create-user-with-optional-password-enabled).
>

##### Request parameters

| Parameter | Description                                     | Param Type | DataType | Required | Default |
| --------- | ----------------------------------------------- | ---------- | -------- | -------- | ------- |
| id        | `id` of user                                    | URL        | String   | TRUE     |         |
| sendEmail | Sends an activation email to the user if `true` | Query      | Boolean  | FALSE    | TRUE    |

> **Legal Disclaimer** <br><br>
After a user is added to the Okta directory, they receive an activation email. As part of signing up for this service, you agreed not to use Okta's service/product to spam and/or send unsolicited messages. Please refrain from adding unrelated accounts to the directory as Okta is not responsible for, and disclaims any and all liability associated with, the activation email's content. You, and you alone, bear responsibility for the emails sent to any recipients.

##### Response parameters

- Returns empty object by default.
- If `sendEmail` is `false`, returns an activation link for the user to set up their account. The activation token can be used to create a custom activation link.

```json
{
  "activationUrl": "https://{yourOktaDomain}/welcome/XE6wE17zmphl3KqAPFxO",
  "activationToken": "XE6wE17zmphl3KqAPFxO"
}
```

If a password was set before the user was activated, then user must login with with their password or the `activationToken` and not the activation link.  More information about using the `activationToken` to login can be found in the [Authentication API](/docs/reference/api/authn/#primary-authentication-with-activation-token).

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/activate?sendEmail=false"
```

##### Response example

```json
{
  "activationUrl": "https://{yourOktaDomain}/welcome/XE6wE17zmphl3KqAPFxO",
  "activationToken": "XE6wE17zmphl3KqAPFxO"
}
```
-->

### Reactivate User

See [Reactivate a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserLifecycle/#tag/UserLifecycle/operation/reactivateUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/reactivate" />

Reactivates a user

This operation can only be performed on users with a `PROVISIONED` or `RECOVERY` [status](#user-status). This operation restarts the activation workflow if for some reason the user activation wasn't completed when using the activationToken from [Activate User](#activate-user).

Users that don't have a password must complete the flow by completing [Reset Password](#reset-password) and MFA enrollment steps to transition the user to `ACTIVE` status.

##### Request parameters

| Parameter | Description                                                                | Param Type | DataType | Required |
| --------- | -------------------------------------------------------------------------- | ---------- | -------- | -------- |
| id        | `id`, `login`, or `login shortname` (as long as it is unambiguous) of user                                                               | URL        | String   | TRUE     |
| sendEmail | Sends an activation email to the user if `true`. Default value is `false`. | Query      | Boolean  | FALSE    |

##### Response parameters

* Returns empty object by default.
* If `sendEmail` is `false`, returns an activation link for the user to set up their account. The activation token can be used to create a custom activation link.

```json
{
  "activationUrl": "https://{yourOktaDomain}/welcome/XE6wE17zmphl3KqAPFxO",
  "activationToken": "XE6wE17zmphl3KqAPFxO"
}
```

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reactivate?sendEmail=false"
```

##### Response example (success)

```json
{
  "activationUrl": "https://{yourOktaDomain}/welcome/XE6wE17zmphl3KqAPFxO",
  "activationToken": "XE6wE17zmphl3KqAPFxO"
}
```

##### Response example (unexpected user status)

```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "errorCode": "E0000038",
  "errorSummary": "This operation is not allowed in the user's current status.",
  "errorLink": "E0000038",
  "errorId": "oaefEpMS5yqTMGYEfxp0S_knw",
  "errorCauses": []
}
```
-->

### Deactivate User

See [Deactivate a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserLifecycle/#tag/UserLifecycle/operation/deactivateUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/deactivate" />

Deactivates a user

This operation can only be performed on users that do not have a `DEPROVISIONED` status.

* The user's `transitioningToStatus` property is `DEPROVISIONED` during deactivation to indicate that the user hasn't completed the asynchronous operation.
* The user's status is `DEPROVISIONED` when the deactivation process is complete.

> **Important:** Deactivating a user is a **destructive** operation. The user is deprovisioned from all assigned applications which may destroy their data such as email or files.  **This action cannot be recovered!**

##### Request parameters

| Parameter | Description                                                                           | Param Type | DataType | Required |
| --------- | ------------------------------------------------------------------------------------- | ---------- | -------- | -------- |
| userId    | ID of user                                                                            | URL        | String   | TRUE     |
| sendEmail | Sends a deactivation email to the administrator if `true`.  Default value is `false`. | Query      | Boolean  | FALSE    |

> **Note:** You can also perform user deactivation asynchronously.
> To invoke asynchronous user deactivation, pass an HTTP header `Prefer: respond-async` with the request.

##### Response parameters

Returns an empty object.

#### Deactivate user synchronously

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate?sendEmail=true"
```

##### Response example

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

#### Deactivate user asynchronously

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-H "Prefer: respond-async" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate?sendEmail=true"
```

##### Response example

```http
HTTP/1.1 200 OK
Content-Type: application/json
```
-->

### Suspend User

See [Suspend a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserLifecycle/#tag/UserLifecycle/operation/suspendUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/suspend" />

Suspends a user

This operation can only be performed on users with an `ACTIVE` status.  The user has a status of `SUSPENDED` when the process is complete.

Suspended users:

* Can't log in to Okta. Their group and app assignments are retained.
* Can only be unsuspended or deactivated.

##### Request parameters

| Parameter | Description  | Param Type | DataType | Required |
| --------- | ------------ | ---------- | -------- | -------- |
| id        | `id` of user | URL        | String   | TRUE     |

##### Response parameters

Returns an empty object

* Passing an invalid `id` returns a `404 Not Found` status code with error code `E0000007`.
* Passing an `id` that is not in the `ACTIVE` state returns a `400 Bad Request` status code with error code `E0000001`.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/suspend"
```

##### Response example

```http
HTTP/1.1 200 OK
Content-Type: application/json
```
-->

### Unsuspend User

See [Unsuspend a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserLifecycle/#tag/UserLifecycle/operation/unsuspendUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/unsuspend" />

Unsuspends a user and returns them to the `ACTIVE` state

This operation can only be performed on users that have a `SUSPENDED` status.

##### Request parameters

| Parameter | Description  | Param Type | DataType | Required |
| --------- | ------------ | ---------- | -------- | -------- |
| id        | `id` of user | URL        | String   | TRUE     |

##### Response parameters

Returns an empty object.

Passing an invalid `id` returns a `404 Not Found` status code with error code `E0000007`.
Passing an `id` that is not in the `SUSPENDED` state returns a `400 Bad Request` status code with error code `E0000001`.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/unsuspend"
```

##### Response example

```http
HTTP/1.1 200 OK
Content-Type: application/json
```
-->

### Delete User

See [Delete a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/deleteUser) in the new Okta API reference portal as part of the [Users API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/).

<!--
<ApiOperation method="delete" url="/api/v1/users/${userId}" />

Deletes a user permanently.  This operation can only be performed on users that have a `DEPROVISIONED` status.  **This action cannot be recovered!**

This operation on a user that hasn't been deactivated causes that user to be deactivated.  A second delete operation
is required to delete the user.

##### Request parameters

| Parameter | Description                                                                           | Param Type | DataType | Required | Default |
| --------- | ------------------------------------------------------------------------------------- | ---------- | -------- | -------- | ------- |
| id        | `id` of user                                                                          | URL        | String   | TRUE     |         |
| sendEmail | Sends a deactivation email to the administrator if `true`.  Default value is `false`. | Query      | Boolean  | FALSE    | FALSE   |

> **Note:** You can also perform user deletion asynchronously. To invoke asynchronous user deletion, pass an HTTP header
> `Prefer: respond-async` with the request. This header is also supported by user deactivation, which is
> performed if the delete endpoint is invoked on a user that hasn't been deactivated.

##### Response parameters

```http
HTTP/1.1 204 No Content
```

Passing an invalid `id` returns a `404 Not Found` status code with error code `E0000007`.

#### Delete user synchronously

##### Request example

```bash
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR?sendEmail=true"
```

##### Response example

```http
HTTP/1.1 204 No Content
```

#### Delete user asynchronously

##### Request example

```bash
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-H "Prefer: respond-async" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR?sendEmail=true"
```

##### Response example

```http
HTTP/1.1 204 No Content
```
-->

### Unlock User

See [Unlock a User](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserLifecycle/#tag/UserLifecycle/operation/unlockUser) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/unlock" />

Unlocks a user with a `LOCKED_OUT` status or unlocks a user with an `ACTIVE` status that is blocked from unknown devices. Unlocked users have an `ACTIVE` status and can sign in with their current password.

> **Note:** This operation works with Okta-sourced users. It doesn't support directory-sourced accounts such as Active Directory.

##### Request parameters

| Parameter | Description  | Param Type | DataType | Required | Default |
| --------- | ------------ | ---------- | -------- | -------- | ------- |
| id        | `id` of user | URL        | String   | TRUE     |         |

##### Response parameters

Returns an empty object

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/unlock"
```

##### Response example

```http
HTTP/1.1 200 OK
Content-Type: application/json
```
-->

### Reset password

See [Reset password](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/#tag/UserCred/operation/resetPassword) in the new Okta API reference portal as part of the [User Credentials API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/reset_password" />

Generates a one-time token (OTT) that can be used to reset a user's password.  The OTT link can be automatically emailed to the user or returned to the API caller and distributed using a custom flow.

This operation will transition the user to the status of `RECOVERY` and the user will not be able to login or initiate a forgot password flow until they complete the reset flow.

This operation provides an option to delete all the user' sessions.  However, if the request is made in the context of a session owned by the specified user, that session isn't cleared.

>**Note:** You can also use this API to convert a user with the Okta Credential Provider to a use a Federated Provider. After this conversion, the user can't directly sign in with a password. The second example demonstrates this usage. To convert a federated user back to an Okta user, use the default API call. See the final example.

##### Request parameters

| Parameter | Description                                      | Param Type | DataType | Required | Default |
| --------- | ------------------------------------------------ | ---------- | -------- | -------- | ------- |
| id        | `id` of user                                     | URL        | String   | TRUE     |         |
| sendEmail | Sends reset password email to the user if `true` | Query      | Boolean  | FALSE    | TRUE    |
| revokeSessions | When set to `true`, revokes all user sessions, except for the current session | Query      | Boolean  | FALSE    | FALSE   |

To ensure a successful password recovery lookup if an email address is associated with multiple users:

* Okta no longer includes deactivated users in the lookup.
* The lookup searches login IDs first, then primary email addresses, and then secondary email addresses.

##### Response parameters

* Returns an empty object by default.
* If`sendEmail` is `false`, returns a link for the user to reset their password.

```json
{
  "resetPasswordUrl": "https://{yourOktaDomain}/reset_password/XE6wE17zmphl3KqAPFxO"
}
```

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password?sendEmail=false"
```

##### Response example

```json
{
  "resetPasswordUrl": "https://{yourOktaDomain}/reset_password/XE6wE17zmphl3KqAPFxO"
}
```

##### Request example (Convert a user to a Federated User)

To convert a user to a federated user, pass `FEDERATION` as the `provider` in the [Provider object](#provider-object). The `sendEmail`
parameter must be false or omitted for this type of conversion.

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/{userId}/lifecycle/reset_password?provider=FEDERATION&sendEmail=false"
```

##### Response example

```json
{}
```

##### Request example (Convert a Federated User to an Okta User)

To convert a federated user to an Okta user, call the default endpoint.

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/{userId}/lifecycle/reset_password"
```

##### Response example

```json
{}
```
-->

### Expire password

See [Expire Password](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/#tag/UserCred/operation/expirePassword) in the new Okta API reference portal as part of the [User Credentials API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/expire_password" />

This operation transitions the user status to `PASSWORD_EXPIRED` so that the user is required to change their password at their next login.
If `tempPassword` is included in the request, the user's password is reset to a temporary password that is returned, and then the temporary password is expired.

If you have integrated Okta with your on-premise Active Directory (AD), then setting a user's password as expired in Okta also expires the password in Active Directory.
When the user tries to log in to Okta, delegated authentication finds the password-expired status in the Active Directory,
and the user is presented with the password-expired page where he or she can change the password.

##### Request parameters

| Parameter    | Description                                                        | Param Type | DataType | Required | Default |
| ------------ | ------------------------------------------------------------------ | ---------- | -------- | -------- | ------- |
| id           | `id` of user                                                       | URL        | String   | TRUE     |         |
| tempPassword | Sets the user's password to a temporary password,  if `true`       | Query      | Boolean  | FALSE    | FALSE   |

##### Response parameters

* Returns the complete user object by default
* If `tempPassword` is `true`, returns the temporary password

```json
{
    "tempPassword": "HR076gb6"
}
```

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password?tempPassword=false"
```

##### Response example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2013-06-27T16:35:28.000Z",
  "passwordChanged": "2013-06-24T16:39:19.000Z",
  "profile": {
    "firstName": "Isaac",
    "lastName": "Brock",
    "email": "isaac.brock@example.com",
    "login": "isaac.brock@example.com",
    "mobilePhone": "555-415-1337"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    }
  }
}
```
-->

### Reset Factors

See [Reset Factors](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserLifecycle/#tag/UserLifecycle/operation/resetFactors) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}/lifecycle/reset_factors" />

This operation resets all factors for the specified user. All MFA factor enrollments returned to the unenrolled state. The user's status remains ACTIVE. This link is present only if the user is currently enrolled in one or more MFA factors.

##### Request parameters

| Parameter    | Description                                                  | Param Type | DataType | Required | Default |
| ------------ | ------------------------------------------------------------ | ---------- | -------- | -------- | ------- |
| id           | `id` of user                                                 | URL        | String   | TRUE     |         |

<!-- REMOVED THIS PARAMETER in 2022.07.0; release mgmt disabled with kill switch - June 30, 2022 Katherine Chan

| removeRecoveryEnrollment       | An optional parameter that allows removal of the the phone factor (SMS/Voice) as both a recovery method and a factor. | QUERY      | Boolean  | FALSE    | FALSE   | 

##### Response parameters

Returns an empty object by default.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
```

##### Response example

```http
HTTP/1.1 200 OK
Content-Type: application/json
```
-->

### Clear current User sessions

See [End a current User session](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserSessions/#tag/UserSessions/operation/endUserSessions) in the new Okta API reference portal as part of the [User Sessions API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/).

<!--Clears Okta sessions for the currently logged in user. By default, the current session remains active. Use this method in a browser-based application.

> **Note:** This operation requires a session cookie for the user. The API token isn't allowed for this operation.

<ApiOperation method="post" url="/api/v1/users/me/lifecycle/delete_sessions" /> <SupportsCors />

##### Request parameters

| Parameter    | Description                                                  | Param Type | DataType | Required | Default |
| ------------ | ------------------------------------------------------------ | ---------- | -------- | -------- | ------- |
| keepCurrent  | Skip deleting user's current session when set to true          | Body       | boolean  | FALSE    |  true   |

##### Response

Returns an empty object.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Cookie: ${okta_session_cookie}" \
-H "Origin: ${trusted_cors_origin}" \
-d '{
  "keepCurrent": true
}' "https://${yourOktaDomain}/api/v1/users/me/lifecycle/delete_sessions"
```

##### Response example

If the sessions were successfully cleared, a `200 OK` response will be returned.

If the current session is invalid, a `403 Forbidden` response will be returned.

```http
HTTP/1.1 200 OK
Content-Type: application/json

{}
```
-->

## User sessions

The User Sessions API provides operations to manage user sessions in your org. These operations are available at the new [Okta API reference portal](https://developer.okta.com/docs/api/) as part of the [User Sessions API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserSessions/).

### Clear User sessions

See [Revoke all User sessions](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserSessions/#tag/UserSessions/operation/revokeUserSessions) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="delete" url="/api/v1/users/${userId}/sessions" />

Removes all active identity provider sessions. This forces the user to authenticate on the next operation. Optionally revokes OpenID Connect and OAuth refresh and access tokens issued to the user.

>**Note:** This operation doesn't clear the sessions created for web sign in or native applications.

#### Request parameters

| Parameter    | Description                                                      | Param Type | DataType | Required | Default |
| ------------ | ---------------------------------------------------------------- | ---------- | -------- | -------- | ------- |
| userId       | `id` of a user                                                   | URL        | String   | TRUE     |         |
| oauthTokens  | Revoke issued OpenID Connect and OAuth refresh and access tokens | Query      | Boolean  | FALSE    | FALSE   |

#### Response parameters

```http
HTTP/1.1 204 No Content
```

#### Request example

```bash
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/sessions"
```

#### Response example

```http
HTTP/1.1 204 No Content
```
-->

## Credential operations

The User Credentials API provides operations to manage user credentials in your org. These operations are available at the new [Okta API reference portal](https://developer.okta.com/docs/api/) as part of the [User Credentials API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/).

### Forgot password

See [Start forgot password flow](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/#tag/UserCred/operation/forgotPassword) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
<ApiOperation method="post" url="/api/v1/users/${userId}/credentials/forgot_password" />

Generates a one-time token (OTT) that can be used to reset a user's password

The user will be required to validate their security question's answer when visiting the reset link.  This operation can only be performed on users with an `ACTIVE` status and a valid [recovery question credential](#recovery-question-object).

>**Note:** If you have migrated to Okta Identity Engine, you can allow users to recover passwords with any enrolled MFA authenticator. See [Self-service account recovery](https://help.okta.com/okta_help.htm?type=oie&id=ext-config-sspr).
><ApiLifecycle access="ie" />

##### Request parameters

| Parameter    | Description                                         | Param Type | DataType | Required | Default |
| ------------ | --------------------------------------------------- | ---------- | -------- | -------- | ------- |
| id           | `id` of user                                        | URL        | String   | TRUE     |         |
| sendEmail    | Sends a forgot password email to the user if `true` | Query      | Boolean  | FALSE    | TRUE    |

To ensure a successful password recovery lookup if an email address is associated with multiple users:

* Okta no longer includes deactivated users in the lookup.
* The lookup searches login IDs first, then primary email addresses, and then secondary email addresses.

##### Response parameters

* Returns an empty object by default
* If `sendEmail` is `false`, returns a link for the user to reset their password.

```json
{
  "resetPasswordUrl": "https://{yourOktaDomain}/signin/reset-password/XE6wE17zmphl3KqAPFxO"
}
```

This operation does not affect the status of the user.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password?sendEmail=false"
```

##### Response example

```json
{
  "resetPasswordUrl": "https://{yourOktaDomain}/signin/reset-password/XE6wE17zmphl3KqAPFxO"
}
```

<ApiOperation method="post" url="/api/v1/users/${userId}/credentials/forgot_password" />

Sets a new password for a user by validating the user's answer to their current recovery question

This operation can only be performed on users with an `ACTIVE` status and a valid [recovery question credential](#recovery-question-object).

> **Important:** This operation is intended for applications that need to implement their own forgot password flow.  You are responsible for mitigation of all security risks such as phishing and replay attacks.  The best practice is to generate a short-lived, one-time token (OTT) that is sent to a verified email account.

##### Request parameters

| Parameter         | Description                                      | Param Type | DataType                                              | Required |
| ----------------- | ------------------------------------------------ | ---------- | ----------------------------------------------------- | -------- |
| id                | `id` of user                                     | URL        | String                                                | TRUE     |
| password          | New password for user                            | Body       | [Password object](#password-object)                   | TRUE     |
| recovery_question | Answer to user's current recovery question       | Body       | [Recovery Question object](#recovery-question-object) | TRUE     |

##### Response parameters

[Credentials](#credentials-object) of the user

This operation does not affect the status of the user.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "password": { "value": "uTVM,TPw55" },
  "recovery_question": { "answer": "Annie Oakley" }
}' "https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
```

##### Response example

```json
{
  "password": {},
  "recovery_question": {
    "question": "Who's a major player in the cowboy scene?"
  },
  "provider": {
    "type": "OKTA",
    "name": "OKTA"
  }
}
```
-->

### Change password

See [Update Password](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/#tag/UserCred/operation/changePassword) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}/credentials/change_password" />

Changes a user's password by validating the user's current password

This operation provides an option to delete all the sessions of the specified user.  However, if the request is made in the context of a session owned by the specified user, that session isn't cleared.

This operation can only be performed on users in `STAGED`, `ACTIVE`, `PASSWORD_EXPIRED`, or `RECOVERY` status that have a valid [password credential](#password-object)

##### Request parameters

| Parameter    | Description                                             | Param Type | DataType                             | Required | Default |
| ------------ | ------------------------------------------------------- | ---------- | ------------------------------------ | -------- |---------|
| id           | `id` of user                                            | URL        | String                               | TRUE     |         |
| strict       | If true, validates against password minimum age policy  | Query      | String                               | FALSE    | FALSE   |
| oldPassword  | Current password for user                               | Body       | [Password object](#password-object)  | TRUE     |         |
| newPassword  | New password for user                                   | Body       | [Password object](#password-object)  | TRUE     |         |
| revokeSessions | When set to `true`, revokes all user sessions, except for the current session | Body       | boolean                              | FALSE    | FALSE  |

##### Response parameters

[Credentials](#credentials-object) of the user

The user transitions to `ACTIVE` status when successfully invoked in `RECOVERY` status.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "oldPassword": { "value": "tlpWENT2m" },
  "newPassword": { "value": "uTVM,TPw55" },
  "revokeSessions" : true
}' "https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
```

##### Response example

```json
{
  "password": {},
  "recovery_question": {
    "question": "Who's a major player in the cowboy scene?"
  },
  "provider": {
    "type": "OKTA",
    "name": "OKTA"
  }
}
```
-->

### Change recovery question

See [Update Recovery Question](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserCred/#tag/UserCred/operation/changeRecoveryQuestion) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="post" url="/api/v1/users/${userId}/credentials/change_recovery_question" />

Changes a user's recovery question & answer credential by validating the user's current password

This operation can only be performed on users in **STAGED**, **ACTIVE** or **RECOVERY** `status` that have a valid [password credential](#password-object)

##### Request parameters

| Parameter         | Description                             | Param Type | DataType                                              | Required |
| ----------------- | --------------------------------------- | ---------- | ----------------------------------------------------- | -------- |
| id                | `id` of user                            | URL        | String                                                | TRUE     |
| password          | Current password for user               | Body       | [Password object](#password-object)                   | TRUE     |
| recovery_question | New recovery question & answer for user | Body       | [Recovery Question object](#recovery-question-object) | TRUE     |

##### Response parameters

[Credentials](#credentials-object) of the user

> **Note:** This operation doesn't affect the status of the user.

##### Request example

```bash
curl -v -X POST \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
-d '{
  "password": { "value": "tlpWENT2m" },
  "recovery_question": {
    "question": "How many roads must a man walk down?",
    "answer": "forty two"
  }
}' "https://${yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
```

##### Response example

```json
{
  "password": {},
  "recovery_question": {
    "question": "How many roads must a man walk down?"
  },
  "provider": {
    "type": "OKTA",
    "name": "OKTA"
  }
}
```
-->

## User-consent Grant operations

The User Grants API provides operations to manage user consent grants in your org. These operations are available at the new [Okta API reference portal](https://developer.okta.com/docs/api/) as part of the [User Grants API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserGrant/).

<!--<ApiLifecycle access="ea" />

A consent represents a user's explicit permission to allow an application to access resources protected by scopes. Consent grants are different from tokens because a consent can outlast a token, and there can be multiple tokens with varying sets of scopes derived from a single consent. When an application comes back and needs to get a new access token, it may not need to prompt the user for consent if they have already consented to the specified scopes.
Consent grants remain valid until the user manually revokes them, or until the user, application, authorization server or scope is deactivated or deleted.

> **Hint:** For all grant operations, you can use `me` instead of the `userId` in an endpoint that contains `/users`, in an active session with no SSWS token (API token). For example: `https://${yourOktaDomain}/api/v1/users/me/grants` returns all the grants for the active session user.

>**Note:** Some browsers have begun blocking third-party cookies by default, disrupting Okta functionality in certain flows. For information see [FAQ: How Blocking Third Party Cookies Can Potentially Impact Your Okta Environment](https://support.okta.com/help/s/article/FAQ-How-Blocking-Third-Party-Cookies-Can-Potentially-Impact-Your-Okta-Environment).
-->

### List Grants

See [List all User Grants](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserGrant/#tag/UserGrant/operation/listUserGrants) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiLifecycle access="ea" />

<ApiOperation method="get" url="/api/v1/users/${userId}/grants" />

Lists all grants for the specified user

#### Request parameters

| Parameter   | Description                                                                                    | Param Type   | DataType   | Required   | Default |
| :---------- | :--------------------------------------------------------------------------------------------- | :----------- | :--------- | :--------- | :------ |
| userId      | ID of the user for whom you are fetching grants                                                | URL          | String     | TRUE       |         |
| expand      | Valid value: `scope`. If specified, scope details are included in the `_embedded` attribute.   | Query        | String     | FALSE      |         |
| scopeId     | The scope ID to filter on                                                                      | Query        | String     | FALSE      |         |
| limit       | The number of grants to return (maximum 200)                                                   | Query        | Number     | FALSE      | 20      |
| after       | Specifies the pagination cursor for the next page of grants                                    | Query        | String     | FALSE      |         |

> **Note:** `after` should be treated as a cursor (an opaque value) and obtained through [the next link relation](/docs/reference/core-okta-api/#pagination).

#### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/grants"
```

#### Response example

```json
[
    {
        "id": "oag3ih1zrm1cBFOiq0h6",
        "status": "ACTIVE",
        "created": "2017-10-30T22:06:53.000Z",
        "lastUpdated": "2017-10-30T22:06:53.000Z",
        "issuer": "https://{yourOktaDomain}/oauth2/ausain6z9zIedDCxB0h7",
        "clientId": "0oabskvc6442nkvQO0h7",
        "userId": "00u5t60iloOHN9pBi0h7",
        "scopeId": "scpCmCCV1DpxVkCaye2X",
        "_links": {
            "app": {
                "href": "https://{yourOktaDomain}/api/v1/apps/0oabskvc6442nkvQO0h7",
                "title": "My App"
            },
            "scope": {
                "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/scopes/scpCmCCV1DpxVkCaye2X",
                "title": "My phone"
            },
            "client": {
                "href": "https://{yourOktaDomain}/oauth2/v1/clients/0oabskvc6442nkvQO0h7",
                "title": "My App"
            },
            "self": {
                "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/grants/oag3ih1zrm1cBFOiq0h6",
                "hints": {
                    "allow": [
                        "GET",
                        "DELETE"
                    ]
                }
            },
            "user": {
                "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7",
                "title": "SAML Jackson"
            },
            "authorizationServer": {
                "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7",
                "title": "Example Authorization Server"
            }
        }
    }
]
```
-->

### Get a Grant

See [Retrieve a Grant](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserGrant/#tag/UserGrant/operation/getUserGrant) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiLifecycle access="ea" />

<ApiOperation method="get" url="/api/v1/users/${userId}/grants/${grantId}" />

Gets a grant for the specified user

#### Request parameters

| Parameter   | Description                                                                                    | Param Type   | DataType   | Required |
| :---------- | :--------------------------------------------------------------------------------------------- | :----------- | :--------- | :------- |
| userId      | ID of the user to whom the grant belongs                                                       | URL          | String     | TRUE     |
| grantId     | ID of the grant being fetched                                                                  | Query        | String     | TRUE     |
| expand      | Valid value: `scope`. If specified, scope details are included in the `_embedded` attribute.   | Query        | String     | FALSE    |

#### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/grants/oag3ih1zrm1cBFOiq0h6"
```

#### Response example

```json
{
    "id": "oag3ih1zrm1cBFOiq0h6",
    "status": "ACTIVE",
    "created": "2017-10-30T22:06:53.000Z",
    "lastUpdated": "2017-10-30T22:06:53.000Z",
    "issuer": "https://{yourOktaDomain}/oauth2/ausain6z9zIedDCxB0h7",
    "clientId": "0oabskvc6442nkvQO0h7",
    "userId": "00u5t60iloOHN9pBi0h7",
    "scopeId": "scpCmCCV1DpxVkCaye2X",
    "_links": {
        "app": {
            "href": "https://{yourOktaDomain}/api/v1/apps/0oabskvc6442nkvQO0h7",
            "title": "My App"
        },
        "scope": {
            "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/scopes/scpCmCCV1DpxVkCaye2X",
            "title": "My phone"
        },
        "client": {
            "href": "https://{yourOktaDomain}/oauth2/v1/clients/0oabskvc6442nkvQO0h7",
            "title": "My App"
        },
        "self": {
            "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/grants/oag3ih1zrm1cBFOiq0h6",
            "hints": {
                "allow": [
                    "GET",
                    "DELETE"
                ]
            }
        },
        "user": {
            "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7",
            "title": "SAML Jackson"
        },
        "authorizationServer": {
            "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7",
            "title": "Example Authorization Server"
        }
    }
}
```
-->

### List Grants for a User-Client combination

See [List all Grants for a Client](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserGrant/#tag/UserGrant/operation/listGrantsForUserAndClient) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiLifecycle access="ea" />

<ApiOperation method="get" url="/api/v1/users/${userId}/clients/${clientId}/grants" />

Lists all grants for a specified user and client

#### Request parameters

| Parameter   | Description                                                                                    | Parameter Type   | DataType   | Required   | Default |
| :---------- | :--------------------------------------------------------------------------------------------- | :--------------- | :--------- | :--------- | :------ |
| userId      | ID of the user whose grants you are listing for the specified `clientId`                       | URL              | String     | TRUE       |         |
| clientId    | ID of the client whose grants you are listing for the specified `userId`                       | URL              | String     | TRUE       |         |
| expand      | Valid value: `scope`. If specified, scope details are included in the `_embedded` attribute.   | Query            | String     | FALSE      |         |
| limit       | The number of tokens to return (maximum 200)                                                   | Query            | Number     | FALSE      | 20      |
| after       | Specifies the pagination cursor for the next page of tokens                                    | Query            | String     | FALSE      |         |

#### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/clients/0oabskvc6442nkvQO0h7/grants"
```

#### Response example

```json
[
    {
        "id": "oag3j3j33ILN7OFqP0h6",
        "status": "ACTIVE",
        "created": "2017-11-03T03:34:17.000Z",
        "lastUpdated": "2017-11-03T03:34:17.000Z",
        "issuer": "https://{yourOktaDomain}/oauth2/ausain6z9zIedDCxB0h7",
        "clientId": "0oabskvc6442nkvQO0h7",
        "userId": "00u5t60iloOHN9pBi0h7",
        "scopeId": "scpCmCCV1DpxVkCaye2X",
        "_links": {
            "app": {
                "href": "https://{yourOktaDomain}/api/v1/apps/0oabskvc6442nkvQO0h7",
                "title": "Test App for Groups Claim"
            },
            "scope": {
                "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/scopes/scpCmCCV1DpxVkCaye2X",
                "title": "Your phone"
            },
            "self": {
                "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/grants/oag3j3j33ILN7OFqP0h6",
                "hints": {
                    "allow": [
                        "GET",
                        "DELETE"
                    ]
                }
            },
            "client": {
                "href": "https://{yourOktaDomain}/oauth2/v1/clients/0oabskvc6442nkvQO0h7",
                "title": "Test App for Groups Claim"
            },
            "user": {
                "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7",
                "title": "Saml Jackson"
            },
            "authorizationServer": {
                "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7",
                "title": "Example Authorization Server"
            }
        }
    }
]
```
-->

### Revoke all Grants for a User

See [Revoke all User Grants](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserGrant/#tag/UserGrant/operation/revokeUserGrants) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiLifecycle access="ea" />

<ApiOperation method="delete" url="/api/v1/users/${userId}/grants" />

Revokes all grants for a specified user

#### Request parameters

| Parameter   | Description                                   | Parameter Type   | DataType   | Required |
| :---------- | :-------------------------------------------- | :--------------- | :--------- | :------- |
| userId      | ID of the user whose grant is being revoked   | URL              | String     | TRUE     |

#### Request example

```bash
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/grants"
```

#### Response example

```http
HTTP/1.1 204 No Content
```
-->

### Revoke a Grant for a User

See [Revoke a User Grant](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserGrant/#tag/UserGrant/operation/revokeUserGrant) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiLifecycle access="ea" />

<ApiOperation method="delete" url="/api/v1/users/${userId}/grants/${grantId}" />

Revokes one grant for a specified user

#### Request parameters

| Parameter   | Description                                   | Parameter Type   | DataType   | Required |
| :---------- | :-------------------------------------------- | :--------------- | :--------- | :------- |
| userId      | ID of the user whose grant is being revoked   | URL              | String     | TRUE     |
| grantId     | ID of the grant being revoked                 | URL              | String     | TRUE     |

#### Request example

```bash
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/grants/oag3ih1zrm1cBFOiq0h6"
```

#### Response example

```http
HTTP/1.1 204 No Content
```
-->

### Revoke Grants for User and Client

See [Revoke all Grants for a Client](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserGrant/#tag/UserGrant/operation/revokeGrantsForUserAndClient) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiLifecycle access="ea" />

<ApiOperation method="delete" url="/api/v1/users/${userId}/clients/${clientId}/grants" />

Revokes all grants for the specified user and client

#### Request parameters

| Parameter   | Description                                                              | Parameter Type   | DataType   | Required |
| :---------- | :----------------------------------------------------------------------- | :--------------- | :--------- | :------- |
| userId      | ID of the user whose grants are being revoked for the specified client   | URL              | String     | TRUE     |
| clientId    | ID of the client who was granted consent by the specified user           | URL              | String     | TRUE     |

#### Request example

```bash
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/clients/0oabskvc6442nkvQO0h7/grants"
```

#### Response example

```http
HTTP/1.1 204 No Content
```
-->

## User OAuth 2.0 Token management operations

The User OAuth 2.0 Token Management API provides operations to manage tokens issued by an authorization server for a particular user and client in your org. These operations are available at the new [Okta API reference portal](https://developer.okta.com/docs/api/) as part of the [User OAuth 2.0 Token Management API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserOAuth/).

<!--
* [List Refresh Tokens](#list-refresh-tokens)
* [Get Refresh Token](#get-refresh-token)
* [Revoke All Refresh Tokens](#revoke-all-refresh-tokens)
* [Revoke Refresh Token](#revoke-refresh-token)

These endpoints allow you to manage tokens issued by an Authorization Server for a particular User and Client. For example, you could revoke every active refresh token for a User in the context of a specific Client. You can also [revoke specific tokens](/docs/guides/revoke-tokens/) or [manage tokens at the Authorization Server level](/docs/reference/api/authorization-servers/#oauth-20-token-management-operations).

Read [Validate Access Tokens](/docs/guides/validate-access-tokens/) to understand more about how OAuth 2.0 tokens work.

-->

### List Refresh Tokens

See [List all Refresh Tokens for a Client](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserOAuth/#tag/UserOAuth/operation/listRefreshTokensForUserAndClient) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="get" url="/api/v1/users/${userId}/clients/${clientId}/tokens" />

Lists all refresh tokens issued for the specified User and Client.

#### Request parameters

| Parameter   | Description                                                                                    | Param Type   | DataType   | Required   | Default |
| :---------- | :--------------------------------------------------------------------------------------------- | :----------- | :--------- | :--------- | :------ |
| userId      | ID of the user for whom you are fetching tokens                                                | URL          | String     | TRUE       |         |
| clientId    | ID of the client                                                                               | URL          | String     | TRUE       |         |
| expand      | Valid value: `scope`. If specified, scope details are included in the `_embedded` attribute.   | Query        | String     | FALSE      |         |
| limit       | The number of tokens to return (maximum 200)                                                   | Query        | Number     | FALSE      | 20      |
| after       | Specifies the pagination cursor for the next page of tokens                                    | Query        | String     | FALSE      |         |

> **Note:** `after` should be treated as a cursor (an opaque value) and obtained through [the next link relation](/docs/reference/core-okta-api/#pagination).

#### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/clients/0oabskvc6442nkvQO0h7/tokens"
```

#### Response example

```json
[
  {
    "id": "oar579Mcp7OUsNTlo0g3",
    "status": "ACTIVE",
    "created": "2018-03-09T03:18:06.000Z",
    "lastUpdated": "2018-03-09T03:18:06.000Z",
    "expiresAt": "2018-03-16T03:18:06.000Z",
    "issuer": "https://{yourOktaDomain}/oauth2/ausain6z9zIedDCxB0h7",
    "clientId": "0oabskvc6442nkvQO0h7",
    "userId": "00u5t60iloOHN9pBi0h7",
    "scopes": [
      "offline_access",
      "car:drive"
    ],
    "_links": {
      "app": {
        "href": "https://{yourOktaDomain}/api/v1/apps/0oabskvc6442nkvQO0h7",
        "title": "Native"
      },
      "self": {
        "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/clients/0oabskvc6442nkvQO0h7/tokens/oar579Mcp7OUsNTlo0g3"
      },
      "revoke": {
        "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/clients/0oabskvc6442nkvQO0h7/tokens/oar579Mcp7OUsNTlo0g3",
        "hints": {
          "allow": [
            "DELETE"
          ]
        }
      },
      "client": {
        "href": "https://{yourOktaDomain}/oauth2/v1/clients/0oabskvc6442nkvQO0h7",
        "title": "Example Client App"
      },
      "user": {
        "href": "https://{yourOktaDomain}/api/v1/users/00upcgi9dyWEOeCwM0g3",
        "title": "Saml Jackson"
      },
      "authorizationServer": {
        "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7",
        "title": "Example Authorization Server"
      }
    }
  }
]
```
-->

### Get Refresh Token

See [Retrieve a Refresh Token for a Client](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserOAuth/#tag/UserOAuth/operation/getRefreshTokenForUserAndClient) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="get" url="/api/v1/users/${userId}/clients/${clientId}/tokens/${tokenId}" />

Gets a refresh token issued for the specified User and Client.

#### Request parameters

| Parameter   | Description                                                                                    | Param Type   | DataType   | Required   | Default |
| :---------- | :--------------------------------------------------------------------------------------------- | :----------- | :--------- | :--------- | :------ |
| userId      | ID of the user for whom you are fetching tokens                                                | URL          | String     | TRUE       |         |
| clientId    | ID of the client                                                                               | URL          | String     | TRUE       |         |
| tokenId     | ID of the token                                                                                | URL          | String     | TRUE       |         |
| expand      | Valid value: `scope`. If specified, scope details are included in the `_embedded` attribute.   | Query        | String     | FALSE      |         |
| limit       | The number of grants to return (maximum 200)                                                   | Query        | Number     | FALSE      | 20      |
| after       | Specifies the pagination cursor for the next page of grants                                    | Query        | String     | FALSE      |         |

> **Note:** `after` should be treated as a cursor (an opaque value) and obtained through [the next link relation](/docs/reference/core-okta-api/#pagination).

#### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/clients/0oabskvc6442nkvQO0h7/tokens/oar579Mcp7OUsNTlo0g3?expand=scope"
```

#### Response example

```json
{
  "id": "oar579Mcp7OUsNTlo0g3",
  "status": "ACTIVE",
  "created": "2018-03-09T03:18:06.000Z",
  "lastUpdated": "2018-03-09T03:18:06.000Z",
  "expiresAt": "2018-03-16T03:18:06.000Z",
  "issuer": "https://{yourOktaDomain}/oauth2/ausain6z9zIedDCxB0h7",
  "clientId": "0oabskvc6442nkvQO0h7",
  "userId": "00u5t60iloOHN9pBi0h7",
  "scopes": [
    "offline_access",
    "car:drive"
  ],
  "_embedded": {
    "scopes": [
      {
        "id": "scppb56cIl4GvGxy70g3",
        "name": "offline_access",
        "description": "Requests a refresh token by default, used to obtain more access tokens without re-prompting the user for authentication.",
        "_links": {
          "scope": {
            "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/scopes/scppb56cIl4GvGxy70g3",
            "title": "offline_access"
          }
        }
      },
      {
        "id": "scp142iq2J8IGRUCS0g4",
        "name": "car:drive",
        "displayName": "Drive car",
        "description": "Allows the user to drive a car.",
        "_links": {
          "scope": {
            "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7/scopes/scp142iq2J8IGRUCS0g4",
            "title": "Drive car"
          }
        }
      }
    ]
  },
  "_links": {
    "app": {
      "href": "https://{yourOktaDomain}/api/v1/apps/0oabskvc6442nkvQO0h7",
      "title": "Native"
    },
    "self": {
      "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/clients/0oabskvc6442nkvQO0h7/tokens/oar579Mcp7OUsNTlo0g3"
    },
    "revoke": {
      "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/clients/0oabskvc6442nkvQO0h7/tokens/oar579Mcp7OUsNTlo0g3",
      "hints": {
        "allow": [
          "DELETE"
        ]
      }
    },
    "client": {
      "href": "https://{yourOktaDomain}/oauth2/v1/clients/0oabskvc6442nkvQO0h7",
      "title": "Example Client App"
    },
    "user": {
      "href": "https://{yourOktaDomain}/api/v1/users/00upcgi9dyWEOeCwM0g3",
      "title": "Saml Jackson"
    },
    "authorizationServer": {
      "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7",
      "title": "Example Authorization Server"
    }
  }
}
```
-->

### Revoke All Refresh Tokens

See [Revoke all Refresh Tokens for a Client](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserOAuth/#tag/UserOAuth/operation/revokeTokensForUserAndClient) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="delete" url="/api/v1/users/${userId}/clients/${clientId}/tokens" />

Revokes all refresh tokens issued for the specified User and Client. Any access tokens issued with these refresh tokens will also be revoked, but access tokens issued without a refresh token will not be affected.

#### Request parameters

| Parameter   | Description                                                              | Parameter Type   | DataType   | Required |
| :---------- | :----------------------------------------------------------------------- | :--------------- | :--------- | :------- |
| userId      | ID of the user whose grants are being revoked for the specified client   | URL              | String     | TRUE     |
| clientId    | ID of the client who was granted consent by the specified user           | URL              | String     | TRUE     |

#### Request example

```bash
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/clients/0oabskvc6442nkvQO0h7/tokens"
```

#### Response example

```http
HTTP/1.1 204 No Content
```
-->

### Revoke Refresh Token

See [Revoke a Token for a Client](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserOAuth/#tag/UserOAuth/operation/revokeTokenForUserAndClient) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiOperation method="delete" url="/api/v1/users/${userId}/clients/${clientId}/tokens/${tokenId}" />

Revokes the specified refresh token. If an access token was issued with this refresh token, it will also be revoked.

#### Request parameters

| Parameter   | Description                                                              | Parameter Type   | DataType   | Required |
| :---------- | :----------------------------------------------------------------------- | :--------------- | :--------- | :------- |
| userId      | ID of the user whose grants are being revoked for the specified client   | URL              | String     | TRUE     |
| clientId    | ID of the client who was granted consent by the specified user           | URL              | String     | TRUE     |
| tokenId     | ID of the token                                                          | URL              | String     | TRUE     |

#### Request example

```bash
curl -v -X DELETE \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/clients/0oabskvc6442nkvQO0h7/tokens/oar579Mcp7OUsNTlo0g3"
```

#### Response example

```http
HTTP/1.1 204 No Content
```
-->

## User Client resource operations

The User Resources API provides operations related to user resources. These operations are available at the new [Okta API reference portal](https://developer.okta.com/docs/api/) as part of the [User Resources API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserResources/).

<!--<ApiLifecycle access="ea" />-->

### List Client resources for a User

See [List all Clients](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserResources/#tag/UserResources/operation/listUserClients) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiLifecycle access="ea" />

<ApiOperation method="get" url="/api/v1/users/${userId}/clients" />

Lists all client resources for which the specified user has grants or tokens.

#### Request parameters

| Parameter   | Description                                       | Parameter Type   | DataType   | Required |
| :---------- | :------------------------------------------------ | :--------------- | :--------- | :------- |
| userId      | ID of the user                                    | URL              | String     | TRUE     |

#### Request example

```bash
curl -v -X GET \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-H "Authorization: SSWS ${api_token}" \
"https://${yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/clients"
```

#### Response example

```json
[
    {
        "client_id": "0oabskvc6442nkvQO0h7",
        "client_name": "My App",
        "client_uri": null,
        "logo_uri": null,
        "_links": {
            "grants": {
                "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/clients/0oabskvc6442nkvQO0h7/grants"
            },
            "tokens": {
                "href": "https://{yourOktaDomain}/api/v1/users/00u5t60iloOHN9pBi0h7/clients/0oabskvc6442nkvQO0h7/tokens"
            }
        }
    }
]
```
-->

## User object

See [User - response payload](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/getUser!c=200&path=activated&t=response) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--
### Example

```json
{
  "id": "00ub0oNGTSWTBKOLGLNR",
  "status": "ACTIVE",
  "created": "2013-06-24T16:39:18.000Z",
  "activated": "2013-06-24T16:39:19.000Z",
  "statusChanged": "2013-06-24T16:39:19.000Z",
  "lastLogin": "2013-06-24T17:39:19.000Z",
  "lastUpdated": "2013-06-27T16:35:28.000Z",
  "passwordChanged": "2013-06-24T16:39:19.000Z",
  "type": {
    "id": "otyfnjfba4ye7pgjB0g4"
   },
  "profile": {
    "login": "isaac.brock@example.com",
    "firstName": "Isaac",
    "lastName": "Brock",
    "nickName": "issac",
    "displayName": "Isaac Brock",
    "email": "isaac.brock@example.com",
    "secondEmail": "isaac@example.org",
    "profileUrl": "http://www.example.com/profile",
    "preferredLanguage": "en-US",
    "userType": "Employee",
    "organization": "Okta",
    "title": "Director",
    "division": "R&D",
    "department": "Engineering",
    "costCenter": "10",
    "employeeNumber": "187",
    "mobilePhone": "+1-555-415-1337",
    "primaryPhone": "+1-555-514-1337",
    "streetAddress": "301 Brannan St.",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94107",
    "countryCode": "US"
  },
  "credentials": {
    "password": {},
    "recovery_question": {
      "question": "Who's a major player in the cowboy scene?"
    },
    "provider": {
      "type": "OKTA",
      "name": "OKTA"
    }
  },
  "_links": {
    "resetPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_password"
    },
    "resetFactors": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/reset_factors"
    },
    "expirePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/expire_password"
    },
    "forgotPassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/forgot_password"
    },
    "changeRecoveryQuestion": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_recovery_question"
    },
    "deactivate": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/lifecycle/deactivate"
    },
    "changePassword": {
      "href": "https://{yourOktaDomain}/api/v1/users/00ub0oNGTSWTBKOLGLNR/credentials/change_password"
    },
    "schema": {
      "href": "https://{yourOktaDomain}/api/v1/meta/schemas/user/oscfnjfba4ye7pgjB0g4"
    },
    "type": {
      "href": "https://{yourOktaDomain}/api/v1/meta/types/user/otyfnjfba4ye7pgjB0g4"
    }
  }
}
```

### User properties

The User object defines several read-only properties:

| Property                | Description                                                             | DataType                                                                                                           | Nullable   | Unique   | Readonly |
| :---------------------- | :---------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :--------- | :------- | :------- |
| id                      | unique key for user                                                     | String                                                                                                             | FALSE      | TRUE     | TRUE     |
| status                  | current [status](#user-status) of user                                  | `STAGED`, `PROVISIONED`, `ACTIVE`, `RECOVERY`, `LOCKED_OUT`, `PASSWORD_EXPIRED`, `SUSPENDED`, or `DEPROVISIONED`   | FALSE      | FALSE    | TRUE     |
| created                 | timestamp when user was created                                         | Date                                                                                                               | FALSE      | FALSE    | TRUE     |
| activated               | timestamp when transition to `ACTIVE` status completed                  | Date                                                                                                               | FALSE      | FALSE    | TRUE     |
| statusChanged           | timestamp when status last changed                                      | Date                                                                                                               | TRUE       | FALSE    | TRUE     |
| lastLogin               | timestamp of last login                                                 | Date                                                                                                               | TRUE       | FALSE    | TRUE     |
| lastUpdated             | timestamp when user was last updated                                    | Date                                                                                                               | FALSE      | FALSE    | TRUE     |
| passwordChanged         | timestamp when password last changed                                    | Date                                                                                                               | TRUE       | FALSE    | TRUE     |
| type                    | user type that determines the schema for the user's profile  | Map (see below)                                                                                                    | FALSE      | FALSE    | TRUE     |
| transitioningToStatus   | target status of an in-progress asynchronous status transition          | `PROVISIONED`, `ACTIVE`, or `DEPROVISIONED`                                                                        | TRUE       | FALSE    | TRUE     |
| profile                 | user profile properties                                                 | [Profile object](#profile-object)                                                                                  | FALSE      | FALSE    | FALSE    |
| credentials             | user's primary authentication and recovery credentials                  | [Credentials object](#credentials-object)                                                                          | FALSE      | FALSE    | FALSE    |
| _links                  | [link relations](#links-object) for the user's current `status`   | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                                                     | TRUE       | FALSE    | TRUE     |
| _embedded               | embedded resources related to the user                                  | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)                                                     | TRUE       | FALSE    | TRUE     |

Metadata properties such as `id`, `status`, timestamps, `_links`, and `_embedded` are only available after a user is created.

* The `activated` timestamp will only be available for users activated after 06/30/2013.
* The`statusChanged` and `lastLogin` timestamps will be missing for users created before 06/30/2013 and updated on next status change or login.

The `type` property is a map that identifies the user type of the user (see [user types](/docs/reference/api/user-types)). Currently it contains a single element, `id`, as shown in the example. It can be specified when creating a new user, and may be updated by an administrator on a [full replace of an existing user](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserType/#tag/UserType/operation/updateUserType) (but not a partial update).

### User status

The following diagram shows the state object for a user:

<div class="full">

![STAGED, PROVISIONED, ACTIVE, RECOVERY, LOCKED_OUT, PASSWORD_EXPIRED, or DEPROVISIONED](/img/users-api/okta-user-status.png)

</div>

### Understanding User status values

The status of a user changes in response to explicit events, such as admin-driven lifecycle changes, user login, or self-service password recovery.
Okta doesn't asynchronously sweep through users and update their password expiry state, for example.
Instead, Okta evaluates password policy at login time, notices the password has expired, and moves the user to the expired state.
When running reports, remember that the data is valid as of the last login or lifecycle event for that user.
-->

### Profile object

<!--
Specifies [standard](#default-profile-properties) and [custom](#custom-profile-properties) profile properties for a user.

```json
{
  "profile": {
    "login": "isaac.brock@example.com",
    "firstName": "Isaac",
    "lastName": "Brock",
    "nickName": "issac",
    "displayName": "Isaac Brock",
    "email": "isaac.brock@example.com",
    "secondEmail": "isaac@example.org",
    "profileUrl": "http://www.example.com/profile",
    "preferredLanguage": "en-US",
    "userType": "Employee",
    "organization": "Okta",
    "title": "Director",
    "division": "R&D",
    "department": "Engineering",
    "costCenter": "10",
    "employeeNumber": "187",
    "mobilePhone": "+1-555-415-1337",
    "primaryPhone": "+1-555-514-1337",
    "streetAddress": "301 Brannan St.",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94107",
    "countryCode": "US"
  }
}
```

#### Default Profile properties

The default user profile is based on the [System for Cross-domain Identity Management: Core Schema](https://tools.ietf.org/html/draft-ietf-scim-core-schema-22#section-4.1.1) and has following standard properties:

| Property            | Description                                                                                                                          | DataType   | Nullable        | Unique   | Readonly   | MinLength   | MaxLength   | Validation                                                                                                       |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------- | :--------- | :---------      | :------- | :--------- | :---------- | :---------- | :--------------------------------------------------------------------------------------------------------------- |
| login               | Unique identifier for the user (`username`)                                                                                          | String     | FALSE           | TRUE     | FALSE      | 5           | 100         | [pattern](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Schema/#tag/Schema/operation/getUserSchema!c=200&path=definitions/base/properties/login&t=response)                                                  |
| email               | Primary email address of user                                                                                                        | String     | FALSE           | FALSE    | FALSE      | 5           | 100         | [RFC 5322 Section 3.2.3](https://datatracker.ietf.org/doc/html/rfc5322#section-3.2.3)                                       |
| secondEmail         | Secondary email address of user typically used for account recovery                                                                  | String     | TRUE            | FALSE     | FALSE      | 5           | 100         | [RFC 5322 Section 3.2.3](https://datatracker.ietf.org/doc/html/rfc5322#section-3.2.3)                                       |
| firstName           | Given name of the user (`givenName`)                                                                                                 | String     | FALSE (default) | FALSE    | FALSE      | 1           | 50          |                                                                                                                  |
| lastName            | Family name of the user (`familyName`)                                                                                               | String     | FALSE (default) | FALSE    | FALSE      | 1           | 50          |                                                                                                                  |
| middleName          | Middle name(s) of the user                                                                                                           | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| honorificPrefix     | Honorific prefix(es) of the user, or title in most Western languages                                                                 | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| honorificSuffix     | Honorific suffix(es) of the user                                                                                                     | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| title               | User's title, such as "Vice President"                                                                                                | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| displayName         | Name of the user, suitable for display to end users                                                                                  | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| nickName            | Casual way to address the user in real life                                                                                          | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| profileUrl          | URL of user's online profile (for example: a web page)                                                                                       | String     | TRUE            | FALSE    | FALSE      |             |             | [URL](https://tools.ietf.org/html/rfc1808)                                                                       |
| primaryPhone        | Primary phone number of user such as home number                                                                                     | String     | TRUE            | FALSE    | FALSE      | 0           | 100         |                                                                                                                  |
| mobilePhone         | Mobile phone number of user                                                                                                          | String     | TRUE            | FALSE    | FALSE      | 0           | 100         |                                                                                                                  |
| streetAddress       | Full street address component of user's address                                                                                      | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| city                | City or locality component of user's address (`locality`)                                                                            | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| state               | State or region component of user's address (`region`)                                                                               | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| zipCode             | ZIP code or postal code component of user's address (`postalCode`)                                                                    | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| countryCode         | Country name component of user's address (`country`)                                                                                 | String     | TRUE            | FALSE    | FALSE      |             |             | [ISO 3166-1 alpha 2 "short" code format](https://tools.ietf.org/html/draft-ietf-scim-core-schema-22#ref-ISO3166) |
| postalAddress       | Mailing address component of user's address                                                                                          | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| preferredLanguage   | User's preferred written or spoken languages                                                                                         | String     | TRUE            | FALSE    | FALSE      |             |             | [RFC 7231 Section 5.3.5](https://tools.ietf.org/html/rfc7231#section-5.3.5)                                      |
| locale              | User's default location for purposes of localizing items such as currency, date time format, numerical representations, and so on.         | String     | FALSE (default)            | FALSE    | FALSE      |             |             | See [Locale format](#locale-format) details.                                                                                       |
| timezone            | User's time zone                                                                                                                     | String     | TRUE            | FALSE    | FALSE      |             |             | [IANA Time Zone database format](https://tools.ietf.org/html/rfc6557)                                            |
| userType            | Used to describe the organization to user relationship such as "Employee" or "Contractor"                                             | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| employeeNumber      | Organization or company assigned unique identifier for the user                                                                      | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| costCenter          | Name of a cost center assigned to user                                                                                               | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| organization        | Name of user's organization                                                                                                          | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| division            | Name of user's division                                                                                                              | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| department          | Name of user's department                                                                                                            | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| managerId           | `id` of a user's manager                                                                                                             | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |
| manager             | `displayName` of the user's manager                                                                                                    | String     | TRUE            | FALSE    | FALSE      |             |             |                                                                                                                  |

##### Locale format

 A locale value is a concatenation of the ISO 639-1 two-letter language code, an underscore, and the ISO 3166-1 two-letter country code. For example, `en_US` specifies the language English and country US. This value is `en_US` by default.

##### Okta login

Every user within your Okta organization must have a unique identifier for a login.  This constraint applies to all users you import from other systems or applications such as Active Directory.  Your organization is the top-level namespace to mix and match logins from all your connected applications or directories.  Careful consideration of naming conventions for your login identifier will make it easier to onboard new applications in the future.

Logins are not considered unique if they differ only in case and/or diacritical marks.  If one of your users has a login of `Isaac.Brock@example.com`, there cannot be another user whose login is `isaac.brock@example.com`, nor `isáàc.bröck@example.com`.

Okta has a default ambiguous name resolution policy for usernames that include @-signs.  (By default, usernames must be formatted as email addresses and thus always include @-signs.  You can remove that restriction using either the Admin Console or the [Schemas API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Schema/).)  Users can sign in with their non-qualified short name (for example: `isaac.brock` with username `isaac.brock@example.com`) as long as the short name is still unique within the organization.

> **Hint:** Don't use a `login` with a `/` character.  Although `/` is a valid character according to [RFC 6531 section 3.3](http://tools.ietf.org/html/rfc6531#section-3.3), a user with this character in their `login` can't be fetched by `login` due to security risks with escaping this character in URI paths.
For more information about `login`, see [Get User by ID](#get-user-with-id).

##### Modifying default Profile properties

The only permitted customization of the default profile is to update permissions, to change whether the `firstName` and `lastName` properties are nullable, or to specify a [pattern](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Schema/#tag/Schema/operation/getUserSchema!c=200&path=definitions/base/properties/login&t=response) for `login`.  Use the Profile Editor in the Admin Console or the [Schemas API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Schema/) to make schema modifications.

#### Custom Profile properties

You can extend user profiles with custom properties, but you must first add the property to the user profile schema before you can reference it.  Use the Profile Editor in the Admin Console or the [Schemas API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Schema/) to manage schema extensions.

Custom attributes may contain HTML tags. It is the client's responsibility to escape or encode this data before displaying it. Use [best-practices](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) to prevent cross-site scripting.
--> 

### Credentials object

See [`credentials`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/createUser!path=credentials&t=request) in the new [Okta API reference portal](https://developer.okta.com/docs/api/)..

<!--Specifies primary authentication and recovery credentials for a user.  Credential types and requirements vary depending on the provider and security policy of the organization.

| Property            | DataType                                                 | Nullable   | Unique   | Readonly |
| :------------------ | :------------------------------------------------------- | :--------- | :------- | :------- |
| password            | [Password object](#password-object)                      | TRUE       | FALSE    | FALSE    |
| recovery_question   | [Recovery Question object](#recovery-question-object)    | TRUE       | FALSE    | FALSE    |
| provider            | [Provider object](#provider-object)                      | FALSE      | FALSE    | TRUE     |

```json
{
  "password": {
    "value": "tlpWENT2m"
  },
  "recovery_question": {
    "question": "Who's a major player in the cowboy scene?",
    "answer": "Annie Oakley"
  },
  "provider": {
    "type": "OKTA",
    "name": "OKTA"
  }
}
```
-->

#### Password object

See [`password`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/createUser!path=credentials&t=request) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--Specifies a password for a user

| Property   | DataType                                          | Nullable   | Unique   | Readonly   | MinLength         | MaxLength   | Validation      |
| :--------- | :---------                                        | :--------- | :------- | :--------- | :---------------- | :---------- | :-------------- |
| value      | String                                            | TRUE       | FALSE    | FALSE      | Password Policy   | 72          | Password Policy |
| hash       | [Hashed Password object](#hashed-password-object) | TRUE       | FALSE    | FALSE      | N/A               | N/A         |                 |
| hook       | [Password Hook object](#password-hook-object)     | TRUE       | FALSE    | FALSE      | N/A               | N/A         |                 |

A password value is a **write-only** property.
A password hash is a **write-only** property.
A password hook is a **write-only** property.

When a user has a valid password, or imported hashed password, or password hook, and a response object contains a password credential, then the Password object is a bare object without the `value` property defined (for example, `password: {}`), to indicate that a password value exists.

##### Default Password Policy

The password specified in the value property must meet the default password policy requirements:

* Must be a minimum of eight characters
* Must have a character from the following groups:
  * Upper case
  * Lower case
  * Digit
* Must not contain the user's sign-in ID or parts of the sign-in ID when split on the following characters: `,`, `.`, `_`, `#`, `@`, `-`. Okta only considers the parts of the sign-in ID that contain at least four characters. Additionally, the parent domain (such as `com` in the following example) isn't considered.<br>
<br>
  **For example:** A user with a sign-in ID such as `isaac.brock@example.com` can't set their password as `brockR0cks!` since the password contains part of the sign-in ID: `brock`.

> **Note:** You can modify password policy requirements in the Admin Console at **Security** > **Policies**.
-->

##### Hashed Password object

See [`hash`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/updateUser!path=credentials/password/hash&t=request) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--Specifies a hashed password to import into Okta. This allows an existing password to be imported into Okta directly from some other store. Okta supports the BCRYPT, SHA-512, SHA-256, SHA-1, MD5 and PBKDF2 hashing functions for password import. A hashed password may be specified in a Password object when creating or updating a user, but not for other operations.  See [Create User with Imported Hashed Password](#create-user-with-imported-hashed-password) for information on using this object when creating a user. When updating a user with a hashed password the user must be in the `STAGED` status.

> **Note:** Because the plain text password isn't specified when a hashed password is provided, password policy isn't applied.

| Property | Type | Description |
| -------- | ----- | ---------- |
| algorithm  | String   | The algorithm used to generate the hash using the password (and salt, when applicable). Must be set to BCRYPT, SHA-512, SHA-256, SHA-1, MD5 or PBKDF2. |
| value      | String   | For SHA-512, SHA-256, SHA-1, MD5 and PBKDF2, This is the actual base64-encoded hash of the password (and salt, if used). This is the Base64 encoded `value` of the SHA-512/SHA-256/SHA-1/MD5/PBKDF2 digest that was computed by either pre-fixing or post-fixing the `salt` to the `password`, depending on the `saltOrder`. If a `salt` was not used in the `source` system, then this should just be the the Base64 encoded `value` of the password's SHA-512/SHA-256/SHA-1/MD5/PBKDF2 digest. For BCRYPT, This is the actual radix64-encoded hashed password. |
| salt       | String   | Only required for salted hashes. For BCRYPT, this specifies the radix64-encoded salt used to generate the hash, which must be 22 characters long. For other salted hashes, this specifies the base64-encoded salt used to generate the hash. |
| workFactor | Number  | Governs the strength of the hash and the time required to compute it. Only required for BCRYPT algorithm. Minimum value is 1, and maximum is 20. |
| saltOrder  | String   | Specifies whether salt was pre- or postfixed to the password before hashing. Only required for salted algorithms. |
| iterationCount  | Number   | The number of iterations used when hashing passwords using PBKDF2. Must be >= 4096. Only required for PBKDF2 algorithm. |
| keySize  | Number   | Size of the derived key in bytes. Only required for PBKDF2 algorithm. |
| digestAlgorithm  | String   | Algorithm used to generate the key. Currently we support "SHA256_HMAC" and "SHA512_HMAC". Only required for the PBKDF2 algorithm. |

###### BCRYPT Hashed Password object example

```bash
"password" : {
  "hash": {
    "algorithm": "BCRYPT",
    "workFactor": 10,
    "salt": "rwh3vH166HCH/NT9XV5FYu",
    "value": "qaMqvAPULkbiQzkTCWo5XDcvzpk8Tna"
  }
}
```

###### SHA-512 Hashed Password object example

```bash
"password" : {
  "hash": {
    "algorithm": "SHA-512",
    "salt": "TXlTYWx0",
    "saltOrder": "PREFIX",
    "value": "QrozP8a+KfoHu6mPFysxLoO5LMQsd2Fw6IclZUf8xQjetJOCGS93vm68h+VaFX0LHSiF/GxQkykq1vofmx6NGA=="
  }
}
```

###### SHA-256 Hashed Password object example

```bash
"password" : {
  "hash": {
    "algorithm": "SHA-256",
    "salt": "MPu13OmY",
    "saltOrder": "PREFIX",
    "value": "Gjxo7mxvvzQWa83ovhYRUH2dWUhC1N77Ntc56UfI4sY"
  }
}
```

###### SHA-1 Hashed Password object example

```bash
"password" : {
  "hash": {
    "algorithm": "SHA-1",
    "salt": "UEO3wsAsgzQ=",
    "saltOrder": "POSTFIX",
    "value": "xjrauE6J6kbjcvMjWSSc+PsBBls="
  }
}
```

###### MD5 Hashed Password object example

```bash
"password" : {
  "hash": {
    "algorithm": "MD5",
    "salt": "TXlTYWx0",
    "saltOrder": "PREFIX",
    "value": "jqACjUUFXM1XE6NiLALAbA=="
  }
}
```

###### PBKDF2 Hashed Password object example

```bash
"password" : {
  "hash": {
    "algorithm": "PBKDF2",
    "salt": "RBDXRWs9",
    "value": "eKe8/dcL5gvRsMmp7WwxZq0Y7WAodielIcLaelLlgNs=",
    "iterationCount" : 4096,
    "keySize" : 32,
    "digestAlgorithm" : "SHA512_HMAC"
  }
}
```
-->

##### Password Hook object

See [`hook`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/updateUser!path=credentials/password/hook&t=request) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--Specifies that a [password import inline hook](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/InlineHook/#tag/InlineHook/operation/createPasswordImportInlineHook) should be triggered to handle verification of the user's password the first time the user logs in. This allows an existing password to be imported into Okta directly from some other store. See [Create User with Password Hook](#create-user-with-password-import-inline-hook) for information on using this object when creating a user.

> **Note:** Because the plain text password isn't specified when a password hook is specified, password policy isn't applied.

| Property   | DataType | Description                                                                                                                                                                                | Required                                                                      | Min Value                      | Max Value                      |
|:-----------|:---------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------|:-------------------------------|:-------------------------------|
| type  | String   | The type of password inline hook. Currently, must be set to default.                                                                                            | TRUE                                                                          | N/A                            | N/A                            |

###### Password Hook object example

```bash
"password" : {
  "hook": {
    "type": "default"
  }
}
```
-->

#### Recovery Question object

See [`recovery_question`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/updateUser!path=credentials/recovery_question&t=request) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--Specifies a secret question and answer that is validated (case insensitive) when a user forgets their password or unlocks their account.  The answer property is **write-only**.

| Property  | DataType | Nullable | Unique | Readonly | MinLength | MaxLength |
| --------- | -------- | -------- | ------ | -------- | --------- | --------- |
| question  | String   | TRUE     | FALSE  | FALSE    | 1         | 100       |
| answer    | String   | TRUE     | FALSE  | FALSE    | 1         | 100       |
-->

#### Provider object

See [`recovery_question`](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/createUser!path=credentials/provider&t=request) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--Specifies the authentication provider that validates the user's password credential. The user's current provider is managed by the Delegated Authentication settings for your organization. The provider object is **read-only**.

| Property   | DataType                                                              | Nullable   | Unique   | Readonly |
| :--------- | :-------------------------------------------------------------        | :--------- | :------- | :------- |
| type       | `OKTA`, `ACTIVE_DIRECTORY`,`LDAP`, `FEDERATION`, `SOCIAL`, or `IMPORT` | FALSE      | FALSE    | TRUE     |
| name       | String                                                                | TRUE       | FALSE    | TRUE     |

> **Note:** `ACTIVE_DIRECTORY` or `LDAP` providers specify the directory instance name as the `name` property.

> **Note:** Users with a `FEDERATION` or `SOCIAL` authentication provider don't support a `password` or `recovery_question` credential and must authenticate through a trusted Identity Provider.

> **Note:** `IMPORT` specifies a hashed password that was imported from an external source.
-->

### Links object

See the Links object section in the [Users API](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--The Links object specifies link relations (see [Web Linking](http://tools.ietf.org/html/rfc8288) available for the current status of a user). The Links object is used for dynamic discovery of related resources, lifecycle operations, and credential operations. The Links object is read-only.

#### Individual Users vs. collection of Users

For an individual User result, the Links object contains a full set of link relations available for that User as determined by your policies. For a collection of Users, the Links object contains only the `self` link. Operations that return a collection of Users include [List Users](#list-users) and [List all Member Users](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Group/#tag/Group/operation/listGroupUsers).

Here are some links that may be available on a User, as determined by your policies:

| Link Relation Type       | Description                                                                                                           |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| self                     | A self-referential link to this user                                                                                  |
| activate                 | Lifecycle action to [activate the user](#activate-user)                                                               |
| deactivate               | Lifecycle action to [deactivate the user](#deactivate-user)                                                           |
| suspend                  | Lifecycle action to [suspend the user](#suspend-user)                                                                 |
| unsuspend                | Lifecycle action to [unsuspend the user](#unsuspend-user)                                                             |
| resetPassword            | Lifecycle action to [trigger a password reset](#reset-password)                                                       |
| expirePassword           | Lifecycle action to [expire the user's password](#expire-password)                                                    |
| resetFactors             | Lifecycle action to [reset all MFA factors](#reset-factors)                                                           |
| unlock                   | Lifecycle action to [unlock a locked-out user](#unlock-user)                                                          |
| forgotPassword           | [Resets a user's password](#forgot-password) by validating the user's recovery credential.                            |
| changePassword           | [Changes a user's password](#change-password) validating the user's current password                                  |
| changeRecoveryQuestion   | [Changes a user's recovery credential](#change-recovery-question) by validating the user's current password           |

### User-Consent Grant object

<ApiLifecycle access="ea" />

```bash
{
    "id": "oag2n8HU1vTmvCdQ50g3",
    "status": "ACTIVE",
    "created": "2017-11-07T21:46:36.000Z",
    "lastUpdated": "2017-11-07T21:46:36.000Z",
    "issuer": "https://{yourOktaDomain}/oauth2/ausain6z9zIedDCxB0h7",
    "clientId": "customClientIdNative",
    "userId": "00uol9oQZaWN47WQZ0g3",
    "scopeId": "scpp4bmzfCV7dHf8y0g3",
    "_embedded": {
        "scope": {
            "name": "bus:drive",
            "displayName": "test",
            "description": "Drive bus"
        }
    },
    "_links": {
        "app": {
            "href": "https://{yourOktaDomain}/api/v1/apps/0oaozwn7Qlfx0wl280g3",
            "title": "Native client"
        },
        "scope": {
            "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausoxdmNlCV4Rw9Ec0g3/scopes/scpp4bmzfCV7dHf8y0g3",
            "title": "test"
        },
        "self": {
            "href": "https://{yourOktaDomain}/api/v1/users/00uol9oQZaWN47WQZ0g3/grants/oag2n8HU1vTmvCdQ50g3",
            "hints": {
                "allow": [
                    "GET",
                    "DELETE"
                ]
            }
        },
        "client": {
            "href": "https://{yourOktaDomain}/oauth2/v1/clients/customClientIdNative",
            "title": "Native client"
        },
        "user": {
            "href": "https://{yourOktaDomain}/api/v1/users/00uol9oQZaWN47WQZ0g3",
            "title": "Saml Jackson"
        },
        "authorizationServer": {
            "href": "https://{yourOktaDomain}/api/v1/authorizationServers/ausain6z9zIedDCxB0h7",
            "title": "Example Authorization Server"
        }
    }
}
```
-->

#### User Block object

See [User block - response payload](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/User/#tag/User/operation/listUserBlocks!c=200&path=appliesTo&t=response) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--The User Block object describes how the account is blocked from access. If `appliesTo` is `ANY_DEVICES`, then the account is blocked for all devices. If `appliesTo` is `UNKNOWN_DEVICES`, then the account is only blocked for unknown devices.

| Property  | Description | Datatype |
| :---------| :---------- | :------- |
| type      | Type of the block. Valid value: `DEVICE_BASED` | String |
| appliesTo | Target of the block. Valid values: `ANY_DEVICES`, `UNKNOWN_DEVICES` | String |

#### User-Consent Grant properties

<ApiLifecycle access="ea" />

| Property      | Description                                                                                                                      | Datatype                                                        |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| Id            | ID of this grant                                                                                                                 | String                                                          |
| status        | Status of the grant. Valid values: `ACTIVE`, `REVOKED` or `EXPIRED`                                                              | String                                                          |
| created       | Timestamp when the grant was created                                                                                             | Date                                                            |
| lastUpdated   | Timestamp when the grant was last updated                                                                                        | Date                                                            |
| issuer        | The complete URL of the authorization server for this grant                                                                      | String                                                          |
| clientId      | ID of the client for this grant                                                                                                  | String                                                          |
| userId        | ID of the user who consented to this grant                                                                                       | String                                                          |
| scopeId       | ID of the scope to which this grant applies                                                                                      | String                                                          |
| _links        | Discoverable resources related to the grant                                                                                      | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)  |
| _embedded     | If `expand`=`scope` is included in the request, information about the scope specified by `scopeId` is included in the response.  | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)  |
-->

### Client Grant object

See [User Grant - response payload](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/UserGrant/#tag/UserGrant/operation/getUserGrant!c=200&path=issuer&t=response) in the new [Okta API reference portal](https://developer.okta.com/docs/api/).

<!--<ApiLifecycle access="ea" />

```bash
{
  "client_id": "0oab57tu2q6C0rYwM0h7",
  "client_name": "AWS Cognito",
  "client_uri": null,
  "logo_uri": "https://example.com/image/logo.jpg",
  "_links": {
     "grants": {
        "href": "https://{yourOktaDomain}/api/v1/users/00ucmukel4KHsPARU0h7/clients/0oab57tu2q6C0rYwM0h7/grants"
        "hints": {
            "allow": [
                "GET",
                "DELETE"
            ]
        }
     }
  }
}
```

#### Client Grant properties

| Property      | Description                                   | Datatype                                                          | Unique |
| :------------ | :-------------------------------------------- | :---------------------------------------------------------------- | :----- |
| client_id     | The client ID of the OAuth 2.0 client         | String                                                            | TRUE   |
| client_name   | The name of the OAuth 2.0 client              | String                                                            | TRUE   |
| client_uri    | The URI of the OAuth 2.0 client               | String                                                            | FALSE  |
| logo_uri      | The logo URI of the OAuth 2.0 client          | String                                                            | FALSE  |
| _links        | Discoverable resources related to the grant   | [JSON HAL](http://tools.ietf.org/html/draft-kelly-json-hal-06)    | FALSE  |
-->
