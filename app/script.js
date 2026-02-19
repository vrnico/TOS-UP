// ===== RED FLAGS DATABASE =====
// Each flag has a name, description, and search terms to look for
const redFlags = [
    {
        name: "Mandatory Arbitration",
        desc: "You waive your right to sue in court",
        terms: ["arbitration", "binding arbitration", "arbitrate"],
        severity: "high"
    },
    {
        name: "Class Action Waiver",
        desc: "You can't join group lawsuits against them",
        terms: ["class action", "class-action", "collective action", "representative action"],
        severity: "high"
    },
    {
        name: "Broad Data Sharing",
        desc: "Your data is shared with unnamed third parties",
        terms: ["third party", "third-party", "partners", "affiliates", "share your", "share information", "data sharing"],
        severity: "high"
    },
    {
        name: "Right to Modify Terms",
        desc: "They can change the agreement at any time",
        terms: ["modify these terms", "change these terms", "update these terms", "right to change", "right to modify", "revised terms", "discretion to change"],
        severity: "high"
    },
    {
        name: "Account Termination",
        desc: "They can delete your account at will",
        terms: ["terminate your account", "suspend your account", "right to terminate", "sole discretion", "without notice"],
        severity: "high"
    },
    {
        name: "Data Collection",
        desc: "They collect data beyond what's needed for the service",
        terms: ["collect information", "collect data", "usage data", "device information", "location data", "cookies", "tracking"],
        severity: "warning"
    },
    {
        name: "Liability Limitation",
        desc: "They limit how much they owe you if something goes wrong",
        terms: ["limitation of liability", "not liable", "no liability", "as is", "without warranty"],
        severity: "warning"
    }
];


// ===== OVERLAP PATTERNS =====
// Cross-product ToS overlap detection (inspired by Piccolo v. Disney, 2024)
const overlapPatterns = [
    {
        id: "umbrella-services",
        name: "Umbrella Service Definition",
        category: "Scope Creep",
        severity: "high",
        desc: "Defines \"Services\" broadly enough to cover the entire corporate family, not just this product",
        why: "This is how the Disney+ ToS was argued to cover a theme park death. If \"Services\" means everything the parent company offers, agreeing to one product binds you to all.",
        terms: ["all services provided by", "all of our services", "any of our services", "services offered by", "and its affiliates", "and its subsidiaries", "family of companies", "corporate family", "group companies", "related services", "associated services", "our services include", "suite of services", "our products and services", "across our services", "across our products"]
    },
    {
        id: "cross-reference",
        name: "Cross-Reference Incorporation",
        category: "Scope Creep",
        severity: "high",
        desc: "Incorporates other agreements by reference, binding you to terms you may not have read",
        why: "By agreeing to product A, you silently agree to master terms that also govern products B, C, and D.",
        terms: ["incorporate by reference", "incorporated by reference", "incorporated herein", "subject to our", "master agreement", "master terms", "general terms", "additional terms apply", "supplemental terms", "also agree to", "also subject to", "in addition to these terms", "applicable terms", "universal terms"]
    },
    {
        id: "blanket-arbitration",
        name: "Blanket Arbitration Clause",
        category: "Legal Rights",
        severity: "high",
        desc: "Arbitration clause scoped broadly enough to cover disputes beyond this specific product",
        why: "Disney argued a Disney+ free trial arbitration clause covered a wrongful death at a restaurant. If arbitration covers \"any dispute\" with the company, a free trial could waive your right to sue over anything.",
        terms: ["any dispute arising from", "any dispute between you and", "all claims arising", "any claims arising", "any controversy or claim", "any and all disputes", "disputes related to any", "any dispute or claim", "any legal dispute", "relating to any of our", "in connection with any"]
    },
    {
        id: "shared-identity",
        name: "Shared Account / Unified Identity",
        category: "Scope Creep",
        severity: "warning",
        desc: "Uses a single account system across multiple products, linking all ToS to one identity",
        why: "When one login governs multiple products, the company can argue that any ToS agreed to under that account applies to all interactions.",
        terms: ["single sign-on", "unified account", "linked accounts", "same credentials", "shared account", "one account", "your account across", "use across our", "your google account", "your apple id", "your microsoft account", "your amazon account", "your disney account", "your meta account"]
    },
    {
        id: "affiliate-data-pipeline",
        name: "Affiliate Data Pipeline",
        category: "Privacy",
        severity: "high",
        desc: "Shares your data across the entire corporate family, not just the product you signed up for",
        why: "When data flows between subsidiaries, the company builds a unified profile. Privacy failures of one product expose your data from all products.",
        terms: ["share with our affiliates", "share with our parent", "share with our subsidiaries", "share with our related", "across our family of", "among our affiliates", "within our corporate", "within our group", "combined with", "combine information", "amazon.com, inc", "alphabet inc", "meta platforms", "the walt disney company", "microsoft corporation", "apple inc"]
    },
    {
        id: "broad-user-definition",
        name: "Broad User Definition",
        category: "Scope Creep",
        severity: "warning",
        desc: "Defines \"user\" broadly to include household members, guests, or anyone using the account",
        why: "If \"you\" includes family members, one person agreeing to ToS can bind others who never consented \u2014 like the spouse in the Disney case.",
        terms: ["you and anyone who", "you or anyone using", "anyone who accesses", "anyone using your account", "household members", "family members", "authorized users", "on behalf of", "your use of or access to", "your access to and use of"]
    },
    {
        id: "survival-clauses",
        name: "Survival Beyond Termination",
        category: "Legal Rights",
        severity: "warning",
        desc: "Key clauses survive even after you stop using the product or delete your account",
        why: "Even if you cancel a free trial, the arbitration clause may still bind you years later.",
        terms: ["survives termination", "survive termination", "survive the expiration", "remains in effect", "remain in effect", "continue to apply", "shall survive", "will survive", "notwithstanding termination", "even after termination", "perpetual", "irrevocable"]
    },
    {
        id: "scope-expansion",
        name: "Unilateral Scope Expansion",
        category: "Scope Creep",
        severity: "high",
        desc: "Company can expand what \"Services\" means, retroactively pulling new products under existing ToS",
        why: "You agreed to ToS for product A. They launch product B and update \"Services\" to include it. Your original agreement now covers a product that didn't exist.",
        terms: ["now known or later developed", "now known or hereafter", "now or in the future", "as may be updated", "as we may update", "as modified from time to time", "including future", "including any new", "including successor", "or any successor", "any future services"]
    }
];


