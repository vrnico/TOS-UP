// Intra-company ToS overlap detector
// Inspired by Piccolo v. Walt Disney Parks (2024) where Disney+ ToS
// arbitration clause was argued to cover a theme park wrongful death claim.
//
// Detects patterns where one product's ToS may bleed into sibling products
// under the same parent company.

const OVERLAP_PATTERNS = [
  // 1. Umbrella "Services" definitions
  {
    id: 'umbrella-services',
    name: 'Umbrella Service Definition',
    category: 'Scope Creep',
    severity: 'high',
    description: 'Defines "Services" broadly enough to cover the entire corporate family, not just this product',
    why_it_matters: 'This is exactly how the Disney+ ToS was argued to cover a theme park death. If "Services" means everything the parent company offers, agreeing to one product binds you to all.',
    terms: [
      'all services provided by',
      'all of our services',
      'any of our services',
      'services offered by',
      'and its affiliates',
      'and its subsidiaries',
      'family of companies',
      'corporate family',
      'group companies',
      'related services',
      'associated services',
      'our services include',
      'suite of services',
      'family of services',
      'our products and services',
      'across our services',
      'across our products',
    ]
  },

  // 2. Cross-reference incorporation
  {
    id: 'cross-reference',
    name: 'Cross-Reference Incorporation',
    category: 'Scope Creep',
    severity: 'high',
    description: 'Incorporates other agreements by reference, making you subject to terms you may not have read',
    why_it_matters: 'By agreeing to product A, you silently agree to the master terms, which also govern products B, C, and D. You never explicitly consented to those terms.',
    terms: [
      'incorporate by reference',
      'incorporated by reference',
      'incorporated herein',
      'subject to our',
      'master agreement',
      'master terms',
      'general terms',
      'additional terms apply',
      'supplemental terms',
      'also agree to',
      'also subject to',
      'together with',
      'in addition to these terms',
      'applicable terms',
      'platform terms',
      'universal terms',
    ]
  },

  // 3. Blanket arbitration / dispute resolution
  {
    id: 'blanket-arbitration',
    name: 'Blanket Arbitration Clause',
    category: 'Legal Rights',
    severity: 'high',
    description: 'Arbitration clause scoped broadly enough to cover disputes beyond this specific product',
    why_it_matters: 'Disney argued that a Disney+ free trial arbitration clause covered a wrongful death at a restaurant. If arbitration covers "any dispute" with the company, signing up for a free trial could waive your right to sue over anything.',
    terms: [
      'any dispute arising from',
      'any dispute between you and',
      'all claims arising',
      'any claims arising',
      'any controversy or claim',
      'any and all disputes',
      'disputes related to any',
      'any dispute or claim',
      'any legal dispute',
      'relating to any of our',
      'in connection with any',
    ]
  },

  // 4. Shared account / unified identity
  {
    id: 'shared-identity',
    name: 'Shared Account / Unified Identity',
    category: 'Scope Creep',
    severity: 'warning',
    description: 'Uses a single account or identity system across multiple products, linking all ToS agreements to one identity',
    why_it_matters: 'When one login governs multiple products, the company can argue that any ToS you agreed to under that account applies to all your interactions across their ecosystem.',
    terms: [
      'single sign-on',
      'unified account',
      'linked accounts',
      'same credentials',
      'shared account',
      'one account',
      'your account across',
      'use across our',
      'sign in to',
      'log in across',
      'account with us',
      'your google account',
      'your apple id',
      'your microsoft account',
      'your amazon account',
      'your disney account',
      'your meta account',
    ]
  },

  // 5. Affiliate / subsidiary data sharing
  {
    id: 'affiliate-data-pipeline',
    name: 'Affiliate Data Pipeline',
    category: 'Privacy',
    severity: 'high',
    description: 'Shares your data across the entire corporate family — not just the product you signed up for',
    why_it_matters: 'When your data flows freely between subsidiaries, the company can build a unified profile across all products. This also means the privacy failures of one product expose your data from all products.',
    terms: [
      'share with our affiliates',
      'share with our parent',
      'share with our subsidiaries',
      'share with our related',
      'across our family of',
      'among our affiliates',
      'within our corporate',
      'within our group',
      'combined with',
      'combine information',
      'amazon.com, inc',
      'alphabet inc',
      'meta platforms',
      'the walt disney company',
      'microsoft corporation',
      'apple inc',
      'bytedance',
    ]
  },

  // 6. Broad "you" / "user" definition
  {
    id: 'broad-user-definition',
    name: 'Broad User Definition',
    category: 'Scope Creep',
    severity: 'warning',
    description: 'Defines "user" or "you" broadly enough to include anyone in the household or anyone using the account',
    why_it_matters: 'If "you" includes family members, guests, or anyone using your account, one person agreeing to ToS can bind others who never consented — like the spouse in the Disney case.',
    terms: [
      'you and anyone who',
      'you or anyone using',
      'anyone who accesses',
      'anyone using your account',
      'household members',
      'family members',
      'authorized users',
      'on behalf of',
      'you represent and warrant',
      'your use of or access to',
      'your access to and use of',
      'guests',
    ]
  },

  // 7. Survival / persistence clauses
  {
    id: 'survival-clauses',
    name: 'Survival Beyond Termination',
    category: 'Legal Rights',
    severity: 'warning',
    description: 'Key clauses (especially arbitration) survive even after you stop using the product or delete your account',
    why_it_matters: 'Even if you cancel a free trial, the arbitration clause may still bind you years later. Survival clauses mean you can never truly "un-agree" to the terms.',
    terms: [
      'survives termination',
      'survive termination',
      'survive the expiration',
      'remains in effect',
      'remain in effect',
      'continue to apply',
      'shall survive',
      'will survive',
      'notwithstanding termination',
      'regardless of termination',
      'even after termination',
      'perpetual',
      'irrevocable',
    ]
  },

  // 8. Unilateral scope expansion
  {
    id: 'scope-expansion',
    name: 'Unilateral Scope Expansion',
    category: 'Scope Creep',
    severity: 'high',
    description: 'Company can expand what "Services" means at any time, retroactively pulling new products under existing ToS',
    why_it_matters: 'You agreed to ToS for product A. The company later launches product B and updates "Services" to include it. Now your original agreement covers a product that didn\'t exist when you agreed.',
    terms: [
      'now known or later developed',
      'now known or hereafter',
      'now or in the future',
      'as may be updated',
      'as we may update',
      'as modified from time to time',
      'including future',
      'including any new',
      'including successor',
      'or any successor',
      'any future services',
      'any new features',
    ]
  },
];

