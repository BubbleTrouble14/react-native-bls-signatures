#import <React/RCTBlobManager.h>
#import <React/RCTBridge+Private.h>
#import <ReactCommon/RCTTurboModule.h>
#import <jsi/jsi.h>

#import "BlsSignatures.h"
#include "../cpp/PrivateKeyHostObject.h"
#include "../cpp/AugSchemeMPLHostObject.h"
#include "../cpp/BasicSchemeMPLHostObject.h"
#include "../cpp/PopSchemeMPLHostObject.h"
#include "../cpp/G1ElementHostObject.h"
#include "../cpp/G2ElementHostObject.h"
#include "../cpp/Util.h"

using namespace bls;
using namespace facebook;

@implementation BlsSignatures

RCT_EXPORT_MODULE(BlsSignatures)

+ (NSString*)getPropertyAsStringOrNilFromObject:(jsi::Object&)object
                                   propertyName:(std::string)propertyName
                                        runtime:(jsi::Runtime&)runtime {
  jsi::Value value = object.getProperty(runtime, propertyName.c_str());
  std::string string = value.isString() ? value.asString(runtime).utf8(runtime) : "";
  return string.length() > 0 ? [NSString stringWithUTF8String:string.c_str()] : nil;
}

// Installing JSI Bindings as done by
// https://github.com/mrousavy/react-native-mmkv
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(install)
{
    RCTBridge* bridge = [RCTBridge currentBridge];
    RCTCxxBridge* cxxBridge = (RCTCxxBridge*)bridge;
    if (cxxBridge == nil) {
        return @false;
    }

    auto jsiRuntime = (jsi::Runtime*) cxxBridge.runtime;
    if (jsiRuntime == nil) {
        return @false;
    }

    utils::install(*(facebook::jsi::Runtime *)jsiRuntime);
    install(*(facebook::jsi::Runtime *)jsiRuntime);


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