// ===== TAB SWITCHING =====
document.querySelectorAll(".tab").forEach(function(tab) {
    tab.addEventListener("click", function() {
        // Update tab buttons
        document.querySelectorAll(".tab").forEach(function(t) { t.classList.remove("active"); });
        tab.classList.add("active");

        // Update tab content
        document.querySelectorAll(".tab-content").forEach(function(tc) { tc.classList.remove("active"); });
        document.getElementById("tab-" + tab.dataset.tab).classList.add("active");

        // Clear results
        document.getElementById("results").innerHTML = "";
    });
});


// ===== MAIN ANALYSIS FUNCTION =====
function analyzeTOS() {
    let text = document.getElementById("tosInput").value;

    if (text.trim() === "") {
        document.getElementById("results").innerHTML = '<div class="no-input">Paste a Terms of Service above and click Analyze.</div>';
        return;
    }

    let wordCount = text.split(/\s+/).filter(function(w) { return w.length > 0; }).length;
    let sentenceCount = text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 0; }).length;
    let readTime = Math.ceil(wordCount / 238);

    let textLower = text.toLowerCase();
    let flagsFound = [];
    let flagsSafe = [];

    for (let i = 0; i < redFlags.length; i++) {
        let flag = redFlags[i];
        let found = false;

        for (let j = 0; j < flag.terms.length; j++) {
            if (textLower.includes(flag.terms[j])) {
                found = true;
                break;
            }
        }

        if (found) {
            flagsFound.push(flag);
        } else {
            flagsSafe.push(flag);
        }
    }

    let highRiskCount = flagsFound.filter(function(f) { return f.severity === "high"; }).length;
    let riskLevel;
    let riskLabel;
    if (highRiskCount >= 3) {
        riskLevel = "high";
        riskLabel = "HIGH RISK";
    } else if (highRiskCount >= 1) {
        riskLevel = "medium";
        riskLabel = "MEDIUM RISK";
    } else {
        riskLevel = "low";
        riskLabel = "LOW RISK";
    }

    let html = "";

    html += '<div class="stats">';
    html += '<div class="stat-card"><div class="number">' + wordCount.toLocaleString() + '</div><div class="label">words</div></div>';
    html += '<div class="stat-card"><div class="number">' + sentenceCount + '</div><div class="label">sentences</div></div>';
    html += '<div class="stat-card"><div class="number">' + readTime + ' min</div><div class="label">read time</div></div>';
    html += '<div class="stat-card"><div class="number">' + flagsFound.length + '</div><div class="label">flags found</div></div>';
    html += '</div>';

    html += '<div class="summary-section">';
    html += '<h2>Risk Assessment</h2>';
    html += '<div class="risk-score ' + riskLevel + '">' + riskLabel + '</div>';
    html += '<p>' + flagsFound.length + ' of ' + redFlags.length + ' red flags detected in this agreement.</p>';
    html += '</div>';

    if (flagsFound.length > 0) {
        html += '<div class="flags-section" style="margin-top: 24px;">';
        html += '<h2>Red Flags Found</h2>';
        for (let i = 0; i < flagsFound.length; i++) {
            let f = flagsFound[i];
            let sevClass = f.severity === "high" ? "" : " warning";
            html += '<div class="flag' + sevClass + '">';
            html += '<div class="flag-name">' + f.name + '</div>';
            html += '<div class="flag-desc">' + f.desc + '</div>';
            html += '<span class="flag-status found">FOUND</span>';
            html += '</div>';
        }
        html += '</div>';
    }

    if (flagsSafe.length > 0) {
        html += '<div class="flags-section" style="margin-top: 24px;">';
        html += '<h2 style="color: #51cf66;">Not Detected</h2>';
        for (let i = 0; i < flagsSafe.length; i++) {
            let f = flagsSafe[i];
            html += '<div class="flag" style="border-left-color: #51cf66;">';
            html += '<div class="flag-name">' + f.name + '</div>';
            html += '<div class="flag-desc">' + f.desc + '</div>';
            html += '<span class="flag-status safe">NOT FOUND</span>';
            html += '</div>';
        }
        html += '</div>';
    }

    document.getElementById("results").innerHTML = html;
}


