<template>
	<view class="swiper">
		<view class="swiper-box">
			<swiper circular="true" autoplay="true" @change="change_current_index">
				<swiper-item v-for="(item,index) in image_list" :key="index" :style="{backgroundImage:'url('+item.img+')'}">
					<!-- <image :src="item.img"></image> -->
				</swiper-item>
			</swiper>
			<view class="indicator">
				<view :class="{'on': index <= current_index}" class="dots" v-for="(item,index) in image_list" :key="index"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current_index: 0
			}
		},
		props: [
			"image_list"
		],
		methods: {
			change_current_index(e) {
				this.current_index = e.detail.current; //获取轮播图当前下标
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.swiper {
		width: 100%;
		display: flex;
		justify-content: center;
		
		.swiper-box {
			width: 92%;
			height: 30.7vw;
			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;
	
			swiper {
				width: 100%;
				height: 30.7vw;
	
				swiper-item {
					background-size: 100% 100%;
					image {
						width: 100%;
						height: 40vw;
					}
				}
			}
	
			.indicator {
				position: absolute;
				bottom: 20upx;
				left: 20upx;
				background-color: rgba(255, 255, 255, 0.4);
				width: 150upx;
				height: 5upx;
				border-radius: 3upx;
				overflow: hidden;
				display: flex;
	
				.dots {
					width: 0upx;
					background-color: rgba(255, 255, 255, 1);
					transition: all 0.3s ease-out;
	
					&.on {
						width: (100%/3);
					}
				}
			}
		}
	}
	
	.category-list {
		width: 92%;
		margin: 0 4%;
		padding: 0 0 30upx 0;
		border-bottom: solid 2upx #f6f6f6;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	
		.category {
			width: 25%;
			margin-top: 50upx;
			display: flex;
			flex-wrap: wrap;
	
			.img {
				width: 100%;
				display: flex;
				justify-content: center;
	
				image {
					width: 11vw;
					height: 11vw;
				}
			}
	
			.text {
				margin-top: 16upx;
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 24upx;
				color: #3c3c3c;
			}
		}
	}
	
	.banner {
		width: 92%;
		margin: 40upx 4%;
	
		image {
			width: 100%;
			height: 36vw;
			border-radius: 4upx;
			box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.3);
		}
	}
	
	.promotion {
		width: 92%;
		margin: 10upx 4% 30upx 4%;
	
		.text {
			width: 100%;
			height: 60upx;
			font-size: 34upx;
			font-weight: 600;
			margin: 10upx;
		}
	
		.list {
			width: 100%;
			display: flex;
			justify-content: space-between;
	
			.column {
				width: 43%;
				padding: 15upx 3%;
				background-color: #ebf9f9;
				border-radius: 10upx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
	
				.top {
					width: 100%;
					height: 40upx;
					display: flex;
					align-items: center;
					margin-bottom: 5upx;
	
					.title {
						font-size: 30upx;
					}
				}
	
				.left {
					width: 50%;
					height: 18.86vw;
					display: flex;
					flex-wrap: wrap;
					align-content: space-between;
	
					.ad {
						margin-top: 5upx;
						width: 100%;
						font-size: 22upx;
						color: #acb0b0;
					}
	
					.into {
						width: 100%;
						font-size: 24upx;
						color: #aaa;
						margin-bottom: 5upx;
					}
				}
	
				.right {
					width: 18.86vw;
					height: 18.86vw;
	
					image {
						width: 18.86vw;
						height: 18.86vw;
					}
				}
			}
		}
	}
</style>
