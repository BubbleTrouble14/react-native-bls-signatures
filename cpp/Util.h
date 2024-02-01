#pragma once

#include <jsi/jsi.h>
#include <memory>
#include <string>
#include <utility>

namespace utils {

namespace jsi = facebook::jsi;

std::vector<uint8_t> messageFromValue(jsi::Runtime& runtime, const jsi::Value& value);
std::vector<std::vector<uint8_t>> messagesArrayFromValue(jsi::Runtime& runtime, const jsi::Value& value);

void install(facebook::jsi::Runtime& jsiRuntime);

} // namespace utils
