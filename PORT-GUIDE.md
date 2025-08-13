# 🔌 Guia de Portas - AdminFlow

## 🚨 Problema: "Deploy feito mas não abre nada"

### ✅ Solução Rápida

1. **Verificar logs do container**:
```bash
# Se usando Docker
docker logs adminflow-app

# Se usando deploy em nuvem, verificar logs da plataforma
```

2. **Testar endpoint de saúde**:
```bash
# Tente diferentes portas
curl http://localhost:3000/api/ping
curl http://localhost:8080/api/ping
curl http://localhost:80/api/ping
```

3. **Verificar em qual porta o servidor está rodando**:
```bash
# Procurar nos logs por:
# "🔌 Port: XXXX"
```

## 🌐 Configuração por Plataforma

### Fly.io
- **Porta padrão**: 8080
- **URL**: `https://sua-app.fly.dev`
- **Logs**: `fly logs`

### Heroku
- **Porta padrão**: Definida por `$PORT`
- **URL**: `https://sua-app.herokuapp.com`
- **Logs**: `heroku logs --tail`

### Railway
- **Porta padrão**: 3000
- **URL**: `https://sua-app.railway.app`
- **Logs**: Interface web da Railway

### Render
- **Porta padrão**: 10000
- **URL**: `https://sua-app.onrender.com`
- **Logs**: Interface web do Render

### Docker Local
- **Porta padrão**: 3000
- **URL**: `http://localhost:3000`
- **Logs**: `docker logs adminflow-app`

## 🔧 Configuração Manual de Porta

### 1. Via Variável de Ambiente
```bash
# Docker
docker run -e PORT=8080 -p 8080:8080 adminflow:latest

# Docker Compose
APP_PORT=8080 CONTAINER_PORT=8080 docker-compose up
```

### 2. Via Dockerfile
```dockerfile
ENV PORT=8080
EXPOSE 8080
```

### 3. Via Deploy Script
```bash
# Editar deploy.sh, linha de docker run:
docker run -d \
  --name adminflow-app \
  -p 8080:8080 \
  -e PORT=8080 \
  adminflow:latest
```

## 🧪 Teste de Conectividade

### Script de Teste
```bash
#!/bin/bash
echo "🔍 Testando conectividade..."

PORTS=(3000 8080 80 8888 10000)

for port in "${PORTS[@]}"; do
  echo -n "Testando porta $port... "
  if curl -f -s http://localhost:$port/api/ping > /dev/null; then
    echo "✅ FUNCIONANDO"
    echo "🌐 Acesse: http://localhost:$port"
    break
  else
    echo "❌ Não responde"
  fi
done
```

### Verificação de Porta em Uso
```bash
# Linux/Mac
lsof -i :3000
netstat -tlnp | grep :3000

# Windows
netstat -an | findstr :3000
```

## 🐛 Debug Comum

### Problema: Container inicia mas não responde
```bash
# 1. Verificar se o processo está rodando
docker exec adminflow-app ps aux

# 2. Verificar porta interna
docker exec adminflow-app netstat -tlnp

# 3. Verificar logs detalhados
docker logs adminflow-app --tail=50
```

### Problema: Aplicação carrega mas API não funciona
```bash
# Verificar se arquivos estáticos estão sendo servidos
curl -I http://localhost:3000/

# Verificar se API está respondendo
curl http://localhost:3000/api/ping
```

### Problema: "502 Bad Gateway" ou "503 Service Unavailable"
- Servidor não iniciou corretamente
- Porta incorreta configurada no proxy
- Verificar logs para erros de inicialização

## 📋 Checklist de Deploy

- [ ] Container buildo com sucesso
- [ ] Container iniciou sem erros
- [ ] Endpoint `/api/ping` responde
- [ ] Página principal carrega
- [ ] Admin panel accessible em `/admin`
- [ ] Logs não mostram erros críticos

## 🆘 Ainda não funciona?

1. **Rebuild completo**:
```bash
docker build --no-cache -t adminflow:latest .
docker run -p 3000:3000 adminflow:latest
```

2. **Verificar arquivo de build**:
```bash
# Verificar se dist/spa existe
docker run --rm adminflow:latest ls -la dist/spa

# Verificar se servidor foi construído
docker run --rm adminflow:latest ls -la dist/server
```

3. **Contactar suporte** com:
   - Logs completos
   - Plataforma de deploy
   - Comando usado para deploy
   - URL que deveria funcionar
