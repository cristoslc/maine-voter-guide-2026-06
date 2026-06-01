---
layout: home
title: "Voter Guide"
permalink: /{{ jurisdiction.slug }}/
pagination:
  data: jurisdictions
  size: 1
  alias: jurisdiction
---

<div class="hero">
  <div class="date-badge">June 9, 2026</div>
  <h1>{{ jurisdiction.name }} Voter Guide</h1>
  <p>Nonpartisan information for the June 2026 State Primary Election. Candidate information, ballot questions, polling locations, and key dates.</p>
</div>

<div class="callout">
  <p><strong>Your jurisdiction:</strong> {{ jurisdiction.name }}{% if jurisdiction.county %}, {{ jurisdiction.county }} County{% endif %}. Not your city? <a href="{{ '/' | url }}">Choose a different jurisdiction →</a></p>
</div>

<div class="callout">
  <p><strong>AI research project — read with care.</strong> This guide was produced by an AI-assisted research project. It is a private work, not affiliated with the League of Women Voters, State of Maine, or any other official organization. Information may contain errors, omissions, or unintended bias. Always cross-check candidate positions and ballot question details with primary sources before voting.</p>
</div>

## Democratic Primary Ballot

<div class="race-grid">
{% for r in races %}
{% if r.jurisdiction == jurisdiction.slug and "democratic" in r.slug %}
  <a href="/{{ jurisdiction.slug }}/races/{{ r.slug }}/" class="race-card">
    <span class="card-tag partisan">{{ r.office }}</span>
    <h2>{{ r.title }}</h2>
    <p class="card-sub">{{ r.voting }}</p>
  </a>
{% endif %}
{% endfor %}
</div>

## Republican Primary Ballot

<div class="race-grid">
{% for r in races %}
{% if r.jurisdiction == jurisdiction.slug and "republican" in r.slug %}
  <a href="/{{ jurisdiction.slug }}/races/{{ r.slug }}/" class="race-card">
    <span class="card-tag partisan">{{ r.office }}</span>
    <h2>{{ r.title }}</h2>
    <p class="card-sub">{{ r.voting }}</p>
  </a>
{% endif %}
{% endfor %}
</div>

## All Voters

<div class="race-grid">
{% for r in races %}
{% if r.jurisdiction == jurisdiction.slug and "democratic" not in r.slug and "republican" not in r.slug %}
  <a href="/{{ jurisdiction.slug }}/races/{{ r.slug }}/" class="race-card">
    <span class="card-tag referendum">{{ r.office }}</span>
    <h2>{{ r.title }}</h2>
    <p class="card-sub">{{ r.voting }}</p>
  </a>
{% endif %}
{% endfor %}
{% for b in ballotQuestions %}
{% if b.jurisdiction == jurisdiction.slug %}
  <a href="{{ b.url }}" class="race-card">
    <span class="card-tag referendum">{{ b.office }}</span>
    <h2>{{ b.title }}</h2>
    <p class="card-sub">{{ b.voting }}</p>
  </a>
{% endif %}
{% endfor %}
</div>
