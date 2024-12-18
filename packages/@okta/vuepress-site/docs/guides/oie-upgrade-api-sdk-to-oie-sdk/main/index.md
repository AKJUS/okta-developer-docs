---
title: Upgrade your app to the Identity Engine SDK
---

<ApiLifecycle access="ie" />

Upgrade your app to use Identity Engine SDK methods after you update your project to the latest Identity Engine SDK. Also, make sure you have an Identity Engine org.

Review the following sections, which detail Identity Engine SDK concepts. This guide discusses the differences between how the Classic Engine authentication SDK and APIs approach authentication compared to the Identity Engine approach. Mappings of Classic Engine authentication SDK method calls, and back-end APIs, to Identity Engine SDK methods are provided for some sample use cases.

---

#### Learning outcomes

* Understand why you should upgrade your app to use the Identity Engine SDK.
* Learn the differences between the Classic Engine authentication SDK and the Identity Engine SDK.
* Identify the mappings between Classic Engine authentication SDK methods and the Identity Engine SDK for your language.
* Identify the mappings between Classic Engine authentication APIs and the Identity Engine SDK for your language.

#### What you need

* An Identity Engine org
* The Interaction Code grant enabled
* The latest Classic Engine authentication SDK installed
* An app that uses the Classic Engine authentication SDK or back-end APIs

#### Sample code

<StackSelector snippet="sample" noSelector />

---

## Why upgrade your app to the Identity Engine SDK

<StackSelector snippet="upgrade" noSelector />

## Classic Engine Authentication APIs and SDK vs Identity Engine SDK

<StackSelector snippet="auth-vs-oie" noSelector />

## Map a basic sign-in code to the Identity Engine SDK

The following sections highlight the Classic Engine Authentication SDK method calls and back-end Authentication APIs that require migration to the Identity Engine SDK. The Identity Engine SDK methods can perform authentication using Identity Engine's new features and workflows.

<StackSelector snippet="auth" noSelector />

### Map Classic Engine Authentication APIs to the Identity Engine SDK

If your app uses direct APIs for an authentication flow, your code may call the following Okta APIs:

* `/api/v1/authn`: Begin the primary authentication, which validates the password credentials and evaluates org policies
* If successful, call the `/api/v1/sessions` API with a `sessionToken` returned from the first call to create a session

See the following sample calls and responses for this Basic Authentication flow:

#### Call /api/v1/authn

```bash
curl --location --request POST 'https://{yourOktaDomain}/api/v1/authn' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
  "username": "john.doe@example.com",
  "password": "password123",
  "options": {
    "multiOptionalFactorEnroll": false,
    "warnBeforePasswordExpired": false
  }
}'

```

#### Receive a successful response with a sessionToken

```JSON
{
    "expiresAt": "2021-10-07T18:19:36.000Z",
    "status": "SUCCESS",
    "sessionToken": "20111KWCKiTgnNgeaFjw760VitvCy7y-9cYl8lvN65754GmBuo_PPE6",
    "_embedded": {
        "user": {
            "id": "00u8eyowx5GiJhqvj1d6",
            "passwordChanged": "2020-12-21T19:39:06.000Z",
            "profile": {
                "login": "john.doe@example.com",
                "firstName": "John",
                "lastName": "Doe",
                "locale": "en_US",
                "timeZone": "America/Los_Angeles"
            }
        }
    },
    "_links": {
        "cancel": {
            "href": "https://example.okta.com/api/v1/authn/cancel",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        }
    }
}
```

#### Use the sessionToken from the response to create a session

```bash
curl --location --request POST 'https://{yourOktaDomain}/api/v1/sessions' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: SSWS 00igKrTNyNLHCw0wYSIsoDF28cN4B3KZPETBz9pqz0' \
--header 'Cookie: JSESSIONID=16DC4838820F919032FC7BF01A8FE3E8' \
--data-raw '{
  "sessionToken": "20111MzxECyRs8sqQ8WG93-ftVtXQ_uBUbOqVt7RYbNFsZBAs1mw-Vl"
}'
```

