#!/bin/bash

# 🐳 Utilidades para Docker - Deudas App
# Script para manejar todos los servicios del proyecto

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    local backend_port=$(get_backend_port)
    echo -e "${BLUE}🐳 Docker Utilities - Deudas App${NC}"
    echo ""
    echo "Uso: $0 [COMANDO] [OPCIONES]"
    echo ""
    echo "CONFIGURACIÓN:"
    echo "  Puerto del Backend: ${backend_port} (configurado en .env.local o variable PORT)"
    echo ""
    echo "COMANDOS DISPONIBLES:"
    echo "  dev         - Levantar servicios para desarrollo (backend + db + redis)"
    echo "  dev-full    - Levantar todos los servicios incluyendo herramientas de desarrollo"
    echo "  prod        - Levantar servicios para producción (con nginx)"
    echo "  stop        - Detener todos los servicios"
    echo "  restart     - Reiniciar todos los servicios"
    echo "  logs        - Mostrar logs de todos los servicios"
    echo "  clean       - Limpiar contenedores, imágenes y volúmenes"
    echo "  reset       - Reset completo (stop + clean + rebuild)"
    echo "  health      - Verificar estado de los servicios"
    echo "  shell       - Acceder al shell del backend"
    echo "  db-shell    - Acceder al shell de PostgreSQL"
    echo "  redis-shell - Acceder al shell de Redis"
    echo ""
    echo "COMANDOS DE PRISMA:"
    echo "  prisma:studio    - Abrir Prisma Studio en el navegador"
    echo "  prisma:migrate   - Ejecutar migraciones pendientes"
    echo "  prisma:generate  - Generar cliente Prisma"
    echo "  prisma:seed      - Ejecutar seed de la base de datos"
    echo "  prisma:reset     - Reset completo de la base de datos"
    echo "  prisma:deploy    - Desplegar esquema a la base de datos"
    echo ""
    echo "EJEMPLOS:"
    echo "  $0 dev              # Iniciar desarrollo"
    echo "  $0 dev-full         # Desarrollo con herramientas"
    echo "  $0 logs backend     # Ver logs del backend"
    echo "  $0 shell            # Shell del contenedor backend"
    echo "  $0 prisma:migrate   # Ejecutar migraciones"
    echo "  $0 prisma:seed      # Ejecutar seed"
}

# Función para verificar si Docker está corriendo
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Error: Docker no está corriendo${NC}"
        exit 1
    fi
}

# Función para detectar el comando de docker-compose
get_docker_compose_cmd() {
    if command -v docker-compose >/dev/null 2>&1; then
        echo "docker-compose"
    elif docker compose version >/dev/null 2>&1; then
        echo "docker compose"
    else
        echo -e "${RED}❌ Error: No se encontró docker-compose ni docker compose${NC}"
        exit 1
    fi
}

# Variable global para el comando de docker-compose
DOCKER_COMPOSE_CMD=""

