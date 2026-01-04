def call(Map config = [:]) {
    String branch = config.get('branch', 'main')
    String url    = config.get('url')

    if (!url) {
        error "gitCheckout: 'url' is required"
    }

    script {
        echo 'Cleaning workspace...'
        deleteDir()

        echo "Checking out ${branch} from ${url}"
        git branch: branch, url: url
    }
}