#### Receive a successful authentication response from the call

```JSON
{
    "id": "102XV1tNvxsTm69-StW_BCU-Q",
    "userId": "00u8eyowx5GiJhqvj1d6",
    "login": "john.doe@example.com",
    "createdAt": "2021-10-07T18:22:07.000Z",
    "expiresAt": "2021-10-07T20:22:07.000Z",
    "status": "ACTIVE",
    "lastPasswordVerification": "2021-10-07T18:22:07.000Z",
    "lastFactorVerification": null,
    "amr": [
        "pwd"
    ],
    "idp": {
        "id": "00o2di92cuwsnS0PS1d6",
        "type": "OKTA"
    },
    "mfaActive": true,
    "_links": {
        "self": {
            "href": "https://example.okta.com/api/v1/sessions/me",
            "hints": {
                "allow": [
                    "GET",
                    "DELETE"
                ]
            }
        },
        "refresh": {
            "href": "https://example.okta.com/api/v1/sessions/me/lifecycle/refresh",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "user": {
            "name": "John Doe",
            "href": "https://example.okta.com/api/v1/users/me",
            "hints":
                "allow": [
                    "GET"
                ]
            }
        }
    }
}
```

If your app implements these API calls and handles the responses shown, update your code to use Identity Engine SDK methods. These methods encapsulate the authentication flow using recursive calls to Identity Engine. A successful response returns with access and ID tokens.

<StackSelector snippet="oie-auth-flow-link1" noSelector />

## Map MFA code to the Identity Engine SDK

The following sections highlight the Classic Engine Authentication SDK method calls and back-end Authentication APIs that require migration to the Identity Engine SDK. The Identity Engine SDK methods can perform multifactor authentication using Identity Engine's new features and workflows.

<StackSelector snippet="mfaauth" noSelector />

### Map Classic Engine Authn APIs to the Identity Engine SDK

If your app uses direct APIs for a multifactor authentication flow, your code may call the following Okta APIs:

- `/api/v1/authn`: Begin the MFA authentication with the password credentials, which sets the transaction state to `MFA_REQUIRED`
- `/api/authn/factors/{emailFactorId}/verify`: Send the user an email with a sign-in code
- `/api/authn/factors/{$emailFactorId}/verify`: Call this a second time with the sign-in code from the email challenge

