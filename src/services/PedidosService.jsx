import { supabase } from "../supabase/supabase.config"

export const PedidosService = {
    list : async() => {
        const {data , error} = await supabase.from('pedidos').select('*,usuarios(*)').order('created_at' , { ascending : false})
        if (error) throw new Error(error.message)
        // if(error){
        //     console.error(error)
        //     return []
        // }
        console.log("SERVICE P",data)
        return data
    },
    async sendOrder(pedidoId){
        const {error} = await supabase.from('pedidos').update({estado: 'ACEPTADO'}).eq('id',pedidoId).order('id')
        if(error){
            throw new Error(error.message)
        }
    }
}