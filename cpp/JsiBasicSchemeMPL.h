#pragma once

#include <memory>
#include <utility>

#include "JsiBlsHostObject.h"
#include "JsiG1Element.h"
#include "JsiG2Element.h"
#include "JsiPrivateKey.h"
#include "RNBlsUtils.h"
#include "TypedArray.h"
#include <jsi/jsi.h>

#include "bls.hpp"
using namespace bls;

namespace RNBls {

namespace jsi = facebook::jsi;

class JsiBasicSchemeMPL : public RNBls::JsiBlsHostObject {
public:
  //----------------------------skToG1----------------------------//
  JSI_HOST_FUNCTION(skToG1) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);

    G1Element g1Element = BasicSchemeMPL().SkToG1(privateKey);
    return JsiG1Element::toValue(runtime, g1Element);
  };

  //----------------------------keyGen----------------------------//
  JSI_HOST_FUNCTION(keyGen) {
    auto object = arguments[0].asObject(runtime);
    if (!isTypedArray(runtime, object)) {
      throw jsi::JSError(runtime, "keyGen argument is an object, but not of type Uint8Array!");
    }

    auto typedArray = getTypedArray(runtime, object);
    PrivateKey sk = BasicSchemeMPL().KeyGen(typedArray.toVector(runtime));
    return JsiPrivateKey::toValue(runtime, sk);
  };

  //----------------------------sign----------------------------//
  JSI_HOST_FUNCTION(sign) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);
    auto message = Utils::messageFromValue(runtime, arguments[1]);

    G2Element g2Element = BasicSchemeMPL().Sign(privateKey, message);
    return JsiG2Element::toValue(runtime, g2Element);
  };

  //----------------------------verify----------------------------//
  JSI_HOST_FUNCTION(verify) {
    auto g1Element = JsiG1Element::fromValue(runtime, arguments[0]);
    auto message = Utils::messageFromValue(runtime, arguments[1]);
    auto g2Element = JsiG2Element::fromValue(runtime, arguments[2]);

    auto valid = BasicSchemeMPL().Verify(g1Element, message, g2Element);

    return jsi::Value(valid);
  };

  //----------------------------aggregate----------------------------//
  JSI_HOST_FUNCTION(aggregate) {
    auto g2Elements = JsiG2Element::arrayFromValue(runtime, arguments[0]);

    G2Element g2Element = BasicSchemeMPL().Aggregate(g2Elements);
    return JsiG2Element::toValue(runtime, g2Element);
  };

  //----------------------------aggregateVerify----------------------------//
  JSI_HOST_FUNCTION(aggregateVerify) {
    auto g1Elements = JsiG1Element::arrayFromValue(runtime, arguments[0]);
    auto messages = Utils::messagesArrayFromValue(runtime, arguments[1]);
    auto g2Element = JsiG2Element::fromValue(runtime, arguments[2]);

    auto value = BasicSchemeMPL().AggregateVerify(g1Elements, messages, g2Element);

    return jsi::Value(value);
  };

  //----------------------------deriveChildSk----------------------------//
  JSI_HOST_FUNCTION(deriveChildSk) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);

    if (!arguments[1].isNumber()) {
      throw jsi::JSError(runtime, "deriveChildSk second argument is not a number!");
    }
    uint32_t index = arguments[1].asNumber();

    PrivateKey childSecretKey = BasicSchemeMPL().DeriveChildSk(privateKey, index);

    return JsiPrivateKey::toValue(runtime, childSecretKey);
  };

  //----------------------------deriveChildSkUnhardened----------------------------//
  JSI_HOST_FUNCTION(deriveChildSkUnhardened) {
    auto privateKey = JsiPrivateKey::fromValue(runtime, arguments[0]);

    if (!arguments[1].isNumber()) {
      throw jsi::JSError(runtime, "deriveChildSkUnhardened second argument is not a number!");
    }
    uint32_t index = arguments[1].asNumber();

    PrivateKey childSecretKey = BasicSchemeMPL().DeriveChildSkUnhardened(privateKey, index);

    return JsiPrivateKey::toValue(runtime, childSecretKey);
  };

  //----------------------------deriveChildPkUnhardened----------------------------//
  JSI_HOST_FUNCTION(deriveChildPkUnhardened) {
    auto g1Element = JsiG1Element::fromValue(runtime, arguments[0]);

    if (!arguments[1].isNumber()) {
      throw jsi::JSError(runtime, "deriveChildPkUnhardened second argument is not a number!");
    }
    uint32_t index = arguments[1].asNumber();

    G1Element childG1Element = BasicSchemeMPL().DeriveChildPkUnhardened(g1Element, index);

    return JsiG1Element::toValue(runtime, childG1Element);
  };

  JSI_EXPORT_FUNCTIONS(JSI_EXPORT_FUNC(JsiBasicSchemeMPL, skToG1), JSI_EXPORT_FUNC(JsiBasicSchemeMPL, keyGen),
                       JSI_EXPORT_FUNC(JsiBasicSchemeMPL, sign), JSI_EXPORT_FUNC(JsiBasicSchemeMPL, verify),
                       JSI_EXPORT_FUNC(JsiBasicSchemeMPL, aggregate), JSI_EXPORT_FUNC(JsiBasicSchemeMPL, aggregateVerify),
                       JSI_EXPORT_FUNC(JsiBasicSchemeMPL, deriveChildSk), JSI_EXPORT_FUNC(JsiBasicSchemeMPL, deriveChildSkUnhardened),
                       JSI_EXPORT_FUNC(JsiBasicSchemeMPL, deriveChildPkUnhardened))

  // Corrected Constructor
  explicit JsiBasicSchemeMPL() : RNBls::JsiBlsHostObject() {}
};

} // namespace RNBls
