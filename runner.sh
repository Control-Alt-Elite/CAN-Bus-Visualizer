#!/usr/bin/bash
declare apiPId=$apiPId;
declare clientPId=$clientPId;
declare cangenId=$cangenId;


# function startVcan () {
#     sudo modprobe vcan
#     sudo ip link add dev vcan0 type vcan
#     sudo ip link set up vcan0
#     #ifconfig vcan0
#     cangen vcan0 -e -L 8 -g 1000 -v & 
#     cangenId=$!;

# }
function runClient(){
    cd CAN-Bus-Visualizer/client && npm install && npm start &
    clientPId=$!;
    sleep 2 &
}
function run(){
    #start the database
    
   
    #cd into server folder
    cd CAN-Bus-Visualizer/api && npm install && npm start &
    apiId=$!;
    sleep 2 &
    
    #cd into client folder
    runClient
    # cd /client && npm install && npm start &
    # clientPId=$!;
    # sleep 2 &
    
    #start up vcan
    sudo modprobe vcan
    sudo ip link add dev vcan0 type vcan
    sudo ip link set up vcan0
    #ifconfig vcan0
    cangen vcan0 -e -L 8 -g 1000 -v & 
    cangenId=$!;
    sleep 2 &

    
    
    #startVcan;
    #startMongo();
    sudo service mongod start;
    #wait
    wait;
    echo "processes complete"
   
   
 
}


#to exit and kill processes
function onexit() {
  kill -9 $apiPId;
  kill -9 $clientPId;
  kill -9 $cangenId;
  kill &&
  exit
}
trap onexit SIGINT;
run
