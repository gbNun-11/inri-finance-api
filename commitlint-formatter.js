export default (report) => {
  if (report.valid) return ''

  return `
❌ ❌ ❌ Invalid Git Commit Message ❌ ❌ ❌

commit message: ${report.input}

correct format: <type>[scope]: <subject>
example: docs: update README to add developer tips

type:
  feat     Nova funcionalidade
  fix      Correção de bug
  docs     Alterações apenas na documentação
  style    Formatação, ponto e vírgula faltando, etc (não altera lógica)
  refactor Alteração no código sem corrigir bug ou adicionar funcionalidade
  test     Adição ou correção de testes
  chore    Tarefas de manutenção / ferramentas / configuração
  perf     Melhoria de performance
  ci       Alterações em CI/CD (pipeline, automações)
  build    Alterações no build ou dependências

scope:
  Optional (ex: api, auth, user)

subject:
  Short description (lowercase, no dot at end)

--------------------------------------------
`
}
