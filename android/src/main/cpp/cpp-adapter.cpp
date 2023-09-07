#include <jni.h>
#include <jsi/jsi.h>
#include <string>
#include "../cpp/JSI Utils/TypedArray.h"
#include <android/log.h>
#include <vector>
#include "PrivateKeyHostObject.h"
#include "AugSchemeMPLHostObject.h"
#include "G1ElementHostObject.h"

#include "bls.hpp"
using namespace bls;

using namespace facebook;
using namespace std;

void install(jsi::Runtime& jsiRuntime) {

  //  auto PrivateKey = jsi::Function::createFromHostFunction(
  //     jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "PrivateKey"), 0,
  //     [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
  //        size_t count) -> jsi::Value {
  //       if (count != 0) {
  //         throw jsi::JSError(runtime, "PrivateKeyHostObject.createNewInstance(..) expects 0 arguments!");
  //       }

  //       auto instance = std::make_shared<PrivateKeyHostObject>();
  //       return jsi::Object::createFromHostObject(runtime, instance);
  //     });

  //     jsiRuntime.global().setProperty(jsiRuntime, "PrivateKey",std::move(PrivateKey));


   auto AugSchemeMPL = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "AugSchemeMPL"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "AugSchemeMPLHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<AugSchemeMPLHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    jsiRuntime.global().setProperty(jsiRuntime, "AugSchemeMPL",std::move(AugSchemeMPL));


  //  auto G1Element = jsi::Function::createFromHostFunction(
  //     jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "G1Element"), 0,
  //     [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
  //        size_t count) -> jsi::Value {
  //       if (count != 0) {
  //         throw jsi::JSError(runtime, "G1ElementHostObject.createNewInstance(..) expects 0 arguments!");
  //       }

  //       auto instance = std::make_shared<G1ElementHostObject>();
  //       return jsi::Object::createFromHostObject(runtime, instance);
  //     });

  //   jsiRuntime.global().setProperty(jsiRuntime, "G1Element",std::move(G1Element));
}

extern "C"
JNIEXPORT void JNICALL
Java_com_reactnativebls_BlsSignaturesModule_nativeInstall(JNIEnv *env, jclass _, jlong jsiPtr, jobject instance) {

    auto runtime = reinterpret_cast<jsi::Runtime*>(jsiPtr);

    if (runtime) {
        install(*runtime);
    }
    // if runtime was nullptr, the helper will not be installed. This should only happen while Remote Debugging (Chrome), but will be weird either way.
}
