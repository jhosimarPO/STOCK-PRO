import { supabase } from "./src"

async function getTableStructure(tableName) {
//     const { data, error } = await supabase
//     .from('information_schema.columns')
//     .select('column_name::text, data_type::text')
//     .eq('table_name', tableName)
  
//   if (error) {
//     console.error(`Error fetching structure for ${tableName}:`, error)
//   } else {
//     console.log(`Estructura de la tabla ${tableName}:`, data)
//   }

const { data, error } = await supabase
    .from('tables')
    .select('table_name')
    .eq('table_schema', 'public')

  if (error) {
    console.error('Error fetching tables:', error)
  } else {
    console.log('Tables in public schema:', data.map(table => table.table_name))
  }
  
  }
  
  export async function exploreDatabase() {
    const tables = ['categorias'] // Reemplaza con los nombres de tus tablas
    for (const table of tables) {
      await getTableStructure(table)
    }
  }
  