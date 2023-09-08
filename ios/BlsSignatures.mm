#import <React/RCTBlobManager.h>
#import <React/RCTBridge+Private.h>
#import <ReactCommon/RCTTurboModule.h>
#import <jsi/jsi.h>

#import "../cpp/TypedArray.h"
// #import "AugSchemeMPLHostObject.h"
#import "BlsSignatures.h"
#import "sodium.h"
#import "../cpp/include/bls/bls.hpp"

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

  vector<uint8_t> seed = {0,  50, 6,  244, 24,  199, 1,  25,  52,  88,  192,
                          19, 18, 12, 89,  6,   220, 18, 102, 58,  209, 82,
                          12, 62, 89, 110, 182, 9,   44, 20,  254, 22};

  PrivateKey sk = AugSchemeMPL().KeyGen(seed);
  //AugSchemeMPL
  // auto AugSchemeMPL = jsi::Function::createFromHostFunction(
  //                                                           runtime, jsi::PropNameID::forAscii(runtime, "AugSchemeMPL"), 0,
  // [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments,
  //     size_t count) -> jsi::Value {
  //   if (count != 0) {
  //     throw jsi::JSError(runtime, "AugSchemeMPLHostObject.createNewInstance(..) expects 0 arguments!");
  //   }

  //   auto instance = std::make_shared<AugSchemeMPLHostObject>();
  //   return jsi::Object::createFromHostObject(runtime, instance);
  // });

  //   runtime.global().setProperty(runtime, "AugSchemeMPL",std::move(AugSchemeMPL));

  NSLog(@"Installed global.AugSchemeMPL!");
  return @true;
}

@end
