<template>
	<div>
		<mu-dialog
		 width="360"
		 :overlay-close="false"
		 :esc-press-close="false"
		 :open.sync="openSimple">
			Input your name please
			<mu-text-field v-model="userName"
			 label="Your Name"
			 label-float
			 full-width></mu-text-field>
			<mu-button slot="actions"
			 flat
			 color="primary"
			 @click="submitName">Submit</mu-button>
		</mu-dialog>
	</div>
</template>

<script>
	export default {
		name: 'NameDialog',
		data() {
			return {
				userName: '',
				openSimple: true,
			}
		},
		methods: {
			openSimpleDialog() {
				this.openSimple = true;
			},
			submitName() {
				if (!this.userName) {
					this.$toast.error('Please input your name')
					return 
				}
				localStorage.setItem('MC_CHAT_NAME', this.userName)
				this.openSimple = false;
				this.$emit('close');
			}
		}
	}
</script>

