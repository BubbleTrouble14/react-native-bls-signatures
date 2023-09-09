#include <jni.h>
#include <jsi/jsi.h>
#include <string>
#include <android/log.h>
#include <vector>
#include "PrivateKeyHostObject.h"
#include "AugSchemeMPLHostObject.h"
#include "BasicSchemeMPLHostObject.h"
#include "PopSchemeMPLHostObject.h"
#include "G1ElementHostObject.h"
#include "G2ElementHostObject.h"

// #include "bls.hpp"
// using namespace bls;

using namespace facebook;
using namespace std;

void install(jsi::Runtime& jsiRuntime) {

   auto createPrivateKeyInstance = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "createPrivateKeyInstance"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "PrivateKeyHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<PrivateKeyHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

      jsiRuntime.global().setProperty(jsiRuntime, "createPrivateKeyInstance",std::move(createPrivateKeyInstance));


   auto createAugSchemeMPLInstance = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "createAugSchemeMPLInstance"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "AugSchemeMPLHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<AugSchemeMPLHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    jsiRuntime.global().setProperty(jsiRuntime, "createAugSchemeMPLInstance",std::move(createAugSchemeMPLInstance));


   auto createBasicSchemeMPLInstance = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "createBasicSchemeMPLInstance"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "createBasicSchemeMPLInstance.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<BasicSchemeMPLHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    jsiRuntime.global().setProperty(jsiRuntime, "createBasicSchemeMPLInstance",std::move(createBasicSchemeMPLInstance));


   auto createPopSchemeMPLInstance = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "createPopSchemeMPLInstance"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "createPopSchemeMPLInstance.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<PopSchemeMPLHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    jsiRuntime.global().setProperty(jsiRuntime, "createPopSchemeMPLInstance",std::move(createPopSchemeMPLInstance));

   auto createG1Element = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "createG1Element"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "G1ElementHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<G1ElementHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    jsiRuntime.global().setProperty(jsiRuntime, "createG1Element",std::move(createG1Element));


   auto createG2Element = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "createG2Element"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "G2ElementHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<G2ElementHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    jsiRuntime.global().setProperty(jsiRuntime, "createG2Element",std::move(createG2Element));
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
