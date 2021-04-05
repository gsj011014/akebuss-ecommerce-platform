<template>
	<view>
		<view class="header">
			<view class="target" v-for="(item,index) in filter_by_list" :key="index" :class="{'on': item.selected}" @tap="change_current_select(index);">
				{{ item.text }}
			</view>
		</view>
		
		<!-- 占位 tabbar 有定位 -->
		<view class="place"></view>
		
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="product-list">
				<view class="product" @tap="goods_detail(item);" v-for="(item,index) in goods_list" :key="index">
					<image mode="widthFix" :src="item.img"></image>
					<view class="name">{{ item.name }}</view>
					<view class="info">
						<view class="price">
							<text>￥</text>
							{{ item.price }}
						</view>
						<view class="slogan">
							{{ item.slogan }}
							<text>人付款</text>
						</view>
					</view>
				</view>
			</view>
			<view class="loading-text">{{ loadingText }}</view>
		</view>
	</view>
</template>

<script>
	import interfaces from '../../utils/interface.js'
	
	export default {
		data() {
			return {
				filter_by_list: [
					{
						text: '全部',
						selected: true,
						filter_by: 'all'
					},
					{
						text: '口碑',
						selected: false,
						filter_by: 'public'
					},
					{
						text: '热门',
						selected: false,
						filter_by: 'hot'
					}
				],
				goods_list: [], //商品列表数据
				filterby: 'all', //默认请求全部
				page: 1,
				size: 6,
				loadingText: '正在加载...'
			}
		},
		methods: {
			load_data() {
				this.$request({
					url: `${interfaces.getGoodsList}/${this.filterby}/${this.page}/${this.size}`,
					success: ((res) => {
						if(res.data.length > 0){
							res.data.forEach(item => { //push到里面 这样里面就会有全部的数据了
								this.goods_list.push(item);
							});
						}else{
							this.loadingText = "到底了";
						}
					})
				});
			},
			change_current_select(select_index) {
				this.filter_by_list.forEach((item,index) => {
					if(index == select_index){
						item.selected = true;
						//切换模块
						this.page = 1;
						this.loadingText = '加载中';
						this.goods_list = [];
						this.filterby = item.filter_by;
						this.load_data();
					}else{
						item.selected = false;
					}
				});
			},
			goods_detail(item) {
				uni.navigateTo({
					url: "./goods_detail?goodsInfo="+JSON.stringify(item)
				});
			}
		},
		onLoad(option) { //option 代表传的值
						
			//动态修改nav title
			uni.setNavigationBarTitle({
				title: option.name
			});
			
			//加载数据
			this.load_data();
		},
		onPullDownRefresh() { //下拉刷新方法 一定要在page.json中做一个配置
			setTimeout(() => {
				this.page = 1;
				this.loadingText = '加载中...';
				this.goods_list = [];
				this.load_data();
				uni.stopPullDownRefresh();
			},1000);
		},
		onReachBottom() { //上拉加载
			this.page ++;
			this.load_data();
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		width: 92%;
		padding: 0 4%;
		height: 79upx;
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		position: fixed;
		z-index: 10;
		background-color: #fff;
		border-bottom: solid 1upx #eee;
	
		.target {
			width: 20%;
			height: 60upx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			margin-bottom: -2upx;
			color: #aaa;
	
			&.on {
				color: #555;
				border-bottom: 4upx solid #f06c7a;
				font-weight: 600;
				font-size: 30upx;
			}
	
			.icon {
				font-size: 26upx;
			}
		}
	}
	
	.place {
		background-color: #ffffff;
		height: 100upx;
	}
	
	.goods-list {
		.loading-text {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60upx;
			color: #979797;
			font-size: 24upx;
		}
	
		.product-list {
			width: 92%;
			padding: 0 4% 3vw 4%;
			column-count: 2;
			column-gap: 1em;
	
			.product {
				break-inside: avoid;
				border-radius: 20upx;
				background-color: #fff;
				margin: 0 0 15upx 0;
				box-shadow: 0upx 5upx 25upx rgba(0, 0, 0, 0.1);
	
				image {
					width: 100%;
					border-radius: 20upx 20upx 0 0;
				}
	
				.name {
					width: 92%;
					padding: 6upx 4%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-align: justify;
					overflow: hidden;
					font-size: 30upx;
				}
	
				.info {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					width: 92%;
					padding: 10upx 4% 10upx 4%;
	
					.price {
						color: #e65339;
						font-size: 30upx;
						font-weight: 600;
					}
	
					.slogan {
						color: #807c87;
						font-size: 24upx;
					}
				}
			}
	
		}
	}
</style>
