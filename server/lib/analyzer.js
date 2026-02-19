// Server-side TOS analyzer with 33 red flags
const RED_FLAGS = [
  // Privacy (6)
  {
    name: 'Broad Data Collection',
    category: 'Privacy',
    description: 'Collects data far beyond what the service needs to function',
    severity: 'high',
    terms: ['collect information', 'collect data', 'usage data', 'device information', 'browsing history', 'cookies', 'tracking', 'analytics', 'diagnostic data']
  },
  {
    name: 'Third-Party Sharing',
    category: 'Privacy',
    description: 'Shares your data with unnamed third parties, advertisers, or partners',
    severity: 'high',
    terms: ['third party', 'third-party', 'partners', 'affiliates', 'share your', 'share information', 'data sharing', 'advertising partners']
  },
  {
    name: 'Cross-Platform Tracking',
    category: 'Privacy',
    description: 'Tracks your activity across different websites and services',
    severity: 'high',
    terms: ['across services', 'cross-device', 'across platforms', 'track your activity', 'across websites', 'pixel', 'web beacon']
  },
  {
    name: 'Biometric Data',
    category: 'Privacy',
    description: 'Collects biometric identifiers like face scans or voiceprints',
    severity: 'high',
    terms: ['biometric', 'facial recognition', 'face geometry', 'voiceprint', 'fingerprint', 'faceprint']
  },
  {
    name: 'Indefinite Data Retention',
    category: 'Privacy',
    description: 'Retains your data indefinitely, even after account deletion',
    severity: 'high',
    terms: ['retain your data', 'indefinitely', 'retain information', 'keep your data', 'data retention', 'after deletion', 'after termination']
  },
  {
    name: 'Precise Location Tracking',
    category: 'Privacy',
    description: 'Tracks your precise GPS location continuously',
    severity: 'warning',
    terms: ['precise location', 'gps', 'geolocation', 'location data', 'location information', 'geographic location']
  },

  // Legal Rights (5)
  {
    name: 'Mandatory Arbitration',
    category: 'Legal Rights',
    description: 'Forces disputes into private arbitration instead of court',
    severity: 'high',
    terms: ['arbitration', 'binding arbitration', 'arbitrate', 'arbitration agreement']
  },
  {
    name: 'Class Action Waiver',
    category: 'Legal Rights',
    description: 'Prevents you from joining group lawsuits',
    severity: 'high',
    terms: ['class action', 'class-action', 'collective action', 'representative action', 'waive your right']
  },
  {
    name: 'Unilateral Terms Changes',
    category: 'Legal Rights',
    description: 'Can change the agreement at any time without meaningful notice',
    severity: 'high',
    terms: ['modify these terms', 'change these terms', 'update these terms', 'right to change', 'right to modify', 'revised terms', 'discretion to change', 'sole discretion to modify']
  },
  {
    name: 'Favorable Governing Law',
    category: 'Legal Rights',
    description: 'Requires disputes be governed by laws favorable to the company',
    severity: 'warning',
    terms: ['governing law', 'laws of the state of california', 'laws of the state of delaware', 'jurisdiction', 'venue shall be']
  },
  {
    name: 'Liability Limitation',
    category: 'Legal Rights',
    description: 'Caps damages or eliminates liability for harm caused to you',
    severity: 'warning',
    terms: ['limitation of liability', 'not liable', 'no liability', 'as is', 'without warranty', 'in no event', 'aggregate liability', 'shall not exceed']
  },

  // Content/IP (5)
  {
    name: 'Broad Content License',
    category: 'Content/IP',
    description: 'Takes a broad, perpetual license to your content',
    severity: 'high',
    terms: ['worldwide license', 'non-exclusive license', 'royalty-free', 'perpetual license', 'irrevocable license', 'sublicensable', 'transferable license']
  },
  {
    name: 'Content Monetization',
    category: 'Content/IP',
    description: 'Can use your content for advertising or commercial purposes',
    severity: 'high',
    terms: ['commercial purposes', 'monetize', 'advertising purposes', 'promotional purposes', 'in connection with advertising']
  },
  {
    name: 'AI/ML Training Rights',
    category: 'Content/IP',
    description: 'Uses your content to train AI/ML models',
    severity: 'high',
    terms: ['machine learning', 'artificial intelligence', 'train', 'training data', 'improve our services', 'automated systems', 'algorithmic']
  },
  {
    name: 'Content Removal Power',
    category: 'Content/IP',
    description: 'Can remove your content at any time for any reason',
    severity: 'warning',
    terms: ['remove content', 'remove your content', 'delete content', 'right to remove', 'take down']
  },
  {
    name: 'No True Content Ownership',
    category: 'Content/IP',
    description: 'License terms effectively strip meaningful ownership of your content',
    severity: 'warning',
    terms: ['you retain ownership', 'you own your content', 'you grant us', 'by submitting', 'by posting']
  },

  // Financial (4)
  {
    name: 'Auto-Renewal',
    category: 'Financial',
    description: 'Subscriptions auto-renew and may be hard to cancel',
    severity: 'warning',
    terms: ['auto-renew', 'automatically renew', 'recurring charges', 'automatic renewal', 'billing cycle']
  },
  {
    name: 'Unilateral Price Changes',
    category: 'Financial',
    description: 'Can raise prices without meaningful consent',
    severity: 'warning',
    terms: ['change the price', 'modify the price', 'price changes', 'adjust the fees', 'increase the price', 'right to change fees']
  },
  {
    name: 'No Refund Policy',
    category: 'Financial',
    description: 'No refunds under any circumstances',
    severity: 'warning',
    terms: ['no refund', 'non-refundable', 'all sales are final', 'no reimbursement']
  },
  {
    name: 'Damages Cap',
    category: 'Financial',
    description: 'Limits total damages to a trivial amount',
    severity: 'warning',
    terms: ['not exceed', 'aggregate liability', 'total liability', 'shall not exceed', 'limited to the amount']
  },

  // Account Control (5)
  {
    name: 'Account Termination at Will',
    category: 'Account Control',
    description: 'Can terminate your account at any time without reason',
    severity: 'high',
    terms: ['terminate your account', 'suspend your account', 'right to terminate', 'sole discretion', 'without notice', 'without cause']
  },
  {
    name: 'Data Non-Portability',
    category: 'Account Control',
    description: 'No meaningful way to export or transfer your data',
    severity: 'warning',
    terms: ['data portability', 'export your data', 'download your data', 'data takeout']
  },
  {
    name: 'Minor/Age Data Collection',
    category: 'Account Control',
    description: 'Collects data from minors or has weak age verification',
    severity: 'high',
    terms: ['children', 'under 13', 'under 16', 'parental consent', 'coppa', 'minors', 'age of consent']
  },
  {
    name: 'Forced Communication Consent',
    category: 'Account Control',
    description: 'Opts you into marketing communications by default',
    severity: 'warning',
    terms: ['consent to receive', 'agree to receive', 'marketing communications', 'promotional emails', 'opt out', 'unsubscribe']
  },
  {
    name: 'Bans Without Appeal',
    category: 'Account Control',
    description: 'Can ban you permanently with no appeals process',
    severity: 'high',
    terms: ['permanent ban', 'permanently suspend', 'no appeal', 'without recourse', 'final and binding', 'not be reversed']
  },

  // Queer Safety (8)
  {
    name: 'Sensitive Identity Data Collection',
    category: 'Queer Safety',
    description: 'Collects sexual orientation, gender identity, health data, or other sensitive personal characteristics — can be used to identify, profile, or target LGBTQ+ individuals even without their knowledge or consent',
    severity: 'high',
    terms: ['sexual orientation', 'gender identity', 'sensitive personal', 'special categories', 'sensitive data', 'protected characteristics', 'sex life', 'sensitive information', 'race or ethnicity', 'religious belief']
  },
  {
    name: 'Real Name / Government ID Requirements',
    category: 'Queer Safety',
    description: 'Requires legal name, government-issued ID, or "authentic identity" verification — can force disclosure of deadnames, mismatched gender markers, or pre-transition identity documents, effectively outing trans and non-binary users',
    severity: 'high',
    terms: ['real name', 'legal name', 'government-issued', 'government id', 'identity verification', 'verify your identity', 'true identity', 'authentic identity', 'official name', 'identification document', 'authentic name']
  },
  {
    name: 'Law Enforcement Data Disclosure',
    category: 'Queer Safety',
    description: 'Shares user data with law enforcement or government agencies upon request — in 60+ countries that criminalize LGBTQ+ identity, this data can lead to arrest, prosecution, or violence; even in "safe" countries, overbroad compliance can expose users to hostile state actors, immigration authorities, or family courts weaponizing identity data',
    severity: 'high',
    terms: ['law enforcement', 'government request', 'legal process', 'subpoena', 'court order', 'national security', 'government authorities', 'regulatory authorities', 'comply with law', 'legal obligation']
  },
  {
    name: 'Cross-Border Data Transfers',
    category: 'Queer Safety',
    description: 'Transfers user data internationally without specifying which countries or what protections apply — data may reach jurisdictions where LGBTQ+ identity is criminalized, punishable by imprisonment, or even death; vague "global operations" language can mask data flows to hostile regimes',
    severity: 'warning',
    terms: ['transfer data', 'international transfer', 'other countries', 'cross-border', 'data transfer', 'outside your country', 'transferred to', 'global operations', 'data internationally', 'transfer outside']
  },
  {
    name: 'Vague Morality / Decency Content Restrictions',
    category: 'Queer Safety',
    description: 'Restricts content based on subjective "morality," "decency," or "family-friendly" standards — this language has been historically and systematically weaponized to suppress LGBTQ+ expression, flag queer existence as "adult" or "inappropriate," shadowban LGBTQ+ creators, and remove content depicting same-sex relationships or gender nonconformity that would be unrestricted for straight/cisgender users',
    severity: 'high',
    terms: ['morally objectionable', 'decency', 'objectionable content', 'offensive content', 'inappropriate content', 'family friendly', 'indecent', 'unwholesome', 'good taste', 'community standards violation']
  },
  {
    name: 'Behavioral Profiling & Identity Inference',
    category: 'Queer Safety',
    description: 'Infers personal characteristics from behavior patterns, content engagement, social connections, or browsing habits — can invisibly construct profiles of sexual orientation, gender identity, or HIV status without users ever disclosing this information; these shadow profiles can then be shared, sold, or leaked',
    severity: 'high',
    terms: ['infer', 'derive information', 'predict', 'create a profile', 'interests and preferences', 'behavioral data', 'demographic information', 'characteristics', 'categories of interest', 'audience segments']
  },
  {
    name: 'Sensitive Data Monetization',
    category: 'Queer Safety',
    description: 'Sells, shares, or monetizes sensitive personal data or inferred identity characteristics with advertisers, data brokers, or third parties — can expose LGBTQ+ identity for profit without consent, enable discriminatory ad targeting, or feed data ecosystems that sell "LGBTQ+ audience segments" to anyone willing to pay, including hostile actors',
    severity: 'high',
    terms: ['sell your data', 'sell personal', 'data broker', 'advertising partners', 'share with advertisers', 'monetize your data', 'sell information', 'data marketplace', 'sell your information', 'sell to third']
  },
  {
    name: 'Health & Medical Data Exposure',
    category: 'Queer Safety',
    description: 'Collects or shares health and medical data — can reveal HIV status, PrEP usage, hormone replacement therapy, gender-affirming surgical care, mental health treatment related to gender dysphoria or minority stress, sexual health clinic visits, or fertility treatments; this data in the wrong hands can be used for discrimination, insurance denial, employment retaliation, custody disputes, or criminal prosecution in anti-LGBTQ+ jurisdictions',
    severity: 'high',
    terms: ['health information', 'medical information', 'health data', 'medical data', 'health records', 'physical health', 'mental health', 'medical history', 'health status', 'wellness data']
  }
];