// ===== OVERLAP ANALYSIS =====
function escapeHtml(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function scanPatterns(text) {
    let textLower = text.toLowerCase();
    let found = [];

    for (let i = 0; i < overlapPatterns.length; i++) {
        let pattern = overlapPatterns[i];
        let matched = false;
        let matchedTerm = "";

        for (let j = 0; j < pattern.terms.length; j++) {
            if (textLower.includes(pattern.terms[j])) {
                matched = true;
                matchedTerm = pattern.terms[j];
                break;
            }
        }

        if (matched) {
            // Extract evidence context
            let idx = textLower.indexOf(matchedTerm);
            let start = Math.max(0, idx - 80);
            let end = Math.min(text.length, idx + matchedTerm.length + 80);
            let evidence = text.substring(start, end).trim();

            found.push({
                id: pattern.id,
                name: pattern.name,
                category: pattern.category,
                severity: pattern.severity,
                desc: pattern.desc,
                why: pattern.why,
                matchedTerm: matchedTerm,
                evidence: evidence
            });
        }
    }

    return found;
}

function highlightMatch(evidence, term) {
    let idx = evidence.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) return escapeHtml(evidence);

    let before = escapeHtml(evidence.substring(0, idx));
    let match = escapeHtml(evidence.substring(idx, idx + term.length));
    let after = escapeHtml(evidence.substring(idx + term.length));
    return '...' + before + '<span class="ev-match">' + match + '</span>' + after + '...';
}