# Función para obtener el puerto del backend
get_backend_port() {
    # Intentar obtener el puerto desde variables de entorno
    local port=${PORT:-8080}

    # Si no hay variable PORT, intentar leer desde .env
    if [ -f ".env.local" ]; then
        local env_port=$(grep "^PORT=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
        if [ -n "$env_port" ]; then
            port=$env_port
        fi
    fi

    echo "$port"
}

# Función para desarrollo básico
dev() {
    local backend_port=$(get_backend_port)
    echo -e "${GREEN}🚀 Iniciando servicios para desarrollo...${NC}"
    $DOCKER_COMPOSE_CMD up -d postgres redis backend
    echo -e "${GREEN}✅ Servicios iniciados:${NC}"
    echo "  - Backend: http://localhost:${backend_port}"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
}

# Función para desarrollo completo
dev_full() {
    local backend_port=$(get_backend_port)
    echo -e "${GREEN}🚀 Iniciando todos los servicios para desarrollo...${NC}"
    $DOCKER_COMPOSE_CMD --profile dev up -d
    echo -e "${GREEN}✅ Todos los servicios iniciados:${NC}"
    echo "  - Backend: http://localhost:${backend_port}"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
    echo "  - Prisma Studio: http://localhost:5555"
    echo "  - pgAdmin: http://localhost:8082 (admin@deudas.com / admin123)"
    echo "  - Redis Commander: http://localhost:8081 (admin / admin123)"
}

# Función para producción
prod() {
    local backend_port=$(get_backend_port)
    echo -e "${GREEN}🚀 Iniciando servicios para producción...${NC}"
    $DOCKER_COMPOSE_CMD --profile prod up -d
    echo -e "${GREEN}✅ Servicios de producción iniciados:${NC}"
    echo "  - API Gateway (Nginx): http://localhost"
    echo "  - Backend: http://localhost/api (puerto interno: ${backend_port})"
    echo "  - Health Check: http://localhost/health"
}

# Función para detener servicios
stop() {
    echo -e "${YELLOW}🛑 Deteniendo todos los servicios...${NC}"
    $DOCKER_COMPOSE_CMD down
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
}

# Función para reiniciar
restart() {
    echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
    stop
    sleep 2
    dev
}

# Función para mostrar logs
logs() {
    if [ -n "$2" ]; then
        echo -e "${BLUE}📋 Mostrando logs de $2...${NC}"
        $DOCKER_COMPOSE_CMD logs -f "$2"
    else
        echo -e "${BLUE}📋 Mostrando logs de todos los servicios...${NC}"
        $DOCKER_COMPOSE_CMD logs -f
    fi
}

# Función para limpiar
clean() {
    echo -e "${YELLOW}🧹 Limpiando contenedores, imágenes y volúmenes...${NC}"

    # Detener servicios
    $DOCKER_COMPOSE_CMD down -v

    # Limpiar contenedores detenidos
    docker container prune -f

    # Limpiar imágenes no utilizadas
    docker image prune -f

    # Limpiar volúmenes no utilizados
    docker volume prune -f

    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Función para reset completo
reset() {
    echo -e "${RED}🔥 Reset completo del proyecto...${NC}"
    read -p "¿Estás seguro? Esto eliminará todos los datos (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        stop
        clean
        echo -e "${GREEN}🏗️ Reconstruyendo imágenes...${NC}"
        $DOCKER_COMPOSE_CMD build --no-cache
        dev
        echo -e "${GREEN}✅ Reset completado${NC}"
    else
        echo -e "${YELLOW}❌ Reset cancelado${NC}"
    fi
}

# Función para verificar salud
health() {
    echo -e "${BLUE}🏥 Verificando estado de los servicios...${NC}"

    services=("backend" "postgres" "redis")

    for service in "${services[@]}"; do
        if $DOCKER_COMPOSE_CMD ps "$service" | grep -q "Up"; then
            health_status=$($DOCKER_COMPOSE_CMD exec -T "$service" echo "OK" 2>/dev/null || echo "FAIL")
            if [ "$health_status" = "OK" ]; then
                echo -e "  $service: ${GREEN}✅ Healthy${NC}"
            else
                echo -e "  $service: ${YELLOW}⚠️ Running but not responding${NC}"
            fi
        else
            echo -e "  $service: ${RED}❌ Down${NC}"
        fi
    done
}

# Función para shell del backend
shell() {
    echo -e "${BLUE}🐚 Accediendo al shell del backend...${NC}"
    $DOCKER_COMPOSE_CMD exec backend /bin/sh
}

# Función para shell de PostgreSQL
db_shell() {
    echo -e "${BLUE}🗄️ Accediendo al shell de PostgreSQL...${NC}"
    $DOCKER_COMPOSE_CMD exec postgres psql -U ${POSTGRES_USER:-deudas_user} -d ${POSTGRES_DB:-deudas_app}
}

# Función para shell de Redis
redis_shell() {
    echo -e "${BLUE}🔴 Accediendo al shell de Redis...${NC}"
    $DOCKER_COMPOSE_CMD exec redis redis-cli
}

# Función para Prisma Studio
prisma_studio() {
    echo -e "${BLUE}🚀 Abriendo Prisma Studio...${NC}"
    $DOCKER_COMPOSE_CMD exec backend sh -c "cd packages/database && bun run db:studio"
    echo -e "${GREEN}✅ Prisma Studio abierto${NC}"
}

# Función para migraciones de Prisma
prisma_migrate() {
    echo -e "${BLUE}🚀 Ejecutando migraciones de Prisma...${NC}"
    $DOCKER_COMPOSE_CMD exec backend sh -c "cd packages/database && bun run db:migrate"
    echo -e "${GREEN}✅ Migraciones ejecutadas${NC}"
}

# Función para generar cliente Prisma
prisma_generate() {
    echo -e "${BLUE}🚀 Generando cliente de Prisma...${NC}"
    $DOCKER_COMPOSE_CMD exec backend sh -c "cd packages/database && bun run db:generate"
    echo -e "${GREEN}✅ Cliente de Prisma generado${NC}"
}

# Función para seed de Prisma
prisma_seed() {
    echo -e "${BLUE}🚀 Ejecutando seed de Prisma...${NC}"
    $DOCKER_COMPOSE_CMD exec backend sh -c "cd packages/database && bun run db:seed"
    echo -e "${GREEN}✅ Seed ejecutado${NC}"
}

# Función para reset de base de datos Prisma
prisma_reset() {
    echo -e "${RED}🔥 Reset completo de la base de datos de Prisma...${NC}"
    read -p "¿Estás seguro? Esto eliminará todos los datos (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🔄 Reseteando base de datos...${NC}"
        $DOCKER_COMPOSE_CMD exec backend sh -c "cd packages/database && bun run db:reset"
        echo -e "${GREEN}✅ Reset de base de datos completado${NC}"
    else
        echo -e "${YELLOW}❌ Reset de base de datos cancelado${NC}"
    fi
}

# Función para desplegar esquema Prisma
prisma_deploy() {
    echo -e "${BLUE}🚀 Desplegando esquema de Prisma...${NC}"
    $DOCKER_COMPOSE_CMD exec backend sh -c "cd packages/database && bun run db:push"
    echo -e "${GREEN}✅ Esquema desplegado${NC}"
}

# Main function
main() {
    check_docker

    # Inicializar el comando de docker-compose
    DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)

    case "${1:-help}" in
        "dev")
            dev
            ;;
        "dev-full")
            dev_full
            ;;
        "prod")
            prod
            ;;
        "stop")
            stop
            ;;
        "restart")
            restart
            ;;
        "logs")
            logs "$@"
            ;;
        "clean")
            clean
            ;;
        "reset")
            reset
            ;;
        "health")
            health
            ;;
        "shell")
            shell
            ;;
        "db-shell")
            db_shell
            ;;
        "redis-shell")
            redis_shell
            ;;
        "prisma:studio")
            prisma_studio
            ;;
        "prisma:migrate")
            prisma_migrate
            ;;
        "prisma:generate")
            prisma_generate
            ;;
        "prisma:seed")
            prisma_seed
            ;;
        "prisma:reset")
            prisma_reset
            ;;
        "prisma:deploy")
            prisma_deploy
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal con todos los argumentos
main "$@"
