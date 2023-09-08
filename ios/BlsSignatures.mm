#import <React/RCTBlobManager.h>
#import <React/RCTBridge+Private.h>
#import <ReactCommon/RCTTurboModule.h>
#import <jsi/jsi.h>

#import "../cpp/TypedArray.h"
#import "AugSchemeMPLHostObject.h"

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

  //AugSchemeMPL
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

  NSLog(@"Installed global.AugSchemeMPL!");
  return @true;
}

@end
