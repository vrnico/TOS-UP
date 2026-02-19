// Simple Markdown to HTML converter (no dependencies)
// Handles: headings, bold, italic, links, lists, blockquotes, code, hr, paragraphs
function renderMarkdown(md) {
  if (!md) return '';

  let html = md
    // Code blocks (must be before other rules)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 id="' + '$1' + '">$2</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Handle headings with IDs for TOC
  html = html.replace(/<h2 id="[^"]*">([^<]+)<\/h2>/g, (match, text) => {
    const id = slugify(text);
    return `<h2 id="${id}">${text}</h2>`;
  });

  // Process unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Process ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br>');

  // Wrap remaining plain lines in paragraphs
  const lines = html.split('\n');
  const result = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
    } else if (
      trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol') ||
      trimmed.startsWith('<li') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<pre') ||
      trimmed.startsWith('<hr') || trimmed.startsWith('<img') || trimmed.startsWith('</') ||
      trimmed.startsWith('<p')
    ) {
      result.push(trimmed);
    } else {
      result.push(`<p>${trimmed}</p>`);
    }
  }

  return result.join('\n');
}

// Extract headings for TOC
function extractHeadings(md) {
  if (!md) return [];
  const headings = [];
  const regex = /^## (.+)$/gm;
  let match;
  while ((match = regex.exec(md)) !== null) {
    headings.push({ text: match[1], id: slugify(match[1]) });
  }
  return headings;
}
