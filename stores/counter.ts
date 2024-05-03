// stores/counter.ts
import { defineStore } from "pinia";

export const useCounterStore = defineStore('counter',{

    // State
    state:()=>{
        return {
            count: 0,
            user: {
                name: "ZaRkKy"
            }
        }
    },
    persist: true,

    // Actions
    actions: {
        // Increment the counter
        increment(){
            this.count++
        },
        // Decrement the counter
        decrement(){
            this.count--
        }
    }

});