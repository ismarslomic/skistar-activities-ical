export default {
  '*': ['npm run prettier:fix'],
  '**/*.ts': () => ['npm run lint:fix', 'npm run build'],
}
