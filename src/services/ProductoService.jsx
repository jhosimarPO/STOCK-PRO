import { supabase } from "../supabase/supabase.config"

export const ProductoService = {
    async delete(productoId){
        const {error} = await supabase.from('productos')
                            .update({ deleted_at: new Date().toISOString() })
                            .eq('id',productoId)
        if(error){
            throw new Error(error.message)
        }
    },
}