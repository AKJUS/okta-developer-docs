<template>
  <div class="login">
    <h1>Welcome back to Okta</h1>
    <div class="login--form">
      <div class="row">
        <label
          class="field-wrapper"
          for="login-email"
        >
          <a
            class="btn"
            :href="uris.email"
          >
            Sign In With Email
          </a>
        </label>
      </div>
      <div class="row goto-signup">
        Need an account?
        <SmartLink :item="{ link: '/signup/' }">
          Sign up
        </SmartLink>
      </div>
    </div>
    <div class="logo-wrapper">
      <CompanyLogos
        with-heading
        small
      />
    </div>
  </div>
</template>

<script>
import { getIdpUri } from "../util/uris";

export default {
  name: "Login",
  components: {
    CompanyLogos: () => import("../components/CompanyLogos"),
    SmartLink: () => import("../components/SmartLink"),
  },
  computed: {
    uris() {
      const { uris } = this.$site.themeConfig;

      return {
        email: "https://login.okta.com/"
        //github: getIdpUri(uris, "github"),
        //google: getIdpUri(uris, "google"),
      };
    },
  },
};
</script>
