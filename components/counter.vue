<template>
	<view class="number">
		<view class="sub" @tap.stop="sub">
			<view class="icon icon-font">&#xe768;</view>
		</view>
		<view class="input">
			<input type="number" v-model="goods_infor.number">
		</view>
		<view class="add" @tap.stop="add">
			<view class="icon icon-font">&#xe767;</view> 
		</view>
	</view>
</template>

<script>

	export default {
		methods:{
			sub(){
				
				// // 注册change事件
				// this.$emit("change");
				
				this.$emit("sub"); //为什么要使用子级注册事件 父级执行 因为我们需要在更新父级数据的时候 是通过修改子级中的数据 来操作的
			},
			add(){
				// this.goodsInfo.number++;
				// // 注册change事件
				// this.$emit("change");
				
				this.$emit("add");
			}
		},
		props: {
			goods_infor: Object
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.number {
		display: flex;
		justify-content: center;
		align-items: center;

		.input {
			width: 80upx;
			height: 60upx;
			margin: 0 10upx;
			background-color: #f3f3f3;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;

			input {
				width: 80upx;
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				font-size: 26upx;
			}
		}

		.sub,
		.add {
			width: 60upx;
			height: 60upx;
			background-color: #f3f3f3;
			border-radius: 5upx;

			.icon {
				font-size: 30upx;
				width: 60upx;
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
</style>
