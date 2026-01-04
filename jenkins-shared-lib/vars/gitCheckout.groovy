def call(Map config = [:]) {
    String branch = config.get('branch', 'main')
    String url    = config.get('url')

    if (!url) {
        error "gitCheckout: 'url' is required"
    }

    script {
        if (fileExists('.git')) {
            echo "Git repo exists. Pulling latest changes..."
            sh 'git pull origin ' + branch
        } else {
            echo "No git repo found. Cloning..."
            git branch: branch, url: url
        }
    }
}
