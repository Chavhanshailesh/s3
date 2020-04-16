pipeline{
    agent any
    environment{
        BUCKET_NAME="demo-react-app-shailesh"
    }
    stages{
        stage('Generate Build'){
            steps{
                echo "***************************STARTING BUILD****************************************"

                sh 'yarn'
                sh 'yarn dist'
                dir('dist'){
                    sh 'rm -rf sourcemaps-not-for-upload/'
                     sh 'rm -rf .cache/'
                }

            }
        }
        stage('Upload to S3'){
            steps{
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'AWS-CRED', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                   sh 'aws s3 ls'
                   sh "aws s3 cp ./dist s3://${BUCKET_NAME}/ --recursive"
                }
                echo "************************Files Uploaded Successfully*************************"

            }
        }

    }
}