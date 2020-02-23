import * as cdk from '@aws-cdk/core';
import path = require('path');
import sns = require('@aws-cdk/aws-sns');
import subscriptions = require('@aws-cdk/aws-sns-subscriptions')
import lambda = require('@aws-cdk/aws-lambda')


export class DeliveryTrackerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Assume this topic already exists -- some other service publishes to it
    const deliveryTopic = sns.Topic.fromTopicArn(this, "deliveryTopic", "arn:aws:sns:us-east-1:939584036768:delivery-notifications")

    // We also need a topic we will publish the results on
    const lateTopic = new sns.Topic(this, "deliveryLateTopic")

    // The lambda function
    const notifier = new lambda.Function(this, "Notifier", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "..", "functions", "notifier")),
      handler: 'notifier.main',
      // Pass identifiers the lambda needs as environment variables
      environment: {
        LATE_TOPIC_ARN: lateTopic.topicArn
      }
    })

    // The lambda's subscription
    const subscription = new subscriptions.LambdaSubscription(notifier)

    // Add the subscription to the topic
    deliveryTopic.addSubscription(subscription)


    // In addition, the lambda needs permission to publish to the topic
    lateTopic.grantPublish(notifier)

    // finally, set up a subscription to email someone if shipments are late
    const emailSubscription = new subscriptions.EmailSubscription("ruthehotha@mywrld.site") //throwaway email I made
    lateTopic.addSubscription(emailSubscription)
  }
}
