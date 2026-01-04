def call() {
    script {
        // ---- Docker check ----
        def dockerInstalled = sh(
            script: 'command -v docker >/dev/null 2>&1',
            returnStatus: true
        ) == 0

        if (!dockerInstalled) {
            echo 'Docker not found. Installing Docker Engine...'
            sh '''
                curl -fsSL https://get.docker.com | sh
                sudo systemctl enable docker
                sudo systemctl start docker
                sudo usermod -aG docker $USER
            '''
        } else {
            echo 'Docker is already installed.'
        }

        // ---- Docker Compose check (v2 preferred) ----
        def composeV2Installed = sh(
            script: 'docker compose version >/dev/null 2>&1',
            returnStatus: true
        ) == 0

        def composeV1Installed = sh(
            script: 'command -v docker-compose >/dev/null 2>&1',
            returnStatus: true
        ) == 0

        if (composeV2Installed) {
            echo 'Docker Compose v2 is already installed.'
        } else if (composeV1Installed) {
            echo 'Docker Compose v1 is installed (legacy).'
        } else {
            echo 'Docker Compose not found. Installing Compose v2 plugin...'
            sh '''
                sudo mkdir -p /etc/apt/keyrings
                curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
                echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
                  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
                sudo apt update
                sudo apt install docker-compose-plugin -y
            '''
        }

        echo 'Docker & Docker Compose check completed.'
    }
}
