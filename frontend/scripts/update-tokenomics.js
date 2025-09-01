const fs = require('fs');
const path = require('path');

const tokenomics = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'tokenomics.json'), 'utf8')
);

function formatNumber(num) {
  return Number(num).toLocaleString('en-US');
}

function updateReadme() {
  const readmePath = path.join(__dirname, '..', 'README.md');
  const readme = fs.readFileSync(readmePath, 'utf8');
  const lines = [
    `- Total supply: ${formatNumber(tokenomics.supply)} HALL`,
    `- DAO treasury: ${tokenomics.dao}%`,
    `- Community rewards: ${tokenomics.community}%`,
    `- Team: ${tokenomics.team}%`,
    `- Advisors: ${tokenomics.advisors}%`,
    `- Investors: ${tokenomics.investors}%`,
    `- Transfer burn: ${tokenomics.burn}%`,
    `- Utility: ${tokenomics.utility}`,
    `- Vesting: Team ${tokenomics.teamVesting} months, Advisors ${tokenomics.advisorsVesting} months, Investors ${tokenomics.investorsVesting} months`,
    `- Burn rate: ${tokenomics.burnRate}% of each transfer is burned to reduce supply`,
  ].join('\n');

  const start = readme.indexOf('## Tokenomics');
  const next = readme.indexOf('## ', start + '## Tokenomics'.length);
  if (start === -1 || next === -1) {
    throw new Error('README.md does not contain expected Tokenomics section');
  }
  const updated =
    readme.slice(0, start) +
    '## Tokenomics\n\n' +
    lines +
    '\n\n' +
    readme.slice(next);
  fs.writeFileSync(readmePath, updated);
}

function updateLocales() {
  const localesDir = path.join(__dirname, '..', 'locales');
  const files = fs.readdirSync(localesDir).filter((f) => f.endsWith('.json'));
  const replacements = {
    supply: formatNumber(tokenomics.supply),
    dao: tokenomics.dao,
    community: tokenomics.community,
    team: tokenomics.team,
    advisors: tokenomics.advisors,
    investors: tokenomics.investors,
    burn: tokenomics.burn,
    teamVesting: tokenomics.teamVesting,
    advisorsVesting: tokenomics.advisorsVesting,
    investorsVesting: tokenomics.investorsVesting,
    burnRate: tokenomics.burnRate,
  };

  files.forEach((file) => {
    const filePath = path.join(localesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const key of Object.keys(data)) {
      let value = data[key];
      if (typeof value === 'string') {
        for (const [ph, rep] of Object.entries(replacements)) {
          value = value.replace(new RegExp(`\\{${ph}\\}`, 'g'), rep.toString());
        }
        data[key] = value;
      }
    }
    if (file === 'en.json') {
      data.tok_utility_text = tokenomics.utility;
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  });
}

updateReadme();
updateLocales();
