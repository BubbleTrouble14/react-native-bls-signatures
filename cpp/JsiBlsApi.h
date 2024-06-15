#pragma once

#include <memory>

#if BLSALLOC_SODIUM
#include "sodium.h"
#endif

#include <jsi/jsi.h>

#include "JsiBlsHostObject.h"

#include "JsiAugSchemeMPL.h"
#include "JsiBasicSchemeMPL.h"
#include "JsiBlsMutableBuffer.h"
#include "JsiG1Element.h"
#include "JsiG2Element.h"
#include "JsiGTElement.h"
#include "JsiHKDF256.h"
#include "JsiPopSchemeMPL.h"
#include "JsiPrivateKey.h"
#include "RNBlsUtils.h"

#include "RNBlsLog.h"

namespace RNBls {

namespace jsi = facebook::jsi;

class JsiBlsApi : public RNBls::JsiBlsHostObject {
public:
  JsiBlsApi(jsi::Runtime& runtime) : JsiBlsHostObject() {
    installReadonlyProperty("PrivateKey", std::make_shared<RNBls::JsiPrivateKey>());
    installReadonlyProperty("G1Element", std::make_shared<RNBls::JsiG1Element>());
    installReadonlyProperty("G2Element", std::make_shared<RNBls::JsiG2Element>());
    installReadonlyProperty("GTElement", std::make_shared<RNBls::JsiGTElement>());
    installReadonlyProperty("AugSchemeMPL", std::make_shared<RNBls::JsiAugSchemeMPL>());
    installReadonlyProperty("BasicSchemeMPL", std::make_shared<RNBls::JsiBasicSchemeMPL>());
    installReadonlyProperty("PopSchemeMPL", std::make_shared<RNBls::JsiPopSchemeMPL>());
    installReadonlyProperty("HKDF256", std::make_shared<RNBls::JsiHKDF256>());
  }

  JSI_HOST_FUNCTION(hash256) {
    if (count != 1) {
      throw jsi::JSError(runtime, "hash256 expects 1 argument!");
    }

    auto object = arguments[0].asObject(runtime);
    if (!object.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "hash256 argument is an object, but not of type ArrayBuffer!");
    }
    auto arrayBuffer = object.getArrayBuffer(runtime);

    uint8_t hash[32];
    bls::Util::Hash256(hash, arrayBuffer.data(runtime), arrayBuffer.size(runtime));

    auto buffer = std::make_shared<JsiBlsMutableBuffer>(32);
    std::memcpy(buffer->data(), hash, 32);

    return jsi::ArrayBuffer(runtime, buffer);
  };

  JSI_HOST_FUNCTION(toHex) {
    if (count != 1) {
      throw jsi::JSError(runtime, "toHex expects 1 argument!");
    }

    auto object = arguments[0].asObject(runtime);
    if (!object.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "toHex argument is an object, but not of type ArrayBuffer!");
    }
    auto arrayBuffer = object.getArrayBuffer(runtime);

    auto hex = jsi::String::createFromUtf8(runtime, Util::HexStr(Utils::ArrayBufferToVector(arrayBuffer, runtime)));

    return hex;
  };

  JSI_HOST_FUNCTION(fromHex) {
    if (count != 1) {
      throw jsi::JSError(runtime, "fromHex expects 1 argument!");
    }

    if (!arguments[0].isString()) {
      throw jsi::JSError(runtime, "fromHex argument is not a string!");
    }

    auto hex = arguments[0].asString(runtime);

    auto bytes = Util::HexToBytes(hex.utf8(runtime));

    auto buffer = std::make_shared<JsiBlsMutableBuffer>(bytes.size());
    std::memcpy(buffer->data(), bytes.data(), bytes.size());

    return jsi::ArrayBuffer(runtime, buffer);
  };

  JSI_HOST_FUNCTION(getRandomSeed) {
    if (count != 0) {
      throw jsi::JSError(runtime, "getRandomSeed does not expect any arguments.");
    }

    uint8_t buf[32];

#if BLSALLOC_SODIUM
    // Use libsodium's cryptographically secure RNG
    randombytes_buf(buf, 32);
#else
    RNBlsLogger::logToJavascriptConsole(runtime, "Not secure Random!");
    // Fallback to a less secure RNG
    for (int i = 0; i < 32; i++)
      buf[i] = rand();
#endif

    auto buffer = std::make_shared<JsiBlsMutableBuffer>(32);
    std::memcpy(buffer->data(), buf, 32);

    return jsi::ArrayBuffer(runtime, buffer);
  };

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiBlsApi, hash256), JSI_EXPORT_FUNC(JsiBlsApi, toHex), JSI_EXPORT_FUNC(JsiBlsApi, fromHex),
                       JSI_EXPORT_FUNC(JsiBlsApi, getRandomSeed))
};

} // namespace RNBls
