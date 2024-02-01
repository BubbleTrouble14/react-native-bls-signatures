#include <jni.h>

#include <ReactCommon/CallInvokerHolder.h>
#include <jsi/jsi.h>

#include "JsiBlsApi.h"
// #include <RuntimeAwareCache.h>
// #include "RNBlsManager.h"

using namespace facebook; // NOLINT

extern "C" JNIEXPORT jboolean JNICALL Java_com_bls_BlsModule_nativeInstall(
    JNIEnv *env, jclass obj, jlong jsiRuntimeRef, jobject jsCallInvokerHolder)
{
  auto jsiRuntime{reinterpret_cast<jsi::Runtime *>(jsiRuntimeRef)};
  auto jsCallInvoker{jni::alias_ref<react::CallInvokerHolder::javaobject>{
      reinterpret_cast<react::CallInvokerHolder::javaobject>(
          jsCallInvokerHolder)} -> cthis()
                         ->getCallInvoker()};

  // RNBls::RNBlsManager(jsiRuntime, jsCallInvoker);
  // RNJsi::BaseRuntimeAwareCache::setMainJsRuntime(jsiRuntime);

  // // Install the bls API
  RNBls::JsiBlsApi::installApi(*jsiRuntime);

  return true;
}
