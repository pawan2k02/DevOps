@Library('shared-lib') _

pipeline {
    agent { label 'vinod' }

    stages {

        stage('Git') {
            steps {
                gitCheckout(
                    branch: 'main',
                    url: 'https://github.com/pawan2k02/DevOps.git'
                )
            }
        }

        stage('Prepare Env') {
            steps {
                writeEnvFile(
                    dir: 'server',
                    env: """
                        PORT=3000
                        DB_HOST=db
                        DB_USER=admin
                        DB_NAME=crud_app
                        DB_PASSWORD=password
                        DB_PORT=5432
                        JWT_SECRET=tumhari_super_secret_key_yahan_daalo
                        SECURE=false
                        SAMESITE=lax
                    """
                )
            }
        }

        stage('Build & Push Image') {
            steps {
                dir('server') {
                    dockerBuildPush(
                        image: 'basic-server',
                        tag: 'jenkins',
                        credentialsId: 'dockerHubCred'
                    )
                }
            }
        }

        stage('Deploy') {
            steps {
                dir('server') {
                    sh 'docker compose up -d'
                }
            }
        }
    }
}
