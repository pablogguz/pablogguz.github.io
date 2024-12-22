+++
title = "The illusion of mobility: why redistribution masks persistent gaps in skill formation"
date = 2024-12-20
draft = true

[taxonomies]
tags = ["intergenerational mobility", "skills", "equality of opportunity"]

[extra]
lang = "en"
toc = true
comment = true
copy = true
math = true
mermaid = false
outdate_alert = true
outdate_alert_days = 365
display_tags = true
truncate_summary = false
featured = false
cover_image = "https://pablogguz.github.io/img/dalle_denmark.webp"
reading_time = 7
+++

<img src="/img/dalle_denmark.webp" width="500"/>
<br>

{% quote(cite="Matthew 25:29") %}
*For to everyone who has will more be given, and he will have an abundance. But from the one who has not, even what he has will be taken away.*
{% end %}

Imagine you are about to be born, but you don't know to whom. If your place in society was determined by a roll of the dice, what kind of society would you want to be born into?

This thought experiment, known as the _veil of ignorance_, is rooted in a Rawlsian philosophical tradition that asks us to consider the principles of justice from a position of impartiality ([Rawls, 1971](https://www.hup.harvard.edu/file/feeds/PDF/9780674000780_sample.pdf)). Behind this veil, most would likely opt for a system that offers genuine equality of opportunity — where your life prospects aren't determined by the accident of birth. In this context, redistributive policies have long been celebrated as a means to level the playing field and promote intergenerational mobility. Scandinavian countries, in particular, are often lauded as success stories where generous welfare states have effectively severed the link between parents' and children's economic outcomes. However, recent research challenges this narrative. A closer examination using data from Denmark reveals that its high intergenerational mobility rates may be largely an artifact of its tax and transfer systems rather than reflecting genuine equality of opportunity in skill formation. As a result, the underlying roots of inequality persist, raising questions about whether redistribution truly addresses the fundamental mechanisms through which advantages are transmitted across generations.

# The Danish paradox  

The Danish system offers a fascinating case study. Denmark has universal access to high-quality healthcare, free college tuition, equality in per-pupil educational expenditure across neighborhoods, universal pre-K education, generous childcare and maternity leave policies, and well-funded social security programs ([Heckman and Landersø, 2022](https://www.sciencedirect.com/science/article/pii/S0927537121000348)). At the same time, Denmark has one of the lowest levels of income inequality worldwide, while its intergenerational income mobility rates — the extent to which children's economic outcomes are independent of their parents' — rank among the highest. Such patterns are often attributed to the country's tax and transfers system, and are frequently cited as evidence that [the _American Dream_ of upward mobility is more alive in the Nordic countries than in the United States](https://www.weforum.org/stories/2020/02/nordic-nations-social-mobility-sanna-marin/).

There are different ways to measure intergenerational mobility. Many studies have traditionally used the intergenerational income elasticity (IGE), which measures the correlation between parents' and children's income in a regression framework. Formally, this relationship can be expressed as:

$$
\log(y^{c}) = \alpha + \beta \log(y^{p}) + \epsilon
$$

where $y^{c}$ is the child's income in adulthood, $y^{p}$ is the parent's income, and $\epsilon$ is an error term. The IGE is then given by the $\beta$ coefficient, which can be interpreted as a measure of economic "stickiness" between generations. An IGE of 1 would mean complete stickiness — children would end up exactly at the same step of the income ladder as their parents. An IGE of 0 would mean no stickiness at all – that is, family background would have no predictive power in explaining their children's economic outcomes. The latter is often interpreted as a society with perfect equality of opportunity.[^1]

The relationship between inequality and intergenerational mobility is perhaps best illustrated by what Alan Krueger dubbed the [_Great Gatsby Curve_](https://en.wikipedia.org/wiki/Great_Gatsby_Curve). Empirically, countries with higher income inequality (as measured by the Gini coefficient) tend to have lower intergenerational mobility rates (<a href="#fig1">Figure 1</a>). Denmark sits at one end of this curve, with low inequality and high mobility, while the United States occupies the opposite end. The intergenerational income elasticity in Denmark is around 0.15, compared to 0.5 in the United States, suggesting that parental income has a much smaller influence on children's economic outcomes in the Scandinavian country.[^2]

<br>
<figure id="fig1">
  <figcaption>Figure 1: The Great Gatsby Curve</figcaption>
  <img src="/img/corak.PNG" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<p class="figure-note">Source: <a href="https://www.aeaweb.org/articles?id=10.1257/jep.27.3.79">Corak (2013)</a></p>
<br>

Yet beneath this veneer of success lies a surprising reality: family influence on many child outcomes in Denmark is remarkably similar to that observed in the United States (<a href="#fig2">Figure 2</a>). From birth weight and early childhood development metrics to educational attainment and labor market outcomes, children of college-educated mothers consistently outperform those whose mothers have less education. Indeed, analysis from large-scale administrative data from Denmark shows that its observed intergenerational mobility rates may be largely an artifact of its tax and transfer system rather than reflecting true equalization of economic opportunity and skill formation (Heckman and Landersø, [2017](https://onlinelibrary.wiley.com/doi/full/10.1111/sjoe.12219); [2022](https://www.sciencedirect.com/science/article/pii/S0927537121000348))

Studies typically calculate the IGE using post-tax income and thus factor in redistribution. However, when measuring mobility using pre-tax income (which reflects more accurately the returns to human capital and individual skills without the distortion of redistributive policies), [Denmark's mobility rates mirror those found across the Atlantic](https://onlinelibrary.wiley.com/doi/full/10.1111/sjoe.12219). In other words, despite Denmark's generous redistributive policies, underlying skill formation and development processes remain almost as stratified by family background as they are in the much more unequal United States. This presents us with a paradox: how can a system that appears so successful at promoting equality show such persistent intergenerational dependencies in actual skills and capabilities?

<br>
<figure id="fig2">
  <figcaption>Figure 2: Family influence on child outcomes in Denmark vs. the US</figcaption>
  <img src="/img/heckman_abstract.jpg" loading="lazy" style="width: 100%; border: 0px none;"></iframe>
</figure>
<p class="figure-note">Source: <a href="https://www.sciencedirect.com/science/article/pii/S0927537121000348">Heckman and Landersø (2022)</a></p>
<br>

# Family influence persists 

Universal programs aim to level the playing field by providing equal access to public goods. However, even in the presence of such programs, families continue to exert significant influence on their children’s outcomes. In particular, more educated and affluent parents not only provide higher-quality time investments and educational support to their children, but they also prove more adept at navigating and capitalizing on resources provided by universal programs. This reflects what is often termed as the [_Matthew effect_](https://en.wikipedia.org/wiki/Matthew_effect): the principle that to those who have, more is given.[^3] 

For example, more advantaged families make strategic choices about neighborhoods long before their children reach school age, clustering in areas with better schools and peer networks. Even with standardized teacher salaries across Danish schools, more advantaged areas tend to attract better teachers, creating de facto quality differences within the supposedly equal system. <a href="#fig3">Figure 3</a> illustrates the relationship between individual characteristics of residents and school quality (measured by school-level average test scores and teacher qualifications) within narrowly defined neighborhoods in Denmark, showing that more affluent and educated families tend to sort into areas with higher-quality schools. The end result is that universal access does not translate into equality of opportunity — instead, advantaged families often extract disproportionate value from these programs, potentially even widening (rather than narrowing) gaps in skill formation.

<br>
<figure id="fig3">
  <figcaption>Figure 3: Sorting by school quality in Denmark</figcaption>
  <img src="/img/school_quality.PNG" loading="lazy" style="width: 70%; border: 0px none;"></iframe>
</figure>
<p class="figure-note">Source: <a href="https://bfi.uchicago.edu/working-paper/pricing-neighborhoods/">Eshaghnia et al. (2023)</a></p>
<br>


# Policy design matters

In the mid-20th century, Denmark employed more targeted approaches to social programs, focusing resources on the most disadvantaged groups rather than universalizing benefits. For instance, educational reforms in the 1950s specifically expanded access to secondary schooling in rural and working-class areas, while early childcare subsidies were initially means-tested based on family income. During this period, family background became less predictive of children's educational outcomes and  educational mobility increased substantially, with the intergenerational elasticity in education declining from around 0.5 to 0.3 for cohorts born between the 1940s and 1960s ([Heckman and Landersø, 2022](https://www.sciencedirect.com/science/article/pii/S0927537121000348)). To put these numbers in perspective, consider a family that started 40% below the average education level. Under the pre-reform system, their children would typically end up 20% below average, and their grandchildren 10% below. After the reforms, convergence happened much faster: their children would end up only 12% below average, and grandchildren merely 3.6% below.[^4]

However, as Denmark shifted toward universal programs in the late 1960s and 1970s — including universal childcare access, standardized per-pupil school funding, and non-means-tested educational support — this progress began to stagnate. Free college tuition (first introduced in 1970 and substantially expanded in 1988) increased overall educational attainment, but did not seem to disproportionately benefit children from less-educated families. Among cohorts born in the 1960s, only 10% of children whose fathers had less than high school completed college, compared to 30% of children whose fathers had college degrees. By the 1985 cohort, after the universal policies were fully implemented, these rates had increased to 20% and 60% respectively (see <a href="#fig4">Figure 4</a>). The relative gap in college completion rates between children from different family backgrounds has thus remained unchanged.

<br>
<figure id="fig4">
  <figcaption>Figure 4: College completion by parents' education</figcaption>
  <img src="/img/heckman_college.PNG" loading="lazy" style="width: 90%; border: 0px none;"></iframe>
</figure>
<p class="figure-note">Source: <a href="https://onlinelibrary.wiley.com/doi/full/10.1111/sjoe.12219">Heckman and Landersø (2017)</a>, <a href="https://cehd.uchicago.edu/wp-content/uploads/2017/01/Scandinavian_Fantasy_Web-App_2016-06-11b_RL-1.pdf">Online Appendix (Figure A30e)</a> </p>
<br>


These findings point to a fundamental tension in policy design. While universal programs may be politically more palatable, they may inadvertently amplify advantages for already-privileged families through Matthew effects. In this context, policymakers might need to think more carefully about how to combine universal access with targeted support that specifically addresses skill formation in disadvantaged groups. Future policy initiatives along these lines might consider:

*   Adopting a two-generation approach like the [Nurse-Family Partnership Program](https://www.nursefamilypartnership.org/), which provides targeted support for first-time mothers from low-income backgrounds. Such programs have shown success in improving both maternal and child outcomes ([Heckman et al., 2017](https://www.nber.org/papers/w23610))
*   Focusing on early childhood interventions (when skill gaps first emerge) modeled after successful programs. For instance, programs such as the [Perry Preschool Project](https://cehd.uchicago.edu/?page_id=958) and the [Abecedarian Project](https://abc.fpg.unc.edu/) have shown long-term benefits in terms of educational attainment, employment, and health outcomes ([Heckman et al., 2010](https://www.sciencedirect.com/science/article/abs/pii/S0047272709001418); [Campbell et al., 2014](https://www.sciencemag.org/lookup/doi/10.1126/science.1248429))
*   Implementing other "smart targeting" mechanisms that identify and provide additional resources to disadvantaged families. This might include additional tutoring resources, enhanced family support services, or supplemental education programs for children identified as being at risk of falling behind
   
<!--    
A very cost-effective example of these type of initiatives is given by online tutoring programs, such as the [_Menttores Project_](https://www.esade.edu/ecpol/es/temas-clave/programa-menttores/) in Spain (which I contributed to a few years ago!). This initiative provided personalized academic support to disadvantaged secondary school students through a combination of volunteer tutors and qualified teachers. The intervention improved math test scores and end-of-year math grades, reduced the probability of grade retention, and raised aspirations of participants ([Gortazar et al., 2024](https://www.sciencedirect.com/science/article/pii/S0047272724000185)) -->
  

# Beyond skill formation 

While the evidence discussed above suggests important limitations of universal public service provision in promoting skill mobility, several policy considerations deserve attention. First, this analysis should not be interpreted as a broader critique of redistributive policies. Tax and transfer systems serve multiple welfare-enhancing functions beyond fostering intergenerational mobility, but discussing these lies outside the scope of this post.

Second, one could also argue that even with persistent skill gradients, lower intergenerational correlations in post-tax income still improve long-run welfare by accelerating regression to the mean across generations. In Denmark, for instance, the IGE estimate suggest that it would take fewer generations for disadvantaged families to reach middle-class status than in the US, potentially reducing the cumulative person-years spent in poverty across generations. Put simply, lower post-tax IGE means that being born to poor parents has far less severe economic consequences in Denmark than in the US. Though this is all true, it does not follow that the underlying skill formation processes (which redistributive policies often fail to address) should be ignored. Steep skill gradients imply persistent misallocation of human capital development opportunities (and thus unrealized productive potential) in each generation, and therefore impose important efficiency costs on society.

A third consideration concerns the political economy of redistribution. While it may be more efficient to focus resources on the most disadvantaged groups, universal policies are often more politically appealing, enjoying greater public support and administrative simplicity ([Korpi and Palme, 1998](https://psycnet.apa.org/record/1998-12763-003)). Policymakers must balance the potential inefficiency of universal approaches against the risk that more narrowly targeted measures could face political resistance, stigma, or insufficient funding, which can ultimately leave some groups worse off.

# Looking forward

The Danish experience offers a sobering lesson about the limitations of redistribution in creating genuine equality of opportunity. Even in a society with extensive universal programs and strong redistributive policies, family background continues to cast a long shadow over children's life trajectories. The illusion of mobility created by tax and transfer systems can mask persistent gaps in skill formation and perpetuate the intergenerational transmission of inequalities.

As we continue to debate mobility and inequality, we must ask ourselves: are we addressing the symptoms or the disease? 

-----------------------------------------------------------------

[^1]: There are also other metrics to assess (relative) intergenerational mobility, such as rank-rank correlations and transition matrices, which have become more common in contemporary work.

[^2]: There are different interpretations of the Great Gatsby Curve. The predominant causal explanation posits that higher inequality reduces intergenerational mobility through various mechanisms: credit constraints that limit human capital investment ([Becker and Tomes, 1986](https://www.jstor.org/stable/2534952)), neighborhood effects and social externalities ([Durlauf, 1996](https://link.springer.com/article/10.1007/BF00163343)), and differential returns to educational investments across socioeconomic groups ([Solon, 2004](https://www.cambridge.org/core/books/abs/generational-income-mobility-in-north-america-and-europe/model-of-intergenerational-mobility-variation-over-time-and-place/52E633A4CECDAED23BB7B8C744F499D1)). However, the relationship can also be rationalized in the other direction: in steady-state models of intergenerational transmission, one can show that lower mobility mechanically generates higher cross-sectional inequality as advantages and disadvantages persist across generations ([Corak, 2013](https://www.aeaweb.org/articles?id=10.1257/jep.27.3.79)).

[^3]: The term _Matthew effect_ was coined by sociologist Robert Merton in reference to the biblical verse "_For to everyone who has will more be given, and he will have an abundance. But from the one who has not, even what he has will be taken away_" in the Parable of the Talents (Matthew 25:29).

[^4]: Mathematically, if we express educational attainment as deviations from the population mean $(e_t - \bar{e})$, where $e_t$ is education in generation $t$ and $\bar{e}$ is the mean, then the IGE equation implies that deviations evolve according to $(e_{t+1} - \bar{e}) = \beta(e_t - \bar{e})$. With $\beta = 0.3$, each generation's deviation is 30% of the previous generation's deviation. After $n$ generations, the remaining deviation is $\beta^n$ times the initial deviation.

<br>

# References
-   Becker, G. S., & Tomes, N. (1986). Human Capital and the Rise and Fall of Families. Journal of Labor Economics, 4(3, Part 2), S1–S39.
-   Campbell, F., Conti, G., Heckman, J. J., Moon, S. H., Pinto, R., Pungello, E., & Pan, Y. (2014). Early childhood investments substantially boost adult health. Science, 343(6178), 1478-1485.
-   Corak, M. (2013). Income inequality, equality of opportunity, and intergenerational mobility. Journal of Economic Perspectives, 27(3), 79-102.
-   Durlauf, S. N. (1996). A Theory of Persistent Income Inequality. Journal of Economic Growth, 1(1), 75–93.
-   Eshaghnia, S. S. M., Heckman, J. J., & Razavi, G. (2023). Pricing neighborhoods. University of Chicago, Becker Friedman Institute for Economics Working Paper No. 2023-80. Retrieved from https://ssrn.com/abstract=4477536 or http://dx.doi.org/10.2139/ssrn.4477536
<!-- -   Gortazar, L., Hupkau, C., & Roldán-Monés, A. (2024). Online tutoring works: Experimental evidence from a program with vulnerable children. Journal of Public Economics, 232, 105082. https://doi.org/10.1016/j.jpubeco.2024.105082. -->
-   Heckman, J. J., & Landersø, R. (2017). The Scandinavian Fantasy: The Sources of Intergenerational Mobility in Denmark and the US. Scandinavian Journal of Economics, 119(1), 178–230. https://doi.org/10.1111/sjoe.12219
-   Heckman, J. J., & Landersø, R. (2022). Lessons for Americans from Denmark about inequality and social mobility. Labour Economics, 77, 101999.
-   Heckman, J. J., Holland, M. L., Makino, K. K., Pinto, R., & Rosales-Rueda, M. (2017). An Analysis of the Memphis Nurse-Family Partnership Program. NBER Working Paper 23610.
-   Heckman, J. J., Moon, S. H., Pinto, R., Savelyev, P. A., & Yavitz, A. (2010). The rate of return to the HighScope Perry Preschool Program. Journal of Public Economics, 94(1-2), 114-128.
-   Korpi, W., & Palme, J. (1998). The paradox of redistribution and strategies of equality: Welfare state institutions, inequality, and poverty in the Western countries. American Sociological Review, 63(5), 661–687. https://doi.org/10.2307/2657333
-   Rawls, J. (1971). A Theory of Justice. Harvard University Press.