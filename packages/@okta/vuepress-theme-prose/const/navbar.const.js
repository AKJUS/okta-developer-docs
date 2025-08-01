export const concepts = [
  {
    title: "Concepts",
    path: "/docs/concepts/",
    subLinks: [
      {
        title: "API Access Management",
        path: "/docs/concepts/api-access-management/",
      },
      {
        title: "Authorization servers",
        path: "/docs/concepts/auth-servers/",
      },
      {
        title: "Brands",
        path: "/docs/concepts/brands/",
      },
      {
        title: "Event hooks",
        path: "/docs/concepts/event-hooks/",
      },
      {
        title: "External Identity Providers",
        path: "/docs/concepts/identity-providers/",
      },
      {
        title: "Feature lifecycle management",
        path: "/docs/concepts/feature-lifecycle-management/",
      },
      {
        title: "Role assignment",
        path: "/docs/concepts/role-assignment/",
      },
      {
        title: "How Okta works",
        path: "/docs/concepts/how-okta-works/",
      },
      {
        title: "Inline hooks",
        path: "/docs/concepts/inline-hooks/",
      },
      {
        title: "Interaction Code grant type",
        path: "/docs/concepts/interaction-code/",
      },
      {
        title: "Key rotation",
        path: "/docs/concepts/key-rotation/",
      },
      {
        title: "Monitor Okta",
        path: "/docs/concepts/monitor/",
      },
      {
        title: "Multi-tenant solutions",
        path: "/docs/concepts/multi-tenancy/",
      },
      {
        title: "OAuth 2.0 and OIDC overview",
        path: "/docs/concepts/oauth-openid/",
      },
      {
        title: "Redirect vs. embedded deployment",
        path: "/docs/concepts/redirect-vs-embedded/",
      },
      {
        title: "Okta data model",
        path: "/docs/concepts/okta-data-model/",
      },
      {
        title: "Okta Identity Engine overview",
        path: "/docs/concepts/oie-intro/",
      },
      {
        title: "Org Creator",
        path: "/docs/concepts/org-creator/",
      },
      {
        title: "Okta organizations",
        path: "/docs/concepts/okta-organizations/",
      },
      {
        title: "Policies",
        path: "/docs/concepts/policies/",
      },
      {
        title: "Session management",
        path: "/docs/concepts/session/",
      },
      {
        title: "User profiles",
        path: "/docs/concepts/user-profiles/",
      },
      {
        title: "Understanding IAM",
        path: "/docs/concepts/iam-overview/",
        subLinks: [
          {
            title: "Identity management factors",
            path: "/docs/concepts/iam-overview-identity-management-factors/"
          },
          {
            title: "Authentication factors",
            path: "/docs/concepts/iam-overview-authentication-factors/"
          },
          {
            title: "Authorization factors",
            path: "/docs/concepts/iam-overview-authorization-factors/"
          },
          {
            title: "Architectural factors",
            path: "/docs/concepts/iam-overview-architectural-factors/"
          },
          {
            title: "IAM terminology",
            path: "/docs/concepts/iam-overview-iam-terminology/",
            description: true,
          }
        ]
      },
      {
        title: "Understanding SAML",
        path: "/docs/concepts/saml/",
        subLinks: [
          {
            title: "SAML FAQ",
            path: "/docs/concepts/saml/faqs/",
          },
        ],
      },
      {
        title: "Understanding SCIM",
        path: "/docs/concepts/scim/",
        subLinks: [
          {
            title: "SCIM FAQ",
            path: "/docs/concepts/scim/faqs/",
          },
        ],
      },
    ],
  },
];

