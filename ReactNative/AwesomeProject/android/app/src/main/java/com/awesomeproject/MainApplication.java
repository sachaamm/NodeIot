package com.awesomeproject;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.github.yamill.orientation.OrientationPackage;
import com.horcrux.svg.SvgPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.awesomeproject.CustomToastPackage; // <-- Add this line with your package name.

import com.github.yamill.orientation.OrientationPackage;  // <--- import 
 



import java.util.Arrays;
import java.util.List;

import com.awesomeproject.UDPHandler;

public class MainApplication extends Application implements ReactApplication {

  UDPHandler udpHandler;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new OrientationPackage(),
            new SvgPackage(),
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new CustomToastPackage()
       

      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    //Fresco.initialize(this);
    //udpHandler = new UDPHandler(3333,"192.168.1.29");

    
    SoLoader.init(this, /* native exopackage */ false);
  }
}
