+++
title = "A tale of regional development in Spain"
date = 2024-08-11
draft = true

[taxonomies]
tags = ["spain", "regional development", "convergence", "economic growth"]

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
cover_image = "https://pablogguz.github.io/img/dalle_vscode_stata_v2.webp"
reading_time = 2
+++

# Data

The ARDECO database is a product maintained by the European Commission's Joint Research Centre. This dataset provides information on a wide range of economic indicators at sub-national level (NUTS2, NUTS3, and metro regions) for EU and EFTA regions, as well as for some candidate countries. You can find the data [here](https://urban.jrc.ec.europa.eu/ardeco/explorer?lng=en). Unless stated otherwise, the GDP per capita figures used in this post are expressed in constant 2015 EUR.

# Some descriptives 

# $\beta$- and $\sigma$-convergence in Spain

The classical literature on economic growth distinguishes between $\beta$- and $\sigma$-convergence. The former reflects whether poorer countries or regions tend to grow faster than richer ones, and can be interpreted as the rate at which the income levels across geographies converge over time. The latter, on the other hand, assesses whether the dispersion of income levels across countries or regions tend to decrease over time.

Intuitively, $\beta$-convergence is a necessary condition for $\sigma$-convergence to hold. In other words, if inequality in income levels across regions is decreasing over time, then it must be the case that poorer regions are catching up with richer ones.[^1] 

The canonical (unconditional) $\beta$-convergence regression is given by the following equation:

$$
\frac{1}{T}\Delta log(y_{it}) = \alpha + \beta log(y_{it-1}) + \epsilon_{it}
$$

where $\Delta y_{it}$ is an approximation for the cumulative income growth rate in region $i$ between time $t$ and $t-1$, and $y_{it-1}$ denotes the income level at baseline in region $i$. The coefficient $\beta$ is the parameter of interest, and it measures the speed at which income levels converge (if negative) or diverge (if positive) across regions. 

If we gather data on sub-national GDP per capita levels for the period 1980-2023 and fit the regression above across Spanish NUTS3 regions, we obtain a (statistically significant) $\beta$-convergence coefficient of -0.0131. This implies that, on average, the income levels across Spanish regions converged at a rate of 1.31% per year over the period of study (see <a href="#fig1">Figure 1</a>). With this rate of convergence, it would take approximately 53 years to close half the income gap between regions in Spain.[^2]

<br>
<figure id="fig1">
  <figcaption>Figure 1</figcaption>
  <img src="/img/convergence.png" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<br>

<!-- Ok, technical stop. What the heck is going on in Lanzarote and Fuerteventura? I had no idea they were so (relatively) rich in 1980. Let's assume that the data is correct and move on. -->

Is a 1.31% annual convergence rate good or bad? To put things into perspective, I ran the same analysis for all countries with i) available data since 1980, and ii) at least 15 NUTS3 regions. The results are shown in <a href="#fig2">Figure 2</a>. As you can see, turns out that Spanish regions are converging at a faster pace than the average country in the sample.[^3]


<br>
<figure id="fig2">
  <figcaption>Figure 2</figcaption>
  <img src="/img/convergence_ctries.png" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<br>

What about $\sigma$-convergence? We can compute a measure of dispersion by looking at the standard deviation of the log of GDP per capita across regions. In <a href="#fig3">Figure 3</a>, I plot the evolution of this measure over time.

As you can see, the dispersion in income levels across Spanish regions has decreased significantly since 1980, consistent with the $\beta$-convergence results. 

<!-- If we transform the standard deviation into a coefficient of variation (the ratio of the standard deviation to the mean), we find that the coefficient of variation has decreased from 0.33 in 1980 to 0.21 in 2023. This suggests that the dispersion of income levels across Spanish regions has decreased by approximately 36% over the period of study. -->

<br>
<figure id="fig3">
  <figcaption>Figure 3</figcaption>
  <img src="/img/sigma.png" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<br>

# Decomposing economic growth in Spain



-----------------------------------------------------------------

[^1]: This is not a sufficient condition, however. Economies are subject to random shocks (i.e., unexpected events like natural disasters, policy changes, or financial crises) that can couse some regions to grow faster or slower, regardless of their initial income levels. These shocks can counteract the convergence process, leading to an steady state where dispersion of income levels increases. See [Barro and Sala-i-Martin (1992)](https://www.jstor.org/stable/2138606).

[^2]: The formula to calculate the time it takes to close half the gap between regions is given by $t = \frac{log(2)}{\beta}$. In this case, $t = \frac{log(2)}{-0.0131} \approx 53$ years.

[^3]: Denmark looks very weird. The data suggests $\beta$-divergence (that is, richer regions are growing faster than poorer ones). I am taking the data at face value, but this is perhaps worth checking.