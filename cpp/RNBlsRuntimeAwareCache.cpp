// Copied
// https://github.com/Shopify/react-native-skia/blob/main/package/cpp/jsi/RNBlsRuntimeAwareCache.cpp
// Credits to William and Christian
#include "RNBlsRuntimeAwareCache.h"

namespace RNBls {

jsi::Runtime* BaseRNBlsRuntimeAwareCache::_mainRuntime = nullptr;

} // namespace RNBls
