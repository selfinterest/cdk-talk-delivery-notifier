import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import DeliveryTracker = require('../lib/delivery-tracker-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new DeliveryTracker.DeliveryTrackerStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
