#include "JsiBlsApi.h"

#include <jsi/jsi.h>

#include <memory>
#include <string>
#include <vector>

#include <RuntimeAwareCache.h>

namespace RNBls {

namespace jsi = facebook::jsi;

void JsiBlsApi::installApi(jsi::Runtime& runtime) {
  RNJsi::BaseRuntimeAwareCache::setMainJsRuntime(&runtime);

  auto blsApi = std::make_shared<JsiBlsApi>(runtime);
  runtime.global().setProperty(runtime, "BlsApi", jsi::Object::createFromHostObject(runtime, std::move(blsApi)));

  // Not sure if i need to use both as I now use the BaseRuntimeAwareCache
  auto propNameIdCache = std::make_shared<InvalidateCacheOnDestroy>(runtime);
  runtime.global().setProperty(runtime, "blsPropNameIdCache", jsi::Object::createFromHostObject(runtime, propNameIdCache));
}

} // namespace RNBls
