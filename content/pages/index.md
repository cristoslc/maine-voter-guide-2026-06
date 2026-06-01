---
layout: home
title: "Voter Guide"
permalink: /
---

<div class="hero">
  <div class="date-badge">June 9, 2026</div>
  <h1>Maine Voter Guide</h1>
  <p>Nonpartisan information for the June 2026 State Primary Election. Select your city or town to see the races and ballot questions on your ballot.</p>
</div>

<div class="callout">
  <p><strong>You may only vote in ONE party's primary.</strong> Unenrolled voters can choose a Republican, Democratic, Green Independent, or Libertarian ballot. Enrolled voters receive their party's ballot.</p>
</div>

<div class="callout">
  <p><strong>AI research project — read with care.</strong> This guide was produced by an AI-assisted research project. It is a private work, not affiliated with the League of Women Voters, State of Maine, South Portland city government, or any other official organization. Information may contain errors, omissions, or unintended bias despite best efforts at factual accuracy. Always cross-check candidate positions and ballot question details with primary sources (campaign websites, <a href="https://www.vote411.org">VOTE411</a>, Maine Secretary of State) before voting.</p>
</div>

## Select Your City or Town

<div class="race-grid">
{% for j in jurisdictions %}
  <a href="{{ '/' | url }}{{ j.slug }}/" class="race-card">
    <span class="card-tag partisan">{{ j.name }}</span>
    <h2>{{ j.name }}</h2>
    <p class="card-sub">{{ j.county }} County</p>
  </a>
{% endfor %}
</div>

