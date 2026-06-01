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
