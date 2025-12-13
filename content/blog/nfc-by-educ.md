+++
title = "Education pays off (for the state too): net fiscal contributions by educational attainment in Spain"
date = 2025-12-12
draft = false

[taxonomies]
tags = ["fiscal", "spain", "education", "nta", "taxes", "public spending"]

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
cover_image = "https://pablogguz.github.io/img/nfc_by_educ.png"
reading_time = 10
+++

<img src="/img/nfc_by_educ.png" width="500"/>
<br>

# Introduction

When people argue about the fiscal sustainability of the welfare state, they are (often implicitly) arguing about a simple accounting identity: some individuals receive more from the state than they pay in, and others pay more than they receive. **The key questions are _how large_ those gaps are, _when_ they occur over the life cycle, and _how they differ across groups_**. These underpin debates about the returns to public investment in education, the sustainability of pension systems, and — perhaps more controversially — the fiscal impact of immigration from countries with different educational profiles.

This post constructs net fiscal contribution (NFC) profiles by educational attainment for Spain, following the [National Transfer Accounts (NTA)](https://dataexplorer.wittgensteincentre.org/nta/) methodology. 

<!-- Intuitively, the headline result is that your fiscal footprint is mainly a function of two things: your human capital and your age. The former determines how much you earn (and hence how much you pay in taxes), while the latter determines which side of the generational transfer you sit on. -->

# Methodology overview

The NTA framework provides a standardised approach for measuring economic flows across generations. The core idea is simple: at each age, individuals receive certain benefits from the state (transfer inflows) and contribute to the state through taxes (transfer outflows). The difference between these (the net fiscal contribution) tells us whether a given age group is a net contributor or net recipient.

$$
\text{NFC}(a,e) = \text{Outflows}(a,e) - \text{Inflows}(a,e)
$$

where $a$ denotes age and $e$ denotes educational attainment. A positive NFC means the individual contributes more than they receive, whereas a negative NFC means they are a net recipient.

# Data

The analysis draws on the following datasets:

- **[Spanish EU-SILC (ECV)](https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176807&menu=ultiDatos&idp=1254735976608)**: The microdata for the 2024 wave of Spain's Survey of Living Conditions, which provides individual-level data on earnings, benefits and socio-demographic characteristics.

- **[Eurostat National Accounts](https://ec.europa.eu/eurostat/databrowser/)**: Macro control totals for rescaling survey-based estimates to match official statistics:
    - `nama_10_gdp`: GDP components including household final consumption expenditure and government consumption, plus corresponding deflators
    - `gov_10a_main`: Government sector accounts
    - `gov_10a_exp`: Government expenditure by function

- **[Eurostat education finance data](https://ec.europa.eu/eurostat/databrowser/view/educ_uoe_fine09)**: Public expenditure per student by education level (`educ_uoe_fine09`)

- **[DG TAXUD data](https://taxation-customs.ec.europa.eu/taxation/economic-analysis/data-taxation-trends_en)** on aggregate tax revenues

- **[European NTA consumption profiles](https://dataexplorer.wittgensteincentre.org/nta/)**: Pre-computed age profiles of public and private consumption by category for Spain

Educational attainment is coded using the ISCED 2011 classification. The table below shows the mapping from ISCED levels to the categories used in the analysis.

| ISCED level | Description | Category |
|-------------|-------------|----------|
| 0 | Early childhood education | Pre-primary |
| 1 | Primary education | Primary |
| 2 | Lower secondary education | Lower secondary |
| 3–4 | Upper secondary and post-secondary non-tertiary | Upper secondary |
| 5–8 | Tertiary education | Tertiary |

For the final results, I aggregate to three broad categories to ensure adequate cell sizes at each age: **Primary or less** (ISCED 0–1), **Secondary** (ISCED 2–4), and **Tertiary** (ISCED 5–8). 

# Transfer inflows

Transfer inflows consist of two main components: cash benefits received from the government and public consumption (the value of in-kind public services consumed).

## Cash benefits

Cash benefits are measured from household survey microdata both at the individual level (for personal benefits) and at the household level (for household-level transfers). Individual-level benefits include unemployment benefits, old-age pensions, survivor benefits, sickness benefits, disability benefits, and education-related benefits. Household-level benefits (housing allowances, family/child allowances, and social exclusion benefits) are divided equally among household members.

I aggregate all cash benefits to the individual level and then rescale to match the National Accounts macro control for social benefits paid by the general government (D62 from `gov_10a_main`):

$$
B_i^{\text{scaled}} = B_i^{\text{survey}} \times \frac{\text{D62}}{\sum_i B_i^{\text{survey}} \times w_i}
$$

where $w_i$ are the survey weights.

## Public consumption

Public consumption represents the value of government-provided services consumed by individuals. I decompose this into two components: **public education** ($G^E$) and **other public consumption** ($G^O$, primarily healthcare and general government services).

### Other public consumption (healthcare and general services)

For healthcare and other government services, consumption is allocated using pre-computed age profiles for Spain from the NTA database (2010 base year), updated to 2023 prices using Eurostat's government consumption deflator (derived from `nama_10_gdp`). These profiles capture the well-documented pattern of healthcare consumption rising sharply with age.

Other public consumption is not differentiated by education — the assumption is that individuals of the same age consume similar amounts of healthcare and other public services regardless of their educational attainment.[^1]

The profiles are rescaled so that the population-weighted total matches the macro control for non-education government consumption:

$$
G^O_{\text{macro}} = \text{P3\\_S13} - \text{GF09}
$$

where P3_S13 is total government consumption from the National Accounts and GF09 is government education expenditure from COFOG.

### Public education consumption

Education consumption requires different treatment because it varies systematically with educational attainment: a university graduate received substantially more public investment during their schooling years than someone who left after compulsory education.

The allocation procedure rests on two building blocks:

1. **Enrolment data**: I gather data on per-student costs by education level (`educ_uoe_fine09`). Since the latest available data is for 2022, I adjust it to 2023 prices using the government consumption deflator.
2. **Macro control**: Total government education expenditure from COFOG (GF09 in `gov_10a_exp`), which the individual-level allocations must sum to.

For each individual in the survey, I assign education consumption as follows. For individuals currently enrolled in education, I assign consumption based on their enrolment level and the corresponding per-student cost. For children under 16, I impute current enrollment based on age (see table below). Individuals not currently enrolled receive zero education consumption. 

| Age | Imputed enrollment |
|-----|-------------------|
| 0-2 | Not enrolled |
| 3-5 | Pre-primary |
| 6-11 | Primary |
| 12-15 | Lower secondary |

Finally, I rescale all values proportionally so that the population-weighted total matches the COFOG macro control.

<!-- {% note(header="Synthetic profiles for young ages") %}
A challenge arises when constructing profiles by current educational consumption: cells for higher attainment levels at young ages are undefined (i.e., there are no 10-year-olds with tertiary education). For visualization purposes, I construct synthetic profiles for young ages that are identical across education categories up to the ages when educational paths diverge.
{% end %} -->

# Transfer outflows

Transfer outflows consist of taxes paid. Following the NTA methodology, I decompose total taxes into three components: taxes on labour income, taxes on capital income, and taxes on consumption.

Two features of the Spanish tax system require careful treatment when constructing education-specific income tax profiles. First, Spain has a progressive tax system: higher earners face higher marginal rates and pay a larger share of their income in taxes. The standard NTA approach takes gross income from surveys and rescales uniformly to match macro tax aggregates, implicitly assuming a flat tax rate across the income distribution. Since educational attainment is strongly correlated with earnings, ignoring progressivity would compress differences across education groups—understating the tax burden of higher-educated individuals and overstating that of lower-educated individuals.

Second, most cash transfers in Spain are subject to personal income tax. Recall that transfer inflows are measured as gross government expenditure — the full amount the state disburses. But recipients do not keep all of this: pensions, unemployment benefits, and most other social transfers enter the tax base and are taxed according to the standard rate schedule. These taxes paid on benefits must appear somewhere in transfer outflows. Indeed, the DG TAXUD classification allocates taxes on pensions and social transfers to "taxes on non-employed labour income", a subcategory of labour taxes. A methodology that only considers taxes on earnings would miss this component, understating the tax contributions of groups that receive substantial taxable transfers (particularly retirees).

To address both issues, I exploit the fact that the Spanish EU-SILC reports both gross and net income variables. The difference between gross and net income captures the actual tax incidence as reported in the survey, which already incorporates the progressive rate structure and taxes paid on benefits:

$$
T_i^{\text{survey}} = Y_i^{\text{gross}} - Y_i^{\text{net}}
$$

This survey-based tax amount is then rescaled to match macro controls:

$$
T_i^{\text{scaled}} = T_i^{\text{survey}} \times \frac{T_{\text{agg}}}{\sum_i T_i^{\text{survey}} \times w_i}
$$

This approach preserves the *shape* of the tax profile (reflecting both progressivity and the taxation of transfers) while ensuring consistency with National Accounts aggregates.

## Labour income taxes

Gross labour income in the survey comprises gross cash earnings from employment, non-cash employee income, company car benefits, employer social security contributions, and self-employment income. Gross benefit income includes unemployment benefits, old-age pensions, survivor benefits, sickness and disability benefits, and education-related allowances. Following NTA convention, self-employment income is attributed in full to labour for the tax calculation.

Net labour and benefit income is constructed analogously from the corresponding net variables. The implied tax is the difference between gross and net totals:

$$
T^L_i = (Y^L_i + B_i)^{\text{gross}} - (Y^L_i + B_i)^{\text{net}}
$$

This captures taxes on both earnings and taxable benefits. The profile is rescaled to match the DG TAXUD macro control for labour-related taxes, which comprises personal income tax on labour and transfers, employee and employer social security contributions, and payroll taxes.

## Capital income taxes

Capital income is measured at the household level and includes interest, dividends, profit from capital investments, and rental income. I compute implied capital taxes as the difference between gross and net capital income at the household level and allocate this to the household head. 

## Consumption taxes

Consumption taxes present a different challenge. The standard NTA approach allocates consumption taxes based on age-specific consumption profiles without further disaggregation, but total consumption varies systematically with income — and hence with educational attainment. 

To address this, I implement an income-weighted consumption tax allocation. I first compute disposable income for each individual and calculate the mean by age × education cell. I then define an adjustment factor as:

$$\alpha(a,e) = \left(\frac{\bar{Y}(a,e)}{\bar{Y}}\right)^{\gamma}$$

where $\gamma < 1$ captures the concavity of the consumption-income relationship. I set $\gamma = 0.6$, which implies that a doubling of income increases consumption by approximately 50% — consistent with empirical estimates of the income elasticity of consumption.[^2] This adjustment is applied to the NTA base consumption profile, and the resulting profiles are rescaled to match the National Accounts aggregate for household consumption. Consumption taxes are then allocated proportionally, with the aggregate matching DG TAXUD data on consumption tax revenue.

# Combining inflows and outflows

For each individual, I compute the net fiscal contribution as:

$$
\text{NFC}_i = T^L_i + T^K_i + T^C_i - B_i - G_i
$$

I then compute weighted means by age and education level to construct the final profiles.

{% note(header="Handling empty cells at young ages") %}
A methodological challenge arises when constructing profiles by educational attainment: at young ages, cells for higher attainment levels are not defined. Educational attainment is a stock variable observed at the time of the survey, whereas fiscal flows occur throughout the life cycle. For a child currently in school, we observe their eventual educational attainment in the cross-section, but their current fiscal profile is largely independent of that future attainment. For visualization purposes, I compute population-weighted per capita values by age, pooling across education categories, and apply this uniform value to all education groups at ages where education-specific estimation is not conceptually feasible. As a result, the final profiles diverge only at ages where economic behaviour genuinely differs by attainment — typically from the late teens onwards. This ensures that the childhood portions of the profiles are identical across education groups.
{% end %}

# Results

<figure id="fig1">
  <figcaption>Figure 1: Net fiscal contributions by age and educational attainment</figcaption>
  <img src="/img/nfc_by_educ_age_ES.png" loading="lazy" style="width: 100%; border: 0px none;"></img>
</figure>

These profiles highlight that the fiscal position of an individual is shaped by two interacting margins: (i) where they sit in the life cycle, and (ii) the earning capacity associated with their skills and education. The life-cycle pattern is common across groups (net receipts in childhood, net payments during working ages, and net receipts in retirement) but the height and width of the "contribution window" differ sharply by educational attainment.

**Tertiary-educated graduates are net fiscal contributors from their late 20s until their mid-60s**, with average contributions around €13,000 per year during prime working ages (25-54). After retirement, they become net recipients, but their implied lifetime contributions remain positive. Those with **secondary education are also net fiscal contributors during their working lives**, but with more modest average contributions during prime working ages (of the order of one-third of the average for tertiary-educated individuals). However, their lifetime fiscal contribution turns negative once we account for receipts during childhood and retirement. 

Those with **only primary education or below are roughly neutral for most of their working lives**. Even during prime working ages, their average net fiscal contribution is slightly below zero. As a result, their lifetime fiscal contribution is substantially negative.

An important part of these gaps stems from differences in labour market attachment. In the survey, prime working-age individuals with less than secondary education have an employment rate of around 55%, compared to over 85% for those with tertiary education. Interestingly, the employment rate of individuals with tertiary education aged 60-64 is above the prime working-age employment rate of those with only primary education.

# Caveats 

This exercise constructs **period (cross-sectional) NFC profiles** by age and educational attainment. It does **not** follow the same people over time, and it does not observe the full fiscal life cycle of any cohort. Instead, it combines a snapshot of age-specific flows observed (or imputed) in one year. That is standard in the NTA tradition, but it comes with important limitations.

1. **Age profiles are “period” profiles, not cohort histories.** At a given age, the tertiary-educated individuals observed in the 2024 survey are not the same people as the tertiary-educated individuals observed at age 60. Cohorts differ in lifetime earnings paths, labour-market attachment, and institutional exposure. As a result, these profiles should be read as: *“How much do 40-year-olds with tertiary education contribute/receive under today’s institutions and macro aggregates?”*, but not as *“What will today’s 40-year-olds experience when they are 60?”*.

2. **Lifetime NFC is a synthetic construct and is not a forecast.** Similarly, any “implied lifetime contribution” computed by integrating these cross-sectional profiles implicitly assumes away policy change, macro shocks, and behavioural adjustments. In reality, taxes, benefits, demographics, and education finance evolve over time; the synthetic lifetime NFC therefore reflects the **current fiscal architecture** rather than a prediction of future net contributions.

3. **Educational attainment is not exogenous.** Differences in NFC across education groups should not be interpreted causally as the fiscal return to education but simply as an accounting decomposition.

Taken together: the results are best interpreted as a **consistent, macro-anchored snapshot of who pays and who receives today**, by age and education, under current institutions. They are informative for understanding the structure of fiscal redistribution, but they are not a cohort forecast and should not be read as a causal estimate of the fiscal payoff to schooling.


---------------------------------------

[^1]: This is a strong assumption. Whereas one should be less worried about collective consumption (e.g. street lighting), healthcare consumption likely varies with socio-economic status. However, it can go either way as two forces pull in opposite directions: on the one hand, lower-educated individuals tend to have worse health outcomes and thus may have more need and often more acute/inpatient use; on the other hand, higher-educated individuals may use more preventive and specialist/outpatient care conditional on need. For the purpose of this exercise I abstract from this heterogeneity, but it is a limitation to keep in mind.

[^2]: See [Blundell et al. (2008)](https://www.aeaweb.org/articles?id=10.1257/aer.98.5.1887).
