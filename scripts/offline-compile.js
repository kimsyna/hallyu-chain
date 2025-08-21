const fs = require('fs');
const path = require('path');
const solc = require('solc');

const sourcePath = path.join(__dirname, '..', 'contracts', 'HallyuToken.sol');
const source = fs.readFileSync(sourcePath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'contracts/HallyuToken.sol': { content: source },
  },
  settings: {
    optimizer: { enabled: false, runs: 200 },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'],
      },
    },
  },
};

function findImports(importPath) {
  const basePath = importPath.startsWith('@')
    ? path.join(__dirname, '..', 'node_modules', importPath)
    : path.join(__dirname, '..', importPath);
  if (fs.existsSync(basePath)) {
    return { contents: fs.readFileSync(basePath, 'utf8') };
  }
  return { error: 'File not found' };
}

const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);
if (output.errors) {
  for (const err of output.errors) {
    console.error(err.formattedMessage);
  }
  if (output.errors.some((e) => e.severity === 'error')) {
    process.exit(1);
  }
}

const contract = output.contracts['contracts/HallyuToken.sol']['HallyuToken'];
const artifact = {
  contractName: 'HallyuToken',
  sourceName: 'contracts/HallyuToken.sol',
  abi: contract.abi,
  bytecode: contract.evm.bytecode.object
    ? '0x' + contract.evm.bytecode.object
    : '0x',
  deployedBytecode: contract.evm.deployedBytecode.object
    ? '0x' + contract.evm.deployedBytecode.object
    : '0x',
  linkReferences: contract.evm.bytecode.linkReferences || {},
  deployedLinkReferences: contract.evm.deployedBytecode.linkReferences || {},
};

const artifactsDir = path.join(
  __dirname,
  '..',
  'artifacts',
  'contracts',
  'HallyuToken.sol'
);
fs.mkdirSync(artifactsDir, { recursive: true });
fs.writeFileSync(
  path.join(artifactsDir, 'HallyuToken.json'),
  JSON.stringify(artifact, null, 2)
);