export const guides = [
  {
    title: "Guides",
    path: "/docs/guides/",
    subLinks: [
      {
        title: "Quickstart",
        guideName: "quickstart"
      },
      {
        title: "Sign users in",
        guideName: "sign-in-overview/main",
        subLinks: [
          {
            title: "Redirect authentication",
            subLinks: [
              {
                title: "Sign in to SPA with AuthJS",
                guideName: "auth-js-redirect",
              },
              {
                title: "Sign in to SPA",
                guideName: "sign-into-spa-redirect",
              },
              {
                title: "Sign in to web application",
                guideName: "sign-into-web-app-redirect",
              },
              {
                title: "Sign in to mobile app",
                guideName: "sign-into-mobile-app-redirect",
              },
              {
                title: "Configure Swift SDK redirect",
                guideName: "mobile-swift-configure-redirect",
              },
              {
                title: "Redirect auth in the sample apps",
                guideName: "sampleapp-oie-redirectauth",
              },
              {
                title: "Refresh access and ID tokens",
                guideName: "oie-embedded-common-refresh-tokens",
              },
            ],
          },
          {
            title: "Embedded authentication",
            subLinks: [
              {
                title: "Get set up",
                subLinks: [
                  {
                    title: "Your Okta org",
                    guideName: "oie-embedded-common-org-setup",
                  },
                  {
                    title:
                      "SDK, widget, sample apps",
                    guideName: "oie-embedded-common-download-setup-app",
                  },
                  {
                    title: "Run the sample apps",
                    guideName: "oie-embedded-common-run-samples",
                  },
                ],
              },
              {
                title: "Auth JS fundamentals",
                guideName: "auth-js",
              },
              {
                title: "Embedded widget fundamentals",
                guideName: "embedded-siw",
              },
              {
                title: "Sign in to SPA: Auth JS",
                guideName: "sign-in-to-spa-authjs",
                description: true
              },
              {
                title: "Sign in to SPA: Widget",
                guideName: "sign-in-to-spa-embedded-widget",
              },
              {
                title: "Password optional",
                path: "/docs/guides/pwd-optional-overview/aspnet/main/",
                subLinks: [
                  {
                    title: "Sign up for new account with email only",
                    guideName: "pwd-optional-new-sign-up-email"
                  },
                  {
                    title: "Sign in with email only",
                    guideName: "pwd-optional-sign-in-email"
                  },
                  {
                    title: "Change your primary email address",
                    guideName: "pwd-optional-change-email"
                  },
                  {
                    title: "Best practices for password optional",
                    guideName: "pwd-optional-best-practices"
                  }
                ]
              },
              {
                title: "Embedded SDK use cases",
                subLinks: [
                  {
                    title: "Basic sign-in flow with password",
                    guideName: "oie-embedded-sdk-use-case-basic-sign-in",
                  },
                  {
                    title: "Sign in with Facebook",
                    guideName: "oie-embedded-sdk-use-case-sign-in-soc-idp",
                  },
                  {
                    title: "User password recovery",
                    guideName: "oie-embedded-sdk-use-case-pwd-recovery-mfa",
                  },
                  {
                    title: "Self-registration",
                    guideName: "oie-embedded-sdk-use-case-self-reg",
                  },
                  {
                    title: "New user activation",
                    guideName: "oie-embedded-sdk-use-case-new-user-activation",
                  },
                  {
                    title: "Sign in: password + email",
                    guideName: "oie-embedded-sdk-use-case-sign-in-pwd-email",
                  },
                  {
                    title: "Sign in: pwd and phone",
                    guideName: "oie-embedded-sdk-use-case-sign-in-pwd-phone",
                  },
                  {
                    title: "User sign out (local app)",
                    guideName: "oie-embedded-sdk-use-case-basic-sign-out",
                  },
                ],
              },
              {
                title: "Embedded Sign-In Widget use cases",
                subLinks: [
                  {
                    title: "Password optional",
                    subLinks: [
                      {
                        title: "Sign in with email only",
                        guideName: "pwd-optional-widget-sign-in-email"
                      }
                    ]
                  },
                  {
                    title: "Load the widget",
                    guideName: "oie-embedded-widget-use-case-load",
                  },
                  {
                    title: "Basic sign-in flow",
                    guideName: "oie-embedded-widget-use-case-basic-sign-in",
                  },
                  {
                    title: "Sign in with Facebook",
                    guideName: "oie-embedded-widget-use-case-sign-in-soc-idp",
                  },
                ],
              },
            ],
          },
          {
            title: "Authenticators",
            path: "/docs/guides/authenticators-overview/main/",
            subLinks: [
              {
                title: "Okta email",
                guideName: "authenticators-okta-email",
              },
              {
                title: "Okta Verify",
                guideName: "authenticators-okta-verify"
              },
              {
                title: "Custom authenticator",
                guideName: "authenticators-custom-authenticator"
              },
              {
                title: "Google authenticator",
                guideName: "authenticators-google-authenticator",
              },
              {
                title: "Temporary access code",
                guideName: "authenticators-tac-authenticator",
              },
              {
                title: "Web Authentication",
                guideName: "authenticators-web-authn",
              },
            ],
          },
          {
            title: "User-scoped account management",
            guideName: "configure-user-scoped-account-management",
          },
          {
            title: "Advanced use cases",
            path: "/docs/guides/advanced-use-case-overview/main/",
            subLinks: [
              {
                title: "Email Magic Links",
                guideName: "email-magic-links-overview"
              },
              {
                title: "Device context",
                guideName: "device-context"
              },
              {
                title: "Custom password recovery",
                guideName: "oie-embedded-sdk-use-case-custom-pwd-recovery-mfa",
              },
            ],
          },
          {
            title: "Mobile authentication",
            subLinks: [
              {
                title: "Identity Engine SDK overview",
                guideName: "mobile-idx-sdk-overview"
              }
            ]
          },
          {
            title: "Access policies",
            guideName: "configure-access-policy",
          },
          {
            title: "Global session and authn policies",
            guideName: "configure-signon-policy"
          },
          {
            title: "Multiple identifiers",
            guideName: "multiple-identifiers"
          },
          {
            title: "Okta account management policy",
            guideName: "okta-account-management-policy"
          },
          {
            title: "Keep me signed in (KMSI)",
            guideName: "keep-me-signed-in"
          },
          {
            title: "Device assurance policies",
            guideName: "device-assurance-policies"
          },
          {
            title: "Test your access policies",
            guideName: "policy-simulation"
          },
          {
            title: "Add an external identity provider",
            path: "/docs/guides/identity-providers/",
            subLinks: [
              {
                title: "Enterprise identity provider",
                guideName: "add-an-external-idp"
              },
              {
                title: "Enterprise identity verification vendor",
                guideName: "add-id-verification-idp"
              },
              {
                title: "Social login",
                guideName: "social-login"
              },
              {
                title: "Login.gov",
                guideName: "add-logingov-idp"
              },
            ],
          },
          {
            title: "Integrate Okta with identity verification vendors",
            guideName: "idv-integration"
          },
          { title: "Configure AMR claims mapping", guideName: "configure-amr-claims-mapping", hidden: true },
          { title: "Configure claims sharing", guideName: "configure-claims-sharing" },
          { title: "Sign users out", guideName: "oie-embedded-sdk-use-case-basic-sign-out" },
          { title: "Delete all Stay signed in sessions", guideName: "delete-all-stay-signed-in-sessions" },
          { title: "Single Logout", guideName: "single-logout" },
          {
            title: "Basics",
            subLinks: [
              {
                title: "Create an API token",
                guideName: "create-an-api-token",
              },
              { title: "Enable CORS", guideName: "enable-cors" },
              { title: "Find your Okta domain", guideName: "find-your-domain" },
              {
                title: "Find your application credentials",
                guideName: "find-your-app-credentials",
              },
              {
                title: "Share app key credentials for IdPs",
                guideName: "sharing-cert",
              },
              { title: "Set up SAML Tracer", guideName: "saml-tracer" },
              {
                title: "Upgrade SAML apps to SHA256",
                guideName: "updating-saml-cert",
              },
              {
                title: "Sign Okta certs with your own CA",
                guideName: "sign-your-own-saml-csr",
              },
            ],
          },
        ],
      },
      {
        title: "Okta Identity Engine upgrade",
        guideName: "oie-upgrade-overview/main",
        subLinks: [
          {
            title: "Plan embedded app upgrades",
            guideName: "oie-upgrade-plan-embedded-upgrades",
          },
          {
            title: "Identity Engine limitations",
            guideName: "ie-limitations",
          },
          {
            title: "Okta Sign-In Widget upgrade",
            subLinks: [
              {
                title: "Upgrade your widget",
                guideName: "oie-upgrade-sign-in-widget",
              },
              {
                title: "Deprecated widget JS methods",
                guideName: "oie-upgrade-sign-in-widget-deprecated-methods",
              },
              {
                title: "Updates to widget styling",
                guideName: "oie-upgrade-sign-in-widget-styling",
              },
              {
                title: "Updates to widget i18n",
                guideName: "oie-upgrade-sign-in-widget-i18n",
              },
            ],
          },
          {
            title: "Identity Engine SDK upgrade",
            subLinks: [
              {
                title: "Add the SDK to your app",
                guideName: "oie-upgrade-add-sdk-to-your-app",
              },
              {
                title: "Upgrade your app SDK",
                guideName: "oie-upgrade-api-sdk-to-oie-sdk",
              },
              {
                title: "Session changes",
                guideName: "oie-upgrade-sessions-api",
              },
            ],
          },
          {
            title: "Authn enrollment policy changes",
            guideName: "oie-upgrade-mfa-enroll-policy"
          }
        ]
      },
      {
        title: "Authorization",
        subLinks: [
          {
            title: "Implement by grant type",
            guideName: "implement-grant-type",
          },
          {
            title: "Configure Device Authz grant flow",
            guideName: "device-authorization-grant",
          },
          {
            title: "Configure Direct Authentication",
            guideName: "configure-direct-auth-grants",
          },
          {
            title: "Configure SSO for native apps",
            guideName: "configure-native-sso",
          },
          {
            title: "Create an authorization server",
            guideName: "customize-authz-server",
          },
          {
            title: "Request user consent",
            guideName: "request-user-consent"
          },
          {
            title: "Rotate secrets and manage keys",
            guideName: "client-secret-rotation-key",
          },
          {
            title: "Set up On-Behalf-Of Token Exchange",
            guideName: "set-up-token-exchange",
          },
          {
            title: "Transactional verification using CIBA",
            guideName: "configure-ciba",
          },
          {
            title: "Tokens",
            subLinks: [
              {
                title: "Build a JWT for client authn",
                guideName: "build-self-signed-jwt",
              },
              {
                title: "Add custom claims",
                guideName: "customize-tokens-returned-from-okta",
              },
              {
                title: "Add a custom groups claim",
                guideName: "customize-tokens-groups-claim",
              },
              {
                title: "Add a dynamic allowlist",
                guideName: "customize-tokens-dynamic",
              },
              {
                title: "Add a static allowlist",
                guideName: "customize-tokens-static",
              },
              {
                title: "Federated claims with entitlements",
                guideName: "federated-claims",
              },
              { title: "Refresh access tokens", guideName: "refresh-tokens" },
              { title: "Revoke tokens", guideName: "revoke-tokens" },
              {
                title: "Work with Okta session cookies",
                guideName: "session-cookie",
              },
              {
                title: "Validate access tokens",
                guideName: "validate-access-tokens",
              },
              { title: "Validate ID tokens", guideName: "validate-id-tokens" },
            ],
          },
        ],
      },
      {
        title: "Brand and Customize",
        subLinks: [
          {
            title: "Domain and email address",
            guideName: "custom-url-domain",
          },
          {
            title: "Customize associated domains",
            guideName: "custom-well-known-uri",
          },
          {
            title: "Sign-in page",
            guideName: "custom-widget",
          },
          {
            title: "Migrate to third generation (Gen3), Sign-In Widget",
            guideName: "custom-widget-migration-gen3",
          },
          {
            title: "Sign-In Widget (third generation)",
            guideName: "custom-widget-gen3",
          },
          {
            title: "Error pages",
            guideName: "custom-error-pages",
          },
          {
            title: "SMS messages",
            guideName: "custom-sms-messaging",
          },
          {
            title: "Email notifications",
            guideName: "custom-email",
          },
        ],
      },
      {
        title: "Okta Integration Network",
        customLandingPage: true,
        subLinks: [
          {
            title: "Single Sign-On",
            path: "/docs/guides/oin-sso-overview/",
            subLinks: [
              {
                title: "Build an SSO integration",
                guideName: "build-sso-integration",
              },
              {
                title: "Add a private SSO integration",
                guideName: "add-private-app",
              },
            ],
          },
          {
            title: "Lifecycle management",
            path: "/docs/guides/oin-lifecycle-mgmt-overview/",
            subLinks: [
              {
                title: "Build a SCIM integration",
                path: "/docs/guides/scim-provisioning-integration-overview/main/",
                subLinks: [
                  {
                    title: "Build your SCIM service",
                    path: "/docs/guides/scim-provisioning-integration-prepare/main/",
                  },
                  {
                    title: "Add a private SCIM integration",
                    guideName: "scim-provisioning-integration-connect",
                  },
                  {
                    title: "Test your private SCIM integration",
                    path: "/docs/guides/scim-provisioning-integration-test/main/",
                  },
                ],
              },
              {
                title: "Build a SCIM server with entitlements",
                path: "/docs/guides/scim-with-entitlements/main/",
              },
            ],
          },
          {
            title: "API service integrations",
            path: "/docs/guides/oin-api-service-overview/",
            subLinks: [
              {
                title: "Build an API service integration",
                guideName: "build-api-integration",
              },
            ],
          },
          {
            title: "Support Universal Logout in your app",
            path: "/docs/guides/oin-universal-logout-overview/",
          },
          {
            title: "Publish an OIN integration",
            path: "/docs/guides/submit-app-overview/",
            subLinks: [
              {
                title: "OIN submission requirements",
                guideName: "submit-app-prereq",
              },
              {
                title: "OIN Wizard: Submit an integration",
                guideName: "submit-oin-app",
              },
              {
                title: "OIN Wizard: Update an integration",
                guideName: "update-oin-app",
              },
              {
                title: "OIN Manager: Submit an integration",
                guideName: "submit-app",
              },
            ]
          },
          {
            title: "Express Configuration",
            path: "/docs/guides/express-configuration/main",
            subLinks: [
              {
                title: "Enable Express Configuration",
                guideName: "enable-express-configuration",
              },
            ]
          },
        ],
      },
      {
        title: "API Security",
        subLinks: [
          {
            title: "Configure Demonstrating Proof-of-Possession",
            guideName: "dpop",
          },
          {
            title: "Implement OAuth for Okta",
            guideName: "implement-oauth-for-okta",
          },
          {
            title: "Implement OAuth for Okta: Service App",
            guideName: "implement-oauth-for-okta-serviceapp",
          },
          {
            title: "Protect your API endpoints",
            guideName: "protect-your-api",
          },
          {
            title: "Secure OAuth API between orgs",
            guideName: "secure-oauth-between-orgs",
          },
          {
            title: "Set up step-up authn with ACR values",
            guideName: "step-up-authentication"
          },
        ],
      },
      {
        title: "Org Security",
        subLinks: [
          {
            title: "Configure an SSF receiver and publish a SET",
            path: "/docs/guides/configure-ssf-receiver/",
          }
        ],
      },
      {
        title: "Manage users",
        subLinks: [
          {
            title: "Anything-as-a-Source integration",
            path: "/docs/guides/anything-as-a-source/",
          },
          {
            title: "Set up an app provisioning connection",
            guideName: "app-provisioning-connection"
          }
        ],
      },
      {
        title: "Manage orgs",
        hidden: true,
        subLinks: [
          {
            title: "Manage orgs with Okta Aerial",
            guideName: "manage-orgs-okta-aerial",
            hidden: true
          }
        ],
      },
      {
        title: "Deploy to Production",
        subLinks: [
          {
            title: "Deployment checklists",
            path: "/docs/guides/deployment-checklist/main/",
          },
          { title: "Deploy your app", guideName: "deploy-your-app" },
          {
            title: "Migrate to Okta",
            subLinks: [
              {
                title: "Prerequisites",
                path: "/docs/guides/migrate-to-okta-prerequisites/main/",
              },
              {
                title: "Bulk migration with credentials",
                path: "/docs/guides/migrate-to-okta-bulk/main/",
              },
              {
                title: "Migrate users with pwd hooks",
                path: "/docs/guides/migrate-to-okta-password-hooks/main/",
              },
            ],
          },
        ],
      },
      {
        title: "Automate org management with Terraform",
        subLinks: [
          {
            title: "Essentials",
            subLinks: [
              {
                title: "Terraform overview",
                guideName: "terraform-overview",
              },
              {
                title: "Enable Terraform access",
                guideName: "terraform-enable-org-access",
              },
              {
                title: "Control Terraform access",
                guideName: "terraform-design-access-security",
              },
            ],
          },
          {
            title: "Create and manage resources",
            subLinks: [
              {
                title: "Manage groups",
                guideName: "terraform-manage-groups",
              },
              {
                title: "Manage user access",
                guideName: "terraform-manage-user-access",
              },
              {
                title: "Manage authentication services",
                guideName: "terraform-manage-external-authenticators",
              },
              {
                title: "Manage device requirements",
                guideName: "terraform-configure-device-signin-standards"
              },
              {
                title: "Manage authorization servers",
                guideName: "terraform-create-custom-auth-server"
              },
              {
                title: "Manage branding",
                guideName: "terraform-manage-end-user-experience",
              },
              {
                title: "Manage custom domains",
                guideName: "terraform-manage-multiple-domains"
              },
              {
                title: "Import existing resources",
                guideName: "terraform-import-existing-resources"
              },
            ],
          },
          {
            title: "Optimize your configuration",
            subLinks: [
              {
                title: "Optimize Terraform access",
                guideName: "terraform-design-rate-limits"
              },
              {
                title: "Organize your configuration",
                guideName: "terraform-organize-configuration"
              },
              {
                title: "Terraform syntax tips",
                guideName: "terraform-syntax-tips"
              },
            ],
          },
        ],
      },
      {
        title: "Hooks",
        subLinks: [
          {
            title: "Common hook set-up steps",
            guideName: "common-hook-set-up-steps",
          },
          {
            title: "Hooks best practices",
            path: "/docs/guides/hooks-best-practices/",
          },
          {
            title: "Event hook",
            guideName: "event-hook-implementation",
          },
          {
            title: "Event hooks with ngrok",
            guideName: "event-hook-ngrok",
          },
          {
            title: "Event hooks with Hookdeck",
            guideName: "event-hook-hookdeck",
          },
          {
            title: "Event hooks with filters",
            guideName: "event-hook-filtering",
          },
          {
            title: "Password import inline hook",
            guideName: "password-import-inline-hook",
          },
          {
            title: "Registration inline hook",
            guideName: "registration-inline-hook",
          },
          {
            title: "SAML assertion inline hook",
            guideName: "saml-inline-hook"
          },
          {
            title: "Telephony inline hook",
            guideName: "telephony-inline-hook",
          },
          {
            title: "Token inline hook",
            guideName: "token-inline-hook",
          },
        ],
      },
      {
        title: "Okta Classic Engine",
        path: "/docs/guides/archive-overview/main/",
        subLinks: [
          {
            title: "Auth JS fundamentals",
            guideName: "archive-auth-js",
          },
          {
            title: "Configure sign-on policies",
            guideName: "archive-configure-signon-policy",
          },
          {
            title: "Embedded widget fundamentals",
            guideName: "archive-embedded-siw",
          },
          {
            title: "Sign in to SPA: Auth JS",
            guideName: "archive-sign-in-to-spa-authjs",
            description: true
          },
          { title: "Sign users out", guideName: "sign-users-out" },
          {
            title: "Add multifactor authentication",
            guideName: "mfa",
          },
          {
            title: "Registration inline hook",
            guideName: "archive-registration-inline-hook"
          },
          {
            title: "Set up self-service registration",
            guideName: "archive-set-up-self-service-registration",
          },
          {
            title: "Mobile apps",
            subLinks: [
              {
                title: "Build a custom sign-in UI",
                guideName: "build-custom-ui-mobile"
              },
              {
                title: "Unlock with biometrics",
                guideName: "unlock-mobile-app-with-biometrics"
              },
              {
                title: "Share a sign-in session",
                guideName: "shared-sso-android-ios"
              }
            ]
          }
        ]
      }
    ]
  }
];

