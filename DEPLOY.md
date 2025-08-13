# 🚀 AdminFlow - Guia de Deploy

Este guia mostra como fazer deploy da aplicação AdminFlow usando Docker.

## 📋 Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) (opcional)

## 🔧 Deploy Rápido

### Opção 1: Script Automático (Recomendado)

```bash
# Torna o script executável
chmod +x deploy.sh

# Executa o deploy
./deploy.sh
```

### Opção 2: Comandos Manuais

```bash
# 1. Build da imagem
docker build -t adminflow:latest .

# 2. Executa o container
docker run -d \
  --name adminflow-app \
  -p 3000:3000 \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/public/uploads:/app/public/uploads" \
  --restart unless-stopped \
  adminflow:latest

# 3. Verifica se está funcionando
curl http://localhost:3000/api/ping
```

### Opção 3: Docker Compose

```bash
# Deploy em produção
docker-compose up -d

# Deploy em desenvolvimento
docker-compose --profile dev up -d
```

## 🌐 URLs da Aplicação

Após o deploy bem-sucedido:

- **Landing Page**: http://localhost:3000
- **Painel Admin**: http://localhost:3000/admin
- **Configurações SEO**: http://localhost:3000/admin/seo
- **Health Check**: http://localhost:3000/api/ping

## 📁 Volumes Persistentes

A aplicação usa volumes para persistir dados:

- `./data` → Configurações SEO (JSON)
- `./public/uploads` → Imagens enviadas

## 🔍 Monitoramento

```bash
# Ver logs em tempo real
docker logs -f adminflow-app

# Ver status do container
docker ps | grep adminflow

# Ver uso de recursos
docker stats adminflow-app
```

## 🛠️ Comandos Úteis

```bash
# Parar a aplicação
docker stop adminflow-app

# Iniciar novamente
docker start adminflow-app

# Remover completamente
docker stop adminflow-app && docker rm adminflow-app

# Rebuild com cache limpo
docker build --no-cache -t adminflow:latest .

# Acessar terminal do container
docker exec -it adminflow-app sh
```

## 🔧 Troubleshooting

### Problema: Container não inicia

```bash
# Verificar logs de erro
docker logs adminflow-app

# Verificar se a porta está ocupada
lsof -i :3000

# Rebuild sem cache
docker build --no-cache -t adminflow:latest .
```

### Problema: API não responde

```bash
# Verificar se o serviço está rodando
docker exec adminflow-app ps aux

# Verificar conectividade de rede
docker exec adminflow-app wget -qO- http://localhost:3000/api/ping
```

### Problema: Dados perdidos

Certifique-se de que os volumes estão montados corretamente:

```bash
# Verificar volumes
docker inspect adminflow-app | grep -A 10 "Mounts"
```

## 🌍 Deploy em Produção

Para deploy em servidor de produção:

1. **Configure variáveis de ambiente**:
```bash
export NODE_ENV=production
export PORT=3000
```

2. **Use proxy reverso** (Nginx/Apache):
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **Configure SSL** com Let's Encrypt:
```bash
certbot --nginx -d yourdomain.com
```

## 📈 Performance

Para melhor performance em produção:

- Use `docker-compose` com múltiplas réplicas
- Configure load balancer (Nginx/HAProxy)
- Monitore com Prometheus/Grafana
- Use CDN para arquivos estáticos

## 🔒 Segurança

- Container roda com usuário não-root
- Arquivos sensíveis não são copiados (`.dockerignore`)
- Health checks configurados
- Volumes com permissões adequadas

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs: `docker logs adminflow-app`
2. Verificar health check: `curl http://localhost:3000/api/ping`
3. Rebuild: `docker build --no-cache -t adminflow:latest .`
