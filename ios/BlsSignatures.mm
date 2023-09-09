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

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(install) {
  NSLog(@"Installing global.BLSInstance...");
  RCTBridge* bridge = [RCTBridge currentBridge];
  RCTCxxBridge* cxxBridge = (RCTCxxBridge*)bridge;
  if (cxxBridge == nil) {
    return @false;
  }

  using namespace facebook;

  auto jsiRuntime = (jsi::Runtime*)cxxBridge.runtime;
  if (jsiRuntime == nil) {
    return @false;
  }
  auto& runtime = *jsiRuntime;

   auto createPrivateKeyInstance = jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, "createPrivateKeyInstance"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "PrivateKeyHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<PrivateKeyHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

      runtime.global().setProperty(runtime, "createPrivateKeyInstance",std::move(createPrivateKeyInstance));


   auto createAugSchemeMPLInstance = jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, "createAugSchemeMPLInstance"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "AugSchemeMPLHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<AugSchemeMPLHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    runtime.global().setProperty(runtime, "createAugSchemeMPLInstance",std::move(createAugSchemeMPLInstance));


   auto createBasicSchemeMPLInstance = jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, "createBasicSchemeMPLInstance"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "createBasicSchemeMPLInstance.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<BasicSchemeMPLHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    runtime.global().setProperty(runtime, "createBasicSchemeMPLInstance",std::move(createBasicSchemeMPLInstance));


   auto createPopSchemeMPLInstance = jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, "createPopSchemeMPLInstance"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "createPopSchemeMPLInstance.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<PopSchemeMPLHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    runtime.global().setProperty(runtime, "createPopSchemeMPLInstance",std::move(createPopSchemeMPLInstance));

   auto createG1Element = jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, "createG1Element"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "G1ElementHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<G1ElementHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    runtime.global().setProperty(runtime, "createG1Element",std::move(createG1Element));


   auto createG2Element = jsi::Function::createFromHostFunction(
      runtime, jsi::PropNameID::forAscii(runtime, "createG2Element"), 0,
      [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
         size_t count) -> jsi::Value {
        if (count != 0) {
          throw jsi::JSError(runtime, "G2ElementHostObject.createNewInstance(..) expects 0 arguments!");
        }

        auto instance = std::make_shared<G2ElementHostObject>();
        return jsi::Object::createFromHostObject(runtime, instance);
      });

    runtime.global().setProperty(runtime, "createG2Element",std::move(createG2Element));;

  NSLog(@"Installed bls Signatures!");
  return @true;
}

@end
