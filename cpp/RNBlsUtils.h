#pragma once

#include <jsi/jsi.h>
#include <memory>
#include <string>
#include <utility>

namespace RNBls {

namespace Utils {

  namespace jsi = facebook::jsi;

  std::vector<uint8_t> messageFromValue(jsi::Runtime& runtime, const jsi::Value& value);
  std::vector<std::vector<uint8_t>> messagesArrayFromValue(jsi::Runtime& runtime, const jsi::Value& value);

  std::vector<uint8_t> ArrayBufferToVector(const jsi::ArrayBuffer& buffer, jsi::Runtime& runtime);

  void install(facebook::jsi::Runtime& jsiRuntime);

} // namespace Utils
} // namespace RNBls
