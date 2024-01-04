package com.bls;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;

abstract class BlsSpec extends ReactContextBaseJavaModule {
  BlsSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract boolean install();
}
