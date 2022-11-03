var fs = require('fs');
var spawn = require('child_process').spawn;

const emitSSE= (res, index, time, can, id, dt1, dt2, dt3, dt4, dt5, dt6, dt7,dt8, decoded) =>{
    res.write('id: ' + index + '\n');
    res.write(`data: {"time": "${time}", "can": "${can}", "id": "${id}", "dt1": "${dt1}", "dt2": "${dt2}", "dt3": "${dt3}", "dt4": "${dt4}", "dt5": "${dt5}", "dt6": "${dt6}", "dt7": "${dt7}", "dt8": "${dt8}", "ECU": "${decoded[0]}","Values": "${decoded[1]}"}`);
    res.write("\n\n");
  }

module.exports = (req,res) => {
    res.writeHead(200, {"Access-Control-Allow-Origin": "*",
                        "Content-Type": "text/event-stream",
                        "Cache-control": "no-cache",
                        "Connection": "keep-alive"});
    //We can use candump filters e.g. 'candump vcan0,9803FEFE:1ffffff' (extended version 29-bits) or 201:7ff (11-bit)
    var child = spawn('candump -t a', ['vcan0 | python3 -m cantools decode --single-line dbc-files/client-j1939.dbc'], {shell: true, detached: true});
    child.unref();
    var writeStream = fs.createWriteStream('./packets/decoded.pcap',{flags: 'a'});
    
    //Writing to file
    child.stdout.on('data', function (data) {
        writeStream.write(data); //This works perfectly to write the stream on a file
        writeStream.end();
    });
    
    child.stdout.on('data', function (data) {
        str = ''
        str = data.toString() + '\n';
        var lines = str.split("\n");
        var clines = lines.filter(element => {
            return element !== '';
          });
        for(var i in clines) {
            packet ='';
            packet = clines[i].split("::");
            raw = packet[0].trim().replace(/\s+/g, '*');
            frame = '';
            frame = raw.split("*");
            decoded = packet[1].trim().replace('(','*').replace(')','*').split("*")
            emitSSE(res, i, frame[0], frame[1], frame[2], frame[4], frame[5], frame[6], frame[7], frame[8], frame[9], frame[10], frame[11], decoded);   
        }
        
    });
    
    /*
    // Reading packets from candump (terminal output)
    child.stdout.on('data',function (data) {
        console.log(`${data}`);
    });
    */
    child.stderr.on('data', function (data) {
    res.end('stderr: ' + data);
    });

    child.on('exit', (code) => {
        console.log(`child process exited with code ${code}`);
      });

    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    
}
