def call(Map config = [:]) {
    String dirPath = config.get('dir', '.')
    String envText = config.get('env')

    if (!envText) {
        error "writeEnvFile: 'env' content is required"
    }

    dir(dirPath) {
        writeFile file: '.env', text: envText.stripIndent()
        echo ".env file created in ${dirPath}"
    }
}
