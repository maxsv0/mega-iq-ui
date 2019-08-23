pipeline {
    environment {
        locale = 'es'
        registrySchema = 'https://'
        registryHost = 'eu.gcr.io'
        registryName = "msvhost/mega-iq-ui-${locale}"
        deploymentName = "mega-iq-ui-${locale}-${env.BUILD_ID}"
        containerTag = ''
    }

    agent any

    stages {
        stage('Install') {
            steps {
                script {
                    sh "npm install"

                    containerTag = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
                }
            }
        }
        stage('Set env') {
            steps {
                script {
                    sh "sed -i 's/www/${locale}/g' src/environments/environment.prod.ts"

                    sh "sed -i \"s/'en'/'${locale}'/g\" src/environments/app-locale.ts"

                    sh "sed -i \"s/Build info/Build ${containerTag}/g\" src/app/app.component.html"

                    withCredentials([string(credentialsId: "firebase_api_token", variable: 'FIREBASE_API_TOKEN')]) {
                        sh "sed -i 's/firebase_api_token/${FIREBASE_API_TOKEN}/g' src/environments/environment.prod.ts"
                    }
                }
            }
        }
        stage('Build SSR') {
            steps {
                script {
                    sh "npm run build:ssr:${locale}"
                }
            }
        }
        stage('Build Image') {
            steps {
                script {
                    dockerImage = docker.build("${registryName}:${env.BUILD_ID}")
                }
            }
        }
        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry("${registrySchema}${registryHost}", 'gcr:msvhost') {
                        dockerImage.push("${containerTag}")
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sh "gcloud beta compute --project=megaiq637 instances create-with-container ${deploymentName} --zone=europe-west2-c --machine-type=g1-small --network=default --network-tier=PREMIUM --metadata=google-logging-enabled=true --maintenance-policy=MIGRATE --tags=http-server,https-server --image-project=cos-cloud  --image=cos-stable-76-12239-60-0 --boot-disk-size=10GB --boot-disk-type=pd-standard --boot-disk-device-name=${deploymentName} --container-image=${registryHost}/${registryName}:${containerTag} --container-restart-policy=always --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append"
                }
            }
        }
    }
}
