pipeline{
    agent any
    environment{

    }
    stages{
        stage('first'){
            steps{
                echo "we are in jenkins"

            }
        }
        stage('second'){
            steps{
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'AWS-CRED', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                   sh 'aws s3 ls'
                }

            }
        }

    }
}