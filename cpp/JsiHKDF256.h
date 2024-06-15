#pragma once

#include <memory>
#include <utility>

#include <jsi/jsi.h>

#include "JsiBlsHostObject.h"
#include "JsiBlsMutableBuffer.h"
#include "RNBlsUtils.h"

#include "bls.hpp"
using namespace bls;

namespace RNBls {

namespace jsi = facebook::jsi;

class JsiHKDF256 : public RNBls::JsiBlsHostObject {
public:
  //----------------------------extract----------------------------//
  JSI_HOST_FUNCTION(extract) {
    // Validate arguments and convert JS arguments to C++ types
    if (count < 2) {
      throw jsi::JSError(runtime, "extract requires at least 2 arguments: salt and ikm");
    }

    if (!arguments[0].isObject() || !arguments[1].isObject()) {
      throw jsi::JSError(runtime, "Both arguments must be ArrayBuffer objects");
    }

    auto saltObject = arguments[0].asObject(runtime);
    auto ikmObject = arguments[1].asObject(runtime);

    if (!saltObject.isArrayBuffer(runtime) || !ikmObject.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "Arguments must be of type ArrayBuffer");
    }

    auto saltArrayBuffer = saltObject.getArrayBuffer(runtime);
    auto ikmArrayBuffer = ikmObject.getArrayBuffer(runtime);

    std::vector<uint8_t> salt = Utils::ArrayBufferToVector(saltObject.getArrayBuffer(runtime), runtime);
    std::vector<uint8_t> ikm = Utils::ArrayBufferToVector(ikmObject.getArrayBuffer(runtime), runtime);

    uint8_t prk[bls::HKDF256::HASH_LEN]; // Fixed size array for PRK output

    bls::HKDF256::Extract(prk, saltArrayBuffer.data(runtime), saltArrayBuffer.size(runtime), ikmArrayBuffer.data(runtime),
                          ikmArrayBuffer.size(runtime));

    auto buffer = std::make_shared<JsiBlsMutableBuffer>(sizeof(prk));
    std::memcpy(buffer->data(), prk, sizeof(prk));

    return jsi::ArrayBuffer(runtime, buffer);
  }

  //----------------------------expand----------------------------//
  JSI_HOST_FUNCTION(expand) {
    // Validate arguments
    if (count < 3) {
      throw jsi::JSError(runtime, "expand requires at least 3 arguments: prk, info, and length");
    }

    if (!arguments[0].isObject() || !arguments[1].isObject() || !arguments[2].isNumber()) {
      throw jsi::JSError(runtime, "Invalid arguments. Expected a PRK (ArrayBuffer), info (ArrayBuffer), and length (number)");
    }

    auto prkObject = arguments[0].asObject(runtime);
    auto infoObject = arguments[1].asObject(runtime);
    auto length = arguments[2].asNumber();

    if (!prkObject.isArrayBuffer(runtime) || !infoObject.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "PRK and info arguments must be of type ArrayBuffer");
    }

    auto prk = Utils::ArrayBufferToVector(prkObject.getArrayBuffer(runtime), runtime);
    auto info = Utils::ArrayBufferToVector(infoObject.getArrayBuffer(runtime), runtime);

    // Check length validity
    if (length <= 0 || length > 255 * bls::HKDF256::HASH_LEN) {
      throw jsi::JSError(runtime, "Invalid length. Must be between 1 and 255 * HASH_LEN");
    }

    std::vector<uint8_t> okm(length);
    bls::HKDF256::Expand(okm.data(), length, prk.data(), info.data(), info.size());

    // Convert the result to a JS ArrayBuffer and return
    auto buffer = std::make_shared<JsiBlsMutableBuffer>(length);
    std::memcpy(buffer->data(), okm.data(), length);

    return jsi::ArrayBuffer(runtime, buffer);
  }

  //----------------------------extractExpand----------------------------//
  JSI_HOST_FUNCTION(extractExpand) {
    // Validate arguments
    if (count < 4) {
      throw jsi::JSError(runtime, "extractExpand requires 4 arguments: salt, ikm, info, and length");
    }

    if (!arguments[0].isObject() || !arguments[1].isObject() || !arguments[2].isObject() || !arguments[3].isNumber()) {
      throw jsi::JSError(runtime,
                         "Invalid arguments. Expected salt (ArrayBuffer), ikm (ArrayBuffer), info (ArrayBuffer), and length (number)");
    }

    auto saltObject = arguments[0].asObject(runtime);
    auto ikmObject = arguments[1].asObject(runtime);
    auto infoObject = arguments[2].asObject(runtime);
    auto length = arguments[3].asNumber();

    if (!saltObject.isArrayBuffer(runtime) || !ikmObject.isArrayBuffer(runtime) || !infoObject.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "salt, ikm, and info arguments must be of type ArrayBuffer");
    }

    auto salt = Utils::ArrayBufferToVector(saltObject.getArrayBuffer(runtime), runtime);
    auto ikm = Utils::ArrayBufferToVector(ikmObject.getArrayBuffer(runtime), runtime);
    auto info = Utils::ArrayBufferToVector(infoObject.getArrayBuffer(runtime), runtime);

    // Check length validity
    if (length <= 0 || length > 255 * bls::HKDF256::HASH_LEN) {
      throw jsi::JSError(runtime, "Invalid length. Must be between 1 and 255 * HASH_LEN");
    }

    std::vector<uint8_t> output(length);

    // Use the ExtractExpand function from the C++ class
    bls::HKDF256::ExtractExpand(output.data(), length, ikm.data(), ikm.size(), salt.data(), salt.size(), info.data(), info.size());

    // Convert the result to a JS ArrayBuffer and return
    auto buffer = std::make_shared<JsiBlsMutableBuffer>(length);
    std::memcpy(buffer->data(), output.data(), length);

    return jsi::ArrayBuffer(runtime, buffer);
  }

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiHKDF256, extract), JSI_EXPORT_FUNC(JsiHKDF256, expand),
                       JSI_EXPORT_FUNC(JsiHKDF256, extractExpand))

  // Corrected Constructor
  explicit JsiHKDF256() : RNBls::JsiBlsHostObject() {}
};

} // namespace RNBls
