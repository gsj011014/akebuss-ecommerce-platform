<template>
	<view class="home">
		<!-- 状态栏 -->
		<page-status></page-status>
		
		<!-- 自定义顶部导航 -->
		<PageHeader></PageHeader>
		
		<!-- 轮播图 -->
		<Swiper :image_list="swiper_list"></Swiper>
		
		<!-- 分类列表 -->
		<view class="category-list">
			<view class="category" @tap="handleCategory(item);" v-for="(item,index) in category_list" :key="index">
				<view class="img">
					<image :src="item.img"></image>
				</view>
				<view class="text">
					{{ item.name }}
				</view>
			</view>
		</view>
		
		<!-- 广告图 -->
		<view v-if="promotion.length > 0" class="banner">
			<image src="../../../static/img/category/ad.jpg"></image>
		</view>
		
		<!-- 活动专区 -->
		<view class="promotion" v-if="promotion.length > 0">
			<view class="text">优惠活动</view>
			<view class="list">
				<view @tap="handlePromotion(item);" class="column" v-for="(item,index) in promotion" :key="index">
					<view class="top">
						<view class="title">
							{{ item.title }}
						</view>
					</view>
					<view class="left">
						<view class="ad">{{ item.ad }}</view>
						<view class="into">点击进入</view>
					</view>
					<view class="right">
						<image :src="item.img"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view class="place"></view>
	</view>
</template>

<script>
	
	import PageHeader from './PageHeader.vue'
	import interfaces from '../../../utils/interface.js'
	import Swiper from '../../../components/Swiper.vue'
	
	export default {
		components: {
			PageHeader,
			Swiper
		},
		data() {
			return {
				swiper_list: [], //轮播图片
				category_list: [] ,//分类菜单
				promotion: [] ,//活动
				touch: false
			}
		},
		methods: {
			init_data() {
				this.$request({
				    url: interfaces.getMallData,
				    success: ((res) => { //如果使用对象的形式传递方法就这样使用 --- 回调函数
					  this.swiper_list = res.data.swiperList;
					  this.category_list = res.data.categoryList;
					  this.promotion = res.data.promotion;
					})
				});
			},
			touch_event(delay,touch) {
				setTimeout(() => {
					this.touch = touch;
				},delay);
			},
			handleCategory(item) { //分类跳转
				uni.navigateTo({ //打开页面
					url: '../../goods/goodsList?name='+item.name
				})
			},
			handlePromotion(item) { //优惠专区
				uni.showToast({
					title: item.title,
					icon: 'none'
				});
			}
		},
		onLoad() { //页面加载完毕时
			this.init_data();
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		}
	}
</script>

<style lang="less" scoped>
	// #wrap{
	// 	position: relative;
	// 	top: 0px;
	// 	width: 100%;
	// 	height: calc(100vh - 50px - 50px + var(--status-bar-height));
	// }
	// #wrap::-webkit-scrollbar {
	// 	width: 3px;
	// } 
	// #wrap::-webkit-scrollbar-track { 
	
	// } 
	// #wrap::-webkit-scrollbar-thumb {
	// 	transition: all 0.5s ease-in-out 0s;
	// 	background-color:rgba(187,187,187,0);
	// 	border-radius: 50px;
	// }
	// .touch::-webkit-scrollbar-thumb {
	// 	background-color:rgba(187,187,187,1) !important;
	// }
	
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
	.place{
		height: 30upx;
	}
</style>
