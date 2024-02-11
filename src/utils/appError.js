const AppError = (error, code) => {
    try {
      // Check if the error is a Mongoose ValidationError
      if (error.name === "ValidationError") {
        let errors = {};
  
        // Extract and format validation errors
        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });
  
        // Return an object indicating failure along with the validation error messages
        return { success: false, errorMessage: errors };
      }
  
      // If the error is not a validation error, return a general error message
      return { success: false, errorMessage: error };
    } catch (error) {
      // Log any unexpected errors that might occur during the error handling process
      console.log(error);
    }
  }
  
  // Export the AppError function
  module.exports = AppError;
  