#!/bin/bash
source ../common.sh

# ***** Undeploy script for Windfire Maps component *****

# ===== MAIN FUNCTION =====
main() {
    # Display header
    echo -e "${BOLD}${BLU}########################################################################${RESET}"
    echo -e "${BOLD}${BLU}############### Windfire Maps Service undeploy procedure ###############${RESET}"
    echo -e "${BOLD}${BLU}########################################################################${RESET}"
    echo
    
    # Parse arguments
    parseArgs $@

    # Start undeployment
    undeploy $@
}

parseArgs()
{
    echo -e "${BOLD}Parsing arguments...${RESET}"
    selectPlatform $@
    echo -e "${BOLD}Selected platform: ${DEPLOY_PLATFORM}${RESET}"
}

undeploy()
{ 
    setFunction
    $DEPLOY_FUNCTION
}

setFunction()
{
	case $DEPLOY_PLATFORM in
		raspberry) DEPLOY_FUNCTION="undeployFromRaspberry"
			;;
		*)  echo -e "${RED}No valid option selected${RESET}"
			selectPlatform $@
			;;
	esac
}

undeployFromRaspberry()
{
	## Undeploy Windfire Maps component from remote Raspberry box
    echo ${cyn}Undeploy Windfire Maps component from Raspberry Pi ...${end}
    eval "$(ssh-agent -s)"
    ssh-add $HOME/.ssh/ansible_rsa
    export ANSIBLE_CONFIG=$PWD/raspberry/ansible.cfg
    ansible-playbook raspberry/windfire-maps-undeploy.yaml 
    echo ${cyn}Done${end}
    echo
}

# ===== EXECUTION =====
main $@