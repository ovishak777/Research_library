const Auth = {
  password: "5445",
  session_key: "rp_auth_session_key",

  isLoggedIn() {
    return sessionStorage.getItem(this.session_key) === "true";
  },

  login(password) {
    if (password === this.password) {
      sessionStorage.setItem(this.session_key, "true");
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem(this.session_key);
    window.location.href = "index.html";
  },

  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = "index.html";
    }
  },
};
