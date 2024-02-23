+++
title = "A modern IDE for Stata with VSCode + Quarto"
date = 2024-02-22
draft = true

[taxonomies]
tags = ["stata","vscode","quarto"]

[extra]
lang = "en"
toc = true
comment = true
copy = true
math = false
mermaid = false
outdate_alert = true
outdate_alert_days = 120
display_tags = true
truncate_summary = false
featured = false
+++

Over the last few decades, empirical research in economics has witnessed what is widely termed as [the credibility revolution](https://www.aeaweb.org/articles?id=10.1257/jep.24.2.3), a paradigm shift that emphasized the importance of experimental and quasi-experimental methods to credibly identify causal relationships. This transformative period has not only influenced the methodologies employed in academic papers but also strengthened the field's impact on policy-making, by providing more solid and rigorous evidence upon which to base decisions.

The emphasis on methodological rigor has naturally elevated the importance of data and coding skills within the field. However, despite the increasing importance of coding in economics, many empirical economists find themselves lagging in adopting modern coding practices and development environments. In fact, one of the most widely used tools in the profession, [Stata](https://www.stata.com/), is not even a programming language[^1], but a purpose-built statistical package. Stata is a commercial software, meaning that it does not have the benefits of open-source languages like Python or R, which have amassed extensive communities contributing to their development and offering support. Due to its nature, it has traditionally been hard to integrate Stata with modern IDEs, which results in a less efficient workflow when one has to write code in multiple languages.

This post is a tutorial on setting up a modern development environment for Stata with Visual Studio Code and Quarto.

# Why Stata

I know what you are thinking. 

**jUsT dOn't usE sTAta BrO**.

I get it. I use R and Stata interchangeably in my work and it is indeed not a good idea to *just* use Stata, simply because you will be unnecessarily limited on the number of things you can do. 

However, the truth is that if you do applied microeconomics for a living, **in many cases it would be very stupid not to use Stata**. Whoever tells you otherwise is i) not an applied microeconomist (good for them!) or ii) likely underestimating how important Stata is in the profession:

- Stata can be found in [more than 70% of replication packages](https://www.r-bloggers.com/2023/12/usage-shares-of-programming-languages-in-economics-research/) for published papers in economics. It is followed by Matlab (which we deliberately ignore since it is aimed for structural work), and R comes in third with less than 10%. I am not going to argue whether this is a good or a bad equilibrium but _it is an equilibrium_, and if you want to understand what others have done you need to be able to (at least) read Stata code

- For basic data wrangling and reduced-form econometrics, Stata is unparallaled. Period. I have been writing code for +3.5 years and it still amazes me how ridiculously cumbersome R and Python are relative to Stata when it comes to running regressions. For some specifications, it is simply not possible to use something else unless you want to code the estimator from scratch (good luck running modern difference-in-differences estimators for heterogeneous treatment effects in Python, for example)

- Economists love regression tables. And again, the functionalities and flexibility of ```esttab``` to export fully formatted and reproducible tables in Stata is light years ahead of the alternatives in other languages (e.g., ```stargazer``` in R). 

- If you do applied micro research or policy work, **coding will never be your comparative advantage**. An economist is not a commercial data scientist, and it does not make sense to pretend to be one.[^2] Instead, your value lies on the quality of your ideas and how good you execute them – programming is only useful insofar as it helps you in that purpose. Some folks (myself included) enjoy venturing off the beaten path and exploring unconventional data sources and empirical designs, but the median researcher would prioritize research productivity over learning new tools. I am not saying this is good (I think is bad!), but in the end people respond to incentives.

# Why VSCode

VSCode is Microsoft's open-source code editor. It supports a wide array of programming languages and comes with the usual IDE features like syntax highlighting, code completion, Copilot, and version control integration.

More importantly, turns out that it is fairly straightforward to integrate VSCode with Stata via plugins. VSCode also has beautiful LaTeX extensions, which in my opinion makes it the only real alternative to Overleaf in terms of comfort. This means that you can seamlessly integrate all your workflow into a single code editor, from data cleaning to drafting.

# Why Quarto

Quarto is an open-source scientific and technical publishing system that allows users to create dynamic documents, slide decks, and reports in various formats from plain text files. Quarto files support multiple programming languages and can be rendered into interactive HTML documents, which allows the user to combine code execution with high-quality document production.

And more crucially, Quarto outputs are [painfully beautiful](https://quarto.org/docs/gallery/#interactive-docs).

# Setup

## Step 1: Install VSCode 

Go to [https://code.visualstudio.com/](https://code.visualstudio.com/), download the latest VSCode version available, and install it on your machine.

## Step 2: Install VSCode Stata extensions

You will need two extensions to be able to run Stata:


## Step 3: Install Quarto

Go to [https://quarto.org/](https://quarto.org/), click on "Get Started", download the latest Quarto version available, and install it on your machine. 

## Step 4: Install ```nbstata```


-----------------------------------------------------------------

[^1]: Stata though has its own matrix-based programming language, _Mata_. Some of the most popular user-written Stata packages, like ```reghdfe``` for regressions with high dimensional fixed effects, are largely written in Mata.

[^2]: Unless you want to work in industry, of course.