# 🔧 Troubleshooting - AdminFlow

## ❌ Erro: pnpm-lock.yaml desatualizado

### Problema
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date
```

### Causa
O arquivo `pnpm-lock.yaml` não está sincronizado com as mudanças no `package.json`.

### Soluções

#### 1. Atualizar Lockfile Localmente (Recomendado)
```bash
# Atualizar o lockfile
pnpm install --no-frozen-lockfile

# Verificar se funcionou
pnpm install --frozen-lockfile --dry-run

# Fazer commit das mudanças
git add pnpm-lock.yaml
git commit -m "update lockfile"
```

#### 2. Docker Build com Fallback
O Dockerfile já está configurado para tentar o fallback automaticamente:
```dockerfile
RUN pnpm install --frozen-lockfile --shamefully-hoist || \
    (echo "Lockfile outdated, updating..." && pnpm install --shamefully-hoist)
```

#### 3. Script Automático
Use o script de deploy que verifica automaticamente:
```bash
./deploy.sh
```

### Prevenção

1. **Sempre commitar o lockfile**:
```bash
git add pnpm-lock.yaml package.json
git commit -m "update dependencies"
```

2. **Usar hooks de pre-commit** (opcional):
```bash
# package.json
{
  "scripts": {
    "precommit": "pnpm install --frozen-lockfile --dry-run || pnpm install"
  }
}
```

3. **CI/CD Configuration**:
```yaml
# .github/workflows/build.yml
- name: Install dependencies
  run: |
    if ! pnpm install --frozen-lockfile; then
      echo "Lockfile outdated, updating..."
      pnpm install --no-frozen-lockfile
    fi
```

## 🐛 Outros Erros Comuns

### Container não inicia
```bash
# Verificar logs
docker logs adminflow-app

# Verificar se a porta está livre
lsof -i :3000

# Rebuild sem cache
docker build --no-cache -t adminflow:latest .
```

### Dependências faltando
```bash
# Limpar cache do pnpm
pnpm store prune

# Reinstalar tudo
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build falha
```bash
# Verificar versão do Node.js
node --version  # Deve ser >= 18

# Verificar versão do pnpm
pnpm --version  # Deve ser >= 8

# Limpar dist e rebuildar
rm -rf dist
pnpm run build
```

### Performance lenta
```bash
# Usar shamefully-hoist para resolver mais rápido
pnpm install --shamefully-hoist

# Configurar no .npmrc
echo "shamefully-hoist=true" >> .npmrc
```

## 🔍 Debug

### Verificar estado do lockfile
```bash
# Verificar diferenças
pnpm install --frozen-lockfile --dry-run

# Mostrar dependências resolvidas
pnpm list

# Verificar integridade
pnpm audit
```

### Verificar build do Docker
```bash
# Build com output detalhado
docker build --progress=plain -t adminflow:latest .

# Verificar layers
docker history adminflow:latest

# Inspecionar imagem
docker run -it --rm adminflow:latest sh
```

## 📞 Suporte

Se os problemas persistirem:

1. **Limpar tudo e começar do zero**:
```bash
rm -rf node_modules dist pnpm-lock.yaml
pnpm install
pnpm run build
```

2. **Verificar compatibilidade**:
- Node.js >= 18
- pnpm >= 8  
- Docker >= 20

3. **Reportar issue** com:
- Versões de Node.js, pnpm, Docker
- Output completo do erro
- Sistema operacional
