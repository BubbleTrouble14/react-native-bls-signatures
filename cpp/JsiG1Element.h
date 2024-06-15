#pragma once

#include <memory>
#include <string>
#include <utility>

#include "JsiBlsHostObject.h"
#include "JsiBlsHostObjects.h"
#include "TypedArray.h"
#include "bls.hpp"
#include <jsi/jsi.h>

using namespace bls;

namespace RNBls {

namespace jsi = facebook::jsi;

class JsiG1Element : public JsiBlsWrappingSharedPtrHostObject<G1Element, JsiG1Element> {
public:
  // For static methods we set a nullptr
  JsiG1Element() : JsiBlsWrappingSharedPtrHostObject<G1Element, JsiG1Element>(nullptr) {}

  JsiG1Element(std::shared_ptr<G1Element> g1Element) : JsiBlsWrappingSharedPtrHostObject<G1Element, JsiG1Element>(std::move(g1Element)) {}

  //----------toBytes----------//
  JSI_HOST_FUNCTION(toBytes) {
    auto newTypedArray = TypedArray<TypedArrayKind::Uint8Array>(runtime, G1Element::SIZE);
    auto newBuffer = newTypedArray.getBuffer(runtime);

    std::memcpy(newBuffer.data(runtime), getObject()->Serialize().data(), G1Element::SIZE);

    return newTypedArray;
  };

  //----------toHex----------//
  JSI_HOST_FUNCTION(toHex) {
    return jsi::String::createFromUtf8(runtime, Util::HexStr(getObject()->Serialize()));
  };

  //----------toString----------//
  JSI_HOST_FUNCTION(toString) {
    std::string hexRepresentation = Util::HexStr(getObject()->Serialize());
    std::string finalString = "G1Element(0x" + hexRepresentation + ")";
    return jsi::String::createFromUtf8(runtime, finalString);
  };

  //----------isValid----------//
  JSI_HOST_FUNCTION(isValid) {
    return jsi::Value(getObject()->IsValid());
  };

  //----------deepCopy----------//
  JSI_HOST_FUNCTION(deepCopy) {
    return JsiG1Element::toValue(runtime, *getObject());
  };

  //----------getFingerprint----------//
  JSI_HOST_FUNCTION(getFingerprint) {
    return jsi::Value(static_cast<double>(getObject()->GetFingerprint()));
  };

  //----------add----------//
  JSI_HOST_FUNCTION(add) {
    auto g1Element_2 = JsiG1Element::fromValue(runtime, arguments[0]);

    G1Element g1Element = *getObject() + g1Element_2;
    return JsiG1Element::toValue(runtime, g1Element);
  }

  //----------negate----------//
  JSI_HOST_FUNCTION(negate) {
    return JsiG1Element::toValue(runtime, getObject()->Negate());
  }

  // //----------pair----------//
  // JSI_HOST_FUNCTION(pair) {
  //   auto g2Element = RNBls::JsiG2Element::fromValue(runtime, arguments[0]);
  //   return JsiGTElement::toValue(runtime, getObject()->Pair(g2Element));
  // }

  //----------equals----------//
  JSI_HOST_FUNCTION(equals) {
    auto G1Element = JsiG1Element::fromValue(runtime, arguments[0]);

    bool areEqual = (*getObject() == G1Element);
    return jsi::Value(areEqual);
  }

  // ----------fromBytes----------//
  JSI_HOST_FUNCTION(fromBytes) {
    auto object = arguments[0].asObject(runtime);
    if (!isTypedArray(runtime, object)) {
      throw jsi::JSError(runtime, "The 'fromBytes' argument must be an object, but it is not of type Uint8Array.");
    }

    auto typedArray = getTypedArray(runtime, object);

    if (typedArray.size(runtime) != G1Element::SIZE) {
      throw jsi::JSError(runtime, "Invalid size for 'fromBytes' argument. Expected " + std::to_string(G1Element::SIZE) + " bytes.");
    }

    G1Element sk = G1Element::FromByteVector(typedArray.toVector(runtime));

    return JsiG1Element::toValue(runtime, sk);
  };

  //----------fromHex----------//
  JSI_HOST_FUNCTION(fromHex) {
    if (!arguments[0].isString()) {
      throw jsi::JSError(runtime, "The argument of 'fromHex' must be a hex string.");
    }

    auto hex = arguments[0].asString(runtime);

    G1Element sk = G1Element::FromBytes(Util::HexToBytes(hex.utf8(runtime)));

    return JsiG1Element::toValue(runtime, sk);
  };

  //----------generator----------//
  JSI_HOST_FUNCTION(generator) {
    G1Element g1Element = G1Element::Generator();

    return JsiG1Element::toValue(runtime, g1Element);
  }

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiG1Element, toBytes), JSI_EXPORT_FUNC(JsiG1Element, toHex),
                       JSI_EXPORT_FUNC(JsiG1Element, toString), JSI_EXPORT_FUNC(JsiG1Element, isValid),
                       JSI_EXPORT_FUNC(JsiG1Element, deepCopy), JSI_EXPORT_FUNC(JsiG1Element, getFingerprint),
                       JSI_EXPORT_FUNC(JsiG1Element, add), JSI_EXPORT_FUNC(JsiG1Element, negate), JSI_EXPORT_FUNC(JsiG1Element, equals),
                       JSI_EXPORT_FUNC(JsiG1Element, fromBytes), JSI_EXPORT_FUNC(JsiG1Element, fromHex),
                       JSI_EXPORT_FUNC(JsiG1Element, generator))
};

} // namespace RNBls
