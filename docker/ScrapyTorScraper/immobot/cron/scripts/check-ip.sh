#!/bin/bash

#echo "$SCRAPER_STATUS"

#if [ "$SCRAPER_STATUS" = "false" ];
#then
#       echo "status false"
#       export SCRAPER_STATUS=true
#else
#       echo "status true"
#fi

check_ip="false"

echo "not" > /home/immobot/status

while [ "$check_ip"  != "true" ]
do
        case "$(torify curl -s --max-time 2 -I http://www.seloger.com/ | sed 's/^[^ ]*  *\([0-9]\).*/\1/; 1q')" in
          [23]) echo "$(date) - HTTP connectivity is up";
                echo "ready" > /home/immobot/status;
                check_ip="true";;
          5) echo "$(date) - The web proxy won't let us through";
                killall -HUP tor;;
          *) echo "$(date) - The network is down or very slow";
                killall -HUP tor;;
        esac
done

#  exit 1