function analyzeTOS(text) {
  const textLower = text.toLowerCase();

  // Basic stats
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const readTime = Math.ceil(wordCount / 238);

  // Scan flags
  const flagsFound = [];
  const flagsSafe = [];

  for (const flag of RED_FLAGS) {
    let found = false;
    let matchedTerm = '';
    for (const term of flag.terms) {
      if (textLower.includes(term)) {
        found = true;
        matchedTerm = term;
        break;
      }
    }
    if (found) {
      // Extract surrounding context as evidence
      const idx = textLower.indexOf(matchedTerm);
      const start = Math.max(0, idx - 60);
      const end = Math.min(text.length, idx + matchedTerm.length + 60);
      const evidence = text.substring(start, end).trim();
      flagsFound.push({ ...flag, evidence });
    } else {
      flagsSafe.push(flag);
    }
  }

  // Calculate risk score (0-100)
  const highFlags = flagsFound.filter(f => f.severity === 'high').length;
  const warningFlags = flagsFound.filter(f => f.severity === 'warning').length;
  const riskScore = Math.min(100, Math.round((highFlags * 6 + warningFlags * 3) * (100 / RED_FLAGS.length)));

  let riskLevel;
  if (riskScore >= 70) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';
  else riskLevel = 'low';

  return {
    word_count: wordCount,
    sentence_count: sentenceCount,
    read_time: readTime,
    flags_found: flagsFound,
    flags_safe: flagsSafe,
    total_flags: RED_FLAGS.length,
    risk_score: riskScore,
    risk_level: riskLevel,
  };
}

module.exports = { analyzeTOS, RED_FLAGS };
