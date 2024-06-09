import { defineStore } from "pinia";
import { computed, ref } from "vue";

 
export const useCartStore=  defineStore('cart',()=>{
    //1.定义state  数据  
    const cartList=ref([])
    //2.定义action   函数
    const addCart=(goods)=>{
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
    //删除购物车
    const delCart=(skuId)=>{
        //思路
        //1.找到要删除项的下标值  splice
        //2.使用数组的过滤方法  filter

        //拿到对应下标
        const idx =cartList.value.findIndex((item)=>skuId===item.skuId)
        cartList.value.splice(idx,1)
    }
    //单选功能
    const singleCheck=(skuId,selected)=>{
        //通过skuId找到要修改的那一项 然后把他的selected修改为传过来的selected
        //find查找  Find返回的是浅拷贝 修改对象(item)的属性会改变原来(cartList)对象
        const item=cartList.value.find((item)=>item.skuId===skuId)
        item.selected=selected
    }

    //计算属性
    //1.总的数量
    //reduce累积操作  a=a+c.count  0初始值
    const allCount= computed(()=>cartList.value.reduce((a,c)=>a+c.count,0))
    //2.总价
    const allPrice= computed(()=>cartList.value.reduce((a,c)=>a+c.count*c.price,0))
    return {
        cartList,
        addCart,
        delCart,
        allCount,
        allPrice,
        singleCheck
    }
},
{
    persist: true, //持久化配置
  })