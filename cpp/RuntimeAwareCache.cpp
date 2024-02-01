// Copied
// https://github.com/Shopify/react-native-skia/blob/main/package/cpp/jsi/RuntimeAwareCache.cpp
// Credits to William and Christian
#include "RuntimeAwareCache.h"

namespace RNJsi {

jsi::Runtime *BaseRuntimeAwareCache::_mainRuntime = nullptr;

} // namespace RNJsi
