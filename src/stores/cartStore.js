import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./user";
import { insertCartAPI,findNewCartListAPI,delCartAPI } from "@/apis/cart";

export const useCartStore=  defineStore('cart',()=>{
    const userStore =useUserStore()
    const isLogin=computed(()=>userStore.userInfo.token)

     //获取最新购物车列表action
    const updateNewList= async()=>{
        const res = await findNewCartListAPI()
        cartList.value=res.result
    }
    //1.定义state  数据  
    const cartList=ref([])
    //2.定义action   函数
    const addCart=async (goods)=>{
        const {skuId,count}=goods
        if(isLogin.value){
            //登录之后的加入购物车逻辑
           await insertCartAPI({skuId,count})
           updateNewList()

        }else{
            //添加购物车操作
            //已添加过  count+1
            //没有添加过 直接push
            //思路：通过匹配传递过来的商品对象中的shuId能不能在cartList中找到，找到了就是添加过
            //find查找
            const item =cartList.value.find((item)=>goods.skuId===item.skuId)
                if(item){
                    //找到了
                    item.count++
                }else{
                    cartList.value.push(goods)
                }
        }
    }
    //删除购物车
    const delCart=async(skuId)=>{
        if(isLogin.value){
        //调用接口实现购物车中的删除功能
        await delCartAPI([skuId])
        updateNewList()
        }else{
        //思路
        //1.找到要删除项的下标值  splice
        //2.使用数组的过滤方法  filter

        //拿到对应下标
        const idx =cartList.value.findIndex((item)=>skuId===item.skuId)
        cartList.value.splice(idx,1)
        }

        
    }
    // 清空购物车
    const clearCart=()=>{
        cartList.value=[]
    }
   
    //单选功能
    const singleCheck=(skuId,selected)=>{
        //通过skuId找到要修改的那一项 然后把他的selected修改为传过来的selected
        //find查找  Find返回的是浅拷贝 修改对象(item)的属性会改变原来(cartList)对象
        const item=cartList.value.find((item)=>item.skuId===skuId)
        item.selected=selected
    }

    //全选功能
    const allCheck=(selected)=>{
        //把cartList中的每一项的selected都设置为当前的全选框状态
        //forEach遍历
        cartList.value.forEach(item=>item.selected=selected)
    }

    //计算属性
    //1.总的数量
    //reduce累积操作  a=a+c.count  0初始值
    const allCount= computed(()=>cartList.value.reduce((a,c)=>a+c.count,0))
    //2.总价
    const allPrice= computed(()=>cartList.value.reduce((a,c)=>a+c.count*c.price,0))
    //3.已选择数量  filter返回的是数组所以可以继续调用
    const selectedCount = computed(()=>cartList.value.filter(item=>item.selected).reduce((a,c)=>a+c.count,0))
    //4.已选择商品价钱合计
    const selectedPrice = computed(()=>cartList.value.filter(item=>item.selected).reduce((a,c)=>a+c.count*c.price,0))
    //是否全选 every所有项
    const isAll=computed(()=>cartList.value.every((item)=>item.selected))
    
    return {
        addCart,
        delCart,
        allCheck,
        singleCheck,
        clearCart,
        updateNewList,
        allCount,
        allPrice,
        cartList,
        isAll,
        selectedCount,
        selectedPrice
    }
},
{
    persist: true, //持久化配置
  })