#!/bin/bash

check_ip="false"

echo "not" > /home/NodeTorScraper/status

while [ "$check_ip"  != "true" ]
do
        case "$(torify curl -s --max-time 2 -I http://www.logic-immo.com/ | sed 's/^[^ ]*  *\([0-9]\).*/\1/; 1q')" in
          [23]) echo "$(date) - HTTP connectivity is up";
                echo "ready" > /home/NodeTorScraper/status;
                check_ip="true";;
          5) echo "$(date) - The web proxy won't let us through";
                killall -HUP tor;;
          *) echo "$(date) - The network is down or very slow";
                killall -HUP tor;;
        esac
done

#  exit 1
