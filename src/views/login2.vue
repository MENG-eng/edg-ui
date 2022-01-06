<template>
  <div class="login">
    <div class="login-container">
      <div class="input-container">
        <input
          class="login-input"
          placeholder="请输入用户名"
          style="margin-top: 120px"
          v-model="loginForm.username"
          @keyup.enter="handleLogin"
        />
        <input
          class="login-input"
          placeholder="请输入密码"
          style="margin-top: 24px"
          type="password"
          v-model="loginForm.password"
          @keyup.enter="handleLogin"
        />
        <div class="ver-code-container" style="margin-top: 24px">
          <input
            class="login-input"
            placeholder="请输入验证码"
            style="margin-top: 0px; width: 63%"
            v-model="loginForm.code"
            @keyup.enter="handleLogin"
          />
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </div>
        <div class="error-msg-container" style="margin-top: 12px">
          {{ errMsg }}
        </div>
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%; height: 50px; margin-top: 12px"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </div>
    </div>
    <div class="el-login-footer">
      <span>Copyright © 2019-2020 hzdl.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { getRootRouter } from "@/utils/permission";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        //rememberMe: false,
        code: "",
        uuid: "",
      },
      errMsg: "",
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      const { username, password, code } = this.loginForm;
      if (!username || username.length <= 0) {
        this.errMsg = "用户名不能为空";
        return;
      }
      if (!password || password.length <= 0) {
        this.errMsg = "密码不能为空";
        return;
      }
      if (!code || code.length <= 0) {
        this.errMsg = "验证码不能为空";
        return;
      }
      this.errMsg = "";

      this.loading = true;
      if (this.loginForm.rememberMe) {
        Cookies.set("username", this.loginForm.username, { expires: 30 });
        Cookies.set("password", encrypt(this.loginForm.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", this.loginForm.rememberMe, {
          expires: 30,
        });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      this.$store
        .dispatch("Login", this.loginForm)
        .then(() => {
          this.$router.push({
            path: this.redirect || getRootRouter(),
          });
        })
        .catch(() => {
          this.loading = false;
          this.getCode();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/img/login-background.jpg");
  background-size: cover;
}

.login-container {
  position: absolute;
  left: 50%;
  top: 50%;
  background: url("../assets/img/login-container.png") center top no-repeat;
  background-size: 90% 90%;
  transform: translateX(-50%) translateY(-50%);
  height: 538px;
  width: 672px;
  text-align: center;

  .input-container {
    height: 100%;
    width: 60%;
    margin: auto;
  }
}

.login-input {
  height: 48px;
  width: 100%;
  text-indent: 16px;
  background: url("../assets/img/input-bg.png");
  border: none;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
}

.ver-code-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 48px;
}

.login-code {
  width: 33%;
  float: right;
  overflow: hidden;
  border-radius: 5px;
  img {
    cursor: pointer;
    vertical-align: middle;
    height: 48px;
    width: 100%;
  }
}

.error-msg-container {
  height: 30px;
  line-height: 30px;
  color: #ff0000;
  font-size: 16px;
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 50px;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>