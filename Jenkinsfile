pipeline {
  environment {
    registrySchema = 'https://'
    registryHost = 'eu.gcr.io'
    machineType = 'g1-small'
    deploymentProject = 'megaiq637'
    deploymentZone = 'europe-west2-c'
    repositoryName = ''
    deploymentName = ''
    containerTag = ''
    localeRu = 'ru'
    localeEs = 'es'
  }

  agent any

  stages {
    stage('Install') {
      steps {
        script {
          containerTag = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
        }
        script {
          sh "npm install"
        }
      }
    }

    stage('Build ES') {
      steps {
        deployByLocale(localeEs)
      }
    }

    stage('Build RU') {
      steps {
        deployByLocale(localeRu)
      }
    }

    stage("Route") {
      steps {
        script {
          BUILD_ID_PREV = sh(returnStdout: true, script: "gcloud compute ssh iq-web-proxy --zone=${deploymentZone} --project=${deploymentProject} --command=\"sudo cat /etc/apache2/conf-enabled/iq-ui.conf | sed 's/[^0-9]*//g'\"").trim()
        }
        script {
          sh "gcloud compute ssh iq-web-proxy --zone=${deploymentZone} --project=${deploymentProject} --command=\"sudo sh -c 'echo Define MegaIqUiBuild ${env.BUILD_ID} > /etc/apache2/conf-enabled/iq-ui.conf'\""
        }
        script {
          sh "gcloud compute ssh iq-web-proxy --zone=${deploymentZone} --project=${deploymentProject} --command=\"sudo service apache2 restart\""
        }
        script {
          sh "gcloud beta compute instances --zone=${deploymentZone} --project=${deploymentProject} stop iq-ui-es-$BUILD_ID_PREV"
        }
        script {
          sh "gcloud beta compute instances --zone=${deploymentZone} --project=${deploymentProject} stop iq-ui-ru-$BUILD_ID_PREV"
        }
      }
    }
  }
}

def deployByLocale(def locale) {
  script {
    sh "git checkout ."
  }
  script {
    repositoryName = "msvhost/mega-iq-ui-${locale}"
    deploymentName = "iq-ui-${locale}-${env.BUILD_ID}"
  }
  script {
    withCredentials([string(credentialsId: "firebase_api_token", variable: 'FIREBASE_API_TOKEN')]) {
      sh "sed -i 's/firebase_api_token/${FIREBASE_API_TOKEN}/g' src/environments/environment.prod.ts"
    }
  }
  script {
    sh "sed -i 's/www/${locale}/g' src/environments/environment.prod.ts"
    sh "sed -i \"s/'en'/'${locale}'/g\" src/environments/app-locale.ts"
    sh "sed -i 's/\"en\"/\"${locale}\"/g' src/index.html"
  }
  script {
    sh "sed -i \"s/Build info/Build ${containerTag}/g\" src/app/app.component.html"
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
    sh "gcloud beta compute --project=${deploymentProject} instances create-with-container ${deploymentName} --zone=${deploymentZone} --machine-type=${machineType} --network=default --network-tier=PREMIUM --metadata=google-logging-enabled=true --maintenance-policy=MIGRATE --image-project=cos-cloud  --image=cos-stable-76-12239-60-0 --boot-disk-size=200GB --boot-disk-type=pd-standard --boot-disk-device-name=${deploymentName} --container-image=${registryHost}/${repositoryName}:${containerTag} --service-account=docker@megaiq637.iam.gserviceaccount.com --container-restart-policy=always --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append"
  }
}
