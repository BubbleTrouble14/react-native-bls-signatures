#pragma once

#include <memory>
#include <string>
#include <utility>

#include "JsiBlsHostObject.h"
#include "JsiBlsHostObjects.h"
#include "JsiBlsMutableBuffer.h"
#include "RNBlsUtils.h"

#include "bls.hpp"
#include <jsi/jsi.h>

using namespace bls;
namespace RNBls {
class JsiG1Element; // Forward declaration

namespace jsi = facebook::jsi;

class JsiG2Element : public JsiBlsWrappingSharedPtrHostObject<G2Element, JsiG2Element> {
public:
  // For static methods we set a nullptr
  JsiG2Element() : JsiBlsWrappingSharedPtrHostObject<G2Element, JsiG2Element>(nullptr) {}

  JsiG2Element(std::shared_ptr<G2Element> g2Element) : JsiBlsWrappingSharedPtrHostObject<G2Element, JsiG2Element>(std::move(g2Element)) {}

  //----------toBytes----------//
  JSI_HOST_FUNCTION(toBytes) {
    auto buffer = std::make_shared<JsiBlsMutableBuffer>(G2Element::SIZE);
    std::memcpy(buffer->data(), getObject()->Serialize().data(), G2Element::SIZE);

    return jsi::ArrayBuffer(runtime, buffer);
  };

  //----------toHex----------//
  JSI_HOST_FUNCTION(toHex) {
    return jsi::String::createFromUtf8(runtime, Util::HexStr(getObject()->Serialize()));
  };

  //----------toString----------//
  JSI_HOST_FUNCTION(toString) {
    std::string hexRepresentation = Util::HexStr(getObject()->Serialize());
    std::string finalString = "G2Element(0x" + hexRepresentation + ")";
    return jsi::String::createFromUtf8(runtime, finalString);
  };

  //----------isValid----------//
  JSI_HOST_FUNCTION(isValid) {
    return jsi::Value(getObject()->IsValid());
  };

  //----------deepCopy----------//
  JSI_HOST_FUNCTION(deepCopy) {
    return JsiG2Element::toValue(runtime, *getObject());
  };

  //----------add----------//
  JSI_HOST_FUNCTION(add) {
    auto g2Element_2 = JsiG2Element::fromValue(runtime, arguments[0]);

    G2Element g2Element = *getObject() + g2Element_2;
    return JsiG2Element::toValue(runtime, g2Element);
  }

  //----------negate----------//
  JSI_HOST_FUNCTION(negate) {
    return JsiG2Element::toValue(runtime, getObject()->Negate());
  }

  // //----------pair----------//
  // JSI_HOST_FUNCTION(pair) {
  //   auto g1Element = RNBls::JsiG1Element::fromValue(runtime, arguments[0]);
  //   return JsiGTElement::toValue(runtime, getObject()->Pair(g1Element));
  // }

  //----------equals----------//
  JSI_HOST_FUNCTION(equals) {
    auto g2Element = JsiG2Element::fromValue(runtime, arguments[0]);

    bool areEqual = (*getObject() == g2Element);
    return jsi::Value(areEqual);
  }

  // ----------fromBytes----------//
  JSI_HOST_FUNCTION(fromBytes) {
    auto object = arguments[0].asObject(runtime);
    if (!object.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "The 'fromBytes' argument must be an object, but it is not of type ArrayBuffer.");
    }

    auto arrayBuffer = object.getArrayBuffer(runtime);

    if (arrayBuffer.size(runtime) != G2Element::SIZE) {
      throw jsi::JSError(runtime, "Invalid size for 'fromBytes' argument. Expected " + std::to_string(G2Element::SIZE) + " bytes.");
    }

    G2Element sk = G2Element::FromByteVector(Utils::ArrayBufferToVector(arrayBuffer, runtime));

    return JsiG2Element::toValue(runtime, sk);
  };

  //----------fromHex----------//
  JSI_HOST_FUNCTION(fromHex) {
    if (!arguments[0].isString()) {
      throw jsi::JSError(runtime, "The argument of 'fromHex' must be a hex string.");
    }

    auto hex = arguments[0].asString(runtime);

    G2Element sk = G2Element::FromBytes(Util::HexToBytes(hex.utf8(runtime)));

    return JsiG2Element::toValue(runtime, sk);
  };

  //----------generator----------//
  JSI_HOST_FUNCTION(generator) {
    G2Element g2Element = G2Element::Generator();

    return JsiG2Element::toValue(runtime, g2Element);
  }

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiG2Element, toBytes), JSI_EXPORT_FUNC(JsiG2Element, toHex),
                       JSI_EXPORT_FUNC(JsiG2Element, toString), JSI_EXPORT_FUNC(JsiG2Element, isValid),
                       JSI_EXPORT_FUNC(JsiG2Element, deepCopy), JSI_EXPORT_FUNC(JsiG2Element, add), JSI_EXPORT_FUNC(JsiG2Element, negate),
                       JSI_EXPORT_FUNC(JsiG2Element, equals), JSI_EXPORT_FUNC(JsiG2Element, fromBytes),
                       JSI_EXPORT_FUNC(JsiG2Element, fromHex), JSI_EXPORT_FUNC(JsiG2Element, generator))
};

} // namespace RNBls
