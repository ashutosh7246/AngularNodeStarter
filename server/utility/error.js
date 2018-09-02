/**
 * Utility for error messages and status
 */
module.exports = {
    status: {
      Created: 201,
      NoContent: 204,
      BadRequest: 400,
      Unauthorized: 401,
      Forbidden: 403,
      NotFound: 404,
      RequestTimeout: 408,
      AuthenticationTimeout: 419,
      UnprocessableEntity: 422,
      InternalServerError: 500,
      NotImplemented: 501,
      ServiceUnavailable: 503,
      GatewayTimeout: 504,
      SessionTimeout: 599
    },
    message: {
      OK: 'The request was successful, and results may be obtained in the response body',
      Created: 'The POST request was successful, and results may be obtained in the response body.',
      NoContent: 'The request was successful, but the response body is empty as nothing deemed important should be returned.',
      BadRequest: 'The server wasn not able to understand the request. It is possibly missing required parameters or has parameters with values of an invalid type. The response should include an error object with more information.',
      Unauthorized: 'The authentication has failed for the user.',
      Forbidden: 'The authorized user does not have access to make the request.',
      NoProvider: 'No provider specified.',
      NoService: 'No service specified.',
      insufficiantData: 'Data not provided or provided data is insufficient.',
      NotFound: 'The endpoint is not valid, or a resource represented by the request does not exist.',
      RequestTimeout: 'The server was not able to complete your request in the time allotted. This could be due to server load, and may be retried in the future.',
      AuthenticationTimeout: 'The access token being used has expired.',
      UnprocessableEntity: 'The request was understood, but has failed some business-level validation. Inspect the error object for more information.',
      InternalServerError: 'Some unhandled server error has been occurred',
      NotImplemented: 'This API endpoint is not yet implemented; please contact service developers for more information.',
      ServiceUnavailable: 'The service is temporarily unavailable. Please try again later.',
      GatewayTimeout: 'The request was unable to be processed in time. This may be due to server load. Please try again later.',
      SessionTimeout: 'Session has been expired.',
      emailNotFound: "Please check your email !",
      deactivated: 'User is deactivated!',
      roleNotFound: "Unable to find your role!",
      noAccessRight: "You do not have access right!",
      invalidPassword: "Password is invalid",
      invalidToken: "Check your token details. Not matched with any user !",
      grantTypeNotFound: 'Not found valid grantType !',
      authorizationNotFound: 'No Authorization header is provided',
      userExist: "Usename already exist !",
      wrongOldPassword: "Check you old password !",
      noNewPassword: 'Provide new password to change old password',
      NoHeaderFound: 'No header is provided',
      noRoleFound: 'Role is not found',
      passwordChangeRequired: 'Your password has been expired! Please change it.',
      maxFailLoginAttempt: 'You have accede maximum fail login attempts. New password has already been sent to your Email Address!',
      maxFailLoginAttemptWitMail: 'You have accede maximum fail login attempts. New password has been sent to your Email Address!'
    },
    formatErrors: function(errorsIn) {
      var errors = {};
      var a, e;
  
      for(a = 0; a < errorsIn.length; a++) {
        e = errorsIn[a];
  
        errors[e.property] = errors[e.property] || [];
        errors[e.property].push(e.msg);
      }
      return errors;
    }
  };
  