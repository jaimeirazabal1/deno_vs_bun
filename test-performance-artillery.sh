#!/bin/bash

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración
RESULTS_DIR="artillery-results"
mkdir -p "$RESULTS_DIR"

# Función para probar un runtime
test_runtime() {
    local runtime=$1
    local port=$2
    local results_file="$RESULTS_DIR/${runtime,,}-results.json"
    
    echo -e "\n${GREEN}Probando $runtime en puerto $port...${NC}"
    
    # Modificar el target en el archivo de configuración
    sed -i "s/target: \".*\"/target: \"http:\/\/localhost:$port\"/" performance-test.yml
    
    # Ejecutar Artillery
    artillery run --output "$results_file" performance-test.yml
    
    # Mostrar resumen
    echo -e "\n${GREEN}Resultados para $runtime:${NC}"
    artillery report "$results_file"
}

# Esperar a que los servicios estén listos
echo "Esperando 5 segundos para que los servicios se inicialicen..."
sleep 5

# Ejecutar pruebas
test_runtime "Deno" "3000"
test_runtime "Bun" "3001"

echo -e "\n${GREEN}Resultados guardados en el directorio $RESULTS_DIR${NC}" 