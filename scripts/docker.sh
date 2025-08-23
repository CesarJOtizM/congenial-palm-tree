#!/bin/bash

# Script de Docker para VitaWallet
# Uso: ./scripts/docker.sh [comando]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables globales
SELECTED_ENV=""
ENV_FILE=""

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}Script de Docker para VitaWallet${NC}"
    echo ""
    echo "Uso: $0 [comando] [entorno]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build     - Construir todas las imágenes (requiere entorno)"
    echo "  up        - Levantar todos los servicios (requiere entorno)"
    echo "  down      - Detener todos los servicios"
    echo "  restart   - Reiniciar todos los servicios"
    echo "  logs      - Mostrar logs de todos los servicios"
    echo "  logs-next - Mostrar logs de Next.js"
    echo "  logs-astro- Mostrar logs de Astro"
    echo "  logs-db   - Mostrar logs de PostgreSQL"
    echo "  studio    - Información sobre Prisma Studio"
    echo "  env-info  - Mostrar información del entorno actual"
    echo "  clean     - Limpiar contenedores e imágenes"
    echo "  db-push   - Ejecutar Prisma db push"
    echo "  db-migrate- Ejecutar migraciones de Prisma"
    echo "  db-seed   - Ejecutar seed de la base de datos"
    echo "  generate  - Generar cliente de Prisma"
    echo "  test-db   - Probar inicialización de base de datos"
    echo "  help      - Mostrar esta ayuda"
    echo ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo "  $0 up development    # Levantar en desarrollo"
    echo "  $0 build production  # Construir para producción"
    echo "  $0 logs              # Ver logs (detecta entorno automáticamente)"
    echo "  $0 down              # Detener servicios"
    echo ""
    echo -e "${CYAN}Entornos disponibles:${NC} development, staging, production, test"
    echo -e "${CYAN}Archivos de entorno:${NC} .env.[entorno].local"
    echo ""
}

# Función para detectar entorno automáticamente
detect_environment() {
    # Buscar contenedores corriendo que tengan el label del proyecto
    local running_containers
    if command -v docker &> /dev/null; then
        running_containers=$(docker ps --format "table {{.Names}}" --filter "name=vitawallet" 2>/dev/null | tail -n +2)

        if [ -n "$running_containers" ]; then
            # Intentar obtener el entorno desde las variables de entorno del contenedor
            local container_env
            container_env=$(docker inspect $(echo "$running_containers" | head -n1) --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null | grep "NODE_ENV=" | cut -d'=' -f2)

            if [ -n "$container_env" ]; then
                echo "$container_env"
                return 0
            fi
        fi
    fi

    # Fallback: buscar el archivo .env más reciente
    local most_recent
    most_recent=$(ls -t .env.*.local 2>/dev/null | head -n1 | sed 's/.env.\(.*\).local/\1/')

    if [ -n "$most_recent" ]; then
        echo "$most_recent"
        return 0
    fi

    # Último fallback
    echo "development"
}

