#pragma once

#include <memory>

#if BLSALLOC_SODIUM
#include "sodium.h"
#endif

#include <jsi/jsi.h>

#include "JsiHostObject.h"
#include "TypedArray.h"

#include "JsiAugSchemeMPL.h"
#include "JsiBasicSchemeMPL.h"
#include "JsiG1Element.h"
#include "JsiG2Element.h"
#include "JsiGTElement.h"
#include "JsiHKDF256.h"
#include "JsiPopSchemeMPL.h"
#include "JsiPrivateKey.h"

#include "RNBlsLog.h"

namespace RNBls {

namespace jsi = facebook::jsi;

class JsiBlsApi : public RNJsi::JsiHostObject {
public:
  static void installApi(jsi::Runtime& runtime);

  JsiBlsApi(jsi::Runtime& runtime) : JsiHostObject() {
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
    if (!isTypedArray(runtime, object)) {
      throw jsi::JSError(runtime, "hash256 argument is an object, but not of type Uint8Array!");
    }
    auto typedArray = getTypedArray(runtime, object);

    uint8_t hash[32];
    bls::Util::Hash256(hash, typedArray.getBuffer(runtime).data(runtime), typedArray.size(runtime));

    auto hashArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, 32);
    auto arrayBuffer = hashArray.getBuffer(runtime);

    memcpy(arrayBuffer.data(runtime), hash, 32);

    return hashArray;
  };

  JSI_HOST_FUNCTION(toHex) {
    if (count != 1) {
      throw jsi::JSError(runtime, "toHex expects 1 argument!");
    }

    auto object = arguments[0].asObject(runtime);
    if (!isTypedArray(runtime, object)) {
      throw jsi::JSError(runtime, "toHex argument is an object, but not of type Uint8Array!");
    }
    auto typedArray = getTypedArray(runtime, object);

    auto hex = jsi::String::createFromUtf8(runtime, Util::HexStr(typedArray.toVector(runtime)));

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

    auto byteArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, bytes.size());
    auto arrayBuffer = byteArray.getBuffer(runtime);

    memcpy(arrayBuffer.data(runtime), bytes.data(), bytes.size());

    return byteArray;
  };

  JSI_HOST_FUNCTION(getRandomSeed) {
    if (count != 0) {
      throw jsi::JSError(runtime, "getRandomSeed does not expect any arguments.");
    }

    uint8_t buf[32];

#if BLSALLOC_SODIUM
    // Use libsodium's cryptographically secure RNG
    randombytes_buf(buf, 32);
    // RNBlsLogger::logToJavascriptConsole(runtime, "Secure random used from libsodium");
#else
    // Fallback to a less secure RNG
    // RNBlsLogger::logToJavascriptConsole(runtime, "Not a secure random");
    for (int i = 0; i < 32; i++)
      buf[i] = rand();
#endif
    // for (int i = 0; i < 32; i++)
    //   buf[i] = rand();

    auto byteArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, 32);
    auto arrayBuffer = byteArray.getBuffer(runtime);

    memcpy(arrayBuffer.data(runtime), buf, 32);

    return byteArray;
  };

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiBlsApi, hash256), JSI_EXPORT_FUNC(JsiBlsApi, toHex), JSI_EXPORT_FUNC(JsiBlsApi, fromHex),
                       JSI_EXPORT_FUNC(JsiBlsApi, getRandomSeed))
};
} // namespace RNBls
