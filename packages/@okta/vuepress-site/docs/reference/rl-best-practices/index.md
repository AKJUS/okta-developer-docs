---
title: Rate limit best practices
excerpt: >-
  Understand rate limit best practices at Okta and learn how to design for efficient use of
  resources
---

# Rate limit best practices

In this section, you learn how to check your rate limits, investigate usage, and request exceptions.

## Check your rate limits with Okta's rate limit dashboard

The Okta [rate limit dashboard](/docs/reference/rl-dashboard/) is an Admin Console tool that provides detailed data on your API usage. Use this tool to monitor your endpoints or investigate issues or violations. Any notification of rate limit violations provides a link to the dashboard.

If the API usage data suggests updates to any rate limits are required, based on your use cases, configurations are available to increase limits temporarily or provide more permanent solutions. See [Request rate limit exceptions](#request-rate-limit-exceptions) or contact [Support](https://support.okta.com/help/open_case).

## Check your rate limits with Okta's rate limit headers

Okta provides three headers in each response to report on both concurrent and org-wide rate limits.

For org-wide rate limits, the three headers show the limit that’s being enforced, when it resets, and how close you are to hitting the limit:

* `X-Rate-Limit-Limit`: the rate limit ceiling that’s applicable for the current request.
* `X-Rate-Limit-Remaining`: the amount of requests left for the current rate-limit window.
* `X-Rate-Limit-Reset`: the time at which the rate limit resets, specified in UTC epoch time (in seconds).

For example:

```http
HTTP/1.1 200 OK
X-Rate-Limit-Limit: 1200
X-Rate-Limit-Remaining: 1199
X-Rate-Limit-Reset: 1609459200
```

The best way to be sure about org-wide rate limits is to check the relevant headers in the response. The System Log doesn't report every API request. Rather, it typically reports completed or attempted real-world events such as configuration changes, user sign in, or user lockout. The System Log doesn't report the rate at which you've been calling the API.

Instead of the accumulated counts for time-based rate limits, when a request exceeds the limit for concurrent requests, `X-Rate-Limit-Limit`, `X-Rate-Limit-Remaining`, and `X-Rate-Limit-Reset` report the concurrent values.

The three headers behave a little differently for concurrent rate limits:

* When the number of unfinished requests is below the concurrent rate limit, request headers only report org-wide rate limits.

* When you exceed a concurrent rate limit threshold, the headers report that the limit has been exceeded.

* When you drop back down below the concurrent rate limit, the headers switch back to reporting the time-based rate limits.

Also, the `X-Rate-Limit-Reset` time for concurrent rate limits is only an estimate. There's no guarantee that enough requests will complete in time to stop exceeding the concurrent rate limit at the time indicated.

### Example rate limit header with org-wide rate limit

This example shows the relevant portion of a rate limit header being returned for a request that hasn't exceeded the org-wide rate limit for the `/api/v1/users` endpoint:

```http
HTTP/1.1 200
X-Rate-Limit-Limit: 600
X-Rate-Limit-Remaining: 598
X-Rate-Limit-Reset: 1609459200
```

The following example shows a rate limit header being returned for a request that has exceeded the rate limit for the `/api/v1/users` endpoint:

```http
HTTP/1.1 429
X-Rate-Limit-Limit: 600
X-Rate-Limit-Remaining: 0
X-Rate-Limit-Reset: 1609459200
```

#### Example rate limit header with concurrent rate limit

This example shows the relevant portion of a rate limit header being returned with an error for a request that exceeded the concurrent rate limit. If the rate limit wasn't being exceeded, the headers would contain information about the org-wide rate limit. You won't see non-error concurrent rate limits in the headers.

```http
HTTP/1.1 429
X-Rate-Limit-Limit: 0
X-Rate-Limit-Remaining: 0
X-Rate-Limit-Reset: 1609459200
```

The first two header values are always `0` for concurrent rate limit errors. The third header reports an estimated time interval when the concurrent rate limit may be resolved. It isn't a guarantee.

The error condition resolves itself when there’s another concurrent thread available. Normally, no intervention is required. However, if you notice frequent bursts of HTTP 429 errors, or if the concurrent rate limit isn't quickly resolved, you may be exceeding the concurrent rate limit. If you can't identify what is causing you to exceed the limit by examining activity in the log before the burst of HTTP 429 errors are logged, contact [Support](https://support.okta.com/help/open_case).

#### Example error response events for concurrent rate limit

```json
{
    "eventId": "tevEVgTHo-aQjOhd1OZ7QS3uQ1506395956000",
    "sessionId": "102oMlafQxwTUGJMLL8FhVNZA",
    "requestId": "reqIUuPHG7ZSEuHGUXBZxUXEw",
    "published": "2021-01-26T03:19:16.000Z",
    "action": {
      "message": "Too many concurrent requests in flight",
      "categories": [],
      "objectType": "core.concurrency.org.limit.violation",
      "requestUri": "/report/system_log"
    },
    "actors": [
      {
        "id": "00uo7fD8dXTeWU3g70g3",
        "displayName": "Test User",
        "login": "test-user@test.net",
        "objectType": "User"
      },
      {
        "id": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
        "displayName": "CHROME",
        "ipAddress": "127.0.0.1",
        "objectType": "Client"
      }
    ],
    "targets": []
  }
```

#### Example error response in the System Log API for concurrent rate limit

```json
{
    "actor": {
        "alternateId": "test.user@test.com",
        "detailEntry": null,
        "displayName": "Test User",
        "id": "00u1qqxig80SMWArY0g7",
        "type": "User"
    },
    "authenticationContext": {
        "authenticationProvider": null,
        "authenticationStep": 0,
        "credentialProvider": null,
        "credentialType": null,
        "externalSessionId": "trs2TSSLkgWR5iDuebwuH9Vsw",
        "interface": null,
        "issuer": null
    },
    "client": {
        "device": "Unknown",
        "geographicalContext": null,
        "id": null,
        "ipAddress": "4.15.16.10",
        "userAgent": {
            "browser": "UNKNOWN",
            "os": "Unknown",
            "rawUserAgent": "Apache-HttpClient/4.5.2 (Java/1.7.0_76)"
        },
        "zone": "null"
    },
    "debugContext": {
        "debugData": {
            "requestUri": "/api/v1/users"
        }
    },
    "displayMessage": "Too many requests in flight",
    "eventType": "core.concurrency.org.limit.violation",
    "legacyEventType": "core.concurrency.org.limit.violation",
    "outcome": null,
    "published": "2021-01-26T20:21:32.783Z",
    "request": {
        "ipChain": [
            {
                "geographicalContext": null,
                "ip": "4.15.16.10",
                "source": null,
                "version": "V4"
            },
            {
                "geographicalContext": null,
                "ip": "52.22.142.162",
                "source": null,
                "version": "V4"
            }
        ]
    },
    "securityContext": {
        "asNumber": null,
        "asOrg": null,
        "domain": null,
        "isProxy": null,
        "isp": null
    },
    "severity": "INFO",
    "target": null,
    "transaction": {
        "detail": {},
        "id": "Wcq2zDtj7xjvEu-gRMigPwAACYM",
        "type": "WEB"
    },
    "uuid": "dc7e2385-74ba-4b77-827f-fb84b37a4b3b",
    "version": "0"
}
```

## Review your API limit parameter

Sometimes, you can avoid hitting rate limits by implementing the maximum value of the `limit` query parameter for an individual API endpoint. Increasing this value to the maximum reduces the number of calls for a given operation, which can keep you under the endpoint's rate limit. By default, Okta uses a default `limit` if one isn't set.

For example, the endpoint `/api/v1/apps/{applicationId}/users` returns, by default, 50 results. You can increase this limit to 500, reducing the number of calls.

See the [Core Okta API](/docs/reference/core-okta-api/) for details on each endpoint's default and maximum values for the `limit` parameter.

## Request rate limit exceptions

You can submit a request by opening a support case to increase the rate limit for specific Okta API endpoints. These requests must be submitted at least 15 business days before the increased rate limit is needed. After submission, Okta Support teams review each request thoroughly and either grant or deny the increase. Okta strongly recommends submitting requests as far in advance as possible. Some requests may take longer to review.

The following customers can submit requests for rate limit exceptions:

* Workforce Identity Cloud (WIC) customers
* Customer Identity Solution (CIS) customers

If a request is made for endpoints covered by [Dynamic Scale](/docs/reference/rl-dynamic-scale/) or [Workforce Multipliers](/docs/reference/rl-additional-limits/#workforce-license-rate-limit-multiplier), Okta may deny the request and require that you consult with your account team to explore other options. Typically, this scenario occurs if:

* You’ve requested a temporary rate limit increase multiple times in a calendar year
* You’re requesting a rate limit increase that is >= 5x the default rate limit (for example, 1,000 requests per minute to 5,000 requests/min)
* You’re requesting a permanent rate limit increase

See [How to Request a Temporary Rate Limit Increase](https://support.okta.com/help/s/article/how-to-request-a-rate-limit-increase?language=en_US&utm_source=google&utm_campaign=amer_namer_usa_all_ciam-all_dg-ao_a-ciam_search_google_pmax_kw_Pmax-sso_utm2&utm_medium=cpc&utm_id=aNK4z000000UGFbGAO&gad_source=1&gclid=Cj0KCQjw3vO3BhCqARIsAEWblcBcvqWV4aGF6X-UTc_imiXfyDRca4hs9HeJKgipWIS-dx8W9NUgAZgaAh-8EALw_wcB) for more information.