>**Note:** If you call the direct `/api/v1/policies` API to manage or update MFA enrollment policies, you need to update these calls to use Identity Engine policies. See [Authentication policy](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/createPolicy) and [User profile policy](https://developer.okta.com/docs/api/openapi/okta-management/management/tag/Policy/#tag/Policy/operation/createPolicy).

See the following sample calls and responses for the MFA authentication flow using the email factor:

#### Call the /api/v1/authn endpoint

```bash
curl --location --request POST 'https://{yourOktaDomain}/api/v1/authn' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
  "username": "john.doe@example.com",
  "password": "password123",
  "options": {
    "multiOptionalFactorEnroll": false,
    "warnBeforePasswordExpired": false
  }
}'

```

#### Receive a successful response that requires MFA

```JSON
{
    "stateToken": "00kYBC0MrmG2kHSqYHrSzw7Y99_u9-MOcjEf-_B9Fa",
    "expiresAt": "2021-10-12T14:38:30.000Z",
    "status": "MFA_REQUIRED",
    "_embedded": {
        "user": {
            "id": "00u1ehs07qD6MhWk85d7",
            "passwordChanged": "2021-10-08T19:36:48.000Z",
            "profile": {
                "login": "michael.john.smith27@gmail.com",
                "firstName": "Michael",
                "lastName": "Smith",
                "locale": "en",
                "timeZone": "America/Los_Angeles"
            }
        },
        "factors": [
            {
                "id": "emf1ehtcpaFA0cQg95d7",
                "factorType": "email",
                "provider": "OKTA",
                "vendorName": "OKTA",
                "profile": {
                    "email": "m...7@gmail.com"
                },
                "_links": {
                    "verify": {
                        "href": "https://example.okta.com/api/v1/authn/factors/emf1ehtcpaFA0cQg95d7/verify",
                        "hints": {
                            "allow": [
                                "POST"
                            ]
                        }
                    }
                }
            },
            {
                "id": "sms1ehtiv4lzDd0MW5d7",
                "factorType": "sms",
                "provider": "OKTA",
                "vendorName": "OKTA",
                "profile": {
                    "phoneNumber": "+1 XXX-XXX-1502"
                },
                "_links": {
                    "verify": {
                        "href": "https://example.okta.com/api/v1/authn/factors/sms1ehtiv4lzDd0MW5d7/verify",
                        "hints": {
                            "allow": [
                                "POST"
                            ]
                        }
                    }
                }
            }
        ],
        "policy": {
            "allowRememberDevice": true,
            "rememberDeviceLifetimeInMinutes": 15,
            "rememberDeviceByDefault": false,
            "factorsPolicyInfo": {}
        }
    },
    "_links": {
        "cancel": {
            "href": "https://example.okta.com/api/v1/authn/cancel",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        }
    }
}
```

#### Send email challenge (/api/v1/authn/factors/{emailFactorId}/verify)

```bash
curl --location --request POST 'https://{yourOktaDomain}/api/v1/authn/factors/emf276bb2dP3no7Da5d7/verify' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=6B93EFE5B529BB1CCC437F33996F04AB' \
--data-raw '{
  "stateToken": "00K3WvIsn4-P64LNEt5NW3yoXx-V6Kgi7H18yamJMi"
}'
```

#### Receive a response to challenge the factor

```JSON
{
    "stateToken": "00kYBC0MrmG2kHSqYHrSzw7Y99_u9-MOcjEf-_B9Fa",
    "expiresAt": "2021-10-12T14:40:23.000Z",
    "status": "MFA_CHALLENGE",
    "factorResult": "CHALLENGE",
    "challengeType": "FACTOR",
    "_embedded": {
        "user": {
            "id": "00u1ehs07qD6MhWk85d7",
            "passwordChanged": "2021-10-08T19:36:48.000Z",
            "profile": {
                "login": "michael.john.smith27@gmail.com",
                "firstName": "Michael",
                "lastName": "Smith",
                "locale": "en",
                "timeZone": "America/Los_Angeles"
            }
        },
        "factor": {
            "id": "emf1ehtcpaFA0cQg95d7",
            "factorType": "email",
            "provider": "OKTA",
            "vendorName": "OKTA",
            "profile": {
                "email": "m...7@gmail.com"
            }
        },
        "policy": {
            "allowRememberDevice": true,
            "rememberDeviceLifetimeInMinutes": 15,
            "rememberDeviceByDefault": false,
            "factorsPolicyInfo": {}
        }
    },
    "_links": {
        "next": {
            "name": "verify",
            "href": "https://example.okta.com/api/v1/authn/factors/emf1ehtcpaFA0cQg95d7/verify",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "resend": [
            {
                "name": "email",
                "href": "https://example.okta.com/api/v1/authn/factors/emf1ehtcpaFA0cQg95d7/verify/resend",
                "hints": {
                    "allow": [
                        "POST"
                    ]
                }
            }
        ],
        "prev": {
            "href": "https://example.okta.com/api/v1/authn/previous",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "cancel": {
            "href": "https://example.okta.com/api/v1/authn/cancel",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        }
    }
}
```

#### Verify code from challenge email (/api/v1/authn/factors/{emailFactorId}/verify)

```bash
curl --location --request POST 'https://{yourOktaDomain}/api/v1/authn/factors/emf276bb2dP3no7Da5d7/verify' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=6B93EFE5B529BB1CCC437F33996F04AB' \
--data-raw '{
  "stateToken": "00K3WvIsn4-P64LNEt5NW3yoXx-V6Kgi7H18yamJMi",
  "passCode": "477420"
}'
```

#### Receive a success response after confirming the email code

```JSON
{
    "expiresAt": "2021-10-12T14:43:04.000Z",
    "status": "SUCCESS",
    "sessionToken": "20111BkbGDWXbtv6_qe0NeDzuIYfWttZu5m4xszO4LQPqrmQfUA3pqc",
    "_embedded": {
        "user": {
            "id": "00u1ehs07qD6MhWk85d7",
            "passwordChanged": "2021-10-08T19:36:48.000Z",
            "profile": {
                "login": "john.doe@example.com",
                "firstName": "John",
                "lastName": "Doe",
                "locale": "en",
                "timeZone": "America/Los_Angeles"
            }
        }
    },
    "_links": {
        "cancel": {
            "href": "https://example.okta.com/api/v1/authn/cancel",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        }
    }
}
```

If your app uses these API calls and handles the responses shown, update your code to use Identity Engine SDK methods. These methods use the authentication flow with recursive calls to Identity Engine. A successful response includes access and ID tokens.

<StackSelector snippet="oie-auth-flow-link2" noSelector />

## Map password recovery code to the Identity Engine SDK

The following sections highlight the Classic Engine Authentication SDK method calls and back-end Authentication APIs that require migration to the Identity Engine SDK. The Identity Engine SDK methods can perform a password reset by using Identity Engine's new features and workflows.

<StackSelector snippet="pswrvy" noSelector />

### Map password recovery APIs to Identity Engine

If your app uses direct APIs for a password recovery flow, your code may call the following APIs:

- `/api/v1/authn/recovery/password`: Initiate the password recovery process and set the transaction state to `RECOVERY_CHALLENGE`
- `/api/v1/authn/recovery/token`: Challenge the factor code
- `/api/v1/authn/credentials/reset_password`: Reset the password if the challenge is successful

See the following sample calls and responses for the password recovery flow using SMS as a factor:

#### User clicks link to recover password (/api/v1/authn/recovery/password with factorType)

```bash
curl --location --request POST 'https://{yourOktaDomain}/api/v1/authn/recovery/password' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=567D81F8C70A8F601AD0EF3A551FB53D' \
--data-raw '{
  "username": "{username}",
  "factorType": "SMS",
  "relayState": "/myapp/some/deep/link/i/want/to/return/to"
}'
```

#### The response requires an SMS code challenge

```JSON
{
    "stateToken": "00hdMzIhfXCfUeRYVjmiP9O6_l0A-ScgdiyucNw3e_",
    "expiresAt": "2021-10-12T19:05:34.000Z",
    "status": "RECOVERY_CHALLENGE",
    "relayState": "/myapp/some/deep/link/i/want/to/return/to",
    "factorType": "SMS",
    "recoveryType": "PASSWORD",
    "_links": {
        "next": {
            "name": "verify",
            "href": "https://example.okta.com/api/v1/authn/recovery/factors/SMS/verify",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "cancel": {
            "href": "https://example.okta.com/api/v1/authn/cancel",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "resend": {
            "name": "SMS",
            "href": "https://example.okta.com/api/v1/authn/recovery/factors/SMS/resend",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        }
    }
}
```

#### The user verifies the SMS challenge (/api/v1/authn/recovery/factors/sms/verify)

```bash
curl --location --request POST 'https://{yourOktaDomain}/api/v1/authn/recovery/factors/sms/verify' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=567D81F8C70A8F601AD0EF3A551FB53D' \
--data-raw '{
  "stateToken": "00hdMzIhfXCfUeRYVjmiP9O6_l0A-ScgdiyucNw3e_",
  "passCode": "926187"
}'
```

#### If successful, the transaction status moves to Password_Reset

```JSON
{
    "stateToken": "00hdMzIhfXCfUeRYVjmiP9O6_l0A-ScgdiyucNw3e_",
    "expiresAt": "2021-10-12T18:11:27.000Z",
    "status": "PASSWORD_RESET",
    "relayState": "/myapp/some/deep/link/i/want/to/return/to",
    "recoveryType": "PASSWORD",
    "_embedded": {
        "user": {
            "id": "00u276bb2cmQuiFhU5d7",
            "passwordChanged": "2021-10-12T17:12:45.000Z",
            "profile": {
                "login": "john.doe@example.com",
                "firstName": "John",
                "lastName": "Doe",
                "locale": "en",
                "timeZone": "America/Los_Angeles"
            }
        },
        "policy": {
            "complexity": {
                "minLength": 8,
                "minLowerCase": 1,
                "minUpperCase": 1,
                "minNumber": 1,
                "minSymbol": 0,
                "excludeUsername": true
            },
            "age": {
                "minAgeMinutes": 0,
                "historyCount": 4
            }
        }
    },
    "_links": {
        "next": {
            "name": "resetPassword",
            "href": "https://example.okta.com/api/v1/authn/credentials/reset_password",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        },
        "cancel": {
            "href": "https://example.okta.com/api/v1/authn/cancel",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        }
    }
}
```

#### Prompt the user to reset the password (/api/v1/authn/credentials/reset_password)

```bash
curl --location --request POST 'https://{yourOktaDomain}/api/v1/authn/credentials/reset_password' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=567D81F8C70A8F601AD0EF3A551FB53D' \
--data-raw '{
  "stateToken": "00hdMzIhfXCfUeRYVjmiP9O6_l0A-ScgdiyucNw3e_",
  "newPassword": "new_password!"
}'
```

#### The app receives the response and the user can sign in

```JSON
{
    "stateToken": "00K3WvIsn4-P64LNEt5NW3yoXx-V6Kgi7H18yamJMi",
    "expiresAt": "2021-10-12T18:13:17.000Z",
    "status": "MFA_REQUIRED",
    "relayState": "/myapp/some/deep/link/i/want/to/return/to?type_hint=PASSWORD_RECOVERY&session_hint=AUTHENTICATED&login_hint=john.doe%40example.com",
    "_embedded": {
        "user": {
            "id": "00u276bb2cmQuiFhU5d7",
            "passwordChanged": "2021-10-12T18:08:17.000Z",
            "profile": {
                "login": "john.doe@example.com",
                "firstName": "John",
                "lastName": "Doe",
                "locale": "en",
                "timeZone": "America/Los_Angeles"
            }
        },
        "factors": [
            {
                "id": "sms276bje00iCLqHY5d7",
                "factorType": "sms",
                "provider": "OKTA",
                "vendorName": "OKTA",
                "profile": {
                    "phoneNumber": "+1 XXX-XXX-1502"
                },
                "_links": {
                    "verify": {
                        "href": "https://example.okta.com/api/v1/authn/factors/sms276bje00iCLqHY5d7/verify",
                        "hints": {
                            "allow": [
                                "POST"
                            ]
                        }
                    }
                }
            },
            {
                "id": "emf276bb2dP3no7Da5d7",
                "factorType": "email",
                "provider": "OKTA",
                "vendorName": "OKTA",
                "profile": {
                    "email": "m...7@gmail.com"
                },
                "_links": {
                    "verify": {
                        "href": "https://example.okta.com/api/v1/authn/factors/emf276bb2dP3no7Da5d7/verify",
                        "hints": {
                            "allow": [
                                "POST"
                            ]
                        }
                    }
                }
            }
        ],
        "policy": {
            "allowRememberDevice": true,
            "rememberDeviceLifetimeInMinutes": 15,
            "rememberDeviceByDefault": false,
            "factorsPolicyInfo": {}
        }
    },
    "_links": {
        "cancel": {
            "href": "https://example.okta.com/api/v1/authn/cancel",
            "hints": {
                "allow": [
                    "POST"
                ]
            }
        }
    }
}
```

If your code implements these API calls and handles the responses shown, you need to update your app to use Identity Engine SDK methods.

These methods encapsulate the password recovery flow using recursive calls to Identity Engine. A success response returns with access and ID tokens.

<StackSelector snippet="oie-auth-flow-link3" noSelector />

## Map basic sign-out code to the Identity Engine SDK

<StackSelector snippet="signout" noSelector />
