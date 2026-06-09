---
layout: home
title: "Voter Guide"
permalink: /{{ jurisdiction.slug }}/
pagination:
  data: jurisdictions
  size: 1
  alias: jurisdiction
---

{% set effJurIds = jurisdiction.id | effectiveJurisdictionIds(geography, jurisdictions) %}
{% set effRaces = races | filterByJurisdictions(jurisdiction.id, geography, jurisdictions) %}
{% set effBallots = ballotQuestions | filterBallotQuestionsByJurisdictions(effJurIds) %}

<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="{{ '/' | url }}">Home</a> &rsaquo; {{ jurisdiction.name }}
</nav>

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

<h2 class="section-democratic">Democratic Primary Ballot</h2>

<div class="race-grid">
{% for r in effRaces %}
{% if "democratic" in r.slug %}
  {% set contested = r.party and r.party.candidates and (r.party.candidates | length) > 1 %}
  <a href="/{{ r.jurisdiction }}/races/{{ r.slug }}/" class="race-card">
    <span class="card-tag partisan">{{ r.office }}</span>
    <span class="card-tag {% if contested %}contested{% else %}uncontested{% endif %}">{% if contested %}Contested{% else %}Uncontested{% endif %}</span>
    <h2>{{ r.title }}</h2>
    <p class="card-sub">{{ r.voting }}</p>
  </a>
{% endif %}
{% endfor %}
</div>

<h2 class="section-republican">Republican Primary Ballot</h2>

<div class="race-grid">
{% for r in effRaces %}
{% if "republican" in r.slug %}
  {% set contested = r.party and r.party.candidates and (r.party.candidates | length) > 1 %}
  <a href="/{{ r.jurisdiction }}/races/{{ r.slug }}/" class="race-card">
    <span class="card-tag partisan">{{ r.office }}</span>
    <span class="card-tag {% if contested %}contested{% else %}uncontested{% endif %}">{% if contested %}Contested{% else %}Uncontested{% endif %}</span>
    <h2>{{ r.title }}</h2>
    <p class="card-sub">{{ r.voting }}</p>
  </a>
{% endif %}
{% endfor %}
</div>

<h2 class="section-all-voters">All Voters</h2>

<div class="race-grid">
{% for r in effRaces %}
{% if "democratic" not in r.slug and "republican" not in r.slug %}
  <a href="/{{ r.jurisdiction }}/races/{{ r.slug }}/" class="race-card">
    <span class="card-tag referendum">{{ r.office }}</span>
    <h2>{{ r.title }}</h2>
    <p class="card-sub">{{ r.voting }}</p>
  </a>
{% endif %}
{% endfor %}
{% for b in effBallots %}
  <a href="{{ b.url }}" class="race-card">
    <span class="card-tag referendum">{{ b.office }}</span>
    <h2>{{ b.title }}</h2>
    <p class="card-sub">{{ b.voting }}</p>
  </a>
{% endfor %}
</div>