# Función para seleccionar entorno (solo cuando sea necesario)
select_environment() {
    local force_selection=${1:-false}

    # Si ya se seleccionó un entorno, no hacer nada
    if [ -n "$SELECTED_ENV" ]; then
        return
    fi

    # Intentar usar entorno pasado como parámetro
    if [ -n "$2" ]; then
        case "$2" in
            development|staging|production|test)
                SELECTED_ENV="$2"
                ENV_FILE="$2"
                export ENV_FILE
                export NODE_ENV=$SELECTED_ENV
                echo -e "${GREEN}✅ Usando entorno: ${SELECTED_ENV}${NC}"
                return
                ;;
            *)
                echo -e "${RED}Entorno inválido: $2${NC}"
                echo -e "${CYAN}Entornos válidos: development, staging, production, test${NC}"
                exit 1
                ;;
        esac
    fi

    # Si no se fuerza la selección, intentar detectar automáticamente
    if [ "$force_selection" = false ]; then
        SELECTED_ENV=$(detect_environment)
        ENV_FILE="$SELECTED_ENV"
        export ENV_FILE
        export NODE_ENV=$SELECTED_ENV
        echo -e "${CYAN}🔍 Entorno detectado automáticamente: ${SELECTED_ENV}${NC}"
        return
    fi

    # Solo mostrar el menú si se fuerza la selección
    echo -e "${PURPLE}🌍 Selección de Entorno${NC}"
    echo -e "${CYAN}===================${NC}"
    echo ""
    echo "Entornos disponibles:"
    echo -e "  ${GREEN}1)${NC} development - Desarrollo local con debug habilitado"
    echo -e "  ${YELLOW}2)${NC} staging     - Entorno de pruebas (pre-producción)"
    echo -e "  ${RED}3)${NC} production  - Entorno de producción"
    echo -e "  ${BLUE}4)${NC} test        - Entorno de testing"
    echo ""

    # Verificar qué archivos .env existen
    echo -e "${CYAN}Archivos de entorno disponibles:${NC}"
    for env in development staging production test; do
        if [ -f ".env.${env}.local" ]; then
            echo -e "  ✅ .env.${env}.local"
        else
            if [ -f "example.env.${env}.local" ]; then
                echo -e "  ⚠️  .env.${env}.local (no existe, usará example.env.${env}.local)"
            else
                echo -e "  ❌ .env.${env}.local (no existe)"
            fi
        fi
    done
    echo ""

    while true; do
        read -p "Selecciona un entorno (1-4) [1]: " choice
        choice=${choice:-1}

        case $choice in
            1)
                SELECTED_ENV="development"
                ENV_FILE="development"
                break
                ;;
            2)
                SELECTED_ENV="staging"
                ENV_FILE="staging"
                break
                ;;
            3)
                SELECTED_ENV="production"
                ENV_FILE="production"
                break
                ;;
            4)
                SELECTED_ENV="test"
                ENV_FILE="test"
                break
                ;;
            *)
                echo -e "${RED}Opción inválida. Por favor selecciona 1-4.${NC}"
                ;;
        esac
    done

    echo ""
    echo -e "${GREEN}✅ Entorno seleccionado: ${SELECTED_ENV}${NC}"
    echo -e "${CYAN}📄 Archivo de variables: .env.${ENV_FILE}.local${NC}"

    # Verificar si el archivo existe
    if [ ! -f ".env.${ENV_FILE}.local" ]; then
        if [ -f "example.env.${ENV_FILE}.local" ]; then
            echo -e "${YELLOW}⚠️  Archivo .env.${ENV_FILE}.local no encontrado${NC}"
            echo -e "${CYAN}💡 Se usará example.env.${ENV_FILE}.local como fallback${NC}"
            echo -e "${CYAN}💡 Para crear tu archivo: cp example.env.${ENV_FILE}.local .env.${ENV_FILE}.local${NC}"
        else
            echo -e "${RED}❌ Error: No se encontró .env.${ENV_FILE}.local ni example.env.${ENV_FILE}.local${NC}"
            echo -e "${CYAN}💡 Crea el archivo desde el ejemplo: cp example.env.development.local .env.${ENV_FILE}.local${NC}"
            exit 1
        fi
    fi

    # Exportar variables para docker-compose
    export ENV_FILE
    export NODE_ENV=$SELECTED_ENV

    echo ""
}

# Función para usar docker compose (con detección automática)
get_docker_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    elif command -v docker &> /dev/null; then
        echo "docker compose"
    else
        echo -e "${RED}Error: Docker no está instalado${NC}"
        exit 1
    fi
}

# Función para construir imágenes
build() {
    select_environment true "$2"  # Forzar selección para build
    echo -e "${YELLOW}Construyendo imágenes de Docker para entorno: ${SELECTED_ENV}...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd build
    echo -e "${GREEN}¡Imágenes construidas exitosamente para ${SELECTED_ENV}!${NC}"
}

# Función para levantar servicios
up() {
    select_environment true "$2"  # Forzar selección para up
    echo -e "${YELLOW}Levantando servicios en entorno: ${SELECTED_ENV}...${NC}"
    echo -e "${CYAN}Archivo de configuración: .env.${ENV_FILE}.local${NC}"
    echo ""

    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd up -d

    echo ""
    echo -e "${GREEN}¡Servicios levantados exitosamente en ${SELECTED_ENV}!${NC}"
    echo ""
    echo -e "${PURPLE}🌐 URLs disponibles:${NC}"
    echo -e "  ${BLUE}Next.js:       http://localhost:3000${NC}"
    echo -e "  ${BLUE}Astro:         http://localhost:4321${NC}"
    echo -e "  ${BLUE}PostgreSQL:    localhost:5432${NC}"
    echo -e "  ${BLUE}Prisma Studio: http://localhost:5555${NC}"
    echo ""
    echo -e "${CYAN}💡 Para ver logs: ./scripts/docker.sh logs${NC}"
    echo -e "${CYAN}💡 Para detener:  ./scripts/docker.sh down${NC}"
}

# Función para detener servicios
down() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Deteniendo servicios del entorno: ${SELECTED_ENV}...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd down
    echo -e "${GREEN}¡Servicios detenidos exitosamente!${NC}"
}

# Función para reiniciar servicios
restart() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Reiniciando servicios del entorno: ${SELECTED_ENV}...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd restart
    echo -e "${GREEN}¡Servicios reiniciados exitosamente en ${SELECTED_ENV}!${NC}"
}

# Función para mostrar logs
logs() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Mostrando logs de todos los servicios (${SELECTED_ENV})...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd logs -f
}

# Función para mostrar logs específicos
logs_next() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Mostrando logs de Next.js (${SELECTED_ENV})...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd logs -f web-next
}

logs_astro() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Mostrando logs de Astro (${SELECTED_ENV})...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd logs -f web-astro
}

logs_db() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Mostrando logs de PostgreSQL (${SELECTED_ENV})...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd logs -f postgres
}

