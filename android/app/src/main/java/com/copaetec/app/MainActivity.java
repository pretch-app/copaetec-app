package com.copaetec.app;

import android.os.Bundle;
import android.webkit.CookieManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // The UI is served from copaetec.vercel.app but the session cookie is set by the
        // backend on copaetec-backend.vercel.app. Android's WebView drops those third-party
        // cookies unless we opt in, which would break Google sign-in and every
        // credentialed API call.
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        if (getBridge() != null && getBridge().getWebView() != null) {
            cookieManager.setAcceptThirdPartyCookies(getBridge().getWebView(), true);
        }
    }
}