export const languagesSdk = [
  {
    title: "SDKs",
    path: "/code/",
    subLinks: [
      { title: "Recommended SDKs", path: "/code/" },
      { title: "Alternate Sign-in SDKs", path: "/code/alternate-sign-in-sdks/" },
      { title: "Versioning", path: "/code/library-versions/" },
    ],
  },
];

export const reference = [
  {
    title: "References",
    path: "/docs/reference/",
    subLinks: [
      {
        title: 'Classic Engine Content',
        path: "/docs/reference/classic-engine/",
        subLinks: [
          { title: "Authentication API", path: "/docs/reference/api/authn/" },
          { title: "WebFinger API", path: "/docs/reference/api/webfinger/" },
        ]
      },
      { title: "Error Codes", path: "/docs/reference/error-codes/" },
      { title: "Event Types", path: "/docs/reference/api/event-types/" },
      {
        title: "Okta Expression Language",
        path: "/docs/reference/okta-expression-language/",
      },
      {
        title: "Expression Language in Identity Engine",
        path: "/docs/reference/okta-expression-language-in-identity-engine/",
      }, 
      {
        title: "Integrator Free Plan Org Configurations",
        path: "/docs/reference/org-defaults/",
      },
      {
        title: "Rate Limits",
        path: "/docs/reference/rate-limits/", 
        subLinks: [
          {
            title: "Rate limit dashboard",
            path: "/docs/reference/rl-dashboard/",
          },
          {
            title: "Authentication and end-user rate limits",
            path: "/docs/reference/rl-global-enduser/",
          },
          {
            title: "Management rate limits",
            path: "/docs/reference/rl-global-mgmt/",
          },

          {
            title: "Additional limits",
            path: "/docs/reference/rl-additional-limits/",
          },
          {
            title: "Rate limit best practices",
            path: "/docs/reference/rl-best-practices/",
          },
          {
            title: "Client-based rate limits",
            path: "/docs/reference/rl-clientbased/",
          },
          {
            title: "DynamicScale",
            path: "/docs/reference/rl-dynamic-scale/",
          },
          {
            title: "System Log events for rate limits",
            path: "/docs/reference/rl-system-log-events/"
          },
        ]
      },
      {title: "SSF Transmitter SET payload structures", path: "/docs/reference/ssf-transmitter-sets/"},
      { title: "System Log query", path: "/docs/reference/system-log-query/" },
      { title: "User query options", path: "/docs/reference/user-query/" },
      {
        title: "Test APIs with Postman",
        path: "/docs/reference/rest/",
      },
    ],
  },
];

