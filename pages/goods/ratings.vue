<template>
	<view>
		<video v-show="show_video" class="myVideo" id="myVideo" @fullscreenchange="video_control" :src="video_src" @pause="video_pause"></video>
		<view class="content-wrap">
			<!-- 好中差评 -->
			<view class="label">
				<view v-for="(item,index) in ratings_type" :key="index" :class="{'on': index == ratings_current_index}" @tap="change_ratings_index(index);">
					{{ item.name }} {{ item.count }}
				</view>
			</view>
			<!-- 评论信息 -->
			<view class="list">
				<view class="ratings" v-for="(item,index) in ratings_list" :key="index">
					<view class="left">
						<view class="face">
							<image :src="item.face"></image>
						</view>
					</view>
					<view class="right">
						<!-- username & date -->
						<view class="name-date">
							<view class="username">{{item.username}}</view>
							<view class="date">{{item.date}}</view>
						</view>
						<!-- specifications -->
						<view class="spec">{{item.spec}}</view>
						<!-- medias -->
						<view class="medias">
							<view class="content">{{item.content}}</view>
							<view class="img-video">
								
								<!-- 视频 -->
								<view class="box" v-for="video in item.video" :key="video.path" @tap="play_video(video.path);">
									<image mode="aspectFill" :src="video.img"></image>
									<view class="playbtn">
										<view class="icon icon-font">&#xe7e9;</view>
									</view>
								</view>
								
								<!-- 图片 -->
								<view class="box" v-for="(image,index) in item.img" :key="index" @tap="preview_image(image,item.img);">
									<image mode="aspectFill" :src="image"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ratings_type: [
					{
						name: "全部",
						count: 55,
						type: 'all'
					},
					{
						name: "好评",
						count: 22,
						type: 'good'
					},
					{
						name: "中评",
						count: 18,
						type: 'secondary'
					},
					{
						name: "差评",
						count: 1,
						type: 'poor'
					},
					{
						name: "有图",
						count: 10,
						type: 'img'
					},
					{
						name: "视频",
						count: 2,
						type: 'video'
					},
					{
						name: "追加",
						count: 2,
						type: 'append'
					}
				],
				ratings_current_index: 0, //当前评论选项的下标
				ratings_list: [], //当前评论列表内容
				show_video: false, //是否显示视频
				video_src: "", //视频地址
				video_context: null //视频播放器对象
			}
		},
		methods: {
			change_ratings_index(index) { //该表评论筛选的下标
				this.ratings_current_index = index;
			},
			preview_image(current_src,item) { //图片预览
				uni.previewImage({
					current: current_src,
					urls: item,
					loop: true,
					indicator: "default"
				});
			},
			video_control(e) { //视频选项
				if(e.detail.fullScreen){ // 全屏
					// 自动播放
					this.video_context.play();
					
				}else {
					
					// 停止播放					
					this.video_src = '';
					
					
					//条件编译 微信小程序暂停视频
					// #ifdef MP-WEIXIN 
					this.video_context.stop();
					// #endif
				}
			},
			video_pause() { //视频暂停
				
			},
			play_video(path) { //播放视频
				
				this.video_src = path;
				// 全屏播放
				
				this.$nextTick(() => { //当里面的DOM创建完毕后，再执行全屏播放。 DOM更新完成后执行。
					this.video_context.requestFullScreen({
						direction: 0
					});
				});
				
				this.show_video = true;
			}
		},
		onLoad() {
			try {
				const comments = uni.getStorageSync('comments');
				if (comments) {
					this.ratings_list = comments;
				}
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			}
		},
		onReady() {
			this.video_context = uni.createVideoContext('myVideo');
		},
		computed: {
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.content-wrap {
		view {
			display: flex;
		}

		width: 94%;
		padding: 0 3%;

		.label {
			width: 100%;
			flex-wrap: wrap;

			view {
				padding: 0 20upx;
				height: 50upx;
				border-radius: 40upx;
				border: solid 1upx #ddd;
				align-items: center;
				color: #555;
				font-size: 26upx;
				background-color: #f9f9f9;
				margin: 10upx 20upx 10upx 0;

				&.on {
					border: solid 1upx #f06c7a;
					color: #f06c7a;
				}
			}
		}
	}

	.list {
		width: 100%;
		flex-wrap: wrap;
		padding: 20upx 0;

		.ratings {
			width: 100%;
			margin-top: 30upx;

			.left {
				width: 10vw;
				flex-shrink: 0;
				margin-right: 20upx;

				.face {
					width: 100%;
					
					image {
						width: 10vw;
						height: 10vw;
						border-radius: 100%;
					}

				}
			}

			.right {
				width: 100%;
				flex-wrap: wrap;

				.name-date {
					width: 100%;
					justify-content: space-between;
					align-items: baseline;

					.username {
						font-size: 32upx;
						color: #555;
					}

					.date {
						font-size: 28upx;
						color: #aaa;
					}
				}

				.spec {
					width: 100%;
					color: #aaa;
					font-size: 26upx;
				}

				.medias {
					width: 100%;
					flex-wrap: wrap;

					.content {
						font-size: 30upx;
						padding-top: 10upx;
					}

					.img-video {
						width: 100%;
						flex-wrap: wrap;
						.box {
							width: calc((84.6vw - 50upx)/4);
							height: calc((84.6vw - 50upx)/4);
							margin: 5upx 5upx;
							position: relative;
							justify-content: left;
							
							image {
								position: absolute;
								width: 100%;
								height: 100%;
								border-radius: 10upx;
							}

							.playbtn {
								position: absolute;
								left: calc(50% - 40upx);
								top: calc(50% - 45upx);
								.icon {
									font-size: 80upx;
									color: rgba(255, 255, 255, .9)
								}
							}
						}
					}
				}
			}
		}
	}
	
	.myVideo{
		position: fixed;
		top: 50%;
		right: 100%;
		// #ifdef  MP
		top: 0;
		right: 0;
		z-index: 99;
		width: 100%;
		height: 100%;
		// #endif
	}
	
</style>
