# ionic-camera-swipe
It took me a lot of Victor Meldrew moments ("I don't believe it!") to get myself on the Ionic/Android dev ladder
with a MacBook Pro, so hopefully this will help at least 1 person to have a, "hey, that's really cool..." Ionic moment.

This repo enhances https://ionicframework.com/docs/angular/your-first-app with the following:
* Smartphone logging service to a tab (rather than the console accessed via 'adb' on Android)
* Swipe mechanism to delete images and messages
* Dynamic CSS variables
* Message passing between components with Event subscribe/publish
* Create new page and route to that page explicitly
* Native plugins (in addition to Camera + SQLite from Ionic example):
  * Displaying images with https://ionicframework.com/docs/native/photo-viewer
* Ionic UI components:
  * ToastController

##### Table of Contents
[Intro](#intro)  
[Android dev on MacOS](#android)  
[VNC + Visual Studio Code IDE](#vnc)  
[ADB on MacOS](#adb)  
[Commands necessary in creating repo](#commands)  
[Clone GitHub repo](#clone)  
[Android Emulator](#emulator)  
[Ionic DevApp](#devapp)  

<a name="intro"/>

### Intro
Ionic is a wrapper around the Cordova build system and Angular Javascript engine + UI features, in order to create hybrid mobile phone apps (as a one-liner appropriate for this repo).

Angular provides the MVC (found in server side systems like Ruby on Rails)
on the client side.  Cordova provides the cross-platform development for mobile phone apps.

If you are completely new to Ionic then save & open in a browser the single html page that demonstrates the <ion-refresher>
(https://ionicframework.com/docs/api/refresher)
* https://github.com/ionic-team/ionic-docs/blob/master/src/demos/api/refresher/index.html
* https://ionicframework.com/docs/installation/cdn#ionic-framework-cdn

<a name="android"/>

### Android dev on MacOS
Now onto getting on the Ionic app development for Android on MacOS (it's almost like deliberate competitor sabotage).
You need to install Java to use the Android SDK so it's natural to install the latest version of something...big mistake...!
You need Java 8 for Android SDK but if you install the latest version of Java on MacOS then you can't get rid of it...ffs...so you have to use Docker.
* https://docs.docker.com/docker-for-mac/install/
* Install Ubuntu Linux in a Docker container
```
    $ docker run -it ubuntu bash
```
* Install Cordova (on that Docker Ubuntu image)
```
  root@container-id:~# apt update
                    ~# apt-get install nodejs
                    ~# apt-get install npm
                    ~# npm install -g cordova

                    ~# cordova create myapp
                    ~/myapp# cordova platform add android

                    ~# apt install openjdk-8-jdk
                    ~# apt install android-sdk
                    ~# apt-get install vim
```
* Download Android SDK Tools for Linux (https://developer.android.com/studio) onto your MacOS
  * https://ionicframework.com/docs/installation/android#android-studio

    "We don't recommend using Android Studio for developing Ionic apps..."

In a separate terminal window commit the state of the Docker container to an image:
```
  $ docker ps
  $ docker commit <CONTAINER ID> ubuntu-cordova
```
* Restart the Docker 'ubuntu-cordova' image with access to the MacOS Desktop to access downloaded Android SDK
```
  root@container-id:~# exit

  [MACOS TERMINAL]   
  $ docker run -it -v ~/Desktop:/Desktop ubuntu-cordova bash

  [DOCKER CONTAINER]
  root@container-id:/# cd /root ; mkdir android-sdk ; cd android-sdk
                    ~/android-sdk# mv /Desktop/sdk-tools-linux-4333796.zip .
                    ~/android-sdk# unzip sdk-tools-linux-4333796.zip

  root@container-id:~/android-sdk# cd /root ; vi .bashrc
    # Creating Docker Cordova image
    export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
    export ANDROID_HOME=$HOME/android-sdk
    export PATH=$PATH:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools

    # Installing vncserver
    export USER=root

  root@container-id:~# source .bashrc
```
* Finish Android SDK requirements
```
  [CREATE EMPTY 'repositories.cfg' WHICH MAY NOT BE NECESSARY!]
  root@container-id:~# cd .android ; vi repositories.cfg
                    ~# sdkmanager --update
                    ~# sdkmanager --licenses
                    ~# sdkmanager "platforms;android-25"
                    ~# sdkmanager "platforms;android-28"
```
* Create 'myapp' APK
```
  root@container-id:~# cd myapp
                    ~/myapp# sdkmanager "build-tools;28.0.3"
                    ~/myapp# cordova build
      Built the following apk(s): 
      /root/myapp/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```
* Transfer APK to Android from MacOS Desktop via USB Android File Transfer and install it.

<a name="vnc"/>

### VNC + Visual Studio Code IDE
I initially used XServer on MacOS to display Visual Stuidio Code but found that VNC was a clearer image.

XServer on MacOS:
```
  $ brew cask install xquartz
  Reboot MacOS after installing 'xquartz'

  $ cd ; vi .bashrc
    IP=$(ifconfig en0 | grep inet | awk '$1=="inet" {print $2}')
    export PATH="$PATH:/usr/X11/bin"
    export DISPLAY=$IP:0

  $ open -a XQuartz
    Preferences, Security, "Allow connections from network clients"

  $ xhost +
    access control disabled, clients can connect from any host

  $ docker run -it -e DISPLAY=$IP:0 ubuntu-cordova bash
```
VNC:
```
  root@container-id:/# apt-get install xfce4 xfce4-goodies
                    /# apt-get install tightvncserver
                    ~# vncserver
                       [Follow instructions]
  root@container-id:~# apt-get install net-tools
                    ~# apt-get install iputils-ping

  MacOS $ docker run -it -p 5901:5901 -v ~/Desktop:/Desktop ubuntu-cordova bash

  root@container-id:~# vncserver

  MacOS Finder_Go_Connect to Server...Server Address: "vnc://localhost:5901" [+password created when config server]
  Application Finder_System_Xfce Terminal
```
Visual Studio Code:
```
  root@container-id:~# apt-get install curl
                    ~# curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
                    ~# mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
                    ~# apt-get update
                    ~# apt-get install code

  VNC Application Finder_System_Xfce Terminal
  root@container-id:~# code --user-data-dir=/root
    Xlib:  extension "RANDR" missing on display ":1.0".
```
* [enter Victor Meldrew stage right] https://github.com/microsoft/vscode/issues/3451#issuecomment-227197582
```
  root@container-id:/# cd /usr/share/code/
                    /usr/share/code# cp /usr/lib/x86_64-linux-gnu/libxcb.so.1 .
                    /usr/share/code# chmod a+x libxcb.so.1 
                    /usr/share/code# sed -i 's/BIG-REQUESTS/_IG-REQUESTS/' libxcb.so.1 

                    ~# code --user-data-dir=/root
```
<a name="adb"/>

### ADB on MacOS
```
  $ brew cask install android-platform-tools
```
* USB
  * Connect USB
  * $ adb devices
  * $ adb logcat
  * $ adb tcpip 5555
  * Disconnect USB

* WiFi
  * $ adb connect 192.168.1.2
  * $ adb logcat
  * $ adb logcat|grep chromium

<a name="commands"/>

### Commands necessary in creating repo
```
  MacOS $ docker run -it -p 5901:5901 -v ~/Desktop:/Desktop ubuntu-cordova bash

  root@container-id:~# npm install npm@latest -g
                    ~# exit
  [RESTART 'ubuntu-cordova']
  root@container-id:~# npm install -g n
                    ~# n lts

                    ~# npm -v
                       6.9.0
                    ~# node -v
                       v10.16.3
```
https://ionicframework.com/docs/angular/your-first-app
```
  root@container-id:~# npm install -g ionic cordova
                    ~# ionic start photo-gallery tabs

                    ~# npm install --unsafe-perm -g cordova-res  
```
https://ionicframework.com/docs/angular/your-first-app/ios-android-camera
```
                    ~/photo-gallery# npm install @ionic-native/camera
                    ~/photo-gallery# ionic cordova plugin add cordova-plugin-camera

                    ~/photo-gallery# ionic cordova build android
                    ~# cp /root/photo-gallery/platforms/android/app/build/outputs/apk/debug/app-debug.apk /Desktop/.
```
https://ionicframework.com/docs/angular/your-first-app/creating-photo-gallery-device-storage
```
                    ~/photo-gallery# ionic g service services/Photo
                    ~/photo-gallery# ionic cordova plugin add cordova-sqlite-storage
                    ~/photo-gallery# npm install --save @ionic/storage
```
Additions to Ionic example
```
                    ~/photo-gallery# ionic g service services/Log
                    ~/photo-gallery# ionic g page tab2/image
                    ~/photo-gallery# ionic cordova plugin add com-sarriaroman-photoviewer
                    ~/photo-gallery# npm install @ionic-native/photo-viewer
```
<a name="clone"/>

### Clone GitHub repo
Cloning 'ionic-camera-swipe' should be all that's necessary
```
  root@container-id:~# git clone https://github.com/doughazell/ionic-camera-swipe.git

  ON A FRESH SYSTEM YOU MAY NEED (since the other node modules are local to the repo):
  root@container-id:~# npm install -g ionic cordova

  root@container-id:~/ionic-camera-swipe# ionic cordova build android
  root@container-id:~/ionic-camera-swipe# cp platforms/android/app/build/outputs/apk/debug/app-debug.apk /Desktop/.
```
Transfer APK to Android from MacOS Desktop via USB Android File Transfer and install it.

<a name="emulator"/>

### Android Emulator
https://developer.android.com/studio/command-line/avdmanager

https://developer.android.com/studio/run/emulator-acceleration
* "You can't run a VM-accelerated emulator inside another VM, such as a VM hosted by VirtualBox, VMWare, or Docker. 
  You must run a VM-accelerated emulator directly on your host computer."

<a name="devapp"/>

### Ionic DevApp
I haven't found a way to use DevApp on Android from Ionic running in a Docker container since it's on a different subnet to the WiFi 
(and hence the IP address of the phone doesn't respond to the broadcasts from 'ionic serve --devapp').

Install the APK via USB Android File Transfer (or Google Drive mapped to Desktop on MacOS) or 'ionic serve' on VNC to test Ionic web features.

