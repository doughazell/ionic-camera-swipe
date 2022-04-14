package com.sarriaroman.PhotoViewer;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
// 12/4/22 DH:
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

// 14/4/22 DH:
//import com.sarriaroman.PhotoViewer.*;

/**
 * Class to Open PhotoViewer with the Required Parameters from Cordova
 * <p>
 * - URL
 * - Title
 */
public class PhotoViewer extends CordovaPlugin {

    public static final int PERMISSION_DENIED_ERROR = 20;

    public static final String WRITE = Manifest.permission.WRITE_EXTERNAL_STORAGE;
    public static final String READ = Manifest.permission.READ_EXTERNAL_STORAGE;

    public static final int REQ_CODE = 0;
    // 14/4/22 DH: https://developer.android.com/reference/android/app/Activity#RESULT_FIRST_USER
    public static final int SPEECH_CODE = 69;

    protected JSONArray args;
    protected CallbackContext callbackContext;

    // 9/4/22 DH:
    private static final String LOG_TAG = "PhotoViewerDH";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("show")) {
            this.args = args;
            this.callbackContext = callbackContext;

            if (cordova.hasPermission(READ) && cordova.hasPermission(WRITE)) {
                this.launchActivity();
            } else {
                this.getPermission();
            }
            return true;
        }
        return false;
    }

    protected void getPermission() {
        cordova.requestPermissions(this, REQ_CODE, new String[]{WRITE, READ});
    }

    //
    protected void launchActivity() throws JSONException {
        Log.d(LOG_TAG,"CordovaPlugin.launchActivity()");
        Intent i = new Intent(this.cordova.getActivity(), com.sarriaroman.PhotoViewer.PhotoActivity.class);
        //new Intent(Context, Class<>)
        PhotoActivity.mArgs = this.args;

        // 9/4/22 DH:
        //this.cordova.getActivity().startActivity(i);
        this.cordova.startActivityForResult((CordovaPlugin) this,i,REQ_CODE);

        // 14/4/22 DH: This leads to 'com.example.app.MainActivity cannot be cast to com.sarriaroman.PhotoViewer.PhotoActivity'
        //PhotoActivity mPhotoActivity = (PhotoActivity) this.cordova.getActivity();
        //mPhotoActivity.setCordovaPlugin(this);

        // 8/4/22 DH:
        //this.callbackContext.error("Dont fink so...");
        // 13/4/22 DH:
        //this.callbackContext.success("launchActivity() callbackContext.success()");
    }

    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions,
                                          int[] grantResults) throws JSONException {
        for (int r : grantResults) {
            if (r == PackageManager.PERMISSION_DENIED) {
                this.callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, PERMISSION_DENIED_ERROR));
                return;
            }
        }

        switch (requestCode) {
            case REQ_CODE:
                launchActivity();
                break;
        }

    }

    // 8/4/22 DH: Taken from 'CameraLauncher.java'
    /**
     * Called when the view exits.
     *
     * @param requestCode The request code originally supplied to startActivityForResult(),
     *                    allowing you to identify who this result came from.
     * @param resultCode  The integer result code returned by the child activity through its setResult().
     * @param intent      An Intent, which can return result data to the caller (various data can be attached to Intent "extras").
     */

    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.d(LOG_TAG,"CordovaPlugin.onActivityResult() resultCode: " + resultCode + ", requestCode: " + requestCode);
        //this.callbackContext.success("CordovaPlugin.onActivityResult(): " + resultCode);

        // 13/4/22 DH: 'callbackContext' doesn't work here IF the Promise has already been returned in launchActivity()
        // https://developer.android.com/reference/android/app/Activity#RESULT_CANCELED
        if (resultCode == Activity.RESULT_CANCELED) {
            try {
                // 13/4/22 DH: This will not work if a callback has already been issued previously
                this.callbackContext.success("Nice work, good job");
            } catch (Exception e) {
                e.printStackTrace();
                this.callbackContext.error("FFS...!");
            }
        }

        if (resultCode == SPEECH_CODE) {
            this.callbackContext.success(SPEECH_CODE);
        } else {
            this.callbackContext.error("No speech required");
        }
    }

}
