install.packages('stringr')
require(stringr)

# Read in data.
advanced_data <- read.csv("advanced_raw.csv", na.strings="B", stringsAsFactors = FALSE)
# Assign the first column as the row names, which is not of our considered data.
colnames(advanced_data) <- c("Field","Number of people","Income","Earnings (FT)","Earnings (All)","Months worked")
rownames(advanced_data)=advanced_data[,1]
# Remove the first column from our data.
advanced_data = advanced_data[,-1]
advanced_data = na.omit(advanced_data)

# Sanitize data, converting them all to numbers.
for(i in 1:ncol(advanced_data)) {
  advanced_data[,i] =
    as.numeric(str_replace_all(string = advanced_data[,i], pattern="[^0-9.]", replacement=""))
}

# Create a statistic table for Mean and Standard Deviation.
stats_row_names = colnames(advanced_data)
statistics = data.frame(
  1:length(stats_row_names), 1:length(stats_row_names)
)
colnames(statistics) = c("Mean", "Standard Deviation")
rownames(statistics) = stats_row_names

# Compute means.
for(i in 1:nrow(statistics)) {
  statistics[i,1] = mean(advanced_data[,i])
}

# Compute standard deviation.
for(i in 1:nrow(statistics)) {
  statistics[i,2] = sd(advanced_data[,i])
}

# Correlations table.
correlations_vector <- c()
# Compute correlation vector.
for(i in 1:(ncol(advanced_data)-1)) {
  for(j in (i+1):ncol(advanced_data)){
    correlations_vector = c(correlations_vector,
                            cor(advanced_data[,i], advanced_data[,j]))
  }
}
# Compute line of regression.
regressions_intercept_vector <- c()
regressions_slope_vector <- c()
variable_pairwises_vector <- c()
for(i in 1:(ncol(advanced_data)-1)) {
  for(j in (i+1):ncol(advanced_data)){
    linear_regression <- lm(advanced_data[,i] ~ advanced_data[,j])
    variable_pairwises_vector <- c(variable_pairwises_vector,
                                   sprintf("(%s,%s)",
                                           names(advanced_data)[i],
                                           names(advanced_data)[j]))
    regressions_intercept_vector = c(regressions_intercept_vector,
                                     linear_regression["coefficients"][[1]][1])
    regressions_slope_vector = c(regressions_slope_vector,
                                 linear_regression["coefficients"][[1]][2])
  }
}

relations_frame <- data.frame(correlations_vector,
                              regressions_intercept_vector,
                              regressions_slope_vector)
colnames(relations_frame) <- c("Correlation", "Regression Intercept", "Regression Slope")
rownames(relations_frame) <- variable_pairwises_vector

# Export analytics data.
write.csv(advanced_data, file="advanced_numerics.csv")
write.csv(relations_frame, "advanced_relations.csv")
write.csv(statistics, "advanced_statistics.csv")