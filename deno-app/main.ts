import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { crypto } from "https://deno.land/std@0.208.0/crypto/mod.ts";

// Asegurarnos que el directorio de datos existe
try {
  await Deno.mkdir("./data");
} catch {
  // El directorio ya existe
}

// Inicializar base de datos SQLite
const db = new DB("./data/test.db");
db.execute(`
  CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    value TEXT
  )
`);

// Datos de ejemplo para procesamiento JSON
const complexData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  data: {
    name: "test" + i,
    values: Array.from({ length: 100 }, (_, j) => ({ sub: j, calc: Math.random() }))
  }
}));

const handler = async (request: Request): Promise<Response> => {
  const start = performance.now();
  
  try {
    // 1. Operación de archivo
    const fileData = JSON.stringify(complexData);
    await Deno.writeTextFile("./data/temp_data.json", fileData);
    const readData = await Deno.readTextFile("./data/temp_data.json");
    
    // 2. Query a base de datos
    const timestamp = new Date().toISOString();
    db.query("INSERT INTO metrics (timestamp, value) VALUES (?, ?)", [timestamp, "test"]);
    const dbResults = db.query("SELECT * FROM metrics ORDER BY id DESC LIMIT 5");
    
    // 3. Procesamiento JSON complejo
    const processedData = JSON.parse(readData).map((item: any) => {
      return {
        ...item,
        data: {
          ...item.data,
          values: item.data.values.map((v: any) => ({
            ...v,
            processed: Math.pow(v.calc, 2) * Math.sin(v.sub)
          }))
        }
      };
    });
    
    // 4. Operaciones criptográficas
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(JSON.stringify(processedData));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const end = performance.now();
    const duration = end - start;

    // Limpiar archivo temporal
    try {
      await Deno.remove("./data/temp_data.json");
    } catch {
      // Ignorar errores al limpiar
    }

    return new Response(
      JSON.stringify({
        message: "Operaciones completadas en Deno",
        duration: `${duration.toFixed(2)}ms`,
        hash: hashHex,
        dbRowCount: Array.from(dbResults).length,
        dataProcessed: processedData.length,
        runtime: "Deno"
      }),
      {
        headers: { "content-type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error en Deno:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        duration: `${(performance.now() - start).toFixed(2)}ms`,
        runtime: "Deno"
      }),
      {
        headers: { "content-type": "application/json" },
        status: 500,
      },
    );
  }
};

console.log("Servidor Deno iniciado en http://localhost:3000");
await serve(handler, { port: 3000 }); 