/**
 * Analyze a single ToS for overlap risk patterns.
 * Returns which overlap patterns are present and how risky
 * the ToS is for the "Disney problem."
 */
function analyzeOverlap(text, productName) {
  const textLower = text.toLowerCase();

  const found = [];
  const notFound = [];

  for (const pattern of OVERLAP_PATTERNS) {
    let matched = false;
    let matchedTerm = '';

    for (const term of pattern.terms) {
      if (textLower.includes(term)) {
        matched = true;
        matchedTerm = term;
        break;
      }
    }

    if (matched) {
      const idx = textLower.indexOf(matchedTerm);
      const start = Math.max(0, idx - 80);
      const end = Math.min(text.length, idx + matchedTerm.length + 80);
      const evidence = text.substring(start, end).trim();

      found.push({
        ...pattern,
        terms: undefined, // don't send the full search term list to the client
        matched_term: matchedTerm,
        evidence,
      });
    } else {
      notFound.push({
        id: pattern.id,
        name: pattern.name,
        category: pattern.category,
        severity: pattern.severity,
        description: pattern.description,
      });
    }
  }

  // Score: high-severity = 10pts, warning = 5pts, out of max possible
  const maxScore = OVERLAP_PATTERNS.reduce((sum, p) => sum + (p.severity === 'high' ? 10 : 5), 0);
  const rawScore = found.reduce((sum, p) => sum + (p.severity === 'high' ? 10 : 5), 0);
  const overlapRisk = Math.round((rawScore / maxScore) * 100);

  let riskLevel;
  if (overlapRisk >= 60) riskLevel = 'high';
  else if (overlapRisk >= 30) riskLevel = 'medium';
  else riskLevel = 'low';

  return {
    product: productName || 'Unknown Product',
    overlap_patterns_found: found,
    overlap_patterns_safe: notFound,
    total_patterns: OVERLAP_PATTERNS.length,
    overlap_risk_score: overlapRisk,
    overlap_risk_level: riskLevel,
  };
}

/**
 * Compare two ToS documents from products under the same parent company.
 * Identifies shared overlap patterns — clauses present in BOTH that could
 * allow one product's ToS to reach into the other.
 */
