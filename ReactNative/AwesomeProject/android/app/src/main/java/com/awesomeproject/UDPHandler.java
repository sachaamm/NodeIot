package com.awesomeproject;


import android.os.AsyncTask;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UDPHandler extends ReactContextBaseJavaModule {

    //UdpClientHandler udpClientHandler;
    private AsyncTask<Void, Void, Void> async_client;

    private int serverPort = 0;
    private String addr = null;

    ReactContext reactContext;
    String udpMsg = "HELLO";
    InetAddress serverAddr;

    DatagramSocket ds = null;

    private Handler customHandler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(Message message) {
            // This is where you do your work in the UI thread.
            // Your worker tells you in the message what to do.
        }
    };


    public UDPHandler(ReactApplicationContext _reactContext) {
        super(_reactContext);
        reactContext = _reactContext;
    }

    @ReactMethod
    public void create(int port, String _addr) {

        serverPort = port;
        addr = _addr;

        try {
            serverAddr = InetAddress.getByName(addr); //<== IP du serveur distant
        }catch (Exception e) {
            Log.e("UDPTest", "Création addr", e);
        }

        runUdpClient();

        WritableMap params = Arguments.createMap();
        params.putDouble("relativeX",999);

        runnable.run(); // START RUNNABLE
        //sendEvent(reactContext, "myAwesomeEvent", params);

    }

    
    public void askESP32Values(int port, String _addr) {

        serverPort = port;
        addr = _addr;
        udpMsg = "VALUES";
        runUdpClient();




        //WritableMap params = Arguments.createMap();
        //params.putDouble("relativeX",999);


    }


    @Override
    public String getName() {
        return "UDPHandler";
    }


    private void runUdpClient() {
        final int UDP_SERVER_PORT = serverPort; //<=== numéro de port
        async_client = new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... params) {


                try {
                    ds = new DatagramSocket();

                    DatagramPacket dp;
                    dp = new DatagramPacket(udpMsg.getBytes(), udpMsg.length(), serverAddr, UDP_SERVER_PORT);

                    try{
                        ds.send(dp);
                        Log.i("send udp packet","msg " + udpMsg + " port# " + serverPort + " UDP_SERVER_PORT " + UDP_SERVER_PORT);

                    }catch (Exception e) {
                        Log.e("UDPTest", " *** Problème d'envoi datagram", e);
                    }

                    byte[] buffer = new byte[2048];

                    DatagramPacket receivePacket;
                    receivePacket = new DatagramPacket(buffer, buffer.length);



                    while (true) {

                        ds.receive(receivePacket);
                        receivePacket.setLength(buffer.length);
                        WritableMap udpParams = Arguments.createMap();
                        udpParams.putString("relativeX",new String(buffer, 0, receivePacket.getLength()));
                        sendEvent(reactContext, "receiveUdp", udpParams);

                    }


                } catch (Exception e) {
                    Log.e("UDPTest", "Problème d'envoi datagram", e);
                } finally {

                    /*
                    if (ds != null) {
                        ds.close();
                    }
                    */
                }
                return null;
            }
            protected void onPostExecute(Void result) {
                super.onPostExecute(result);
            }
        };
        if (Build.VERSION.SDK_INT >= 11)
            async_client.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
        else async_client.execute();
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private Runnable runnable = new Runnable() { // GET VALUES
        @Override
        public void run() {

            if(ds != null){

                udpMsg = "VALUES";
                Log.i("ask values","run on " + addr + " port# " + serverPort);

                DatagramPacket dp;
                dp = new DatagramPacket(udpMsg.getBytes(), udpMsg.length(), serverAddr, serverPort);

                try{
                    ds.send(dp);
                    Log.i("send udp packet","msg " + udpMsg + " port# " + serverPort + " UDP_SERVER_PORT " + serverPort);

                }catch (Exception e) {
                    Log.e("UDPTest", " *** Problème d'envoi datagram", e);
                }


            }







            customHandler.postDelayed(this, 5000);
        }


    };




}
