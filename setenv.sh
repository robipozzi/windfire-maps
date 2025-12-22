##### TERMINAL COLORS - START
# ===== COLOR CODES =====
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED=$'\e[1;31m'
MAGENTA=$'\e[1;35m'
BLU=$'\e[1;34m'
CYAN=$'\e[1;36m'
RESET='\033[0m'
BOLD='\033[1m'
# ===== EMOJI =====
coffee=$'\xE2\x98\x95'
coffee3="${coffee} ${coffee} ${coffee}"
##### TERMINAL COLORS - END

###### Variable section - START
# ===== DEPLOYMENT / UNDEPLOYMENT =====
PLATFORM_OPTION=$1
PLATFORM_SELECTED=false
DEPLOY_PLATFORM=
DEPLOY_FUNCTION=

# ===== ROOT CA =====
WINDFIRE_ROOT_CA_KEY="WindfireRootCA.key"
WINDFIRE_ROOT_CA_CERTIFICATE="WindfireRootCA.crt"
WINDFIRE_DEFAULT_KEYSTORE_DIR=$HOME/opt/windfire/ssl/keystore
WINDFIRE_DEFAULT_TRUSTSTORE_DIR=$HOME/opt/windfire/ssl/truststore
WINDFIRE_DEFAULT_CERTS_PROD_DIR=$HOME/opt/windfire/ssl/certs/raspberry
###### Variable section - END

# ***** Function section - START
selectPlatform()
{
    if [[ $PLATFORM_OPTION == "" && $PLATFORM_SELECTED == false ]]; then
        echo -e "${BLU}No platform option provided - Select deployment platform :${RESET}"
        echo -e "${GREEN}1. Raspberry${RESET}"
        read PLATFORM_OPTION
        setDeployPlatform
    else
        echo -e "${CYAN}Platform option provided as argument: $PLATFORM_OPTION${RESET}"
        setDeployPlatform
    fi
}

setDeployPlatform()
{
    case $PLATFORM_OPTION in
        1)  DEPLOY_PLATFORM="raspberry"
            PLATFORM_SELECTED=true
            DEPLOY_PLATFORM="raspberry"
            ;;
        *)  echo -e "${RED}No valid option selected${RESET}"
            PLATFORM_OPTION=""
            PLATFORM_SELECTED=false
            selectPlatform
            ;;
    esac
}
# ***** Function section - END