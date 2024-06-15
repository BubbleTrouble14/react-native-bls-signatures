#pragma once

#include <memory>
#include <utility>

#include "JsiBlsHostObject.h"
#include "TypedArray.h"
#include <jsi/jsi.h>

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
      throw jsi::JSError(runtime, "Both arguments must be Uint8Array objects");
    }

    auto saltObject = arguments[0].asObject(runtime);
    auto ikmObject = arguments[1].asObject(runtime);

    if (!isTypedArray(runtime, saltObject) || !isTypedArray(runtime, ikmObject)) {
      throw jsi::JSError(runtime, "Arguments must be of type Uint8Array");
    }

    auto salt = getTypedArray(runtime, saltObject).toVector(runtime);
    auto ikm = getTypedArray(runtime, ikmObject).toVector(runtime);

    uint8_t prk[bls::HKDF256::HASH_LEN]; // Fixed size array for PRK output

    // Calling the original C++ Extract function
    bls::HKDF256::Extract(prk, salt.data(), salt.size(), ikm.data(), ikm.size());

    // Convert the result to a JS TypedArray and return
    auto prkArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, bls::HKDF256::HASH_LEN);
    auto prkBuffer = prkArray.getBuffer(runtime);
    std::memcpy(prkBuffer.data(runtime), prk, bls::HKDF256::HASH_LEN);

    return prkArray;
  }

  //----------------------------expand----------------------------//
  JSI_HOST_FUNCTION(expand) {
    // Validate arguments
    if (count < 3) {
      throw jsi::JSError(runtime, "expand requires at least 3 arguments: prk, info, and length");
    }

    if (!arguments[0].isObject() || !arguments[1].isObject() || !arguments[2].isNumber()) {
      throw jsi::JSError(runtime, "Invalid arguments. Expected a PRK (Uint8Array), info (Uint8Array), and length (number)");
    }

    auto prkObject = arguments[0].asObject(runtime);
    auto infoObject = arguments[1].asObject(runtime);
    auto length = arguments[2].asNumber();

    if (!isTypedArray(runtime, prkObject) || !isTypedArray(runtime, infoObject)) {
      throw jsi::JSError(runtime, "PRK and info arguments must be of type Uint8Array");
    }

    auto prk = getTypedArray(runtime, prkObject).toVector(runtime);
    auto info = getTypedArray(runtime, infoObject).toVector(runtime);

    // Check length validity
    if (length <= 0 || length > 255 * bls::HKDF256::HASH_LEN) {
      throw jsi::JSError(runtime, "Invalid length. Must be between 1 and 255 * HASH_LEN");
    }

    std::vector<uint8_t> okm(length);
    bls::HKDF256::Expand(okm.data(), length, prk.data(), info.data(), info.size());

    // Convert the result to a JS TypedArray and return
    auto okmArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, length);
    auto okmBuffer = okmArray.getBuffer(runtime);
    std::memcpy(okmBuffer.data(runtime), okm.data(), length);

    return okmArray;
  }

  //----------------------------extractExpand----------------------------//
  JSI_HOST_FUNCTION(extractExpand) {
    // Validate arguments
    if (count < 4) {
      throw jsi::JSError(runtime, "extractExpand requires 4 arguments: salt, ikm, info, and length");
    }

    if (!arguments[0].isObject() || !arguments[1].isObject() || !arguments[2].isObject() || !arguments[3].isNumber()) {
      throw jsi::JSError(runtime,
                         "Invalid arguments. Expected salt (Uint8Array), ikm (Uint8Array), info (Uint8Array), and length (number)");
    }

    auto saltObject = arguments[0].asObject(runtime);
    auto ikmObject = arguments[1].asObject(runtime);
    auto infoObject = arguments[2].asObject(runtime);
    auto length = arguments[3].asNumber();

    if (!isTypedArray(runtime, saltObject) || !isTypedArray(runtime, ikmObject) || !isTypedArray(runtime, infoObject)) {
      throw jsi::JSError(runtime, "salt, ikm, and info arguments must be of type Uint8Array");
    }

    auto salt = getTypedArray(runtime, saltObject).toVector(runtime);
    auto ikm = getTypedArray(runtime, ikmObject).toVector(runtime);
    auto info = getTypedArray(runtime, infoObject).toVector(runtime);

    // Check length validity
    if (length <= 0 || length > 255 * bls::HKDF256::HASH_LEN) {
      throw jsi::JSError(runtime, "Invalid length. Must be between 1 and 255 * HASH_LEN");
    }

    std::vector<uint8_t> output(length);

    // Use the ExtractExpand function from the C++ class
    bls::HKDF256::ExtractExpand(output.data(), length, ikm.data(), ikm.size(), salt.data(), salt.size(), info.data(), info.size());

    // Convert the result to a JS TypedArray and return
    auto outputArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, length);
    auto outputBuffer = outputArray.getBuffer(runtime);
    std::memcpy(outputBuffer.data(runtime), output.data(), length);

    return outputArray;
  }

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiHKDF256, extract), JSI_EXPORT_FUNC(JsiHKDF256, expand),
                       JSI_EXPORT_FUNC(JsiHKDF256, extractExpand))

  // Corrected Constructor
  explicit JsiHKDF256() : RNBls::JsiBlsHostObject() {}
};

} // namespace RNBls
