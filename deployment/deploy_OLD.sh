#!/bin/bash

# ***** Deploy script for Windfire Maps component *****

source ../setenv.sh
source ../commons.sh

# ##### Variable section - START
SCRIPT=deploy.sh
PLATFORM_OPTION=$1
DEPLOY_FUNCTION=
# ##### Variable section - END

# ***** Function section - START
deployToRaspberry()
{
	## Deploy Windfire Maps component to remote Raspberry box
    echo ${cyn}Deploy Windfire Maps component to Raspberry Pi ...${end}
    eval "$(ssh-agent -s)"
    ssh-add $HOME/.ssh/ansible_rsa
    #export ANSIBLE_CONFIG=$PWD/raspberry/ansible.cfg
    ansible-playbook raspberry/windfire-maps-deploy.yaml 
    echo ${cyn}Done${end}
    echo
}

deploy()
{
    rm -rf $PWD/app/node_modules
    if [ -z $PLATFORM_OPTION ]; then 
        printSelectPlatform
    fi
    $DEPLOY_FUNCTION
}

# ***** Function section - END

# ##############################################
# #################### MAIN ####################
# ##############################################
# ************ START evaluate args ************"
if [ "$1" != "" ]; then
    setDeployFunction
fi
# ************** END evaluate args **************"
RUN_FUNCTION=deploy
$RUN_FUNCTION