import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

import * as fs from 'fs';

export class IndexStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      stackName: process.env.BASE_STACK_NAME!,
    });

    const userPool = new cognito.UserPool(this, 'SamlUserPool', {
      userPoolName: 'MySamlUserPool',
      selfSignUpEnabled: false,
      signInAliases: { username: false, email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
      },
    });

    const samlMetadataXml = fs.readFileSync('saml-metadata.xml', 'utf8');
    const samlIDProvider = new cognito.CfnUserPoolIdentityProvider(this, 'SamlIDProvider', {
      providerName: 'MySAMLIdP',
      providerType: 'SAML',
      userPoolId: userPool.userPoolId,
      providerDetails: {
        MetadataFile: samlMetadataXml,
      },
      attributeMapping: {
        email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
        name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
      },
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'SamlAppClient', {
      userPool,
      userPoolClientName: 'MySamlAppClient',
      generateSecret: false,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: ['http://localhost:3000/callback'],
        logoutUrls: ['http://localhost:3000/logout'],
      },
      supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.custom('MySAMLIdP')],
    });
    userPoolClient.node.addDependency(samlIDProvider);

    const domain = new cognito.UserPoolDomain(this, 'CognitoDomain', {
      userPool,
      cognitoDomain: {
        domainPrefix: 'my-saml-auth',
      },
    });
    domain.node.addDependency(samlIDProvider);

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });
    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, 'ACSURL', {
      value: `https://${domain.domainName}.auth.${this.region}.amazoncognito.com/saml2/idpresponse`,
    });
    new cdk.CfnOutput(this, 'ENTITYID', {
      value: `urn:amazon:cognito:sp:${userPool.userPoolId}`,
    });
  }
}
