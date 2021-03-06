import Em from 'ember';
import delay from 'ember-delay/delay';

var retryWithBackoff = function(callback, retryCountBeforeFailure, waitInMilliseconds) {
  if(Em.isEmpty(retryCountBeforeFailure)) {
    retryCountBeforeFailure = 5;
  }
  waitInMilliseconds = waitInMilliseconds || 250;

  return callback().catch(function(reason) {
    if (retryCountBeforeFailure-- > 1) {
      waitInMilliseconds = waitInMilliseconds * 2;

      return delay(waitInMilliseconds).then(function() {
        return retryWithBackoff(callback, retryCountBeforeFailure, waitInMilliseconds);
      });
    }

    throw reason;
  });
};

export default retryWithBackoff;
