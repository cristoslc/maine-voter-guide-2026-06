#!/bin/bash
set -e

echo "=== Opening browser ==="
playwright-cli open 2>/dev/null
sleep 2

echo "=== Navigating to VOTE411 ==="
playwright-cli goto "https://www.vote411.org/ballot" 2>/dev/null
sleep 5

echo "=== Clicking All Candidates ==="
playwright-cli eval '
var btns = document.querySelectorAll("button");
for (var b of btns) { if (b.textContent.trim() === "All Candidates") { b.scrollIntoView({block:"center"}); b.click(); return "ok"; } }
return "not found";
' 2>/dev/null
sleep 4

echo "=== Clicking Maine ==="
playwright-cli eval '
var btns = document.querySelectorAll("button");
for (var b of btns) { if (b.textContent.includes("Maine View Candidates")) { b.scrollIntoView({block:"center"}); b.click(); return "ok"; } }
return "not found";
' 2>/dev/null
sleep 5

echo "=== Loaded ==="
playwright-cli eval 'return document.querySelectorAll("button").length;' 2>/dev/null

for name in "Carney" "Maietta" "Shedlock" "Dougherty" "Matthew Beck" "Robert Cameron" "Meagan Smith"; do
  echo ""
  echo "=== $name ==="
  
  playwright-cli eval "
    var input = document.querySelector('input');
    if (input) {
      input.focus();
      var setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, '$name');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  " 2>/dev/null
  sleep 3

  playwright-cli eval "
    var btns = document.querySelectorAll('button');
    for (var b of btns) {
      if (b.textContent.includes('$name')) {
        b.scrollIntoView({block:'center'});
        b.click();
        return 'ok';
      }
    }
    return 'not found';
  " 2>/dev/null
  sleep 4

  playwright-cli eval '
    var all = document.querySelectorAll("span, label, div, button");
    for (var e of all) {
      if (e.textContent.trim() === "View Answers") { e.click(); }
      if (e.textContent.includes("General Information") && e.tagName === "BUTTON") { e.click(); }
    }
  ' 2>/dev/null
  sleep 3

  echo "---ANSWERS---"
  playwright-cli eval '
    var b = document.body.innerText;
    var i = b.indexOf("Candidate Answers");
    if (i >= 0) return b.substring(i, i + 2000);
    i = b.indexOf("has not yet responded");
    if (i >= 0) return "NO RESPONSE: " + b.substring(Math.max(0,i-40), i+60);
    return "OTHER: " + b.substring(0, 500);
  ' 2>/dev/null

  playwright-cli eval '
    var btns = document.querySelectorAll("button");
    for (var b of btns) { if (b.textContent.includes("Back to candidates")) { b.click(); return "ok"; } }
    history.back(); return "fallback";
  ' 2>/dev/null
  sleep 3
done

echo ""
echo "=== DONE ==="
playwright-cli close 2>/dev/null