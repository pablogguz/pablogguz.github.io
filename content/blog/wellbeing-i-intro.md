+++
title = "Wellbeing I: Introduction"
date = 2024-03-27
draft = true

[taxonomies]
tags = ["wellbeing"]

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

<!-- {% tip(header="Hey!") %}
*This is the first post of a series on wellbeing.*
{% end %} -->

{% quote(cite="Robert F. Kennedy") %}
*GDP measures everything, in short, except that which makes life worthwile*
{% end %}

I am not an utilitarian, but I am not averse to the idea of maximizing well-being. The ultimate goal of policy should be to improve the lives of the people it serves, and well-being is a good proxy for that. 

My background is in economics. Perhaps inadvertently, well-being has always been a fundamental outcome for economists – in fact, the entire theoretical framework in consumer choice problems is built around the idea of maximizing individual utility.

In this post, I will not write about *how* to increase societal well-being. I am also not so interested on justifying *why* we should do it in the first place (though it is an interesting question). I am, however, interested in showing what we should *not* do if we were to prioritize well-being from a policy perspective.

This is the first post of a series about well-being measurement and policy. 

## Definitions 

Let's start with the basics. What is well-being?

There is no universal definition. Well-being is a complex, multifaceted concept that encompasses a variety of domains, including emotional, psychological, and social aspects of life. It is also a subjective concept, meaning that it is defined by the individual's own perception of their life, rather than by an external observer. This is important to keep in mind, as it means that well-being is not something that can be imposed from the outside, but rather something that needs to be elicited from the individual themselves.

In the context of policy research, I like to define well-being as the individual's *inner subjective state of satisfaction with their own existence*. Nothing less, nothing more.

People often interchangeably use the idea of *happiness* to refer to well-being. This is not entirely accurate: although happiness is an important component of well-being, they are distinct concepts Happiness is a transient, momentary state of mind, while well-being is a more stable subjective state that factors in long-term mental and physical health, social connections, purpose, and fulfillment. However, happiness and well-being are highly correlated empirically, and the distinction is often blurred in practice. We will illustrate this with data.

The best way we have to elicit individual well-being is via large-scale household surveys. These surveys typically ask respondents to rate their own well-being, and they also collect a wide range of information about the respondent's life circumstances, such as income, employment, health, and social relationships. This allows us to study the determinants of well-being, and to understand how different policies and interventions affect people's lives. Well-being measures can be splitted into three categories:

