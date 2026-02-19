const express = require('express');
const router = express.Router();
const path = require('path');

// Load scoring data at startup
const rawData = require(path.join(__dirname, '..', '..', 'scores-all-platforms.json'));

const THEMES = {
  'Your Content': ['content_license_scope', 'ai_ml_training', 'content_removal_power', 'post_deletion_survival'],
  'Your Account': ['account_termination', 'dispute_resolution', 'terms_change_process', 'liability_indemnification'],
  'Your Data': ['data_collection_breadth', 'third_party_sharing', 'tracking_advertising', 'data_retention_deletion'],
  'Transparency': ['readability_honesty', 'encryption_security'],
  'Creator Economics': ['creator_monetization'],
  'Queer Safety': ['sensitive_data_handling', 'real_name_requirements', 'law_enforcement_transparency', 'content_moderation_equity', 'anti_harassment_protections', 'cross_border_safety'],
};

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const CATEGORY_LABELS = {
  content_license_scope: 'Content License Scope',
  ai_ml_training: 'AI/ML Training',
  content_removal_power: 'Content Removal Power',
  post_deletion_survival: 'Post-Deletion Survival',
  account_termination: 'Account Termination',
  dispute_resolution: 'Dispute Resolution',
  terms_change_process: 'Terms Change Process',
  liability_indemnification: 'Liability & Indemnification',
  data_collection_breadth: 'Data Collection Breadth',
  third_party_sharing: 'Third-Party Sharing',
  tracking_advertising: 'Tracking & Advertising',
  data_retention_deletion: 'Data Retention & Deletion',
  readability_honesty: 'Readability & Honesty',
  encryption_security: 'Encryption & Security',
  creator_monetization: 'Creator Monetization',
  sensitive_data_handling: 'Sensitive Identity Data Handling',
  real_name_requirements: 'Real Name / ID Requirements',
  law_enforcement_transparency: 'Law Enforcement Transparency',
  content_moderation_equity: 'Content Moderation Equity',
  anti_harassment_protections: 'Anti-Harassment Protections',
  cross_border_safety: 'Cross-Border Data Safety',
};

function enrichPlatform(entry) {
  const scores = entry.scores;
  const categoryKeys = Object.keys(scores);

  // Compute average score excluding nulls
  let sum = 0;
  let count = 0;
  let gapCount = 0;

  for (const key of categoryKeys) {
    const cat = scores[key];
    if (cat.score !== null) {
      sum += cat.score;
      count++;
    }
    if (cat.gap_flag) {
      gapCount++;
    }
  }

  const avgScore = count > 0 ? sum / count : 0;
  // TOS-Up Score: ((avg - 1) / 4) * 100, clamped to 0-100
  const tosupScore = count > 0 ? Math.round(((avgScore - 1) / 4) * 100) : 0;

  return {
    platform: entry.platform,
    slug: slugify(entry.platform),
    type: entry.type,
    tosup_score: Math.max(0, Math.min(100, tosupScore)),
    avg_score: Math.round(avgScore * 10) / 10,
    gap_count: gapCount,
    scores: entry.scores,
  };
}

// Pre-compute enriched data
const platforms = rawData.map(enrichPlatform).sort((a, b) => b.tosup_score - a.tosup_score);

// GET /api/scorecard
router.get('/', (req, res) => {
  res.json({
    platforms,
    themes: THEMES,
    category_labels: CATEGORY_LABELS,
  });
});

module.exports = router;