function analyzeOverlap() {
    let textA = document.getElementById("overlapInputA").value;
    let textB = document.getElementById("overlapInputB").value;
    let nameA = document.getElementById("overlapNameA").value || "Product A";
    let nameB = document.getElementById("overlapNameB").value || "Product B";
    let parent = document.getElementById("parentCompany").value || "";

    if (textA.trim() === "" || textB.trim() === "") {
        document.getElementById("results").innerHTML = '<div class="no-input">Paste both Terms of Service documents to check for overlap.</div>';
        return;
    }

    let foundA = scanPatterns(textA);
    let foundB = scanPatterns(textB);

    let idsA = {};
    for (let i = 0; i < foundA.length; i++) idsA[foundA[i].id] = foundA[i];
    let idsB = {};
    for (let i = 0; i < foundB.length; i++) idsB[foundB[i].id] = foundB[i];

    // Shared patterns (present in BOTH)
    let shared = [];
    for (let i = 0; i < foundA.length; i++) {
        if (idsB[foundA[i].id]) {
            shared.push({
                pattern: foundA[i],
                evidenceA: foundA[i],
                evidenceB: idsB[foundA[i].id]
            });
        }
    }

    // Only in one
    let onlyA = foundA.filter(function(p) { return !idsB[p.id]; });
    let onlyB = foundB.filter(function(p) { return !idsA[p.id]; });

    // Scores
    let scoreA = calcOverlapScore(foundA);
    let scoreB = calcOverlapScore(foundB);

    let sharedHigh = shared.filter(function(s) { return s.pattern.severity === "high"; }).length;
    let sharedWarn = shared.filter(function(s) { return s.pattern.severity === "warning"; }).length;
    let crossScore = Math.min(100, Math.round((sharedHigh * 15 + sharedWarn * 8) * (100 / (overlapPatterns.length * 10))));

    let crossLevel;
    if (crossScore >= 60) crossLevel = "high";
    else if (crossScore >= 30) crossLevel = "medium";
    else crossLevel = "low";

    // Build HTML
    let html = "";

    // Product scores header
    html += '<div class="overlap-header">';
    html += '<div class="overlap-product"><div class="product-name">' + escapeHtml(nameA) + '</div>';
    html += '<div class="product-score ' + scoreA.level + '">' + scoreA.score + '%</div>';
    html += '<div class="label">' + foundA.length + '/' + overlapPatterns.length + ' overlap patterns</div></div>';
    html += '<div class="overlap-product"><div class="product-name">' + escapeHtml(nameB) + '</div>';
    html += '<div class="product-score ' + scoreB.level + '">' + scoreB.score + '%</div>';
    html += '<div class="label">' + foundB.length + '/' + overlapPatterns.length + ' overlap patterns</div></div>';
    html += '</div>';

    // Cross-product risk
    html += '<div class="cross-risk">';
    html += '<h2>Cross-Product Risk' + (parent ? ' \u2014 ' + escapeHtml(parent) : '') + '</h2>';
    html += '<div class="score ' + crossLevel + '">' + crossScore + '% \u2014 ';
    if (crossLevel === "high") html += "HIGH RISK";
    else if (crossLevel === "medium") html += "MEDIUM RISK";
    else html += "LOW RISK";
    html += '</div>';
    html += '<p>' + shared.length + ' overlap patterns found in BOTH products. ';
    if (shared.length > 0) {
        html += 'Agreeing to ' + escapeHtml(nameA) + '\'s ToS may expose you to clauses in ' + escapeHtml(nameB) + '\'s ToS.';
    } else {
        html += 'Low cross-contamination risk between these two products.';
    }
    html += '</p></div>';

    // Disney summary
    let summary = buildSummary(shared, nameA, nameB);
    if (summary) {
        html += '<div class="disney-summary">' + escapeHtml(summary) + '</div>';
    }

    // Shared patterns (the dangerous ones)
    if (shared.length > 0) {
        html += '<div class="flags-section" style="margin-top: 24px;">';
        html += '<h2>Shared Overlap Patterns</h2>';
        for (let i = 0; i < shared.length; i++) {
            let s = shared[i];
            let sevClass = s.pattern.severity === "high" ? "" : " warning";
            html += '<div class="shared-pattern' + sevClass + '">';
            html += '<div class="pattern-name">' + escapeHtml(s.pattern.name) + ' <span class="flag-status found">' + s.pattern.severity.toUpperCase() + '</span></div>';
            html += '<div class="pattern-desc">' + escapeHtml(s.pattern.desc) + '</div>';
            html += '<div class="pattern-why">' + escapeHtml(s.pattern.why) + '</div>';

            html += '<div class="evidence-pair">';
            html += '<div class="evidence-box"><div class="ev-label">' + escapeHtml(nameA) + '</div>' + highlightMatch(s.evidenceA.evidence, s.evidenceA.matchedTerm) + '</div>';
            html += '<div class="evidence-box"><div class="ev-label">' + escapeHtml(nameB) + '</div>' + highlightMatch(s.evidenceB.evidence, s.evidenceB.matchedTerm) + '</div>';
            html += '</div>';

            html += '</div>';
        }
        html += '</div>';
    }

    // Only in one product
    if (onlyA.length > 0 || onlyB.length > 0) {
        html += '<div class="flags-section" style="margin-top: 24px;">';
        html += '<h2 style="color: #ffd43b;">Patterns in Only One Product</h2>';

        for (let i = 0; i < onlyA.length; i++) {
            html += '<div class="flag warning">';
            html += '<div class="flag-name">' + escapeHtml(onlyA[i].name) + '</div>';
            html += '<div class="flag-desc">Found only in ' + escapeHtml(nameA) + '</div>';
            html += '</div>';
        }
        for (let i = 0; i < onlyB.length; i++) {
            html += '<div class="flag warning">';
            html += '<div class="flag-name">' + escapeHtml(onlyB[i].name) + '</div>';
            html += '<div class="flag-desc">Found only in ' + escapeHtml(nameB) + '</div>';
            html += '</div>';
        }
        html += '</div>';
    }

    // Patterns not found in either
    let allFoundIds = {};
    for (let i = 0; i < foundA.length; i++) allFoundIds[foundA[i].id] = true;
    for (let i = 0; i < foundB.length; i++) allFoundIds[foundB[i].id] = true;
    let neitherFound = overlapPatterns.filter(function(p) { return !allFoundIds[p.id]; });

    if (neitherFound.length > 0) {
        html += '<div class="flags-section" style="margin-top: 24px;">';
        html += '<h2 style="color: #51cf66;">Not Detected in Either</h2>';
        for (let i = 0; i < neitherFound.length; i++) {
            html += '<div class="flag" style="border-left-color: #51cf66;">';
            html += '<div class="flag-name">' + escapeHtml(neitherFound[i].name) + '</div>';
            html += '<div class="flag-desc">' + escapeHtml(neitherFound[i].desc) + '</div>';
            html += '<span class="flag-status safe">NOT FOUND</span>';
            html += '</div>';
        }
        html += '</div>';
    }

    document.getElementById("results").innerHTML = html;
}

