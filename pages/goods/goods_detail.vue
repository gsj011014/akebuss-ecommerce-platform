<template>
	<view>
		<!-- 状态栏 -->
		<page-status></page-status>

		<!-- 标题栏 -->
		<GoodsHeader></GoodsHeader>
		
		<!-- 轮播图 -->
		<view class="swiper-box">
			<swiper @change="swiperChange" circular="true" autoplay="true">
				<swiper-item v-for="(item,index) in goods_data.swiperList" :key="index" @click="image_preview(item.img);">
					<image :src="item.img"></image>
				</swiper-item>
			</swiper>
			<view class="indicator">
				{{ current_swiper_index }} {{ goods_data.swiperList | swiper_count }}
			</view>
		</view>
		
		<!-- 图片预览 -->
		<!-- <PreviewImage :list.sync="preview_image_data.previewImgList" :current.sync="preview_image_data.currentImg" :start.sync="preview_image_data.PINum"></PreviewImage> -->
		
		<!-- 标题和价格 -->
		<view class="info-box goods-info">
			<view class="price">￥{{ goods_infor.price }}</view>
			<view class="title">{{ goods_infor.name }}</view>
		</view>
		
		<!-- 选择规格 -->
		<view class="info-box">
			<view class="row" @tap="show_popup_spec();">
				<view class="text">选择规格:</view>
				<view class="content">
					<!-- <view>选择规格:</view> -->
					<view class="sp">
						<view :class="{'on':item == goods_infor.spec}" v-for="(item,index) in goods_data.spec" :key="index">
							{{ item }}
						</view>
					</view>
				</view>
				<!-- 箭头 -->
				<view class="arrow">
					<view class="icon icon-font">&#xe6a3;</view>
				</view>
			</view>
			<view class="row" @tap="show_popup_spec();">
				<view class="text">购买数量:</view>
				<view class="content">
					<view class="content-text">{{ goods_infor.number }}</view>
				</view>
				<!-- 箭头 -->
				<view class="arrow">
					<view class="icon icon-font">&#xe6a3;</view>
				</view>
			</view>
		</view>
		
		<!-- 模态框 -->
		<PopupSpec @add="add_buy_count" @sub="sub_buy_count" @hide_popup_spec="hide_popup_spec" @select_spec="select_spec" :show_space="show_space" :goods_infor="goods_infor" :goods_data="goods_data"></PopupSpec>
		
		<!-- 评价 -->
		<view class="info-box comments">
			<view class="row">
				<view class="text">商品评价({{goods_data.comment.length}})</view>
				<view class="arrow" @tap="look_more_comments">
					<view class="show">
						查看全部
						<view class="icon icon-font">&#xe6a3;</view>
					</view>
				</view>
			</view>
			<view class="comment">
				<view class="user-info">
					<view class="face">
						<image :src="goods_data.comment[0].face"></image>
					</view>
					<view class="username">{{goods_data.comment[0].username}}</view>
				</view>
				<view class="content">
					{{goods_data.comment[0].content}}
				</view>
			</view>
		</view>
		
		<!-- 商品详情 -->
		<view class="description">
			<view class="title">———— 商品详情 ————</view>
			<view class="content">
				<rich-text :nodes="goods_data.descriptionStr"></rich-text>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer">
			<view class="icons">
				<view class="box">
					<view class="icon icon-font">&#xe7e0;</view>
					<view class="text">分享</view>
				</view>
				<view class="box" @tap="give_like_good">
					<view class="icon icon-font give-like-icon" v-if="give_like">&#xe64b;</view>
					<view class="icon icon-font" v-if="!give_like">&#xe64c;</view>
					<view class="text">{{give_like?"已":''}}收藏</view>
				</view>
			</view>
			<view class="btn">
				<view class="joinCart" @tap="join_cart">加入购物车</view>
				<view class="buy" @tap="handle_buy">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import GoodsHeader from '../../components/GoodsHeader.vue'
	import interfaces from '../../utils/interface.js'
	import PopupSpec from '../../components/PopupSpec.vue'
	
	export default {
		data() {
			return {
				goods_infor: { //商品信息
					name: "",
					price: "",
					number: 1,
					spec: ""
				},
				goods_data: { //商品数据 一定要提前定义好数据
					swiperList: [],
					spec: [],
					comment: [{
						face: "",
						content: "",
						username: ""
					}],
					descriptionStr: ""
				},
				current_swiper_index: 1 ,//当前轮播图的下标
				preview_image_data: {
					currentImg: '',
					previewImgList: [],
					PINum: 0
				},
				show_space: false,
				give_like: false
			}
		},
		components:{
			GoodsHeader,
			PopupSpec
		},
		methods: {
			swiperChange(event) {
				this.current_swiper_index = event.detail.current + 1;
			},
			init_data() {
				return this.$request({
					url: interfaces.getGoods,
					success: ((data) => {
						this.goods_data = data.data;
					})
				});
			},
			image_preview(imgSrc) { //图片预览
				this.goods_data.swiperList.forEach((item,index) => {
					this.preview_image_data.previewImgList.push(item.img);
				});
				this.preview_image_data.previewImgList = [...new Set(this.preview_image_data.previewImgList)]; //图片数组去重
				uni.previewImage({
					current:imgSrc,
					urls: this.preview_image_data.previewImgList
				})
			},
			show_popup_spec() { //显示选择页面
				this.show_space = true;
			},
			hide_popup_spec() { //隐藏选择页面
				this.show_space = false;
			},
			select_spec(spec) { //选择尺码
				this.goods_infor.spec = spec;
			},
			add_buy_count() { //增加购买数量
				this.goods_infor.number ++;
			},
			sub_buy_count() { //减少购买数量
				this.goods_infor.number --;
				if(this.goods_infor.number < 1) this.goods_infor.number = 1;
			},
			give_like_good() { //收藏商品
				this.give_like = !this.give_like;
				if(this.give_like) {
					uni.showToast({
						title: "已收藏"
					});
				}else{
					uni.showToast({
						title: "取消收藏"
					});
				}
			},
			join_cart() { //加入购物车
				//先查找本地中是否存在这个商品
				uni.getStorage({
					key: 'buy_goods_infor',
					success: (res => { //得到数据时
						let buy_goods_infor = res.data;
						let exist = false; //是否存在数据 
						for (let item of buy_goods_infor) {
							if(item.goods_id == this.goods_infor.goods_id && item.spec == this.goods_infor.spec){ //购物车中存在此商品的时候 并且商品相同和尺码一样的情况下 需要设置数量
								item.number += Number(this.goods_infor.number);
								exist = true;
							}
						}
						if(!exist){ //如果购物车不存在此商品信息，就添加商品到购物车。
							buy_goods_infor.push(this.goods_infor);
						}
						this.set_goods_infor(buy_goods_infor);
					}),
					fail: (err => { //不存在数据时就，就存储此数据。
						let buy_goods_infor = [];
							buy_goods_infor.push(this.goods_infor);
						this.set_goods_infor(buy_goods_infor);
					})
				});
			},
			handle_buy() { //立即购买
				uni.setStorage({
					key: 'handle_buy_goods_infor',
					data: this.goods_infor,
					success: () => {
						uni.navigateTo({
							url: "./confirm"
						});
					}
				});
			},
			look_more_comments() { //查看更多评论
				
				// 本地存储 存储评论的数据
				uni.setStorageSync('comments', this.goods_data.comment)
			
				uni.navigateTo({ //跳转页面
					url: "./ratings",
					animationType: 'slide-in-bottom',
					animationDuration: 200
				});
			},
			set_goods_infor(infor) {
				uni.setStorage({
					key: 'buy_goods_infor',
					data: infor,
					success: () => {
						uni.showToast({
							title: "已添加到购物车"
						});
					}
				});
			}
		},
		computed:{ //必须有返回值
			
		},
		onLoad(option) {
			this.init_data().then(() => {
				
			});
			this.goods_infor = JSON.parse(option.goodsInfo);
		},
		filters: {
			swiper_count(data) {
				return '/ ' + data.length;
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.place{
		height: 100upx;
	}
	
	.preview_image_wrap{
		width: 100vw;
		height: 100vh;
		
		swiper {
			width: 100%;
			height: 100%;
			
			swiper-item {
				width: 100%;
				height: 100%;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	/*  修改状态栏样式 */
	.status {
		/* #ifdef APP-PLUS */
		opacity: 0;
		/* #endif */
	}
	
	.swiper-box {
		position: relative;
		width: 100%;
		height: 100vw;
	
		swiper {
			width: 100%;
			height: 100vw;
	
			swiper-item {
				image {
					width: 100%;
					height: 100vw;
				}
			}
		}
	
		.indicator {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 25upx;
			height: 40upx;
			border-radius: 40upx;
			font-size: 22upx;
			position: absolute;
			bottom: 20upx;
			right: 20upx;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.2);
		}
	}
	
	.info-box {
		width: 92%;
		padding: 20upx 4%;
		background-color: #fff;
		margin-bottom: 20upx;
	}
	
	.goods-info {
		.price {
			font-size: 46upx;
			font-weight: 600;
			color: #f47925;
		}
	
		.title {
			font-size: 30upx;
		}
	}
	
	.row {
		width: 100%;
		display: flex;
		align-items: center;
		margin: 0 0 30upx 0;
	
		.text {
			font-size: 28upx;
			color: #a2a2a2;
			margin-right: 20upx;
		}
	
		.content {
			font-size: 28upx;
			display: flex;
			flex-wrap: wrap;
			
			.content-text{
				font-size: 28upx;
				color: #f47925;
			}
			
			.serviceitem {
				margin-right: 10upx;
			}
	
			.sp {
				width: 100%;
				display: flex;
	
				view {
					background-color: #f6f6f6;
					padding: 8upx 20upx;
					color: #999;
					margin-right: 10upx;
					font-size: 20upx;
					border-radius: 5upx;
	
					&.on {
						background-color: #f47952;
						color: white;
					}
				}
			}
		}
	
		.arrow {
			position: absolute;
			right: 4%;
	
			.icon {
				color: #ccc;
			}
		}
	}
	
	.comments {
		.row {
			width: 100%;
			height: 40upx;
			display: flex;
			align-items: center;
			margin: 0 0 30upx 0;
	
			.text {
				font-size: 30upx;
			}
	
			.arrow {
				font-size: 28upx;
				position: absolute;
				right: 4%;
				color: #17e6a1;
	
				.show {
					display: flex;
					align-items: center;
	
					.icon {
						color: #17e6a1;
					}
				}
			}
		}
	
		.comment {
			width: 100%;
	
			.user-info {
				width: 100%;
				height: 40upx;
				display: flex;
				align-items: center;
	
				.face {
					width: 40upx;
					height: 40upx;
					margin-right: 8upx;
	
					image {
						width: 40upx;
						height: 40upx;
						border-radius: 100%;
					}
				}
	
				.username {
					font-size: 24upx;
					color: #999;
				}
			}
	
			.content {
				margin-top: 10upx;
				font-size: 26upx;
			}
		}
	}
	
	.description {
		.title {
			width: 100%;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #999;
		}
	}
	.footer {
		position: fixed;
		bottom: 0upx;
		width: 92%;
		padding: 0 4%;
		height: 99upx;
		border-top: solid 1upx #eee;
		background-color: #fff;
		z-index: 2;
		display: flex;
		justify-content: space-between;
		align-items: center;
	
		.icons {
			display: flex;
			height: 80upx;
			margin-left: -4%;
	
			.box {
				width: 80upx;
				height: 80upx;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
	
				.icon {
					font-size: 40upx;
					color: #828282;
				}
				.give-like-icon{
					color: #f47925;
				}
	
				.text {
					display: flex;
					justify-content: center;
					width: 100%;
					font-size: 22upx;
					color: #666;
				}
			}
		}
	
		.btn {
			height: 80upx;
			border-radius: 40upx;
			overflow: hidden;
			display: flex;
			margin-right: -2%;
	
			.joinCart,
			.buy {
				height: 80upx;
				padding: 0 40upx;
				color: #fff;
				display: flex;
				align-items: center;
				font-size: 28upx;
			}
	
			.joinCart {
				background-color: #f0b46c;
			}
	
			.buy {
				background-color: #f06c7a;
			}
		}
	}
</style>
