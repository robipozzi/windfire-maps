#!/bin/bash

# ***** Run Test Client for Windfire Maps Service

source ../setenv.sh

# ===== DEFAULT VALUES =====
LOG_LEVEL="INFO"
HTTPS_ENDPOINT=true
PROTOCOL="https"
DEFAULT_HOST="localhost"
DEFAULT_PORT=3443

# ===== MAIN FUNCTION =====
main() {
    # Display header
    echo -e "${BOLD}${BLU}###################################################################${RESET}"
    echo -e "${BOLD}${BLU}############### Windfire Maps Service - test client ###############${RESET}"
    echo -e "${BOLD}${BLU}###################################################################${RESET}"
    echo
    
    # Parse command-line arguments
    parse_args "$@"
    
    # Run tests
    run_test_client
}

# ===== TEST RUN FUNCTION =====
run_test_client() {
    echo -e "${YELLOW}Running tests ...${RESET}"
    echo

    if [ "$HTTPS_ENDPOINT" = false ]; then
        echo -e "${YELLOW}HTTPS_ENDPOINT is set to ${BOLD}${BLU}$HTTPS_ENDPOINT${RESET}${RESET}"
        PROTOCOL="http"
        if [ -z "${PORT}" ]; then
            PORT=3000
        fi
    fi

    if [ -z "${HOST}" ]; then
        echo -e "${YELLOW}HOST is not set or is empty, running with default ${BOLD}${BLU}$DEFAULT_HOST${RESET}${RESET}"
        HOST=$DEFAULT_HOST
    fi

    if [ -z "${PORT}" ]; then
        echo -e "${YELLOW}PORT is not set or is empty, running with default ${BOLD}${BLU}$DEFAULT_PORT${RESET}${RESET}"
        PORT=$DEFAULT_PORT
    fi

    if [ "$VERBOSE" = true ]; then
        LOG_LEVEL="DEBUG"
    fi
    
    echo 

    # Show configuration
    display_config

    echo -e "${BOLD}${BLU}##################################################################${RESET}"
    echo -e "${BOLD}${BLU}############### Windfire Maps Service - CURL tests ###############${RESET}"
    echo -e "${BOLD}${BLU}##################################################################${RESET}"
    echo

    # Build URL
    URL="${PROTOCOL}://${HOST}:${PORT}"
    echo -e "${YELLOW}Target URL: ${BOLD}${BLU}$URL${RESET}${RESET}"
    echo

    # Set CURL_CA_BUNDLE to use custom CA certificate
    export CURL_CA_BUNDLE=$WINDFIRE_DEFAULT_TRUSTSTORE_DIR/$WINDFIRE_ROOT_CA_CERTIFICATE

    # Run curl tests
    run_curl_autocomplete_test
    run_curl_placedetails_test
    
    echo -e "${BOLD}${BLU}###########################################################################${RESET}"
    echo -e "${BOLD}${BLU}############### Windfire Maps Service - NodeJs client tests ###############${RESET}"
    echo -e "${BOLD}${BLU}###########################################################################${RESET}"
    echo

    # Run NodeJs tests
    run_nodejs_test
}

# ===== CURL TESTS FUNCTIONS =====
run_curl_autocomplete_test() {
    # Autocomplete Test
    echo -e "${BOLD}${BLU}-----> CURL autocomplete test <-----${RESET}"
    curl "https://localhost:3443/api/places/autocomplete?input=Via%20Valle%20Nuova"
    echo
}

run_curl_placedetails_test() {
    # Place Details Test
    echo -e "${BOLD}${BLU}-----> CURL place details test <-----${RESET}"
    curl "https://localhost:3443/api/places/details?placeid=EiVWaWEgVmFsbGUgTnVvdmEsIEdhbGxhcmF0ZSwgVkEsIEl0YWx5Ii4qLAoUChIJW_5sjdiJhkcRwTEXklP4LOsSFAoSCfd3lYjCiYZHERGKzb2w_oYZ"
    echo
}

# ===== NODJS TESTS FUNCTIONS =====
run_nodejs_test() {
    ### Run Node.Js application
    npm install
    npm start
}

# ===== ARGUMENT PARSING FUNCTION =====
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --http)
                HTTPS_ENDPOINT=false
                shift
                ;;
            --host)
                HOST="$2"
                shift 2
                ;;
            -p|--port)
                PORT="$2"
                shift 2
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                print_help
                exit 0
                ;;
            *)
                echo -e "${RED}Error: Unknown option '$1'${RESET}"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

# ===== CONFIGURATION DISPLAY FUNCTION =====
display_config() {
    echo -e "${BOLD}${GREEN}Configuration Summary:${RESET}"
    echo -e "  HTTPS_ENDPOINT:  ${YELLOW}$HTTPS_ENDPOINT${RESET}"
    echo -e "  HOST:            ${YELLOW}$HOST${RESET}"
    echo -e "  PORT:            ${YELLOW}$PORT${RESET}"
    echo -e "  Verbose:         ${YELLOW}$([ "$VERBOSE" = true ] && echo 'Enabled' || echo 'Disabled')${RESET}"
    echo
}

# ===== HELP FUNCTION =====
print_help() {
    # Display help information
    echo -e "${BOLD}===================================${RESET}"
    echo -e "${BOLD}Windfire Maps Service - Test script${RESET}"
    echo -e "${BOLD}===================================${RESET}"
    echo
    echo -e "${BOLD}DESCRIPTION:${RESET}"
    echo -e "    This script launches the Windfire Maps Service test suite"
    echo
    echo -e "${BOLD}USAGE:${RESET}"
    echo -e "    ./run-test-client.sh [OPTIONS]"
    echo
    echo -e "${BOLD}OPTIONS:${RESET}"
    echo -e "    --http                     Enforce call to HTTP endpoint"
    echo -e "                               Default: HTTPS endpoint call enforced"
    echo
    echo -e "    --host HOST                Specify HOST "
    echo -e "                               Default: localhost"
    echo
    echo -e "    -p, --port PORT            Specify server port (1-65535)"
    echo -e "                               Default: 3000 (for HTTP) / 3443 (for HTTPS)"
    echo
    echo -e "    -v, --verbose              Enable debug logging"
    echo -e "                               Default: disabled"
    echo
    echo -e "    -h, --help                 Display this help message and exit"
    echo
    echo -e "${BOLD}EXAMPLES:${RESET}"
    echo -e "    # Run with default settings"
    echo -e "    ./run-test-client.sh"
    echo
    echo -e "    # Run with HTTP endpoint enabled"
    echo -e "    ./run-test-client.sh --http"
    echo
    echo -e "    # Run tests against default host (i.e.: localhost) on custom port 9000"
    echo -e "    ./run-test-client.sh -p 9000"
    echo
    echo -e "    # Run tests against custom host 'test' and custom port 9000"
    echo -e "    ./run-test-client.sh --host test -p 9000"
    echo
    echo -e "    # Run with verbose logging for debug purposes"
    echo -e "    ./run-test-client.sh -v"
    echo
    echo -e "${BOLD}TROUBLESHOOTING:${RESET}"
    echo -e "    • Port already in use: Use -p|--port to specify a different port"
    echo -e "    • Permission denied: Run 'chmod +x start-auth-server.sh'"
    echo
    echo -e "${BOLD}========================================================${RESET}"
}

# ===== EXECUTION =====
main "$@"