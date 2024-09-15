import { supabase } from "../supabase/supabase.config"

export const UsuarioService = {
    async findByEmail(email){
        const {data,error} = await supabase.from('usuarios')
                            .select('*')
                            .eq('correo',email)
                            .single()
        if(error){
            throw new Error(error.message)
        }

        return data
    },
}