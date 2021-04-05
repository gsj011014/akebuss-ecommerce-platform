<template>
	<view class="popup spec" v-show="show_space"  @tap="hide_popup_spec">
		
		<!-- 遮罩层 -->
		<view class="mask"></view>
		
		<view class="layer" :class="{'slide-up': show_space}">
			<view class="content">
				<view class="title">选择规格: </view>
				<view class="sp">
					<view @tap.stop="select_spec(item);" :class="{'on': goods_infor.spec == item}" v-for="(item,index) in goods_data.spec" :key="index">
						{{item}}
					</view>
				</view>
				<view class="length">
					<view class="text">数量</view>
					
					<!-- counter组件 -->
					<Counter @sub="sub" @add="add" :goods_infor="goods_infor" />
				</view>
			</view>
			<!-- 确定按钮 -->
			<view class="btn">
				<view @tap="hide_popup_spec" class="button">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import Counter from './counter.vue'
	
	export default {
		data() {
			return {
				
			};
		},
		components:{
			Counter
		},
		props: {
			show_space: Boolean,
			goods_infor: Object,
			goods_data: Object
		},
		methods: {
			hide_popup_spec() { //不可以直接修改 props 中的数据,需要通过子级注册事件 父级执行事件。
				this.$emit('hide_popup_spec');
			},
			select_spec(spec) { //选择尺码
				this.$emit('select_spec',spec);
			},
			sub() {
				this.$emit("sub");
			},
			add() {
				this.$emit("add");
			}
		},
		mounted() {

		}
	}
</script>

<style lang="scss" scoped>
	
	.fade-wrap-enter-active,.fade-wrap-leave-active,.mask-fade-enter-active,.mask-fade-leave-active{ 
		transition: all .3s ease;
	}
	
	.fade-wrap-enter,.fade-wrap-leave-to{
		
	}
	
	.mask-fade-enter,.mask-fade-leave-to{
		opacity: 0;
	}
	
	.popup {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		.slide-fade-enter-active{ //进入时过渡
			transition: all .3s ease;
		}
		
		.slide-fade-leave-active{ //离开时的过渡
			transition: all .3s ease;
		}
		
		.slide-fade-enter,.slide-fade-leave-to{ //进入过渡的结束状态
			 transform: translateY(100%);
		}
			
		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 21;
			background-color: rgba(0, 0, 0, 0.6);
		}
	
		.layer {
			transition: all .3s ease 0s;
			transform: translateY(100%);
			position: fixed;
			z-index: 22;
			bottom: 0%;
			width: 92%;
			padding: 0 4%;
			height: 70%;
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;
			
			&.slide-up{ //&当前元素会改变的class
				transform: translateY(0);
			}
	
			.content {
				width: 100%;
				padding: 20upx 0;
			}
	
			.btn {
				width: 100%;
				height: 100upx;
	
				.button {
					width: 100%;
					height: 80upx;
					border-radius: 40upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f47952;
					font-size: 28upx;
				}
			}
		}
	
		&.spec {
			.title {
				font-size: 30upx;
				margin: 30upx 0;
			}
	
			.sp {
				display: flex;
	
				view {
					font-size: 25upx;
					padding: 8upx 25upx;
					border-radius: 8upx;
					margin: 0 30upx 20upx 0;
					background-color: #f6f6f6;
	
					&.on {
						background-color: #f47952;
						color: white;
					}
				}
			}
	
			.length {
				margin-top: 30upx;
				border-top: solid 1upx #aaa;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 20upx;
	
				.text {
					font-size: 30upx;
				}
	
			}
	
		}
	}
</style>
