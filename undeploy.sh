source ./setenv.sh
# ##### Variable section - START
SCRIPT=undeploy.sh
PLATFORM_OPTION=$1
UNDEPLOY_FUNCTION=
# ##### Variable section - END

# ***** Function section - START
undeployFromRaspberry()
{
	## Undeploy Windfire Maps component from remote Raspberry box
    echo ${cyn}Undeploy Windfire Maps component from Raspberry Pi ...${end}
    export ANSIBLE_CONFIG=$PWD/deployment/raspberry/ansible.cfg
    ansible-playbook deployment/raspberry/windfire-maps-undeploy.yaml 
    echo ${cyn}Done${end}
    echo
}

undeploy()
{
    rm -rf $PWD/app/node_modules
    if [ -z $PLATFORM_OPTION ]; then 
        printSelectPlatform
    fi
    $UNDEPLOY_FUNCTION
}

printSelectPlatform()
{
	echo ${grn}Select deployment platform : ${end}
    echo "${grn}1. Raspberry${end}"
    read PLATFORM_OPTION
	setUndeployFunction
}

setUndeployFunction()
{
	case $PLATFORM_OPTION in
		1)  UNDEPLOY_FUNCTION="undeployFromRaspberry"
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
    setUndeployFunction
fi
# ************** END evaluate args **************"
RUN_FUNCTION=undeploy
$RUN_FUNCTION