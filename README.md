# cognito-saml-auth

🏤🏤🏤 CognitoのSAML認証を行う！  

## 実行方法

`.env.example`をコピーして`.env`ファイルを作成します。  
中身を適切に設定してください。  

SAMLメタデータファイルをダウンロードし、`./saml-metadata.xml`に配置してください。  
作成方法は「[IdPの設定](#idpの設定)」を参照してください。  

DevContainerに入り、以下のコマンドを実行します。  
※ `~/.aws/credentials`にAWSの認証情報があることを前提とします。  

```shell
cdk bootstrap
cdk synth
cdk deploy --require-approval never --all

chmod +x ./setup_server.sh
./setup_server.sh
```

---

GitHub Actionsでデプロイするためには、以下のシークレットを設定してください。  

| シークレット名 | 説明 |
| --- | --- |
| AWS_ROLE_ARN | IAMロールARN (Ref: https://github.com/osawa-koki/oidc-integration-github-aws) |
| AWS_REGION | AWSリージョン |
| DOTENV | `.env`ファイルの内容 |
| SAML_METADATA | `./saml-metadata.xml`の内容 |

タグをプッシュすると、GitHub Actionsがデプロイを行います。  
手動でトリガーすることも可能です。  

## IdPの設定

Google Workspaceの場合の説明です。  

[管理コンソール](https://admin.google.com/)にログインします。  
「アプリ」「ウェブアプリとモバイルアプリ」から「アプリを追加」「カスタムSAMLアプリの追加」をクリックします。  

名前を入力し、「次へ」をクリックします。  
メタデータファイルをダウンロードし、`./saml-metadata.xml`に配置します。  

以降の処理は、CloudFormationがデプロイされた後に行います。  

「ACSのURL」と「エンティティID」を入力します。  
以下のコマンドで取得できます。  

```shell
source .env

OUTPUTS=$(aws cloudformation describe-stacks --stack-name $BASE_STACK_NAME --query "Stacks[0].Outputs" --output json)
ACS_URL=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey == "ACSURL") | .OutputValue')
ENTITY_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey == "ENTITYID") | .OutputValue')

echo "ACS_URL: $ACS_URL"
echo "ENTITY_ID: $ENTITY_ID"
```

その他の項目はデフォルト値で進めます。  

属性マッピングは以下のように設定します。  

| 属性名 | マッピング先 |
| --- | --- |
| Primary email | http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress |
| First name | http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname |
| Last name | http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname |

「アプリを追加」をクリックすると、アプリが作成されます。  
サービスのステータスを「オン（すべてのユーザー）」にします。  

## WEBサーバーの実行

```shell
npm run dev

# or

npm run start
```

`http://localhost:3000/`にアクセスします。  
SAML認証を行います！  
