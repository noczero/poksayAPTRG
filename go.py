from dronekit import connect, VehicleMode, LocationGlobalRelative
import time
import math

# ----
# FUNCTIONS
# ----
# to calculate distance
def get_distance_metres(aLocation1, aLocation2):
    dlat = aLocation2.lat - aLocation1.lat
    dlong = aLocation2.lon - aLocation1.lon
    return math.sqrt((dlat*dlat) + (dlong*dlong)) * 1.113195e5

targetAltitude = 30
def armingAndTakeOff(targetAltitude):
    print("Pre arm check")
    while not wahana.is_armable:
        print("Menunggu wahana ready....")
        time.sleep(1)

    # arming
    wahana.mode = VehicleMode("GUIDED")
    wahana.armed = True

    #confirm arming
    while not wahana.armed:
        print("Waiting for arming..")
        time.sleep(1)

    # takeoff to spesific altitude
    wahana.simple_takeoff(targetAltitude)

    currentAltitude = 0
    while currentAltitude <= targetAltitude*0.95:
        currentAltitude = wahana.location.global_relative_frame.alt
        print("Current Altitude : %s" ) % currentAltitude
        time.sleep(1)
    print ("Current Altitude has reached, going to waypoints %s" )% targetAltitude


# ----
# INITIALIZE
# ----

sitl_ip = 'udp:127.0.0.1:14551'
wahana = connect(sitl_ip, wait_ready=True)

# ----
# MAIN FUNCTION
# ----
armingAndTakeOff(30) #with the altitude

#define point coordinate
        #Lokasi (lat, long, alt)
point1 = LocationGlobalRelative(-6.972947, 107.632797, 35)
point2 = LocationGlobalRelative(-6.972351, 107.632979, 50)
point3 = LocationGlobalRelative(-6.972319, 107.632271, 30)
point4 = LocationGlobalRelative(-6.972724, 107.631767, 30)
point5 = LocationGlobalRelative(-6.973533, 107.631585, 30)
point6 = LocationGlobalRelative(-6.973714, 107.632604, 30)
# set speed vehicle unit is m.s
# setting kecepatan wahana saat diudara
airSpeed = 500
print ("Set airspeed %d" )% airSpeed
wahana.airspeed = airSpeed #set airspeed

print("Go to point 1")
wahana.simple_goto(point1)
finished = False
while not finished:
    print("waiting...going to next waypoint")
    #set waypoint wahana
    posisiSementara = wahana.location.global_relative_frame
    distancePoint1 = get_distance_metres(point1, posisiSementara)
    distancePoint2 = get_distance_metres(point2, posisiSementara)
    distancePoint3 = get_distance_metres(point3, posisiSementara)
    distancePoint4 = get_distance_metres(point4, posisiSementara)
    distancePoint5 = get_distance_metres(point5, posisiSementara)
    distancePoint6 = get_distance_metres(point6, posisiSementara)

    print("distance point 1 : %f") % distancePoint1
    print("distance point 2 : %f") % distancePoint2
    print("distance point 3 : %f") % distancePoint3
    print("distance point 4 : %f") % distancePoint4
    print("distance point 5 : %f") % distancePoint5
    print("distance point 6 : %f") % distancePoint6

    if distancePoint1 < 7:
        # go to waypoint 2
        print("go to point 2")
        wahana.simple_goto(point2)
    elif distancePoint2 < 7:
        # go to waypoint 3
        print("go to point 3")
        wahana.simple_goto(point3)
    elif distancePoint3 < 7:
        #finished = True
        print("go to point 4")
        wahana.simple_goto(point4)
    elif distancePoint4 < 7:
        #finished = True
        print("go to point 5")
        wahana.simple_goto(point5)
    elif distancePoint5 < 7:
        #finished = True
        print("go to point 6")
        wahana.simple_goto(point6)
    elif distancePoint6 < 7:
        finished = True
    else:
        print("On the way to way point ")

    print " %s" % posisiSementara

    time.sleep(1)

# when finished
wahana.mode = VehicleMode("RTL")

# Close vehicle object
print("Close vehicle")
wahana.close()





