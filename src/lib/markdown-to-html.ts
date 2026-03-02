import { escapeHtml } from "@/lib/sanitize";

/**
 * Lightweight markdown-to-HTML converter for proposal content.
 * Handles the subset of markdown used by the proposal generator:
 * headings, bold, bullet lists, numbered lists, paragraphs, tables, hr.
 * Zero external dependencies.
 */
export function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | "" = "";
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Close list if this line is not a list item
    if (inList && !isListItem(line) && line.trim() !== "") {
      html.push(listType === "ul" ? "</ul>" : "</ol>");
      inList = false;
      listType = "";
    }

    // Close table if this line is not a table row
    if (inTable && !line.trim().startsWith("|")) {
      html.push("</table>");
      inTable = false;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line.trim())) {
      html.push("<hr>");
      continue;
    }

    // Headings
    if (line.startsWith("#### ")) {
      html.push(`<h4>${formatInline(escapeHtml(line.slice(5).trim()))}</h4>`);
      continue;
    }
    if (line.startsWith("### ")) {
      html.push(`<h3>${formatInline(escapeHtml(line.slice(4).trim()))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      html.push(`<h2>${formatInline(escapeHtml(line.slice(3).trim()))}</h2>`);
      continue;
    }

    // Table row
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      // Skip separator rows (| --- | --- |)
      if (/^\|[\s\-:|]+\|$/.test(line.trim())) {
        continue;
      }

      if (!inTable) {
        html.push('<table role="presentation">');
        inTable = true;
      }

      const cells = line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      const tag = !inTable || html[html.length - 1] === '<table role="presentation">' ? "th" : "td";
      html.push(
        `<tr>${cells.map((c) => `<${tag}>${formatInline(escapeHtml(c))}</${tag}>`).join("")}</tr>`
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line.trim())) {
      if (!inList || listType !== "ul") {
        if (inList) html.push(listType === "ul" ? "</ul>" : "</ol>");
        html.push("<ul>");
        inList = true;
        listType = "ul";
      }
      const content = line.trim().replace(/^[-*]\s/, "");
      html.push(`<li>${formatInline(escapeHtml(content))}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      if (!inList || listType !== "ol") {
        if (inList) html.push(listType === "ul" ? "</ul>" : "</ol>");
        html.push("<ol>");
        inList = true;
        listType = "ol";
      }
      const content = line.trim().replace(/^\d+\.\s/, "");
      html.push(`<li>${formatInline(escapeHtml(content))}</li>`);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Paragraph (italic block)
    if (line.trim().startsWith("*") && line.trim().endsWith("*") && !line.trim().startsWith("**")) {
      html.push(`<p><em>${escapeHtml(line.trim().slice(1, -1))}</em></p>`);
      continue;
    }

    // Regular paragraph
    html.push(`<p>${formatInline(escapeHtml(line.trim()))}</p>`);
  }

  // Close any open tags
  if (inList) {
    html.push(listType === "ul" ? "</ul>" : "</ol>");
  }
  if (inTable) {
    html.push("</table>");
  }

  return html.join("\n");
}

function isListItem(line: string): boolean {
  const trimmed = line.trim();
  return /^[-*]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
}

function formatInline(text: string): string {
  // Bold: **text** → <strong>text</strong>
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
