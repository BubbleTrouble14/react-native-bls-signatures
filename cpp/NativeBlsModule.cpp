//
//  NativeBlsModule.cpp
//  react-native-worklets-core
//
//  Created by Marc Rousavy on 15.05.24.
//

#include "NativeBlsModule.h"
#include "JsiBlsApi.h"
// #include <RNBlsRuntimeAwareCache.h>
#include <memory>
#include <utility>

namespace facebook::react {

NativeBlsModule::NativeBlsModule(std::shared_ptr<CallInvoker> jsInvoker) : NativeBlsCxxSpec(jsInvoker), _jsCallInvoker(jsInvoker) {}

NativeBlsModule::~NativeBlsModule() {}

jsi::Object NativeBlsModule::createBlsApi(jsi::Runtime& runtime) {
  RNBls::BaseRNBlsRuntimeAwareCache::setMainJsRuntime(&runtime);

  // Create new instance of the Worklets API (JSI module)
  auto bls = std::make_shared<RNBls::JsiBlsApi>(runtime);

  return jsi::Object::createFromHostObject(runtime, bls);
  // return jsi::String::createFromUtf8(runtime, finalString);
}

} // namespace facebook::react