# Función para levantar Prisma Studio
studio() {
    echo -e "${YELLOW}Prisma Studio ya está disponible en: http://localhost:5555${NC}"
    echo -e "${BLUE}Se levanta automáticamente con: ./scripts/docker.sh up${NC}"
}

# Función para mostrar información del entorno
env_info() {
    select_environment false "$2"  # Detectar automáticamente
    echo ""
    echo -e "${PURPLE}🔍 Información del Entorno${NC}"
    echo -e "${CYAN}=========================${NC}"
    echo ""
    echo -e "${GREEN}Entorno detectado:${NC} ${SELECTED_ENV}"
    echo -e "${GREEN}Archivo de configuración:${NC} .env.${ENV_FILE}.local"
    echo -e "${GREEN}NODE_ENV:${NC} ${NODE_ENV}"
    echo ""

    if [ -f ".env.${ENV_FILE}.local" ]; then
        echo -e "${CYAN}📄 Variables principales del archivo:${NC}"
        echo -e "${BLUE}$(grep -E '^(NODE_ENV|SHARED_|NEXT_PUBLIC_|PUBLIC_|DATABASE_URL)' .env.${ENV_FILE}.local | head -10)${NC}"
        echo ""

        # Contar variables
        local total_vars=$(grep -c '^[A-Z]' .env.${ENV_FILE}.local 2>/dev/null || echo "0")
        echo -e "${GREEN}Total de variables configuradas:${NC} ${total_vars}"
    else
        echo -e "${YELLOW}⚠️  Archivo .env.${ENV_FILE}.local no encontrado${NC}"
        if [ -f "example.env.${ENV_FILE}.local" ]; then
            echo -e "${CYAN}📋 Se usará example.env.${ENV_FILE}.local${NC}"
        fi
    fi

    echo ""
    echo -e "${CYAN}💡 Para cambiar entorno explícitamente: ./scripts/docker.sh up [entorno]${NC}"
    echo ""
}

# Función para limpiar
clean() {
    echo -e "${YELLOW}Limpiando todos los contenedores e imágenes...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)

    # Intentar limpiar con diferentes entornos
    for env in development staging production test; do
        if [ -f ".env.${env}.local" ] || [ -f "example.env.${env}.local" ]; then
            ENV_FILE=$env NODE_ENV=$env $docker_cmd down -v --rmi all 2>/dev/null || true
        fi
    done

    docker system prune -f
    echo -e "${GREEN}¡Limpieza completada!${NC}"
}

# Función para ejecutar Prisma db push
db_push() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Ejecutando Prisma db push en ${SELECTED_ENV}...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd exec web-next bun run db:push
    echo -e "${GREEN}¡Prisma db push completado en ${SELECTED_ENV}!${NC}"
}

# Función para ejecutar migraciones
db_migrate() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Ejecutando migraciones de Prisma en ${SELECTED_ENV}...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd exec web-next bun run db:migrate
    echo -e "${GREEN}¡Migraciones completadas en ${SELECTED_ENV}!${NC}"
}

# Función para ejecutar seed
db_seed() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Ejecutando seed de la base de datos en ${SELECTED_ENV}...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd exec web-next bun run db:seed
    echo -e "${GREEN}¡Seed completado en ${SELECTED_ENV}!${NC}"
}

# Función para generar cliente de Prisma
generate() {
    select_environment false "$2"  # Detectar automáticamente
    echo -e "${YELLOW}Generando cliente de Prisma para ${SELECTED_ENV}...${NC}"
    local docker_cmd=$(get_docker_compose_cmd)
    ENV_FILE=$ENV_FILE NODE_ENV=$SELECTED_ENV $docker_cmd exec web-next bun run db:generate
    echo -e "${GREEN}¡Cliente de Prisma generado exitosamente para ${SELECTED_ENV}!${NC}"
}

# Función para probar inicialización de base de datos
test_db() {
    echo -e "${YELLOW}Probando inicialización de base de datos...${NC}"
    if [ -f "packages/database/test-init.sh" ]; then
        cd packages/database && ./test-init.sh
    else
        echo -e "${RED}Error: Script de prueba no encontrado${NC}"
        exit 1
    fi
    echo -e "${GREEN}¡Prueba de inicialización completada!${NC}"
}

# Manejo de comandos
case "$1" in
    build)
        build "$@"
        ;;
    up)
        up "$@"
        ;;
    down)
        down "$@"
        ;;
    restart)
        restart "$@"
        ;;
    logs)
        logs "$@"
        ;;
    logs-next)
        logs_next "$@"
        ;;
    logs-astro)
        logs_astro "$@"
        ;;
    logs-db)
        logs_db "$@"
        ;;
    studio)
        studio
        ;;
    env-info|info)
        env_info "$@"
        ;;
    clean)
        clean
        ;;
    db-push)
        db_push "$@"
        ;;
    db-migrate)
        db_migrate "$@"
        ;;
    db-seed)
        db_seed "$@"
        ;;
    generate)
        generate "$@"
        ;;
    test-db)
        test_db
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Comando no reconocido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