export const releaseNotes = [
  {
    title: "Release Notes",
    path: "/docs/release-notes/",
    subLinks: [
      {
        title: "2025 - Classic Engine",
        path: "/docs/release-notes/2025/"
      },
      {
        title: "2025 - Identity Engine",
        path: "/docs/release-notes/2025-okta-identity-engine/",
      },
      {
        title: "2025 - Identity Governance",
        path: "/docs/release-notes/2025-okta-identity-governance/",
      },
      {
        title: "2025 - Privileged Access",
        path: "/docs/release-notes/2025-okta-privileged-access/",
      },
      {
        title: "Archive",
        path: "/docs/release-notes/archive",
        subLinks: [
          {
            title: "2023-2024 Okta Identity Governance changelog",
            path: "/docs/release-notes/oig-changelog/"
          },
          {
            title: "2024 - Classic Engine",
            path: "/docs/release-notes/2024/"
          },
          {
            title: "2024 - Identity Engine",
            path: "/docs/release-notes/2024-okta-identity-engine/",
          },
          {
            title: "2023 - Classic Engine",
            path: "/docs/release-notes/2023/"
          },
          {
            title: "2023 - Identity Engine",
            path: "/docs/release-notes/2023-okta-identity-engine/",
          },
        ]
      },
    ],
  },
];
