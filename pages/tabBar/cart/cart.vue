<template>
	<view>
		<!-- 购物列表 -->
		<view class="goods-list">
			<view class="empty" v-if="buy_goods_list.length == 0">购物车空空如也~</view>
			<view class="row" v-for="(item,index) in buy_goods_list" :key="index" @tap="open_goods_detail(item);">
				<!-- 删除按钮 -->
				<view class="menu" @tap="handleSingleDelete(item);">
					<view class="icon icon-font">&#xe6a6;</view>
				</view>
				<!-- 商品 -->
				<view class="production" @touchstart="handleTouchStart(index,$event)" @touchmove="handleTouchMove(index,$event);" @touchend="handleTouchEnd(index,$event);" :class="[theIndex == index ? 'open' : oldIndex == index ? 'close' : '']">
					<!-- checkbox -->
					<view class="container" @tap.stop="checked_good(item);">
						<view class="checkbox">
							<view :class="{'on':item.selected}"></view>
						</view>
					</view>

					<!-- 商品详情 -->
					<view class="goods-info">
						<view class="img">
							<image :src="item.img"></image>
						</view>
						<view class="info">
							<view class="title">{{ item.name }}</view>
							<view class="spec">{{ item.spec }}</view>
							<view class="price-number">
								<view class="price">{{ item.price | price_dis}}</view>
								<counter @add="add_goods(item);" @sub="sub_goods(item);" :goods_infor="item" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部菜单 -->
		<view class="footer" :style="{ 'bottom': tabbar_h5 }" v-if="buy_goods_list.length > 0">
			<!-- checkbox -->
			<view class="container" @tap="checked_all_goods">
				<view class="checkbox">
					<view :class="{ 'on':selected_all }"></view>
				</view>
				<view class="text">全选</view>
			</view>
			<view class="delBtn" @tap="delete_checked_goods" v-if="selected_buy_goods_list.length > 0">删除</view>
			<view class="settlement">
				<!-- <view class="sum">
					合计: 
					<view class="money">{{ checked_goods_all_price | price_dis }}</view>
				</view> -->
				<view class="btn">结算 {{ checked_goods_all_price | price_dis }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import counter from '../../../components/counter.vue'
	
	export default {
		data() {
			return {
				buy_goods_list: [],
				selected_buy_goods_list: [],
				selected_all: false,
				theIndex: null, // 控制滑动效果 当前滑动下标
				oldIndex: null // 上一个左滑下标
			}
		},
		components: {
			counter
		},
		methods: {
			init_goods() { //加载商品数据
				uni.getStorage({
					key: 'buy_goods_infor',
					success: data => {
						data.data.forEach(item => {
							item.selected = false;
						});
						this.buy_goods_list = data.data;
					}
				});
			},
			checked_good(item) { //选择购物车中的商品
			
				item.selected = !item.selected;
				
				//将选择的商品添加到 指定数组中 取消选择的商品 从指定数组中移除
				let exist = this.selected_buy_goods_list.indexOf(item);
				if(exist > -1) { //代表已存在数据
					this.selected_buy_goods_list.splice(exist,1);
				}else { //代表不存在数据
					this.selected_buy_goods_list.push(item);
				}
				
				if(this.selected_buy_goods_list.length == this.buy_goods_list.length){ //代表全部选中
					this.selected_all = true;
				}else{ //未全部选中
					this.selected_all = false;
				}
			},
			checked_all_goods() { //选中购物车中的全部商品
				this.selected_all = !this.selected_all;
				this.buy_goods_list.forEach(item => {
					item.selected = this.selected_all;
				});
				
				this.selected_buy_goods_list = this.selected_all ? [...this.buy_goods_list] : []; //深拷贝 要不然删除后 数据也会同步删除
				
			},
			delete_checked_goods() { //删除选中的数据
				while(this.selected_buy_goods_list.length > 0) {
					this.handleSingleDelete(this.selected_buy_goods_list[0]);
				}
				if(this.selected_buy_goods_list.length == 0) this.selected_all = false;
			},
			handleSingleDelete(item) {
				uni.getStorage({
					key: 'buy_goods_infor',
					success: (res => {
						res.data.forEach((goods,index) => {
							if(item.goods_id == goods.goods_id) {
								res.data.splice(index, 1);
							}
						});
						uni.setStorage({
							key: "buy_goods_infor",
							data: res.data
						});
						
					})
				});
				
				//更新数组
				this.selected_buy_goods_list.splice(this.selected_buy_goods_list.indexOf(item),1); //删除选中购物车中的数据
				this.buy_goods_list.splice(this.buy_goods_list.indexOf(item),1); //删除购物车商品列表的数据
				this.oldIndex = null;
				this.theIndex = null;
			},
			add_goods(item) {
				item.number ++;
				this.update_goods_list();
			},
			sub_goods(item) {
				if(item.number <= 1){
					uni.showToast({
						title: "宝贝不能再减少了喽~",
						icon: 'none'
					});
				}
				item.number <= 1 ? 1 : item.number --;
				this.update_goods_list();
			},
			update_goods_list() {
				uni.setStorage({
					key: 'buy_goods_infor',
					data: this.buy_goods_list
				})
			},
			handleTouchStart(index, event) {
				// 多点触控 不触发
				if (event.touches.length > 1) {
					return;
				}
			
				this.oldIndex = this.theIndex;
				this.theIndex = null;
			
				// 初始化坐标
				this.initXY = [event.touches[0].pageX, event.touches[0].pageY];
			},
			handleTouchMove(index, event) {
				// 多点触控 不触发
				if (event.touches.length > 1) {
					return;
				}
			
				// 移动位置
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
			
				// 滑动位置小 不触发
				if (Math.abs(moveX) < 20) {
					return;
				}
			
				// 竖向滑动 不触发
				if (Math.abs(moveY) > Math.abs(moveX)) {
					return;
				}
			
				// 左滑
				if (moveX < 0) {
					this.theIndex = index;
				}
			},
			handleTouchEnd(index, event) {
				
			},
			open_goods_detail(item) {
				console.log(item)
				uni.navigateTo({
					url: "../../goods/goods_detail?goodsInfo="+JSON.stringify(item)
				});
			}
		},
		computed: {
			tabbar_h5() {
				// 兼容h5下的底部菜单
				// #ifdef H5
				return document.getElementsByTagName("uni-tabbar")[0].offsetHeight + "px";
				// #endif
			},
			checked_goods_all_price() {
				return this.selected_buy_goods_list.reduce((initial,item) => {
					return initial + Number(item.number) * Number(item.price);
				},0);
			}
		},
		mounted() {
			
		},
		filters: {
			price_dis(number) {
				return '￥' + Number(number).toFixed(2);
			}
		},
		onShow() { //页面显示
			this.init_goods();
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		align-items: center;

		.checkbox {
			width: 35upx;
			height: 35upx;
			border-radius: 100%;
			border: solid 2upx #f06c7a;
			display: flex;
			justify-content: center;
			align-items: center;

			.on {
				width: 25upx;
				height: 25upx;
				border-radius: 100%;
				background-color: #f06c7a;
			}
		}

		.text {
			font-size: 28upx;
			margin-left: 10upx;
		}
	}


	.goods-list {
		width: 100%;
		padding: 20upx 0 120upx 0;

		.empty {
			width: 100%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			color: #a7a7a7;
		}

		.row {
			width: calc(92%);
			height: calc(22vw + 40upx);
			margin: 20upx auto;

			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
			display: flex;
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;

			.menu {
				.icon {
					color: #fff;
					font-size: 60upx;
				}

				position: absolute;
				width: 30%;
				height: 100%;
				right: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}

			.production {
				@keyframes showMenu {
					0% {
						transform: translateX(0);
					}

					100% {
						transform: translateX(-30%);
					}
				}

				@keyframes closeMenu {
					0% {
						transform: translateX(-30%);
					}

					100% {
						transform: translateX(0);
					}
				}

				&.open {
					animation: showMenu 0.25s linear both;
				}

				&.close {
					animation: closeMenu 0.15s linear both;
				}

				background-color: #fff;

				.container {
					padding-left: 20upx;
					flex-shrink: 0;
					height: 22vw;
					margin-right: 20upx;
				}

				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				display: flex;
				align-items: center;

				.goods-info {
					width: 100%;
					display: flex;
					padding-right: 20upx;

					.img {
						width: 22vw;
						height: 22vw;
						border-radius: 10upx;
						overflow: hidden;
						flex-shrink: 0;
						margin-right: 10upx;

						image {
							width: 22vw;
							height: 22vw;
						}
					}

					.info {
						width: 100%;
						height: 22vw;
						overflow: hidden;
						display: flex;
						flex-wrap: wrap;
						position: relative;

						.title {
							width: 100%;
							font-size: 28upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// text-align: justify;
							overflow: hidden;
						}

						.spec {
							font-size: 20upx;
							background-color: #f3f3f3;
							color: #a7a7a7;
							height: 30upx;
							display: flex;
							align-items: center;
							padding: 0 10upx;
							border-radius: 15upx;
							margin-bottom: 20vw;
						}

						.price-number {
							position: absolute;
							left: 0;
							width: 100%;
							bottom: 0upx;
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							font-size: 28upx;
							height: 60upx;

							.price {}

						}
					}
				}
			}
		}
	}

	.footer {
		width: 92%;
		padding: 0 4%;
		background-color: #fbfbfb;
		height: 100upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		position: fixed;
		bottom: 0upx;
		z-index: 5;

		.delBtn {
			border: solid 1upx #f06c7a;
			color: #f06c7a;
			padding: 0 30upx;
			height: 50upx;
			border-radius: 30upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.settlement {
			width: 60%;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.sum {
				font-size: 28upx;
				margin-right: 10upx;
				display: flex;
				justify-content: flex-end;

				.money {
					font-weight: 600;
				}
			}

			.btn {
				padding: 5upx 30upx;
				height: 50upx;
				background-color: #f06c7a;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;

				border-radius: 30upx;
			}
		}
	}
</style>
