#!/bin/bash

echo "🧪 Executando testes do backend..."

echo "📋 Executando testes unitários..."
npm run test

echo "🔗 Executando testes de integração (e2e)..."
npm run test:e2e

echo "📊 Gerando relatório de cobertura..."
npm run test:cov

echo "✅ Todos os testes concluídos!"
