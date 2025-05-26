// src/system/sysvars.js
import fs from 'fs'
import path from 'path'

const FILE_PATH = path.resolve('./system-variables.json')

// Carrega o arquivo JSON ou cria um objeto vazio
let systemVariables = {}

try {
  if (fs.existsSync(FILE_PATH)) {
    const data = fs.readFileSync(FILE_PATH, 'utf-8')
    systemVariables = JSON.parse(data)
  }
} catch (err) {
  console.error('Error loading system variables JSON:', err)
}

// Função pra salvar no arquivo JSON
function saveToFile() {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(systemVariables, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error saving system variables JSON:', err)
  }
}

// Acessar variável (throw se não existir)
export function access(key) {
  if (!(key in systemVariables)) {
    throw new Error(`Variable "${key}" not found`)
  }
  return systemVariables[key]
}

// Setar/Atualizar variável e salvar no arquivo
export function setVar(key, value) {
  systemVariables[key] = value
  saveToFile()
}

// Listar tudo (clone para evitar gambiarra)
export function listVars() {
  return { ...systemVariables }
}
