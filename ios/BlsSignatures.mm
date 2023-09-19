#import <React/RCTBlobManager.h>
#import <React/RCTBridge+Private.h>
#import <ReactCommon/RCTTurboModule.h>
#import <jsi/jsi.h>

#import "BlsSignatures.h"
#import "../cpp/PrivateKeyHostObject.h"
#import "../cpp/AugSchemeMPLHostObject.h"
#import "../cpp/BasicSchemeMPLHostObject.h"
#import "../cpp/PopSchemeMPLHostObject.h"
#import "../cpp/G1ElementHostObject.h"
#import "../cpp/G2ElementHostObject.h"
#import "../cpp/Util.h"
#import "../cpp/TypedArray.h"

using namespace bls;

@implementation BlsSignatures

RCT_EXPORT_MODULE(BlsSignatures)

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(install)
{
    NSLog(@"Installing React Native BLS Signatures...");
    RCTBridge* bridge = [RCTBridge currentBridge];
    RCTCxxBridge* cxxBridge = (RCTCxxBridge*)bridge;
    if (cxxBridge == nil) {
      return @false;
    }

    using namespace facebook;

    auto jsiRuntime = (jsi::Runtime*) cxxBridge.runtime;
    if (jsiRuntime == nil) {
      return @false;
    }
    auto& runtime = *jsiRuntime;

    utils::install(runtime);
    install(runtime);

    jsi::Object cacheCleaner = jsi::Object::createFromHostObject(runtime,
                                                               std::make_shared<InvalidateCacheOnDestroy>(runtime));
    runtime.global().setProperty(runtime, "__blsCacheCleaner", cacheCleaner);

    NSLog(@"Installed React Native BLS Signatures");
    return @true;
}

static void install(jsi::Runtime &jsiRuntime) {
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

@end
