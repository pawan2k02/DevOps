def call(Map config = [:]) {
    String image        = config.get('image')
    String tag          = config.get('tag', 'latest')
    String credentials  = config.get('credentialsId')

    if (!image) {
        error "dockerBuildPush: 'image' is required (e.g. pawan630703/basic-server)"
    }
    if (!credentials) {
        error "dockerBuildPush: 'credentialsId' is required"
    }

    script {
        withCredentials([
            usernamePassword(
                credentialsId: credentials,
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )
        ]) {
            sh """
                echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                docker build -t ${image}:${tag} .
                docker push ${image}:${tag}
                docker logout
            """
        }
    }
}
