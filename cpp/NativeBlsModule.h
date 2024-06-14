#pragma once

#include <RNBlsSpecJSI.h>
#include <memory>

namespace facebook::react {

// The TurboModule itself
class NativeBlsModule : public NativeBlsCxxSpec<NativeBlsModule> {
public:
  explicit NativeBlsModule(std::shared_ptr<CallInvoker> jsInvoker);
  ~NativeBlsModule();

  jsi::Object createBlsApi(jsi::Runtime& runtime);

private:
  std::shared_ptr<CallInvoker> _jsCallInvoker;
};

} // namespace facebook::react
