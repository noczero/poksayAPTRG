Bismillahirahamanirahim

Using SITL :
mavproxy --master tcp:127.0.0.1:5760 --sitl 127.0.0.1:5501 --out 127.0.0.1:14550 --out 127.0.0.1:14551

Using Mavproxy:
mavproxy --master com15  --out 127.0.0.1:14550 --out 127.0.0.1:14551

Start this first Loc : 
dronekit-sitl copter --home=-6.973448, 107.632733, 0, 180
