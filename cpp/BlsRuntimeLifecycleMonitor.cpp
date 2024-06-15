// Copied
// https://github.com/Shopify/react-native-skia/blob/main/package/cpp/jsi/BlsRuntimeLifecycleMonitor.cpp
// Credits to William and Christian
#include "BlsRuntimeLifecycleMonitor.h"

#include <unordered_map>
#include <unordered_set>
#include <utility>

namespace RNBls {

static std::unordered_map<jsi::Runtime*, std::unordered_set<RuntimeLifecycleListener*>> listeners;

struct BlsRuntimeLifecycleMonitorObject : public jsi::HostObject {
  jsi::Runtime* _rt;
  explicit BlsRuntimeLifecycleMonitorObject(jsi::Runtime* rt) : _rt(rt) {}
  ~BlsRuntimeLifecycleMonitorObject() {
    auto listenersSet = listeners.find(_rt);
    if (listenersSet != listeners.end()) {
      for (auto listener : listenersSet->second) {
        listener->onRuntimeDestroyed(_rt);
      }
      listeners.erase(listenersSet);
    }
  }
};

void BlsRuntimeLifecycleMonitor::addListener(jsi::Runtime& rt, RuntimeLifecycleListener* listener) {
  auto listenersSet = listeners.find(&rt);
  if (listenersSet == listeners.end()) {
    // We install a global host object in the provided runtime, this way we can
    // use that host object destructor to get notified when the runtime is being
    // terminated. We use a unique name for the object as it gets saved with the
    // runtime's global object.
    rt.global().setProperty(rt, "__rnbls_rt_lifecycle_monitor",
                            jsi::Object::createFromHostObject(rt, std::make_shared<BlsRuntimeLifecycleMonitorObject>(&rt)));
    std::unordered_set<RuntimeLifecycleListener*> newSet;
    newSet.insert(listener);
    listeners.emplace(&rt, std::move(newSet));
  } else {
    listenersSet->second.insert(listener);
  }
}

void BlsRuntimeLifecycleMonitor::removeListener(jsi::Runtime& rt, RuntimeLifecycleListener* listener) {
  auto listenersSet = listeners.find(&rt);
  if (listenersSet == listeners.end()) {
    // nothing to do here
  } else {
    listenersSet->second.erase(listener);
  }
}

} // namespace RNBls
