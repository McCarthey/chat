<template>
	<div>
		<div class="input-container">
			<mu-tabs :value.sync="tabActive"
			 center>
				<mu-tab>Sign Up</mu-tab>
				<mu-tab>Login</mu-tab>
			</mu-tabs>
			<div v-if="tabActive === 0">
				<div class="sign-up__wrap">
					<mu-text-field v-model="username"
					 label="Username"
					 label-float></mu-text-field>
					<br />
					<mu-text-field v-model="password"
					 label="Password"
					 :action-icon="visibility ? 'visibility_off' : 'visibility'"
					 :action-click="() => (visibility = !visibility)"
					 :type="visibility ? 'text' : 'password'"></mu-text-field>
					<br />
					<mu-button large
					 color="info"
					 class="sign-up__btn"
					 @click="handleClickSignUp">
						Sign up
					</mu-button>
				</div>
			</div>
			<div v-if="tabActive === 1">
				<div class="sign-up__wrap">
					<mu-text-field v-model="username"
					 label="Username"
					 label-float></mu-text-field>
					<br />
					<mu-text-field v-model="password"
					 label="Password"
					 :action-icon="visibility ? 'visibility_off' : 'visibility'"
					 :action-click="() => (visibility = !visibility)"
					 :type="visibility ? 'text' : 'password'"></mu-text-field>
					<br />
					<mu-button large
					 color="info"
					 class="sign-up__btn"
					 @click="handleClickLogin">
						Login
					</mu-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'SignUp',
		data: () => ({
			username: '',
			password: '',
			visibility: false,
			message: '',
			tabActive: 0,
		}),
		methods: {
			async handleClickSignUp() {
				const res = await this.$ajax.post('/signup', {
					username: this.username,
					password: this.password
				})
				if (res.data.code === 0) {
					this.handleClickLogin()
				} else {
					this.$toast.error(res.data.msg)
				}
			},
			async handleClickTest() {
				const res = await this.$ajax.get('/test')
				console.log(res)
				this.message = res.data
			},
			async handleClickLogin() {
				const res = await this.$ajax.post('/login', {
					username: this.username,
					password: this.password
				})
				if (res.data.code === 0) {
					this.$router.push({ name: 'home' })
				} else {
					this.$toast.error(res.data.msg)
				}
			}
		},
		mounted () {
			console.log(this.$route.query)
			if (this.$route.query && this.$route.query.type === 'login') {
				this.tabActive = 1
			}
		}
	}
</script>

<style lang="scss">
	.input-container {
		width: 400px;
		margin: 40px auto;
	}
	.sign-up__wrap {
		width: 400px;
	    position: absolute;
	    top: 20%;
	    left: 50%;
	    transform: translateX(-50%) translateY(-50%);
	    border: 1px solid #ccc;
	    border-radius: 8px;
	    padding: 30px;
	}
	.sign-up__btn {
	    width: 256px;
	}
</style>