function compareOverlap(tosA, tosB) {
  const analysisA = analyzeOverlap(tosA.text, tosA.name);
  const analysisB = analyzeOverlap(tosB.text, tosB.name);

  const foundIdsA = new Set(analysisA.overlap_patterns_found.map(p => p.id));
  const foundIdsB = new Set(analysisB.overlap_patterns_found.map(p => p.id));

  // Patterns present in BOTH products
  const sharedPatterns = analysisA.overlap_patterns_found
    .filter(p => foundIdsB.has(p.id))
    .map(pA => {
      const pB = analysisB.overlap_patterns_found.find(p => p.id === pA.id);
      return {
        id: pA.id,
        name: pA.name,
        category: pA.category,
        severity: pA.severity,
        description: pA.description,
        why_it_matters: pA.why_it_matters,
        evidence_a: { product: tosA.name, evidence: pA.evidence, matched_term: pA.matched_term },
        evidence_b: { product: tosB.name, evidence: pB.evidence, matched_term: pB.matched_term },
      };
    });

  // Only in A
  const onlyA = analysisA.overlap_patterns_found
    .filter(p => !foundIdsB.has(p.id))
    .map(p => ({ id: p.id, name: p.name, severity: p.severity, product: tosA.name }));

  // Only in B
  const onlyB = analysisB.overlap_patterns_found
    .filter(p => !foundIdsA.has(p.id))
    .map(p => ({ id: p.id, name: p.name, severity: p.severity, product: tosB.name }));

  // Combined danger score: shared high-severity patterns are worst
  const sharedHighCount = sharedPatterns.filter(p => p.severity === 'high').length;
  const sharedWarnCount = sharedPatterns.filter(p => p.severity === 'warning').length;
  const crossProductRisk = Math.min(100, Math.round(
    (sharedHighCount * 15 + sharedWarnCount * 8) * (100 / (OVERLAP_PATTERNS.length * 10))
  ));

  let crossRiskLevel;
  if (crossProductRisk >= 60) crossRiskLevel = 'high';
  else if (crossProductRisk >= 30) crossRiskLevel = 'medium';
  else crossRiskLevel = 'low';

  return {
    parent_company: tosA.parentCompany || tosB.parentCompany || null,
    products: [
      { name: tosA.name, overlap_risk: analysisA.overlap_risk_score, risk_level: analysisA.overlap_risk_level },
      { name: tosB.name, overlap_risk: analysisB.overlap_risk_score, risk_level: analysisB.overlap_risk_level },
    ],
    shared_patterns: sharedPatterns,
    only_in: { [tosA.name]: onlyA, [tosB.name]: onlyB },
    cross_product_risk_score: crossProductRisk,
    cross_product_risk_level: crossRiskLevel,
    disney_risk_summary: buildDisneySummary(sharedPatterns, tosA.name, tosB.name),
  };
}

/**
 * Build a plain-English summary of the "Disney risk" — can agreeing
 * to product A's ToS be used against you in a dispute involving product B?
 */
function buildDisneySummary(sharedPatterns, nameA, nameB) {
  const dangers = [];

  const has = id => sharedPatterns.some(p => p.id === id);

  if (has('blanket-arbitration') && has('umbrella-services')) {
    dangers.push(
      `CRITICAL: Both ${nameA} and ${nameB} have blanket arbitration clauses combined with umbrella service definitions. ` +
      `Agreeing to either product's ToS could force you into arbitration for disputes involving the other product.`
    );
  } else if (has('blanket-arbitration')) {
    dangers.push(
      `Both products have broadly-scoped arbitration clauses. The company could argue that agreeing to arbitration ` +
      `for ${nameA} also covers disputes arising from ${nameB}.`
    );
  }

  if (has('cross-reference')) {
    dangers.push(
      `Both products incorporate other agreements by reference. You may be bound by terms you never directly agreed to.`
    );
  }

  if (has('shared-identity')) {
    dangers.push(
      `Both products use a shared account system. Because it's one identity, the company can argue all ToS ` +
      `you've agreed to under that account are a single agreement.`
    );
  }

  if (has('survival-clauses') && has('blanket-arbitration')) {
    dangers.push(
      `Arbitration clauses in both products survive termination. Even canceling your account on one product ` +
      `may not release you from the arbitration agreement.`
    );
  }

  if (has('scope-expansion')) {
    dangers.push(
      `Both products reserve the right to expand their scope to cover future services. Your current agreement ` +
      `could be stretched to cover products that don't exist yet.`
    );
  }

  if (has('affiliate-data-pipeline')) {
    dangers.push(
      `Both products share data across the corporate family. Your data from ${nameA} is combined with ${nameB}, ` +
      `creating a unified profile the company uses across all subsidiaries.`
    );
  }

  if (dangers.length === 0) {
    return `Low cross-product risk detected between ${nameA} and ${nameB}. ` +
      `Few overlapping clauses that could be used to extend one product's terms to the other.`;
  }

  return dangers.join('\n\n');
}

module.exports = { analyzeOverlap, compareOverlap, OVERLAP_PATTERNS };
