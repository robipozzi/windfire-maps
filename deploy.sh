source ./setenv.sh
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
    export ANSIBLE_CONFIG=$PWD/deployment/raspberry/ansible.cfg
    ansible-playbook deployment/raspberry/windfire-maps.yaml 
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

printSelectPlatform()
{
	echo ${grn}Select deployment platform : ${end}
    echo "${grn}1. Raspberry${end}"
    read PLATFORM_OPTION
	setDeployFunction
}

setDeployFunction()
{
	case $PLATFORM_OPTION in
		1)  DEPLOY_FUNCTION="deployToRaspberry"
			;;
		*)  echo "${red}No valid option selected${end}"
			printSelectPlatform
			;;
	esac
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