#pragma once

#include <memory>
#include <string>
#include <utility>

#include "JsiBlsHostObject.h"
#include "JsiBlsHostObjects.h"
#include "JsiBlsMutableBuffer.h"
#include "JsiG1Element.h"
#include "JsiG2Element.h"
#include "RNBlsUtils.h"

#include "bls.hpp"
#include <jsi/jsi.h>

#include "RNBlsLog.h"
using namespace bls;

namespace RNBls {

namespace jsi = facebook::jsi;

class JsiPrivateKey : public JsiBlsWrappingSharedPtrHostObject<PrivateKey, JsiPrivateKey> {
public:
  // For static methods we set a nullptr
  JsiPrivateKey() : JsiBlsWrappingSharedPtrHostObject<PrivateKey, JsiPrivateKey>(nullptr) {}

  JsiPrivateKey(std::shared_ptr<PrivateKey> privateKey)
      : JsiBlsWrappingSharedPtrHostObject<PrivateKey, JsiPrivateKey>(std::move(privateKey)) {}

  //----------toBytes----------//
  JSI_HOST_FUNCTION(toBytes) {
    auto buffer = std::make_shared<JsiBlsMutableBuffer>(PrivateKey::PRIVATE_KEY_SIZE);
    std::memcpy(buffer->data(), getObject()->Serialize().data(), PrivateKey::PRIVATE_KEY_SIZE);

    return jsi::ArrayBuffer(runtime, buffer);
  };

  //----------toHex----------//
  JSI_HOST_FUNCTION(toHex) {
    return jsi::String::createFromUtf8(runtime, Util::HexStr(getObject()->Serialize()));
  };

  //----------toString----------//
  JSI_HOST_FUNCTION(toString) {
    std::string hexRepresentation = Util::HexStr(getObject()->Serialize());
    std::string finalString = "PrivateKey(0x" + hexRepresentation + ")";
    return jsi::String::createFromUtf8(runtime, finalString);
  };

  //----------isZero----------//
  JSI_HOST_FUNCTION(isZero) {
    return jsi::Value(getObject()->IsZero());
  };

  //----------getG1----------//
  JSI_HOST_FUNCTION(getG1) {
    return JsiG1Element::toValue(runtime, getObject()->GetG1Element());
  };

  //----------getG2----------//
  JSI_HOST_FUNCTION(getG2) {
    return JsiG2Element::toValue(runtime, getObject()->GetG2Element());
  };

  //----------deepCopy----------//
  JSI_HOST_FUNCTION(deepCopy) {
    return JsiPrivateKey::toValue(runtime, *getObject());
  };

  //----------mulG1----------//
  JSI_HOST_FUNCTION(mulG1) {
    auto g1Element = JsiG1Element::fromValue(runtime, arguments[0]);

    G1Element result = *getObject() * g1Element;

    return JsiG1Element::toValue(runtime, result);
  };

  //----------mulG2----------//
  JSI_HOST_FUNCTION(mulG2) {
    auto g2Element = JsiG2Element::fromValue(runtime, arguments[0]);

    G2Element result = *getObject() * g2Element;

    return JsiG2Element::toValue(runtime, result);
  };

  //----------getG2Power----------//
  JSI_HOST_FUNCTION(getG2Power) {
    G2Element g2Element = JsiG2Element::fromValue(runtime, arguments[0]);

    G2Element result = getObject()->GetG2Power(g2Element);

    return JsiG2Element::toValue(runtime, result);
  };

  // ----------fromBytes----------//
  JSI_HOST_FUNCTION(fromBytes) {
    auto object = arguments[0].asObject(runtime);
    if (!object.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "The 'fromBytes' argument must be an object, but it is not of type ArrayBuffer.");
    }

    auto arrayBuffer = object.getArrayBuffer(runtime);

    if (arrayBuffer.size(runtime) != PrivateKey::PRIVATE_KEY_SIZE) {
      throw jsi::JSError(runtime,
                         "Invalid size for 'fromBytes' argument. Expected " + std::to_string(PrivateKey::PRIVATE_KEY_SIZE) + " bytes.");
    }

    if (!arguments[1].isBool()) {
      throw jsi::JSError(runtime, "The second argument of 'fromBytes' must be of type boolean.");
    }
    auto modOrder = arguments[1].asBool();

    PrivateKey sk = PrivateKey::FromByteVector(Utils::ArrayBufferToVector(arrayBuffer, runtime), modOrder);

    return JsiPrivateKey::toValue(runtime, sk);
  };

  //----------fromHex----------//
  JSI_HOST_FUNCTION(fromHex) {
    if (!arguments[0].isString()) {
      throw jsi::JSError(runtime, "The argument of 'fromHex' must be a hex string.");
    }

    auto hex = arguments[0].asString(runtime);

    PrivateKey sk = PrivateKey::FromBytes(Util::HexToBytes(hex.utf8(runtime)));

    return JsiPrivateKey::toValue(runtime, sk);
  };

  //----------aggregate----------//
  JSI_HOST_FUNCTION(aggregate) {
    auto privateKeys = arrayFromValue(runtime, arguments[0]);

    PrivateKey sk = PrivateKey::Aggregate(privateKeys);
    return JsiPrivateKey::toValue(runtime, sk);
  };

  //----------equals----------//
  JSI_HOST_FUNCTION(equals) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);

    bool areEqual = (*getObject() == privateKey);

    return jsi::Value(areEqual);
  }

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiPrivateKey, toBytes), JSI_EXPORT_FUNC(JsiPrivateKey, toHex),
                       JSI_EXPORT_FUNC(JsiPrivateKey, toString), JSI_EXPORT_FUNC(JsiPrivateKey, isZero),
                       JSI_EXPORT_FUNC(JsiPrivateKey, getG1), JSI_EXPORT_FUNC(JsiPrivateKey, getG2),
                       JSI_EXPORT_FUNC(JsiPrivateKey, deepCopy), JSI_EXPORT_FUNC(JsiPrivateKey, mulG1),
                       JSI_EXPORT_FUNC(JsiPrivateKey, mulG2), JSI_EXPORT_FUNC(JsiPrivateKey, getG2Power),
                       JSI_EXPORT_FUNC(JsiPrivateKey, fromBytes), JSI_EXPORT_FUNC(JsiPrivateKey, fromHex),
                       JSI_EXPORT_FUNC(JsiPrivateKey, aggregate), JSI_EXPORT_FUNC(JsiPrivateKey, equals))
};

} // namespace RNBls
