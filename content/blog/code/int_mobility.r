library(tidyverse)
library(ggthemes)
library(extrafont)

# Create the dataset
data <- tibble(
    measure = c(
        "Wage earnings and\npublic transfers",
        "Wage earnings",
        "Gross income incl.\npublic transfers",
        "Gross income excl.\npublic transfers"
    ),
    denmark = c(0.063, 0.083, 0.271, 0.352),
    us = c(0.419, 0.289, 0.446, 0.312),
    difference = us - denmark
)

# Create the plot
plot <- ggplot(data, aes(x = difference, y = factor(measure, levels = measure))) +
    geom_vline(xintercept = 0, linetype = "dashed", color = "gray50") +
    geom_segment(
        aes(
            x = 0, xend = difference,
            y = factor(measure, levels = measure),
            yend = factor(measure, levels = measure)
        ),
        color = "#2171b5",
        alpha = 0.5,
        linewidth = 1
    ) +
    geom_point(size = 5, color = "#2171b5", fill = "#8BB5E3", shape = 23, stroke = 1) +
    geom_text(
        aes(
            label = sprintf("%.3f", difference),
            hjust = ifelse(difference >= 0, -0.5, 1.5)
        ),
        family = "Libre Franklin",
        color = "gray30"
    ) +
    labs(
        title = "",
        subtitle = "Positive values indicate higher IGE (lower mobility) in the US",
        x = "Difference in IGE (US - Denmark)",
        y = NULL
    ) +
    theme_minimal() +
    theme(
        text = element_text(family = "Libre Franklin"),
        plot.background = element_rect(fill = "#f2f2f2", color = NA),
        panel.grid.minor = element_blank(),
        panel.grid.major.y = element_blank(),
        axis.text = element_text(size = 11),
        plot.title = element_text(face = "bold"),
        plot.subtitle = element_text(color = "gray30"),
        axis.title.x = element_text(margin = margin(t = 10), color = "gray30"),
        axis.text.y = element_text(hjust = 0)
    ) +
    scale_x_continuous(
        labels = scales::number_format(accuracy = 0.01),
        breaks = seq(-0.1, 0.4, by = 0.1),
        limits = c(-0.1, 0.45) # Expanded to accommodate labels
    )

ggsave("static/img/ige_differences.png", plot, width = 10, height = 6, dpi = 300)
