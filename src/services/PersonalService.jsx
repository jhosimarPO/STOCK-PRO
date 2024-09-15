import { supabase } from "../supabase/supabase.config"

export const PersonalService = {
    async delete(userId){
        const {error} = await supabase.from('usuarios')
                            .update({ deleted_at: new Date().toISOString() })
                            .eq('id',userId)
        if(error){
            throw new Error(error.message)
        }
    },
}