function calcOverlapScore(found) {
    let maxScore = 0;
    let rawScore = 0;
    for (let i = 0; i < overlapPatterns.length; i++) {
        maxScore += overlapPatterns[i].severity === "high" ? 10 : 5;
    }
    for (let i = 0; i < found.length; i++) {
        rawScore += found[i].severity === "high" ? 10 : 5;
    }
    let score = Math.round((rawScore / maxScore) * 100);
    let level;
    if (score >= 60) level = "high";
    else if (score >= 30) level = "medium";
    else level = "low";
    return { score: score, level: level };
}

function buildSummary(shared, nameA, nameB) {
    let dangers = [];
    let hasId = function(id) {
        return shared.some(function(s) { return s.pattern.id === id; });
    };

    if (hasId("blanket-arbitration") && hasId("umbrella-services")) {
        dangers.push(
            "CRITICAL: Both " + nameA + " and " + nameB + " have blanket arbitration clauses combined with umbrella service definitions. " +
            "Agreeing to either product's ToS could force you into arbitration for disputes involving the other product."
        );
    } else if (hasId("blanket-arbitration")) {
        dangers.push(
            "Both products have broadly-scoped arbitration clauses. The company could argue that agreeing to arbitration " +
            "for " + nameA + " also covers disputes arising from " + nameB + "."
        );
    }

    if (hasId("cross-reference")) {
        dangers.push("Both products incorporate other agreements by reference. You may be bound by terms you never directly agreed to.");
    }

    if (hasId("shared-identity")) {
        dangers.push(
            "Both products use a shared account system. Because it's one identity, the company can argue all ToS " +
            "you've agreed to under that account are a single agreement."
        );
    }

    if (hasId("survival-clauses") && hasId("blanket-arbitration")) {
        dangers.push(
            "Arbitration clauses in both products survive termination. Even canceling your account on one product " +
            "may not release you from the arbitration agreement."
        );
    }

    if (hasId("scope-expansion")) {
        dangers.push(
            "Both products reserve the right to expand their scope to cover future services. Your current agreement " +
            "could be stretched to cover products that don't exist yet."
        );
    }

    if (hasId("affiliate-data-pipeline")) {
        dangers.push(
            "Both products share data across the corporate family. Your data from " + nameA + " is combined with " + nameB + ", " +
            "creating a unified profile used across all subsidiaries."
        );
    }

    if (dangers.length === 0) return "";
    return dangers.join("\n\n");
}


// ===== WIRE UP BUTTONS =====
document.getElementById("analyzeBtn").addEventListener("click", analyzeTOS);
document.getElementById("overlapBtn").addEventListener("click", analyzeOverlap);
