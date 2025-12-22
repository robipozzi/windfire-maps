#!/bin/bash

# ***** Undeploy script for Windfire Maps component *****

source ../setenv.sh

# ===== MAIN FUNCTION =====
main() {
    # Display header
    echo -e "${BOLD}${BLU}######################################################################${RESET}"
    echo -e "${BOLD}${BLU}############### Windfire Maps Service deploy procedure ###############${RESET}"
    echo -e "${BOLD}${BLU}######################################################################${RESET}"
    echo
    
    # Parse arguments
    parseArgs $@

    # Start deployment
    deploy $@
}

parseArgs()
{
    echo -e "${BOLD}Parsing arguments...${RESET}"
    selectPlatform $@
    echo -e "${BOLD}Selected platform: ${DEPLOY_PLATFORM}${RESET}"
}

deploy()
{ 
    setFunction
    $DEPLOY_FUNCTION
}

setFunction()
{
	case $DEPLOY_PLATFORM in
		raspberry) DEPLOY_FUNCTION="deployToRaspberry"
			;;
		*)  echo -e "${RED}No valid option selected${RESET}"
			selectPlatform $@
			;;
	esac
}

deployToRaspberry()
{
	## Deploy Windfire Maps component to remote Raspberry box
    echo ${cyn}Deploy Windfire Maps component to Raspberry Pi ...${end}
    eval "$(ssh-agent -s)"
    ssh-add $HOME/.ssh/ansible_rsa
    export ANSIBLE_CONFIG=$PWD/raspberry/ansible.cfg
    ansible-playbook raspberry/windfire-maps-deploy.yaml 
    echo ${cyn}Done${end}
    echo
}

# ===== EXECUTION =====
main $@