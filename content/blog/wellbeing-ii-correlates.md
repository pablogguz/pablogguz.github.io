+++
title = "Wellbeing II: Correlates of wellbeing"
date = 2024-06-16
draft = true

[taxonomies]
tags = ["me"]

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

What makes life truly worthwhile?

[Some months ago](https://pablogguz.github.io/blog/wellbeing-i-intro/), I discussed the concept of wellbeing and how it is measured empirically. I mentioned how large-scale household surveys have become a key tool for understanding people's subjective wellbeing, as they allow us to explore which individual and environmental characteristics are associated with self-reported measures of life satisfaction and happiness. 

In this post, I use microdata from the [European Social Survey](https://www.europeansocialsurvey.org/) to illustrate (i) which factors are associated with higher levels of wellbeing at the individual level, and (ii) how the explanatory power of these factors varies across countries. 

# Data 

The ESS is a biennial household survey that collects a wide range of attitudinal outcomes alongside the traditional socio-demographic features of individuals across European countries. The survey is conducted face-to-face and covers a representative sample of the population aged 15 and over. The data is publicly available and can be accessed [here](https://www.europeansocialsurvey.org/data/download.html?r=10). I use data from the last 3 rounds of the survey, which took place between 2016 and 2020. The final sample includes more than XXXX respondents across YY countries.


# The framework 

Let $Y_i$ be a wellbeing outcome of interest for each individual $i$. Then, we can model our outcome as 

$$Y_i = g(\mathbf{X}_i, \varepsilon_i)$$

where $\mathbf{X}_i$ is a vector of individual and/or environmental characteristics, $g(\cdot)$ is a function that maps individual characteristics into a measure of wellbeing, and $\varepsilon_i$ is an error term that captures unobserved factors that affect $Y_i$.

The first step is to define the functional form of $g(\cdot)$. 


