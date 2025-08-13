#!/bin/bash

echo "🧪 Teste Rápido de Deploy - AdminFlow"
echo "======================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}🔍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Test 1: Check if files were built
print_test "Verificando arquivos de build..."

if [ -f "dist/spa/index.html" ]; then
    print_success "Frontend construído (dist/spa/index.html)"
else
    print_error "Frontend não construído"
    exit 1
fi

if [ -f "dist/server/production.mjs" ]; then
    print_success "Backend construído (dist/server/production.mjs)"
else
    print_error "Backend não construído"
    exit 1
fi

# Test 2: Check if server can start
print_test "Testando inicialização do servidor..."

# Start server in background
node dist/server/production.mjs &
SERVER_PID=$!

# Wait a bit for server to start
sleep 5

# Test 3: Check health endpoint
print_test "Testando endpoint de saúde..."

PORTS=(3000 8080 80)
WORKING_PORT=""

for port in "${PORTS[@]}"; do
    if curl -f -s http://localhost:$port/api/ping > /dev/null 2>&1; then
        WORKING_PORT=$port
        break
    fi
done

if [ -n "$WORKING_PORT" ]; then
    print_success "API funcionando na porta $WORKING_PORT"
    
    # Test 4: Check if frontend is served
    print_test "Testando carregamento do frontend..."
    
    if curl -f -s http://localhost:$WORKING_PORT/ > /dev/null 2>&1; then
        print_success "Frontend sendo servido corretamente"
    else
        print_error "Frontend não está sendo servido"
    fi
    
    # Test 5: Check specific routes
    print_test "Testando rotas específicas..."
    
    if curl -f -s http://localhost:$WORKING_PORT/api/seo > /dev/null 2>&1; then
        print_success "API SEO funcionando"
    else
        print_warning "API SEO pode não estar funcionando"
    fi
    
    echo ""
    print_success "DEPLOY OK! Aplicação funcionando na porta $WORKING_PORT"
    echo ""
    echo "🌐 URLs de teste:"
    echo "   • Landing Page: http://localhost:$WORKING_PORT"
    echo "   • Admin:        http://localhost:$WORKING_PORT/admin"
    echo "   • API Health:   http://localhost:$WORKING_PORT/api/ping"
    echo "   • API SEO:      http://localhost:$WORKING_PORT/api/seo"
    
else
    print_error "Servidor não respondeu em nenhuma porta testada"
    print_warning "Verifique os logs de erro"
fi

# Cleanup
print_test "Parando servidor de teste..."
kill $SERVER_PID 2>/dev/null
wait $SERVER_PID 2>/dev/null

echo ""
echo "🎯 Teste concluído!"
