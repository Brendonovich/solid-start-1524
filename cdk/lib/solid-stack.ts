import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class SolidStartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backendLambda = new lambda.Function(this, "SolidBackendLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("./.output/server"),
      architecture: lambda.Architecture.ARM_64,
    });

    const api = new apigw.HttpApi(this, "Endpoint", {
      defaultIntegration: new integrations.HttpLambdaIntegration(
        "SolidIntegration",
        backendLambda,
      ),
    });

    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something went wrong with the deploy",
    });
  }
}
