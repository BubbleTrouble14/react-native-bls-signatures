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

namespace jsi = facebook::jsi;

class JsiGTElement : public JsiBlsWrappingSharedPtrHostObject<GTElement, JsiGTElement> {
public:
  // For static methods we set a nullptr
  JsiGTElement() : JsiBlsWrappingSharedPtrHostObject<GTElement, JsiGTElement>(nullptr) {}

  JsiGTElement(std::shared_ptr<GTElement> gTElement) : JsiBlsWrappingSharedPtrHostObject<GTElement, JsiGTElement>(std::move(gTElement)) {}

  JSI_PROPERTY_GET(SIZE) {
    return static_cast<double>(GTElement::SIZE);
  }

  //----------toBytes----------//
  JSI_HOST_FUNCTION(toBytes) {
    auto buffer = std::make_shared<JsiBlsMutableBuffer>(GTElement::SIZE);
    std::memcpy(buffer->data(), getObject()->Serialize().data(), GTElement::SIZE);

    return jsi::ArrayBuffer(runtime, buffer);
  };

  //----------toHex----------//
  JSI_HOST_FUNCTION(toHex) {
    return jsi::String::createFromUtf8(runtime, Util::HexStr(getObject()->Serialize()));
  };

  //----------toString----------//
  JSI_HOST_FUNCTION(toString) {
    std::string hexRepresentation = Util::HexStr(getObject()->Serialize());
    std::string finalString = "GTElement(0x" + hexRepresentation + ")";
    return jsi::String::createFromUtf8(runtime, finalString);
  };

  //----------deepCopy----------//
  JSI_HOST_FUNCTION(deepCopy) {
    return JsiGTElement::toValue(runtime, *getObject());
  };

  //----------equals----------//
  JSI_HOST_FUNCTION(equals) {
    auto GTElement = JsiGTElement::fromValue(runtime, arguments[0]);

    bool areEqual = (*getObject() == GTElement);
    return jsi::Value(areEqual);
  }

  // ----------fromBytes----------//
  JSI_HOST_FUNCTION(fromBytes) {
    auto object = arguments[0].asObject(runtime);
    if (!object.isArrayBuffer(runtime)) {
      throw jsi::JSError(runtime, "The 'fromBytes' argument must be an object, but it is not of type ArrayBuffer.");
    }

    auto arrayBuffer = object.getArrayBuffer(runtime);

    if (arrayBuffer.size(runtime) != GTElement::SIZE) {
      throw jsi::JSError(runtime, "Invalid size for 'fromBytes' argument. Expected " + std::to_string(GTElement::SIZE) + " bytes.");
    }

    GTElement sk = GTElement::FromByteVector(Utils::ArrayBufferToVector(arrayBuffer, runtime));

    return JsiGTElement::toValue(runtime, sk);
  };

  //----------fromHex----------//
  JSI_HOST_FUNCTION(fromHex) {
    if (!arguments[0].isString()) {
      throw jsi::JSError(runtime, "The argument of 'fromHex' must be a hex string.");
    }

    auto hex = arguments[0].asString(runtime);

    GTElement sk = GTElement::FromBytes(Util::HexToBytes(hex.utf8(runtime)));

    return JsiGTElement::toValue(runtime, sk);
  };

  //----------unity----------//
  JSI_HOST_FUNCTION(unity) {
    GTElement GTElement = GTElement::Unity();

    return JsiGTElement::toValue(runtime, GTElement);
  }

  JSI_EXPORT_PROPERTY_GETTERS(JSI_EXPORT_PROP_GET(JsiGTElement, SIZE))

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiGTElement, toBytes), JSI_EXPORT_FUNC(JsiGTElement, toHex),
                       JSI_EXPORT_FUNC(JsiGTElement, toString), JSI_EXPORT_FUNC(JsiGTElement, deepCopy),
                       JSI_EXPORT_FUNC(JsiGTElement, equals), JSI_EXPORT_FUNC(JsiGTElement, fromBytes),
                       JSI_EXPORT_FUNC(JsiGTElement, fromHex), JSI_EXPORT_FUNC(JsiGTElement, unity))
};

} // namespace RNBls
