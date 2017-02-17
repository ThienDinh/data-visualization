install.packages('stringr')
require(stringr)

# Read in data.
bachelor_data <- read.csv("bachelor_raw.csv", na.strings="B", stringsAsFactors = FALSE)
# Assign the first column as the row names, which is not of our considered data.
colnames(bachelor_data) <- c("Field","Number of people","Income","Earnings (FT)","Earnings (All)","Months worked")
rownames(bachelor_data)=bachelor_data[,1]
# Remove the first column from our data.
bachelor_data = bachelor_data[,-1]
bachelor_data = na.omit(bachelor_data)

# Sanitize data, converting them all to numbers.
for(i in 1:ncol(bachelor_data)) {
  bachelor_data[,i] =
    as.numeric(str_replace_all(string = bachelor_data[,i], pattern="[^0-9.]", replacement=""))
}

# Create a statistic table for Mean and Standard Deviation.
stats_row_names = colnames(bachelor_data)
statistics = data.frame(
  1:length(stats_row_names), 1:length(stats_row_names)
)
colnames(statistics) = c("Mean", "Standard Deviation")
rownames(statistics) = stats_row_names

# Compute means.
for(i in 1:nrow(statistics)) {
    statistics[i,1] = mean(bachelor_data[,i])
}

# Compute standard deviation.
for(i in 1:nrow(statistics)) {
  statistics[i,2] = sd(bachelor_data[,i])
}

# Correlations table.
correlations_vector <- c()
# Compute correlation vector.
for(i in 1:(ncol(bachelor_data)-1)) {
  for(j in (i+1):ncol(bachelor_data)){
    correlations_vector = c(correlations_vector,
                            cor(bachelor_data[,i], bachelor_data[,j]))
  }
}
# Compute line of regression.
regressions_intercept_vector <- c()
regressions_slope_vector <- c()
variable_pairwises_vector <- c()
for(i in 1:(ncol(bachelor_data)-1)) {
  for(j in (i+1):ncol(bachelor_data)){
    linear_regression <- lm(bachelor_data[,i] ~ bachelor_data[,j])
    variable_pairwises_vector <- c(variable_pairwises_vector,
                                   sprintf("(%s,%s)",
                                           names(bachelor_data)[i],
                                           names(bachelor_data)[j]))
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
write.csv(bachelor_data, file="bachelor_numerics.csv")
write.csv(relations_frame, "bachelor_relations.csv")
write.csv(statistics, "bachelor_statistics.csv")