pipeline {
    environment {
        registrySchema = 'https://'
        registryHost = 'eu.gcr.io'
        repositoryName = ''
        deploymentName = ''
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

        stage("Build ES") {
            steps {
                script {
                    locale = "es"
                    repositoryName = "msvhost/mega-iq-ui-${locale}"
                    deploymentName = "iq-ui-${locale}-${env.BUILD_ID}"
                }
                script {
                    withCredentials([string(credentialsId: "firebase_api_token", variable: 'FIREBASE_API_TOKEN')]) {
                        sh "sed -i 's/firebase_api_token/${FIREBASE_API_TOKEN}/g' src/environments/environment.prod.ts"
                    }

                    sh "sed -i \"s/Build info/Build ${containerTag}/g\" src/app/app.component.html"
                    sh "sed -i 's/www/${locale}/g' src/environments/environment.prod.ts"
                    sh "sed -i \"s/'en'/'${locale}'/g\" src/environments/app-locale.ts"
                    sh "sed -i 's/\"en\"/\"${locale}\"/g' src/index.html"
                }
                script {
                    sh "npm run build:ssr:${locale}"
                }
                script {
                    dockerImage = docker.build("${repositoryName}:${env.BUILD_ID}")
                }
                script {
                    docker.withRegistry("${registrySchema}${registryHost}", 'gcr:msvhost') {
                      dockerImage.push("${containerTag}")
                    }
                }
                script {
                    sh "gcloud beta compute --project=megaiq637 instances create-with-container ${deploymentName} --zone=europe-west2-c --machine-type=f1-micro --network=default --network-tier=PREMIUM --metadata=google-logging-enabled=true --maintenance-policy=MIGRATE --image-project=cos-cloud  --image=cos-stable-76-12239-60-0 --boot-disk-size=200GB --boot-disk-type=pd-standard --boot-disk-device-name=${deploymentName} --container-image=${registryHost}/${repositoryName}:${containerTag} --service-account=docker@megaiq637.iam.gserviceaccount.com --container-restart-policy=always --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append"
                }
            }
        }

        stage("Build RU") {
            steps {
                script {
                    sh "git checkout ."
                }
                script {
                    locale = "ru"
                    repositoryName = "msvhost/mega-iq-ui-${locale}"
                    deploymentName = "iq-ui-${locale}-${env.BUILD_ID}"
                }
                script {
                    withCredentials([string(credentialsId: "firebase_api_token", variable: 'FIREBASE_API_TOKEN')]) {
                        sh "sed -i 's/firebase_api_token/${FIREBASE_API_TOKEN}/g' src/environments/environment.prod.ts"
                    }

                    sh "sed -i \"s/Build info/Build ${containerTag}/g\" src/app/app.component.html"
                    sh "sed -i 's/www/${locale}/g' src/environments/environment.prod.ts"
                    sh "sed -i \"s/'en'/'${locale}'/g\" src/environments/app-locale.ts"
                    sh "sed -i 's/\"en\"/\"${locale}\"/g' src/index.html"
                }
                script {
                    sh "npm run build:ssr:${locale}"
                }
                script {
                    dockerImage = docker.build("${repositoryName}:${env.BUILD_ID}")
                }
                script {
                    docker.withRegistry("${registrySchema}${registryHost}", 'gcr:msvhost') {
                      dockerImage.push("${containerTag}")
                    }
                }
                script {
                    sh "gcloud beta compute --project=megaiq637 instances create-with-container ${deploymentName} --zone=europe-west2-c --machine-type=f1-micro --network=default --network-tier=PREMIUM --metadata=google-logging-enabled=true --maintenance-policy=MIGRATE --image-project=cos-cloud  --image=cos-stable-76-12239-60-0 --boot-disk-size=200GB --boot-disk-type=pd-standard --boot-disk-device-name=${deploymentName} --container-image=${registryHost}/${repositoryName}:${containerTag} --service-account=docker@megaiq637.iam.gserviceaccount.com --container-restart-policy=always --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append"
                }
            }
        }

    }
}
