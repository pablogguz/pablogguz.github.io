+++
title = "Predicting socio-economic outcomes with Google Trends"
date = 2024-03-09
draft = true

[taxonomies]
tags = ["googletrends", "badbunny"]

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
reading_time = 8
+++

Everybody lies.

This is both a truth and the title of a book by [Seth Stephens-Davidowitz](http://sethsd.com/), former data scientist at Google and PhD in economics from Harvard. [_Everybody lies_](https://www.amazon.co.uk/Everybody-Lies-Internet-about-Really/dp/0062390856) is an incredibly fun read offering a compelling argument that our online searches can reveal more about our true selves than we might like to admit. The book is not only a testament to the power of non-traditional data sources, but also an invitation to explore the world through creativity and curiosity.

Stephens-Davidowitz's work shows that Google searches can be used to predict a wide range of socio-economic outcomes when traditional data sources are not available or are contaminated by social acceptability bias. The latter is particularly important when studying sensitive topics such as racial animus, sexual orientation, or mental health: when disclosing your true preferences or beliefs might lead to social stigma, people are then more likely to tell the truth to Google than to a survey interviewer.

 In an [academic paper](https://people.cs.umass.edu/~brenocon/smacss2015/papers/StephensDawidowitz2014.pdf) published in the _Journal of Public Economnics_, Stephens-Davidowitz uses Google searches to measure racial animus in the U.S. and its impact on the 2008 and 2012 presidential elections – specifically, he finds that racially charged Google search rates are a strong negative predictor of Obama's vote share. A back-of-the-envelope calculation suggests that racial animus cost Obama around 4 percentage points in the 2008 election. This estimate is significantly larger than previous figures based on survey data.

<br>
<div id="table1">
<figcaption>Table 1: Google search terms and socio-economic outcomes </figcaption>

| Term               | Underlying variable | t-Stat | $R^2$   |
|--------------------|---------------------|--------|------|
| God                | Percent believe in god | 8.45   | 0.65 |
| Gun                | Percent own gun        | 8.94   | 0.62 |
| African American(s)| Percent Black          | 13.15  | 0.78 |
| Hispanic           | Percent Hispanic       | 8.71   | 0.61 |
| Jewish             | Percent Jewish         | 17.08  | 0.86 |
<p class="figure-note">Source: <a href="https://people.cs.umass.edu/~brenocon/smacss2015/papers/StephensDawidowitz2014.pdf">Stephens-Davidowitz (2015)</a>, Table 1. The t-stat and $R^2$ are from a regression with the normalized search volume of the
word(s) in the first column as the independent variable and measures of the value in
the second column as the dependent variable. The normalized search volume for all
terms is from 2004 to 2007. All data are at the state level.</p>
</div>
<br>

In <a href="#table1">Table 1</a>, I show some of Stephen-Davidowitz's examples on how Google searches can be used to predict population-level outcomes. For example, Google searches for the word "Gun" explain 62% of the variation in states' gun ownership rates. Similarly, Google searches for the word "Jewish" explain 86% of the variation in the percentage of Jewish population across U.S. states. 

Can we do better? In this post, I will show you how the popularity of latino urban music singers in Google searches can be used to predict the hispanic population shares across U.S. states. 

# Some background on Google Trends data

Data on Google searches is available through [Google Trends](https://trends.google.com/trends/), a tool that allows users to explore the popularity of search terms over time and across different regions within countries. The data is normalized to the time and location of a query, so that the popularity of a search term is measured relative to the total number of searches in a given region and time period. In other words, Google Trends gives measures of relative search term popularity, not an absolute measure of the number of searches for a given term.[^1]

Relative popularity is measured on a scale from 0 to 100, where 100 is the most popular point in time and location for a given search term. For example, value of 50 means that the term is half as popular as the most popular time and location for the term. 

There are a bazillion online resources on how to use Google Trends, so I won't go into the details here. If you are interested, I recommend you to check out the [Google Trends basics page](https://newsinitiative.withgoogle.com/es-es/resources/trainings/basics-of-google-trends/) and the [search tips page](https://support.google.com/trends/answer/4359582?hl=en).

# Data 

We will combine Google Trends data on the popularity of search terms related to latino urban music singers with data on the hispanic population shares across U.S. states sourced from the [American Community Survey (ACS)](https://www.census.gov/programs-surveys/acs/data.html) microdata for the year 2022.

First, we will use the search term "bad bunny" to predict hispanic population shares. [Bad Bunny](https://open.spotify.com/intl-es/artist/4q3ewBCX7sLwd24euuV69X) is arguably the most popular latin artist worldwide nowadays – in 2022, he was Billboard's top artist of the year and the [most streamed artist](https://www.billboard.com/pro/bad-bunny-top-streaming-artist-year-end-charts-2022/) in Spotify and Apple Music. He also has a [huge following](https://www.instagram.com/badbunnypr/) on Instagram with over 40 million followers, and its popularity has played a crucial role in the reivindication of the latino culture and identity in the U.S. ([_ahora todos quieren ser latinos_](https://www.youtube.com/watch?v=QdQEljUMCEM)).

Let's do it. To start with, I show the hispanic population shares across U.S. states in 2022 in <a href="#fig1">Figure 1</a>. Unsurprisingly, the hispanic population is concentrated in the South and West regions of the U.S. The states with the highest hispanic population shares are New Mexico, California, and Texas, with shares of 50%, 40.3%, and 40.2%, respectively. The states with the lowest hispanic population shares are West Virginia, Maine, and Vermont, with shares of around 2% each.

<br>
<figure id="fig1">
  <figcaption>Figure 1</figcaption>
  <img src="/img/map_hispanic.png" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<!-- <p class="figure-note">Source: 2022 ACS.</a></p> -->
<br>

Now, let's do the same for the popularity of the search term "bad bunny" in the U.S. in 2022:

<br>
<figure id="fig2">
  <figcaption>Figure 2</figcaption>
  <img src="/img/map_badbunny.png" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<!-- <p class="figure-note">Source: 2022 ACS.</a></p> -->
<br>

Similar, right?

We can visualize the relationship between the popularity of the search term "bad bunny" and the hispanic population shares across U.S. states in a scatter plot (see <a href="#fig3">Figure 3</a>). The $R^2$ of an OLS regression of the hispanic population share on our Google Trends measure is 0.76, which means that 76% of the variation in the hispanic population share across U.S. states can be explained by variation in the popularity of Bad Bunny in Google searches.

<br>
<figure id="fig3">
  <figcaption>Figure 3</figcaption>
  <img src="/img/corr_badbunny_hispanic.png" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<!-- <p class="figure-note">Source: 2022 ACS.</a></p> -->
<br>

There is one state that is particularly off the line: New Mexico. The state has a hispanic population share of 50%, but the popularity of Bad Bunny in Google searches is only 56% of the most popular point in time and location for the term. The hispanic pool in New Mexico is a bit different from the rest of the U.S. in the sense that there is one particular group (you guessed it, the mexican population) that is vastly overrepresented. Perhaps the mexicans are not that into Bad Bunny?

I was curious about this, so I decided to check what would happen if we replicate the analysis for the popularity of the search term "peso pluma" in the U.S. in 2022 while focusing on mexican population shares. Peso Pluma is a mexican singer whose popularity has skyrocketed during the last couple of years, being youtube's [most viewed artist of 2023 in the U.S.](https://www.billboard.com/espanol/noticias/peso-pluma-artista-mas-visto-youtube-2023-estados-unidos-1235563630/). 

The results are shown in <a href="#fig4">Figure 4</a>. An turns out that Peso Pluma's popularity in Google searches explains 94% of the variation in the mexican population share across U.S. states. 

<br>
<figure id="fig3">
  <figcaption>Figure 3</figcaption>
  <img src="/img/corr_pesopluma_mexican.png" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<!-- <p class="figure-note">Source: 2022 ACS.</a></p> -->
<br>
