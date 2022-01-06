<template>
  <div class="login">
    <div class="body-container">
      <div class="body-img"></div>
      <div class="login-container">
        <div class="input-container">
          <div class="top-container">
            <img
              src="../assets/img/login-logo.png"
              style="width: 65px; margin-left: -20px"
              alt=""
            />
<!--            <img-->
<!--              src="../assets/img/login-title.png"-->
<!--              style="height: 40px"-->
<!--              class="ml5"-->
<!--              alt=""-->
<!--            />-->
            <span style="font-size: 29px; color: white; margin-left:5px; white-space:nowrap">语音标注数据的存证溯源系统</span>
          </div>
          <div class="info-container">
            <div style="padding: 0 20px">
              <div class="info-title">用户登录</div>
              <input
                class="login-input"
                placeholder="请输入用户名"
                style="margin-top: 35px"
                v-model="loginForm.username"
                @keyup.enter="handleLogin"
              />
              <input
                class="login-input"
                placeholder="请输入密码"
                style="margin-top: 35px"
                type="password"
                v-model="loginForm.password"
                @keyup.enter="handleLogin"
              />
              <div class="ver-code-container" style="margin-top: 35px">
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
              <div class="error-msg-container">
                {{ errMsg }}
              </div>
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                class="login-btn"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
            </div>
          </div>
        </div>
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
      // 验证码地址
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        //rememberMe: false,
        // 验证码
        code: "",
        uuid: "",
      },
      errMsg: "",
      // 是否正在登陆
      loading: false,
      redirect: undefined,
    };
  },
  // watch用来响应数据变化
  // immediate表示在watch中首次绑定的时候，是否执行handler，值为true则表示在watch中声明的时候，就立即执行handler方法，值为false，则和一般使用watch一样，在数据发生变化的时候才执行handler。
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
    // 获取验证码图片
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
      // 请求store中的Login方法
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

<style lang="scss">
// 修改input输入框字体placeholder提示颜色
input::-webkit-input-placeholder {
  color: #cccccc !important;
}

input::-moz-placeholder {
  color: #cccccc !important;
}

input:-moz-placeholder {
  color: #cccccc !important;
}

input:-ms-input-placeholder {
  color: #cccccc !important;
}
</style>
<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("../assets/img/bg.png") no-repeat;
  background-size: cover;
}

.body-container {
  width: 90%;
  height: 86%;
  margin: 9% 5% 5% 5%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.body-img {
  width: 55%;
  height: 70%;
  margin-top: 7%;
  background: url("../assets/img/body-img.png") no-repeat;
  background-size: contain;
}

.login-container {
  // margin-top: 3%;
  margin-right: 3.5%;
  text-align: center;

  .input-container {
    height: 100%;
    width: 75%;
    margin: auto;
  }
}

.top-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.info-container {
  background-color: #ffffff;
  margin-top: 40px;
  border-radius: 15px;

  .info-title {
    float: left;
    width: max-content;
    margin-top: 20px;
    height: 40px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    line-height: 40px;
    border-bottom: 2px solid #ffba00;
  }
}

.login-input {
  height: 48px;
  width: 100%;
  text-indent: 16px;
  background-color: #ffffff;
  border: 1px solid #1977fa;
  border-radius: 5px;
  font-size: 16px;
  color: #333333;
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
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-btn {
  width: 100%;
  height: 50px;
  margin-bottom: 50px;
  background: linear-gradient(90deg, #1977fa, #25c4ff);
  box-shadow: 0px 8px 8px 0px rgba(25, 119, 250, 0.3);
  border-radius: 5px;
}
</style>