-	**Evaluative** measures stem from asking the respondent how satisfied or happy they are with their life. A common framing is *All thing considered, how satisfied are you with your life nowadays?*, with the answer options being either a continuous scale from 0-10 or a Likert-type scale.[^1] A variant of the former approach is to ask respondents to rate their life on a ladder, where the top of the ladder represents the best possible life for them, and the bottom of the ladder represents the worst possible life for them. This is commonly known as the *Cantril ladder*, which is used in many international household surveys such as the [Gallup World Poll](https://www.gallup.com/analytics/318875/global-research.aspx) or the [World Values Survey](http://www.worldvaluessurvey.org/).
-	**Hedonic** approaches focus on measuring how people feel at a particular point in time. This is typically done by asking respondents to report their feelings at the moment of the survey, or to recall their feelings over a specific period of time. Happiness is the most common measure of hedonic well-being, but negative emotions such as sadness, anger, and stress are also used.
-	**Eudaimonic** measures are based on the Aristotelian tradition with the idea that well-being is not just about feeling good, but also about functioning well. This approach focuses on the extent to which people are able to realize their potential, and to live a life that is meaningful and fulfilling. This is typically measured by asking respondents about their sense of purpose, their autonomy, and their relationships with others.

Tipically, evaluative and hedonic measures are the most widely used in policy research. Eudaimonic measures are harder to interpret – for example, when we talk about being virtuous, it is not clear whether that should be an outcome in itself or another determinant (among many) of well-being.

<a href="#fig1">Figure 1</a> shows cross-country averages of life satisfaction, as measured by the Cantril ladder. The figure shows that there is a wide variation in life satisfaction across countries, with the highest levels of life satisfaction being found in the Nordic countries, and the lowest levels of life satisfaction being found in sub-Saharan Africa and the Middle East. The difference between the country with the highest average life satisfaction (Finland) and the country with the lowest average life satisfaction (Afghanistan) is about 6 points on a 0-10 scale, which is a huge difference.

<br>
<figure id="fig1">
  <figcaption>Figure 1: Life satisfaction across countries </figcaption>
  <iframe src="https://ourworldindata.org/grapher/happiness-cantril-ladder" loading="lazy" style="width: 100%; height: 600px; border: 0px none;"></iframe>
</figure>
<br>

## It is (not) all about the money

Traditionally, the main proxy for well-being in academic and policy circles has been income, with GDP per capita being widely used for cross-country comparisons. This is not surprising: income is a key determinant of well-being, and it is also a relatively easy to measure. It is also a good proxy for many other things that are important for well-being, such as access to healthcare, education, leisure...

...and **well-being itself**. Across countries, higher GDP per capita is associated with greater levels of life satisfaction. This finding is remarkably consistent across surveys, and it holds up irrespective of the definition of well-being we use. <a href="#fig2">Figure 2</a> shows the relationship between GDP per capita and life satisfaction for a large number of countries, using data from the [World Happiness Report](https://worldhappiness.report/). High-income countries tend to have higher levels of life satisfaction than low-income countries, and the relationship is roughly log-linear. The latter is consistent with the idea of diminishing marginal utility of income: an extra dollar has more impact on well-being for the average Joe than for Jeff Bezos. Intuitive, right?

<br>
<figure id="fig2">
  <figcaption>Figure 2: Self-reported life satisfaction vs. GDP per capita </figcaption>
  <iframe src="https://ourworldindata.org/grapher/gdp-vs-happiness" loading="lazy" style="width: 100%; height: 600px; border: 0px none;"></iframe>
</figure>
<br>

What is, then, the catch? Why should not just stick to GDP per capita as a measure of well-being?

### The Easterlin Paradox

In 1974, economist Richard Easterlin established an empirical stylized fact:

1.  At a given point in time, richer people tend to be happier than poorer people, both within and across countries
2.  However, as income grows and countries become richer, the average level of life satisfaction in such countries does not necessarily increase 

This is known as the **Easterlin paradox** and has been a subject of much debate in the literature. Whereas (1) is undisputedly true, (2) is more ambiguous: whereas some countries have not experienced increases in average life satisfaction despite large increases in income, others have become happier as with income growth. My reading of the literature is, however, that the cases in which the paradox holds are more common than the cases in which it does not.

To illustrate this, consider <a href="#fig3">Figure 3</a>, which shows the evolution of GDP per capita and average life satisfaction (computed from large-scale longitudinal household surveys) for a sample of countries. The figure shows that, despite considerable increases in within-country per capita income, the average level of life satisfaction has remained surprisingly constant over time.

<br>
<figure id="fig2">
  <figcaption>Figure 3: The Easterlin Paradox</figcaption>
  <img src="/img/clark_2018_paradox.png" loading="lazy" style="width: 100%; height: 500px; border: 0px none;"></iframe>
</figure>
<p class="figure-note">Source: <a href="https://www.jstor.org/stable/j.ctvd58t1t">Clark et al. (2018).</a></p>
<br>

In practice, the concept is a bit more nuanced. For example, to test whether within-country increases in income are associated with increases in life satisfaction, you could gather country-year level data on GDP per capita and life satisfaction, and then regress the latter on the former controlling for country fixed effects. This would effectively allow you to test the Easterlin paradox empirically, right?

The answer is no. A critical aspect of the Easterlin paradox is that it is the *long-run trends* in happiness and income that are not related, not the short-run changes. In fact, the literature has shown that happiness and life satisfaction goes down during recessions [insert references]. Such an strategy would capture variation stemming from year-on-year fluctuations in income, so it cannot tell us much about their long-run relationship. A more accurate way of testing the Easterlin paradox would be to look at the relationship between long-run differences in both income and life satisfaction. If one does this, the correlation between income and life satisfaction is still positive and significant, but rather weak (around 0.3).

### The relative income hypothesis

One of the first explanations for the paradox was that income affects well-being through relative, rather than absolute, terms. In other words, what matters for determining well-being is how one's income compares to that of others in society. This is known as the **relative income hypothesis** and suggests that, if everyone becomes richer by a common factor, the average level of life satisfaction would not necessarily increase as the individuals' relative position within the income distribution would remain unchanged.

The good thing about the relative income hypothesis is that it is testable. And, indeed, it has been tested. Consider a very simple regression framework in which we regress well-being on both individual income and average income of a group of comparators:

$$Y_i = \alpha + \beta X_i + \gamma \bar{X} + \epsilon_i$$

where $Y_i$ is individual $i$'s well-being, $X_i$ is individual $i$'s income, $\bar{X}$ is the average income of a group of comparators, and $\epsilon_i$ is the error term. If the relative income hypothesis holds, we would expect $\gamma$ to be negative, as individual well-being would decrease as the average income of the group of comparators increases.

This is exactly what we find. <a href="#table1">Table 1</a> shows the results of such a regression for cross-sections of different countries, in which the group of comparators is defined by people of the same sex, age group, region, and survey year, and the outcome is life satisfaction (measured on a 0-10 scale). Individual well-being is positively associated with individual income, but negatively associated with the average income of the comparison group. Except for the United States, a 1% increase in the average income of comparators reduces well-being in the same amount or more than a 1% increase in individual income increases well-being.

<div id="table1">
<figcaption>Table 1: The relative income hypothesis</figcaption>

|                     | Britain | Germany | Australia | United States |
|---------------------|---------|---------|-----------|---------------|
| Own income          | 0.16 (.01) | 0.26 (.01) | 0.16 (.01) | 0.31 (.01) |
| Comparator income   | -0.23 (.07) | -0.25 (.04) | -0.17 (.06) | -0.19 (.03) |
<p class="figure-note">Source: <a href="https://www.cambridge.org/gb/universitypress/subjects/economics/microeconomics/wellbeing-science-and-policy">Layard and De Neve (2023)</a>, Table 13.4. Standard errors in parentheses.</p>
</div>


### Effect sizes 




[^1]: A Likert-type scale is a psychometric scale commonly involved in research that employs questionnaires. It is the most widely used approach to scaling responses in survey research, such that the term is often used interchangeably with rating scale, although there are other types of rating scales. When responding to a Likert item, respondents specify their level of agreement or disagreement on a symmetric agree-disagree scale for a series of statements. Thus, the range captures the intensity of their feelings for a given item. For example, a 5-point Likert item could have the following options: 1. Strongly disagree, 2. Disagree, 3. Neither agree nor disagree, 4. Agree, 5. Strongly agree. 
