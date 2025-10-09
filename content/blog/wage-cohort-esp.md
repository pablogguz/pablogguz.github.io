+++
title = "No country for young men: wage trajectories by birth cohort in Spain"
date = 2025-10-09
draft = true

[taxonomies]
tags = ["wages", "spain", "cohorts", "labour market"]

[extra]
lang = "en"
toc = true
comment = true
copy = true
math = true
mermaid = false
outdate_alert = true
outdate_alert_days = 120
display_tags = true
truncate_summary = false
featured = false
cover_image = "https://pablogguz.github.io/img/bull.png"
reading_time = 10
+++

<img src="/img/nocountry.png" width="500"/>
<br>

# Introduction

This post is a short methodological note explaining how I made [this chart](twitter link). 

# Data

I use the following datasets, all publicly available:

**[Structure of Earnings Survey (2002-2023)](https://www.ine.es/jaxiT3/Tabla.htm?t=28189&L=0)**: Estimates of average annual gross wages by age group and sex. My analysis includes the annual surveys from 2004-07 and 2008-23, as well as the quadrennial survey from 2002. Ages are reported in five-year bands (20-24, 25-29, ..., 55-59). These surveys are conducted by Spain's National Statistical Office (hereafter INE) and cover XXX, excluding XXX. My analysis includes the annual surveys from 2004-07 and 2008-23, as well as the quadrennial survey from 2002. Ages are reported in five-year bands (20-24, 25-29, ..., 55-59).

**[Eurostat National Accounts (nama_10_gdp)](https://ec.europa.eu/eurostat/web/main/data/database)**: I use the household final consumption expenditure deflator (P31_S14_S15) to convert all wages to constant 2023 EUR.

# Methodology

Data on wages is made available for five-year age bands, so the first step is to expand these five-year averags into single-year estimates while preserving the original means within each band. One way to do this is through a **Lexis expansion**. 

## A lexis expansion with monotonic splines

In demography, a **Lexis diagram** is a graphical tool that represents demographic data across two dimensions: age (on the vertical axis) and time (on the horizontal axis). Diagonal lines in this diagram represent birth cohorts (i.e., groups of people born in the same year) as they age over time.

A **Lexis expansion** refers to the process of disaggregating data from coarser categories (like five-year age bands) into finer single-year units while maintaining consistency with the original aggregated data. The name comes from the fact that you're "expanding" the cells of a Lexis diagram from large blocks into smaller, more granular cells.

Specifically, for each calendar year $t$ and sex $s$, I proceed as follows:

1. **Interpolate in log wages.** Take the eight five-year bands $b\in \\{ \text{20–24},\dots,\text{55–59} \\}$ and place them at their midpoints $m_b\in\\{22,27,\dots,57\\}$. Fit a monotone cubic spline to $\log \bar w_{y,b,s}$ over $m_b$, and predict $\tilde w_{y,a,s}$ for every integer age $a\in[20,59]$. Working in logs enforces positivity and yields smooth, concave profiles. The monotonic constraint ensures that if wages increase with age in the observed bands, they also increase smoothly in the interpolated single-year values, preventing the spline from introducing spurious extrema peaks or that aren't in the underlying data.

2. **Ratio-adjust within each band to preserve published means.** For each band $b$ with age set $A_b$ (e.g., $A_{\text{20–24}}={20,21...,24}$), compute

   $$
   r_{y,b,s} = \frac{\bar w_{y,b,s}}{\frac{1}{|A_b|}\sum_{a\in A_b}\tilde w_{y,a,s}}.
   $$

Rescale ages inside the band:
   $$
   \hat w_{y,a,s} = r_{y,b,s}\times \tilde w_{y,a,s}\quad\text{for } a\in A_b.
   $$
   By construction,
   $$
   \frac{1}{|A_b|}\sum_{a\in A_b}\hat w_{y,a,s} = \bar w_{y,b,s}
   $$
   for every band $b$. This step “rakes” the interpolated curve so that the **band averages match the official INE means exactly**.


### Cohorts and indexing

With single-year ages, cohorts are straightforward:

$$c = t - a$$

I group individual cohorts into decades (1950s, 1960s, etc.). For each cohort decade $d$, the average wage at age $a$ is just:

$$\bar{w}(a, d) = \frac{1}{|C_d|} \sum_{c \in C_d} w^{Lexis}(c, a)$$

To make the chart easier to read, I index everything relative to the 1960s cohort at age 40 separately by sex. That is, an index of 80 at age 30 means that the cohort earns 80% of what the 1960s cohort earned at age 40.

I only include cohorts observed in at least two survey years and focus on ages 20-59.

## Results

## Conclusion
